"use server";

import { supabase } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";

// ── Generate Invoice for Subscription ─────────────────────

export async function generateInvoice(subscriptionId: string, actorId: string) {
  // Get subscription with enrollments
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("*, enrollment(*, plans(*))")
    .eq("id", subscriptionId)
    .single();

  if (!sub) {
    return { success: false, error: "Subscription not found" };
  }

  const periodYear = new Date().getFullYear();
  const idempotencyKey = `invoice:${subscriptionId}:${periodYear}`;

  // Check idempotency — don't generate duplicate invoice
  const { data: existing } = await supabase
    .from("invoices")
    .select("id, invoice_number")
    .eq("idempotency_key", idempotencyKey)
    .single();

  if (existing) {
    return { success: true, invoiceId: existing.id, already_existed: true };
  }

  // Calculate total from active enrollments
  const activeEnrollments = (sub.enrollment || []).filter(
    (e: { status: string }) => e.status === "ACTIVE"
  );

  if (activeEnrollments.length === 0) {
    return { success: false, error: "No active enrollments to invoice" };
  }

  // Generate invoice number
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const seq = Math.floor(Math.random() * 99999).toString().padStart(5, "0");
  const invoiceNumber = `INV-${periodYear}${month}-${seq}`;

  // Create invoice
  const { data: invoice, error: invErr } = await supabase
    .from("invoices")
    .insert({
      subscription_id: subscriptionId,
      invoice_number: invoiceNumber,
      status: "DRAFT",
      total_cents: 0, // will be updated by trigger when lines are added
      currency: "USD",
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      idempotency_key: idempotencyKey,
    })
    .select("id")
    .single();

  if (invErr || !invoice) {
    return { success: false, error: invErr?.message || "Failed to create invoice" };
  }

  // Add line items
  const lines = activeEnrollments.map((enrollment: {
    id: string;
    plan_id: string;
    beneficiary_id: string;
    plans: { yearly_price_cents: number; dependent_fee_cents: number; name_en: string };
    subscription_id: string;
  }) => {
    const isSelfEnrolled = enrollment.beneficiary_id === sub.payer_id;
    const amount = isSelfEnrolled
      ? enrollment.plans.yearly_price_cents
      : enrollment.plans.yearly_price_cents + enrollment.plans.dependent_fee_cents;

    return {
      invoice_id: invoice.id,
      enrollment_id: enrollment.id,
      description: `${enrollment.plans.name_en} plan${isSelfEnrolled ? "" : " + dependent fee"}`,
      amount_cents: amount,
    };
  });

  await supabase.from("invoice_lines").insert(lines);

  // Emit event
  await supabase.from("events").insert({
    event_type: "subscription.invoice_generated",
    aggregate_type: "SUBSCRIPTION",
    aggregate_id: subscriptionId,
    payload: { invoice_id: invoice.id, invoice_number: invoiceNumber },
    actor_id: actorId,
    idempotency_key: `invoice_generated:${invoice.id}`,
  });

  return { success: true, invoiceId: invoice.id, invoiceNumber };
}

// ── Record Payment (mark invoice as paid + renew) ─────────

export async function recordPayment(invoiceId: string, actorId: string) {
  // Get invoice
  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, subscriptions(*)")
    .eq("id", invoiceId)
    .single();

  if (!invoice) {
    return { success: false, error: "Invoice not found" };
  }

  if (invoice.status === "PAID") {
    return { success: true, already_paid: true };
  }

  // Mark as paid
  await supabase
    .from("invoices")
    .update({ status: "PAID", paid_at: new Date().toISOString() })
    .eq("id", invoiceId);

  // Renew subscription (resets credits)
  const { error } = await supabase.rpc("renew_subscription", {
    p_subscription_id: invoice.subscription_id,
    p_actor_id: actorId,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ── Create Stripe Checkout Session ────────────────────────
// Signup and dashboard call this to kick off a Stripe-hosted payment.
// Returns the Stripe URL the client should redirect to.

export async function createStripeCheckout(params: {
  payerUserId: string;
  enrollmentId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  // Load enrollment + plan + subscription.
  const { data: enrollment, error: enrErr } = await supabase
    .from("enrollment")
    .select("id, subscription_id, plan_id, plans(slug, name_en, yearly_price_cents, dependent_fee_cents), subscriptions!inner(payer_id, stripe_subscription_id)")
    .eq("id", params.enrollmentId)
    .single();

  if (enrErr || !enrollment) {
    return { success: false, error: "Enrollment not found" };
  }

  const plan = enrollment.plans as unknown as {
    slug: string;
    name_en: string;
    yearly_price_cents: number;
    dependent_fee_cents: number;
  };
  const sub = enrollment.subscriptions as unknown as {
    payer_id: string;
    stripe_subscription_id: string | null;
  };

  if (sub.payer_id !== params.payerUserId) {
    return { success: false, error: "Not authorized for this enrollment" };
  }

  // Create a one-off Stripe checkout session. Uses dynamic price_data so we
  // don't have to pre-create Stripe products for every plan.
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    client_reference_id: params.payerUserId,
    metadata: {
      subscriptionId: enrollment.subscription_id,
      enrollmentId: enrollment.id,
      planSlug: plan.slug,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Vita Santé — ${plan.name_en}`,
            description: `Annual membership for one beneficiary`,
          },
          unit_amount: plan.yearly_price_cents,
        },
        quantity: 1,
      },
    ],
  });

  return { success: true, url: session.url, sessionId: session.id };
}

// ── Get Payer's Invoices ──────────────────────────────────

export async function getPayerInvoices(payerUserId: string) {
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      invoice_lines(*),
      subscriptions!inner(payer_id)
    `)
    .eq("subscriptions.payer_id", payerUserId)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, invoices: data };
}
