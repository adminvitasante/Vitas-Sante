"use server";

import { supabase } from "@/lib/supabase";
import { requireCapability } from "@/lib/server/authz";
import type { CapabilityType, AffiliateTier } from "@/types/database";

// ── Enrollment approvals (most critical admin action) ─────

export async function approveEnrollmentAction(enrollmentId: string) {
  const admin = await requireCapability("ADMIN");

  const { error } = await supabase.rpc("approve_enrollment", {
    p_enrollment_id: enrollmentId,
    p_admin_id: admin.id,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function rejectEnrollmentAction(enrollmentId: string, reason: string) {
  const admin = await requireCapability("ADMIN");

  if (!reason.trim()) {
    return { success: false, error: "Un motif de rejet est requis." };
  }

  const { error } = await supabase.rpc("reject_enrollment", {
    p_enrollment_id: enrollmentId,
    p_admin_id: admin.id,
    p_reason: reason.trim(),
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Pending enrollments listing ───────────────────────────

export async function getPendingEnrollments() {
  await requireCapability("ADMIN");

  const { data } = await supabase
    .from("enrollment")
    .select(`
      id, status, enrolled_at, created_at,
      plans(slug, name_en, name_fr, yearly_price_cents),
      users:beneficiary_id(id, name, email, phone, is_diaspora),
      subscriptions!inner(payer_id, users:payer_id(name, email))
    `)
    .in("status", ["UNDER_REVIEW", "SUBMITTED"])
    .order("created_at", { ascending: true });

  return data ?? [];
}

// ── Capability management (suspend / reactivate) ──────────

export async function setCapabilityStatus(
  userId: string,
  capability: CapabilityType,
  status: "ACTIVE" | "SUSPENDED" | "REVOKED"
) {
  const admin = await requireCapability("ADMIN");

  // Guard against admin locking themselves out.
  if (userId === admin.id && capability === "ADMIN" && status !== "ACTIVE") {
    return { success: false, error: "Vous ne pouvez pas révoquer votre propre accès admin." };
  }

  const { error } = await supabase
    .from("capabilities")
    .upsert(
      { user_id: userId, capability, status },
      { onConflict: "user_id,capability" }
    );

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Affiliate management ──────────────────────────────────

export async function promoteUserToAffiliate(params: {
  email: string;
  partnerCode: string;
  tier: AffiliateTier;
}) {
  await requireCapability("ADMIN");

  if (!/^[A-Z0-9-]{3,32}$/.test(params.partnerCode)) {
    return { success: false, error: "Code partenaire invalide (A-Z, 0-9, tirets, 3-32 car.)" };
  }

  const { data: user } = await supabase
    .from("users")
    .select("id, name")
    .eq("email", params.email)
    .maybeSingle();

  if (!user) {
    return { success: false, error: "Aucun utilisateur avec cet email." };
  }

  // Check partner_code not already used.
  const { data: existingCode } = await supabase
    .from("affiliates")
    .select("id")
    .eq("partner_code", params.partnerCode)
    .maybeSingle();

  if (existingCode) {
    return { success: false, error: "Ce code partenaire est déjà utilisé." };
  }

  // Check user doesn't already have an affiliate account.
  const { data: existingAffiliate } = await supabase
    .from("affiliates")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingAffiliate) {
    return { success: false, error: `${user.name} est déjà un affilié.` };
  }

  const { error: affErr } = await supabase.from("affiliates").insert({
    user_id: user.id,
    partner_code: params.partnerCode,
    tier: params.tier,
    status: "ACTIVE",
  });

  if (affErr) return { success: false, error: affErr.message };

  // Grant AFFILIATE capability.
  await supabase
    .from("capabilities")
    .upsert(
      { user_id: user.id, capability: "AFFILIATE", status: "ACTIVE" },
      { onConflict: "user_id,capability" }
    );

  return { success: true, userId: user.id };
}

export async function setAffiliateTier(affiliateId: string, tier: AffiliateTier) {
  await requireCapability("ADMIN");

  const { error } = await supabase
    .from("affiliates")
    .update({ tier })
    .eq("id", affiliateId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function setAffiliateStatus(
  affiliateId: string,
  status: "ACTIVE" | "SUSPENDED" | "REVOKED"
) {
  await requireCapability("ADMIN");

  const { data: aff } = await supabase
    .from("affiliates")
    .update({ status })
    .eq("id", affiliateId)
    .select("user_id")
    .single();

  if (!aff) return { success: false, error: "Affilié introuvable." };

  // Keep the user capability in sync.
  await supabase
    .from("capabilities")
    .upsert(
      { user_id: aff.user_id, capability: "AFFILIATE", status },
      { onConflict: "user_id,capability" }
    );

  return { success: true };
}

// ── Plan management ──────────────────────────────────────

export async function togglePlanActive(planId: string, isActive: boolean) {
  await requireCapability("ADMIN");

  const { error } = await supabase
    .from("plans")
    .update({ is_active: isActive })
    .eq("id", planId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updatePlanPricing(params: {
  planId: string;
  yearlyPriceCents: number;
  dependentFeeCents: number;
}) {
  await requireCapability("ADMIN");

  if (params.yearlyPriceCents < 0 || params.dependentFeeCents < 0) {
    return { success: false, error: "Les prix doivent être positifs." };
  }

  const { error } = await supabase
    .from("plans")
    .update({
      yearly_price_cents: params.yearlyPriceCents,
      dependent_fee_cents: params.dependentFeeCents,
    })
    .eq("id", params.planId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
