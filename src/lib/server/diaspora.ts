"use server";

import { supabase } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { requireCapability } from "@/lib/server/authz";

// Diaspora beneficiary onboarding. The payer (diaspora user or self-paying
// local user adding dependents) chooses a plan and provides beneficiary details.
// Returns a Stripe checkout URL. Webhook activates the enrollment on payment.

export async function addBeneficiaryAndCheckout(params: {
  beneficiaryEmail: string;
  beneficiaryName: string;
  beneficiaryPhone?: string;
  planSlug: string;
  referralCode?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const me = await requireCapability("PAYER", "ADMIN");

  // 1. Resolve/create beneficiary user.
  let beneficiaryId: string;
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", params.beneficiaryEmail)
    .maybeSingle();

  if (existingUser) {
    beneficiaryId = existingUser.id;
  } else {
    const { data: newUser, error: userErr } = await supabase
      .from("users")
      .insert({
        email: params.beneficiaryEmail,
        name: params.beneficiaryName,
        phone: params.beneficiaryPhone ?? null,
        locale: "fr",
      })
      .select("id")
      .single();

    if (userErr || !newUser) {
      return { success: false as const, error: "Impossible de créer le bénéficiaire" };
    }
    beneficiaryId = newUser.id;
  }

  // 2. Ensure BENEFICIARY capability on the beneficiary.
  await supabase
    .from("capabilities")
    .upsert(
      { user_id: beneficiaryId, capability: "BENEFICIARY", status: "ACTIVE" },
      { onConflict: "user_id,capability" }
    );

  // 3. Resolve/create subscription for the payer.
  let subscriptionId: string;
  const { data: existingSub } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("payer_id", me.id)
    .in("status", ["ACTIVE", "CREATED"])
    .maybeSingle();

  if (existingSub) {
    subscriptionId = existingSub.id;
  } else {
    const { data: newSub, error: subErr } = await supabase
      .from("subscriptions")
      .insert({ payer_id: me.id, status: "CREATED" })
      .select("id")
      .single();

    if (subErr || !newSub) {
      return { success: false as const, error: "Impossible de créer l'abonnement" };
    }
    subscriptionId = newSub.id;
  }

  // 4. Load plan.
  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("slug", params.planSlug)
    .eq("is_active", true)
    .single();

  if (!plan) return { success: false as const, error: "Forfait introuvable" };

  // 5. Create DRAFT enrollment.
  const { data: enrollment, error: enrErr } = await supabase
    .from("enrollment")
    .insert({
      subscription_id: subscriptionId,
      beneficiary_id: beneficiaryId,
      plan_id: plan.id,
      status: "DRAFT",
    })
    .select("id")
    .single();

  if (enrErr || !enrollment) {
    if (enrErr?.code === "23505") {
      return { success: false as const, error: "Ce bénéficiaire a déjà une adhésion active" };
    }
    return { success: false as const, error: enrErr?.message ?? "Échec création adhésion" };
  }

  // 6. Create referral if code provided.
  if (params.referralCode) {
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id, tier")
      .eq("partner_code", params.referralCode)
      .eq("status", "ACTIVE")
      .maybeSingle();

    if (affiliate) {
      const rate =
        affiliate.tier === "DIAMOND" ? 20 : affiliate.tier === "ELITE" ? 15 : 10;
      await supabase.from("referrals").insert({
        affiliate_id: affiliate.id,
        enrollment_id: enrollment.id,
        commission_rate_pct: rate,
        idempotency_key: `referral:${enrollment.id}`,
      });
    }
  }

  // 7. Price = plan price + dependent fee if beneficiary != payer.
  const isSelf = beneficiaryId === me.id;
  const priceCents =
    plan.yearly_price_cents + (isSelf ? 0 : plan.dependent_fee_cents);

  // 8. Stripe checkout.
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: me.email,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    client_reference_id: me.id,
    metadata: {
      subscriptionId,
      enrollmentId: enrollment.id,
      planSlug: plan.slug,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Vita Santé — ${plan.name_en}`,
            description: isSelf
              ? "Adhésion annuelle personnelle"
              : `Adhésion annuelle pour ${params.beneficiaryName}`,
          },
          unit_amount: priceCents,
        },
        quantity: 1,
      },
    ],
  });

  return {
    success: true as const,
    url: session.url,
    enrollmentId: enrollment.id,
  };
}
