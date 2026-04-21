import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { stripe, isSimulationMode } from "@/lib/stripe";

// Signup now handles the full onboarding flow:
//   1. Create user + capabilities
//   2. For non-diaspora (self-paying): create subscription + enrollment + checkout session
//   3. For diaspora (paying for someone else): create user only; they add beneficiaries post-signin
// The response includes a `checkoutUrl` when payment is needed so the client
// can redirect to Stripe.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, firstName, lastName, phone, country, plan, referralCode } = body;

  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json(
      { error: "Email, mot de passe, prénom et nom sont requis." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Le mot de passe doit comporter au moins 8 caractères." },
      { status: 400 }
    );
  }

  // Dedupe email.
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Un compte avec cet email existe déjà." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const isDiaspora = country && country !== "Haiti";
  const name = `${firstName} ${lastName}`;

  const { data: user, error: insertErr } = await supabase
    .from("users")
    .insert({
      email,
      name,
      phone: phone || null,
      password_hash: passwordHash,
      is_diaspora: isDiaspora,
      locale: "fr",
    })
    .select("id")
    .single();

  if (insertErr || !user) {
    console.error("Signup insert error:", insertErr);
    return NextResponse.json(
      { error: "Impossible de créer le compte. Réessayez." },
      { status: 500 }
    );
  }

  // Capabilities: diaspora payers are PAYER only; self-paying locals are both.
  const caps: { user_id: string; capability: string }[] = [
    { user_id: user.id, capability: "PAYER" },
  ];
  if (!isDiaspora) {
    caps.push({ user_id: user.id, capability: "BENEFICIARY" });
  }
  await supabase.from("capabilities").insert(caps);

  // If a plan was selected AND the user is self-paying (not diaspora),
  // create the subscription + enrollment + Stripe checkout session.
  if (plan && !isDiaspora) {
    // Simulation mode (no Stripe keys yet OR DEMO_MODE=true):
    // skip Stripe entirely and activate the enrollment immediately.
    if (isSimulationMode()) {
      const demoResult = await createAndActivateDemoEnrollment({
        userId: user.id,
        planSlug: plan,
        referralCode: referralCode ?? null,
      });
      return NextResponse.json(
        {
          success: true,
          userId: user.id,
          demoMode: true,
          enrollmentId: demoResult.enrollmentId,
          memberIdCode: demoResult.memberIdCode,
        },
        { status: 201 }
      );
    }

    const checkout = await createSubscriptionAndCheckout({
      userId: user.id,
      planSlug: plan,
      userEmail: email,
      origin: new URL(req.url).origin,
      referralCode: referralCode ?? null,
    });

    if (!checkout.success) {
      return NextResponse.json(
        { success: true, userId: user.id, checkoutError: checkout.error },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: true, userId: user.id, checkoutUrl: checkout.url },
      { status: 201 }
    );
  }

  // Diaspora case: no plan to pay yet. They'll add beneficiaries from the dashboard.
  return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
}

// ── Demo-mode enrollment activation ────────────────────────
// Bypasses Stripe entirely: creates subscription as ACTIVE, enrollment as
// ACTIVE with generated member_id_code + credit account. Used when
// DEMO_MODE=true (env var) so a client can test the full signup → card flow
// without real payment credentials.

