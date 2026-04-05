"use server";

import { supabase } from "@/lib/supabase";

// ── Create Enrollment (Payer adds a beneficiary) ──────────

export async function createEnrollment(params: {
  payerUserId: string;
  beneficiaryEmail: string;
  beneficiaryName: string;
  beneficiaryPhone?: string;
  planSlug: string;
  isDiaspora?: boolean;
  referralCode?: string;
}) {
  // 1. Get or create beneficiary user
  let beneficiaryId: string;

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", params.beneficiaryEmail)
    .single();

  if (existingUser) {
    beneficiaryId = existingUser.id;
  } else {
    const { data: newUser, error: userErr } = await supabase
      .from("users")
      .insert({
        email: params.beneficiaryEmail,
        name: params.beneficiaryName,
        phone: params.beneficiaryPhone || null,
        is_diaspora: params.isDiaspora || false,
      })
      .select("id")
      .single();

    if (userErr || !newUser) {
      return { success: false, error: "Failed to create beneficiary user" };
    }
    beneficiaryId = newUser.id;
  }

  // 2. Get or create subscription for payer
  let subscriptionId: string;

  const { data: existingSub } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("payer_id", params.payerUserId)
    .in("status", ["ACTIVE", "CREATED"])
    .single();

  if (existingSub) {
    subscriptionId = existingSub.id;
  } else {
    const { data: newSub, error: subErr } = await supabase
      .from("subscriptions")
      .insert({
        payer_id: params.payerUserId,
        status: "CREATED",
      })
      .select("id")
      .single();

    if (subErr || !newSub) {
      return { success: false, error: "Failed to create subscription" };
    }
    subscriptionId = newSub.id;
  }

  // 3. Get plan
  const { data: plan } = await supabase
    .from("plans")
    .select("id")
    .eq("slug", params.planSlug)
    .eq("is_active", true)
    .single();

  if (!plan) {
    return { success: false, error: "Plan not found or inactive" };
  }

  // 4. Create enrollment in DRAFT status
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

  if (enrErr) {
    if (enrErr.code === "23505") {
      return { success: false, error: "This person already has an active enrollment" };
    }
    return { success: false, error: enrErr.message };
  }

  // 5. If referral code provided, create referral
  if (params.referralCode) {
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id, tier")
      .eq("partner_code", params.referralCode)
      .eq("status", "ACTIVE")
      .single();

    if (affiliate) {
      const commissionRate = affiliate.tier === "DIAMOND" ? 20 : affiliate.tier === "ELITE" ? 15 : 10;

      await supabase.from("referrals").insert({
        affiliate_id: affiliate.id,
        enrollment_id: enrollment!.id,
        commission_rate_pct: commissionRate,
        idempotency_key: `referral:${enrollment!.id}`,
      });
    }
  }

  return { success: true, enrollmentId: enrollment!.id };
}

// ── Submit Enrollment (DRAFT → UNDER_REVIEW) ──────────────

export async function submitEnrollment(enrollmentId: string, actorId: string) {
  const { data, error } = await supabase.rpc("submit_enrollment", {
    p_enrollment_id: enrollmentId,
    p_actor_id: actorId,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, enrollment: data };
}

// ── Approve Enrollment (admin action) ─────────────────────

export async function approveEnrollment(enrollmentId: string, adminId: string) {
  const { data, error } = await supabase.rpc("approve_enrollment", {
    p_enrollment_id: enrollmentId,
    p_admin_id: adminId,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, enrollment: data };
}

// ── Reject Enrollment (admin action) ──────────────────────

export async function rejectEnrollment(enrollmentId: string, adminId: string, reason: string) {
  const { data, error } = await supabase.rpc("reject_enrollment", {
    p_enrollment_id: enrollmentId,
    p_admin_id: adminId,
    p_reason: reason,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, enrollment: data };
}
