import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

// Vita Santé Stripe webhook.
// Handles the five events that keep subscription/enrollment state consistent
// with Stripe's billing lifecycle.

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[stripe] Invalid signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency: dedupe on Stripe's event id so retries don't double-apply.
  const { data: existing } = await supabase
    .from("events")
    .select("id")
    .eq("idempotency_key", `stripe:${event.id}`)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ received: true, deduped: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      default:
        // Unhandled event types are logged but not an error.
        console.log(`[stripe] unhandled event type: ${event.type}`);
    }

    // Log the event for audit + dedup.
    await supabase.from("events").insert({
      event_type: `stripe.${event.type}`,
      aggregate_type: "SUBSCRIPTION",
      aggregate_id: getAggregateId(event),
      payload: { stripe_event_id: event.id, livemode: event.livemode },
      idempotency_key: `stripe:${event.id}`,
    });
  } catch (err) {
    console.error(`[stripe] handler failed for ${event.type}:`, err);
    // Return 500 so Stripe retries.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function getAggregateId(event: Stripe.Event): string {
  // Try to extract a UUID-shaped aggregate id; fallback to the Stripe object id.
  const obj = event.data.object as { metadata?: Record<string, string>; id?: string };
  return obj.metadata?.subscriptionId || obj.metadata?.enrollmentId || obj.id || "00000000-0000-0000-0000-000000000000";
}

// ── Handlers ────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { subscriptionId, enrollmentId, sponsorGrantId } = session.metadata ?? {};

  // Sponsor grant checkout: flip PLEDGED → FUNDED.
  if (sponsorGrantId) {
    await supabase
      .from("sponsor_grants")
      .update({
        status: "FUNDED",
        stripe_invoice_id: typeof session.invoice === "string"
          ? session.invoice
          : session.invoice?.id ?? null,
      })
      .eq("id", sponsorGrantId)
      .eq("status", "PLEDGED");
    return;
  }

  const stripeSubId = typeof session.subscription === "string"
    ? session.subscription
    : session.subscription?.id;

  if (!subscriptionId) {
    console.warn("[stripe] checkout.session.completed missing subscriptionId metadata");
    return;
  }

  // Link Stripe subscription id back to our subscription.
  await supabase
    .from("subscriptions")
    .update({
      status: "ACTIVE",
      stripe_subscription_id: stripeSubId ?? null,
    })
    .eq("id", subscriptionId);

  // Record the payment.
  await supabase.from("invoices").insert({
    subscription_id: subscriptionId,
    invoice_number: `CHK-${Date.now()}`,
    status: "PAID",
    total_cents: session.amount_total ?? 0,
    currency: (session.currency ?? "usd").toUpperCase(),
    due_date: new Date().toISOString(),
    paid_at: new Date().toISOString(),
    stripe_invoice_id: typeof session.invoice === "string" ? session.invoice : session.invoice?.id ?? null,
    idempotency_key: `stripe_checkout:${session.id}`,
  });

  // If the checkout tied to a specific enrollment, submit + approve it automatically.
  if (enrollmentId) {
    await supabase
      .from("enrollment")
      .update({ status: "UNDER_REVIEW", enrolled_at: new Date().toISOString() })
      .eq("id", enrollmentId)
      .eq("status", "DRAFT");
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.metadata?.subscriptionId;
  const invSub = (invoice as unknown as { subscription?: string | { id: string } }).subscription;
  const stripeSubId = typeof invSub === "string" ? invSub : invSub?.id;

  // Resolve our subscription id from metadata or Stripe id.
  let ourSubId = subscriptionId;
  if (!ourSubId && stripeSubId) {
    const { data } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("stripe_subscription_id", stripeSubId)
      .maybeSingle();
    ourSubId = data?.id;
  }

  if (!ourSubId) {
    console.warn("[stripe] invoice.paid could not resolve subscription");
    return;
  }

  // Record the payment + renew (resets credits).
  await supabase.from("invoices").insert({
    subscription_id: ourSubId,
    invoice_number: invoice.number ?? `STR-${invoice.id}`,
    status: "PAID",
    total_cents: invoice.amount_paid,
    currency: invoice.currency.toUpperCase(),
    due_date: invoice.due_date
      ? new Date(invoice.due_date * 1000).toISOString()
      : new Date().toISOString(),
    paid_at: new Date().toISOString(),
    stripe_invoice_id: invoice.id,
    idempotency_key: `stripe_invoice:${invoice.id}`,
  });

  await supabase.rpc("renew_subscription", {
    p_subscription_id: ourSubId,
    p_actor_id: null,
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const invSub = (invoice as unknown as { subscription?: string | { id: string } }).subscription;
  const stripeSubId = typeof invSub === "string" ? invSub : invSub?.id;

  if (!stripeSubId) return;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("id, status")
    .eq("stripe_subscription_id", stripeSubId)
    .maybeSingle();

  if (!sub) return;

  // Mark the invoice as failed for the audit trail.
  await supabase.from("invoices").insert({
    subscription_id: sub.id,
    invoice_number: invoice.number ?? `FAIL-${invoice.id}`,
    status: "FAILED",
    total_cents: invoice.amount_due,
    currency: invoice.currency.toUpperCase(),
    due_date: invoice.due_date
      ? new Date(invoice.due_date * 1000).toISOString()
      : new Date().toISOString(),
    stripe_invoice_id: invoice.id,
    idempotency_key: `stripe_invoice_failed:${invoice.id}`,
  });

  // If currently ACTIVE, start grace period. If already in grace, leave it.
  if (sub.status === "ACTIVE") {
    await supabase.rpc("start_grace_period", {
      p_subscription_id: sub.id,
      p_actor_id: null,
    });
  }
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const { data: ours } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("stripe_subscription_id", sub.id)
    .maybeSingle();

  if (!ours) return;

  // Cancel the subscription and suspend all its enrollments.
  await supabase
    .from("subscriptions")
    .update({ status: "CANCELLED" })
    .eq("id", ours.id);

  // Suspend every active enrollment on this subscription.
  const { data: enrollments } = await supabase
    .from("enrollment")
    .select("id")
    .eq("subscription_id", ours.id)
    .eq("status", "ACTIVE");

  for (const enr of enrollments ?? []) {
    await supabase
      .from("enrollment")
      .update({
        status: "EXPIRED",
        expires_at: new Date().toISOString(),
      })
      .eq("id", enr.id);
  }
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const { data: ours } = await supabase
    .from("subscriptions")
    .select("id, status")
    .eq("stripe_subscription_id", sub.id)
    .maybeSingle();

  if (!ours) return;

  // Map Stripe's status to ours.
  const statusMap: Record<string, string> = {
    active: "ACTIVE",
    past_due: "GRACE_PERIOD",
    canceled: "CANCELLED",
    incomplete: "CREATED",
    incomplete_expired: "EXPIRED",
    trialing: "ACTIVE",
    unpaid: "SUSPENDED",
  };

  const mapped = statusMap[sub.status] ?? ours.status;
  if (mapped === ours.status) return;

  const anySub = sub as unknown as { current_period_start?: number; current_period_end?: number };
  const update: Record<string, string> = { status: mapped };
  if (anySub.current_period_start) {
    update.current_period_start = new Date(anySub.current_period_start * 1000).toISOString();
  }
  if (anySub.current_period_end) {
    update.current_period_end = new Date(anySub.current_period_end * 1000).toISOString();
  }

  await supabase
    .from("subscriptions")
    .update(update)
    .eq("id", ours.id);
}