async function createAndActivateDemoEnrollment(params: {
  userId: string;
  planSlug: string;
  referralCode: string | null;
}) {
  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("slug", params.planSlug)
    .eq("is_active", true)
    .single();

  if (!plan) return { enrollmentId: null, memberIdCode: null };

  // Active subscription (no Stripe id).
  const { data: sub } = await supabase
    .from("subscriptions")
    .insert({
      payer_id: params.userId,
      status: "ACTIVE",
    })
    .select("id")
    .single();

  if (!sub) return { enrollmentId: null, memberIdCode: null };

  // Create enrollment in UNDER_REVIEW so we can funnel through the RPC.
  const { data: enrollment } = await supabase
    .from("enrollment")
    .insert({
      subscription_id: sub.id,
      beneficiary_id: params.userId,
      plan_id: plan.id,
      status: "UNDER_REVIEW",
      enrolled_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (!enrollment) return { enrollmentId: null, memberIdCode: null };

  // Attach referral if provided.
  if (params.referralCode) {
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id, tier")
      .eq("partner_code", params.referralCode)
      .eq("status", "ACTIVE")
      .maybeSingle();

    if (affiliate) {
      const rate = affiliate.tier === "DIAMOND" ? 20 : affiliate.tier === "ELITE" ? 15 : 10;
      await supabase.from("referrals").insert({
        affiliate_id: affiliate.id,
        enrollment_id: enrollment.id,
        commission_rate_pct: rate,
        idempotency_key: `referral:${enrollment.id}`,
      });
    }
  }

  // Approve it using the seed-admin actor. The RPC handles member ID
  // generation, credit account creation, capability grant, events.
  const SEED_ADMIN_ID = "a0000000-0000-0000-0000-000000000001";
  const { data: approved } = await supabase.rpc("approve_enrollment", {
    p_enrollment_id: enrollment.id,
    p_admin_id: SEED_ADMIN_ID,
  });

  const memberIdCode = (approved as { member_id_code?: string } | null)?.member_id_code ?? null;

  return { enrollmentId: enrollment.id, memberIdCode };
}

async function createSubscriptionAndCheckout(params: {
  userId: string;
  planSlug: string;
  userEmail: string;
  origin: string;
  referralCode: string | null;
}) {
  // Load plan.
  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("slug", params.planSlug)
    .eq("is_active", true)
    .single();

  if (!plan) {
    return { success: false as const, error: "Plan introuvable" };
  }

  // Create subscription.
  const { data: sub } = await supabase
    .from("subscriptions")
    .insert({
      payer_id: params.userId,
      status: "CREATED",
    })
    .select("id")
    .single();

  if (!sub) {
    return { success: false as const, error: "Impossible de créer l'abonnement" };
  }

  // Create enrollment (payer == beneficiary for self-paying).
  const { data: enrollment } = await supabase
    .from("enrollment")
    .insert({
      subscription_id: sub.id,
      beneficiary_id: params.userId,
      plan_id: plan.id,
      status: "DRAFT",
    })
    .select("id")
    .single();

  if (!enrollment) {
    return { success: false as const, error: "Impossible de créer l'adhésion" };
  }

  // If a referral code is present, create the referral row in PENDING state.
  // Event-processor flips it to ACTIVE + credits commission on enrollment.activated.
  if (params.referralCode) {
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id, tier")
      .eq("partner_code", params.referralCode)
      .eq("status", "ACTIVE")
      .maybeSingle();

    if (affiliate) {
      const commissionRate =
        affiliate.tier === "DIAMOND" ? 20 : affiliate.tier === "ELITE" ? 15 : 10;

      await supabase.from("referrals").insert({
        affiliate_id: affiliate.id,
        enrollment_id: enrollment.id,
        commission_rate_pct: commissionRate,
        idempotency_key: `referral:${enrollment.id}`,
      });
    }
  }

  // Build the Stripe checkout URL.
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: params.userEmail,
    success_url: `${params.origin}/auth/signin?enrolled=1`,
    cancel_url: `${params.origin}/auth/signup?canceled=1`,
    client_reference_id: params.userId,
    metadata: {
      subscriptionId: sub.id,
      enrollmentId: enrollment.id,
      planSlug: plan.slug,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Vita Santé — ${plan.name_en}`,
            description: `Adhésion annuelle, ${plan.visits_per_year} visites incluses`,
          },
          unit_amount: plan.yearly_price_cents,
        },
        quantity: 1,
      },
    ],
  });

  return { success: true as const, url: session.url };
}
