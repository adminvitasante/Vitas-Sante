"use server";

import { supabase } from "@/lib/supabase";
import { stripe, isSimulationMode } from "@/lib/stripe";
import { requireCapability, getSessionUser } from "@/lib/server/authz";

// ── Sponsor overview: how many people they fund, total contributed ──

export async function getSponsorOverview(sponsorUserId: string) {
  const { data: grants } = await supabase
    .from("sponsor_grants")
    .select(`
      *,
      plans(name_en, yearly_price_cents),
      sponsor_grant_enrollments(id, enrollment_id, enrollment(member_id_code, beneficiary_id, users:beneficiary_id(name), status))
    `)
    .eq("sponsor_user_id", sponsorUserId)
    .order("created_at", { ascending: false });

  const totalContributedCents = (grants ?? []).reduce((sum, g) => {
    if (g.status === "FUNDED" || g.status === "FULFILLED") {
      const plan = g.plans as unknown as { yearly_price_cents: number };
      return sum + plan.yearly_price_cents * g.seats_total;
    }
    return sum;
  }, 0);

  const totalSeatsClaimed = (grants ?? []).reduce((sum, g) => sum + g.seats_claimed, 0);
  const totalSeatsTotal = (grants ?? []).reduce((sum, g) => sum + g.seats_total, 0);

  return {
    grants: grants ?? [],
    stats: {
      activeGrants: (grants ?? []).filter((g) => g.status === "FUNDED").length,
      totalSeatsClaimed,
      totalSeatsTotal,
      totalContributedCents,
    },
  };
}

// ── Create a sponsor grant + checkout session ───────────────
// Sponsor picks a plan and number of seats; this creates a PLEDGED grant
// and a Stripe checkout session. Webhook will flip it to FUNDED on payment.

export async function createSponsorGrant(params: {
  planSlug: string;
  seats: number;
  notes?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const me = await getSessionUser();
  if (!me) return { success: false, error: "Non authentifié" };

  if (params.seats < 1 || params.seats > 1000) {
    return { success: false, error: "Nombre de places invalide (1-1000)" };
  }

  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("slug", params.planSlug)
    .eq("is_active", true)
    .single();

  if (!plan) return { success: false, error: "Forfait introuvable" };

  const { data: grant, error: grantErr } = await supabase
    .from("sponsor_grants")
    .insert({
      sponsor_user_id: me.id,
      plan_id: plan.id,
      seats_total: params.seats,
      seats_claimed: 0,
      status: "PLEDGED",
      notes: params.notes ?? null,
    })
    .select("id")
    .single();

  if (grantErr || !grant) {
    return { success: false, error: grantErr?.message ?? "Erreur création grant" };
  }

  // Simulation mode (no Stripe keys yet OR DEMO_MODE=true):
  // mark grant FUNDED directly, skip Stripe.
  if (isSimulationMode()) {
    await supabase
      .from("sponsor_grants")
      .update({ status: "FUNDED" })
      .eq("id", grant.id);

    return {
      success: true,
      url: params.successUrl,
      grantId: grant.id,
      demoMode: true,
    };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: me.email,
    client_reference_id: me.id,
    metadata: {
      sponsorGrantId: grant.id,
      sponsorUserId: me.id,
      planSlug: plan.slug,
      seats: String(params.seats),
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Vita Santé — ${plan.name_en} (${params.seats} places)`,
            description: `Parrainage institutionnel: ${params.seats} adhésions annuelles`,
          },
          unit_amount: plan.yearly_price_cents,
        },
        quantity: params.seats,
      },
    ],
  });

  return { success: true, url: session.url, grantId: grant.id };
}

// ── Sponsor claims seats for specific beneficiaries ─────────
// Called when the sponsor assigns one of their grant's seats to a specific
// beneficiary (new or existing user). Creates the enrollment and links it
// to the grant.

export async function claimSponsorGrantSeat(params: {
  grantId: string;
  beneficiaryEmail: string;
  beneficiaryName: string;
  beneficiaryPhone?: string;
}) {
  const me = await requireCapability("PAYER");

  // Load grant + verify ownership + check seats available.
  const { data: grant, error: grantErr } = await supabase
    .from("sponsor_grants")
    .select("*, plans(*)")
    .eq("id", params.grantId)
    .eq("sponsor_user_id", me.id)
    .single();

  if (grantErr || !grant) {
    return { success: false, error: "Parrainage introuvable" };
  }

  if (grant.status !== "FUNDED") {
    return { success: false, error: `Parrainage non financé (statut ${grant.status})` };
  }

  if (grant.seats_claimed >= grant.seats_total) {
    return { success: false, error: "Toutes les places sont déjà attribuées" };
  }

  // Resolve or create the beneficiary user.
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
      })
      .select("id")
      .single();

    if (userErr || !newUser) {
      return { success: false, error: userErr?.message ?? "Erreur création bénéficiaire" };
    }
    beneficiaryId = newUser.id;
  }

  // Need a subscription to hang the enrollment on. Reuse sponsor's subscription
  // or create one. Sponsors get a single ongoing subscription that's just a
  // wrapper for their grants.
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
    const { data: newSub } = await supabase
      .from("subscriptions")
      .insert({ payer_id: me.id, status: "ACTIVE" })
      .select("id")
      .single();
    if (!newSub) return { success: false, error: "Erreur création abonnement" };
    subscriptionId = newSub.id;
  }

  // Create enrollment. Admin still needs to approve (state machine),
  // but the seat is reserved immediately.
  const { data: enrollment, error: enrErr } = await supabase
    .from("enrollment")
    .insert({
      subscription_id: subscriptionId,
      beneficiary_id: beneficiaryId,
      plan_id: grant.plan_id,
      status: "UNDER_REVIEW",
      enrolled_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (enrErr || !enrollment) {
    if (enrErr?.code === "23505") {
      return { success: false, error: "Ce bénéficiaire a déjà une adhésion active" };
    }
    return { success: false, error: enrErr?.message ?? "Erreur création adhésion" };
  }

  // Link enrollment to grant.
  await supabase.from("sponsor_grant_enrollments").insert({
    grant_id: grant.id,
    enrollment_id: enrollment.id,
  });

  // Increment seats claimed.
  const newClaimed = grant.seats_claimed + 1;
  const newStatus = newClaimed >= grant.seats_total ? "FULFILLED" : "FUNDED";

  await supabase
    .from("sponsor_grants")
    .update({ seats_claimed: newClaimed, status: newStatus })
    .eq("id", grant.id);

  return { success: true, enrollmentId: enrollment.id, beneficiaryId };
}

// ── List grants this sponsor has available to assign ───────

export async function getAvailableGrants(sponsorUserId: string) {
  const { data } = await supabase
    .from("sponsor_grants")
    .select("*, plans(name_en, slug)")
    .eq("sponsor_user_id", sponsorUserId)
    .eq("status", "FUNDED")
    .order("created_at", { ascending: false });

  return (data ?? []).filter((g) => g.seats_claimed < g.seats_total);
}
