"use server";

import { supabase } from "@/lib/supabase";

// ── Member Queries ──────────────────────────────────────────

export async function getMemberDashboard(userId: string) {
  const { data: enrollment } = await supabase
    .from("enrollment")
    .select(`*, plans(*), credit_accounts(*), subscriptions!inner(payer_id, status, current_period_start, current_period_end)`)
    .eq("beneficiary_id", userId)
    .eq("status", "ACTIVE")
    .single();

  const { data: visits } = await supabase
    .from("visits")
    .select(`*, doctors(users:user_id(name), specialty, clinic_name)`)
    .eq("enrollment_id", enrollment?.id)
    .eq("status", "COMPLETED")
    .order("visited_at", { ascending: false })
    .limit(5);

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  return { enrollment, visits, user };
}

export async function getMemberProfile(userId: string) {
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  const { data: capabilities } = await supabase
    .from("capabilities")
    .select("capability, status")
    .eq("user_id", userId);

  const { data: enrollment } = await supabase
    .from("enrollment")
    .select(`*, plans(*), subscriptions!inner(status, current_period_start, current_period_end)`)
    .eq("beneficiary_id", userId)
    .eq("status", "ACTIVE")
    .single();

  return { user, capabilities, enrollment };
}

export async function getMemberMedicalCard(userId: string) {
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  const { data: enrollment } = await supabase
    .from("enrollment")
    .select(`*, plans(*), credit_accounts(*), subscriptions!inner(current_period_end)`)
    .eq("beneficiary_id", userId)
    .eq("status", "ACTIVE")
    .single();

  return { user, enrollment };
}

// Payer-scoped access to a dependent's card. Verifies the caller is the
// payer on the beneficiary's active subscription before returning data.
export async function getBeneficiaryMedicalCard(
  beneficiaryId: string,
  callerPayerId: string
): Promise<
  | { user: unknown; enrollment: unknown }
  | { error: string }
> {
  const { data: enrollment } = await supabase
    .from("enrollment")
    .select(
      `*, plans(*), credit_accounts(*), subscriptions!inner(payer_id, current_period_end)`
    )
    .eq("beneficiary_id", beneficiaryId)
    .eq("status", "ACTIVE")
    .single();

  if (!enrollment) {
    return { error: "Aucune adhésion active pour ce bénéficiaire." };
  }

  const sub = enrollment.subscriptions as unknown as { payer_id: string };
  if (sub.payer_id !== callerPayerId) {
    return { error: "Vous n'êtes pas le payeur de ce bénéficiaire." };
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", beneficiaryId)
    .single();

  return { user, enrollment };
}

export async function getDependents(userId: string) {
  // Get subscriptions where user is the payer
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("payer_id", userId)
    .in("status", ["ACTIVE", "GRACE_PERIOD"]);

  if (!subscriptions?.length) return [];

  const subIds = subscriptions.map((s: { id: string }) => s.id);

  const { data: enrollments } = await supabase
    .from("enrollment")
    .select(`*, plans(name_en, slug), users:beneficiary_id(id, name, email, phone, created_at), credit_accounts(visits_remaining, visits_total)`)
    .in("subscription_id", subIds)
    .neq("beneficiary_id", userId)
    .eq("status", "ACTIVE");

  return enrollments || [];
}

export async function getMemberPayments(userId: string) {
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("payer_id", userId);

  if (!subscriptions?.length) return { invoices: [], visits: [] };

  const subIds = subscriptions.map((s: { id: string }) => s.id);

  const { data: invoices } = await supabase
    .from("invoices")
    .select(`*, invoice_lines(*)`)
    .in("subscription_id", subIds)
    .order("created_at", { ascending: false })
    .limit(20);

  // Also get visit copays
  const { data: enrollment } = await supabase
    .from("enrollment")
    .select("id")
    .eq("beneficiary_id", userId)
    .eq("status", "ACTIVE")
    .single();

  const { data: visits } = await supabase
    .from("visits")
    .select("id, visit_type, copay_amount_cents, visited_at, status")
    .eq("enrollment_id", enrollment?.id)
    .eq("status", "COMPLETED")
    .order("visited_at", { ascending: false })
    .limit(10);

  return { invoices: invoices || [], visits: visits || [] };
}

export async function getMemberAnalytics(userId: string) {
  const { data: enrollment } = await supabase
    .from("enrollment")
    .select(`*, plans(*), credit_accounts(*)`)
    .eq("beneficiary_id", userId)
    .eq("status", "ACTIVE")
    .single();

  const { data: visits } = await supabase
    .from("visits")
    .select(`*, doctors(users:user_id(name), specialty, clinic_name)`)
    .eq("enrollment_id", enrollment?.id)
    .order("visited_at", { ascending: false });

  const { count: totalVisits } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true })
    .eq("enrollment_id", enrollment?.id)
    .eq("status", "COMPLETED");

  const { count: televisits } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true })
    .eq("enrollment_id", enrollment?.id)
    .eq("visit_type", "TELEVISIT")
    .eq("status", "COMPLETED");

  return {
    enrollment,
    visits: visits || [],
    stats: { totalVisits: totalVisits || 0, televisits: televisits || 0 },
  };
}

// ── Doctor Queries ──────────────────────────────────────────

export async function getDoctorDashboard(userId: string) {
  const { data: doctor } = await supabase
    .from("doctors")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!doctor) return { doctor: null, todayVisits: [], stats: null };

  const today = new Date().toISOString().split("T")[0];

  const { data: todayVisits } = await supabase
    .from("visits")
    .select(`*, enrollment(member_id_code, plans(name_en, slug), users:beneficiary_id(name))`)
    .eq("doctor_id", doctor.id)
    .gte("visited_at", today)
    .order("visited_at", { ascending: true });

  const { count: totalVisits } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true })
    .eq("doctor_id", doctor.id)
    .eq("status", "COMPLETED");

  const { count: todayCompleted } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true })
    .eq("doctor_id", doctor.id)
    .eq("status", "COMPLETED")
    .gte("visited_at", today);

  return { doctor, todayVisits, stats: { totalVisits: totalVisits || 0, todayCompleted: todayCompleted || 0 } };
}

export async function getDoctorProfile(userId: string) {
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  const { data: doctor } = await supabase
    .from("doctors")
    .select("*")
    .eq("user_id", userId)
    .single();

  return { user, doctor };
}

export async function getDoctorVisitHistory(userId: string) {
  const { data: doctor } = await supabase
    .from("doctors")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!doctor) return [];

  const { data: visits } = await supabase
    .from("visits")
    .select(`*, enrollment(member_id_code, plans(name_en), users:beneficiary_id(name))`)
    .eq("doctor_id", doctor.id)
    .order("visited_at", { ascending: false })
    .limit(50);

  return visits || [];
}

// ── Affiliate Queries ───────────────────────────────────────

export async function getAffiliateDashboard(userId: string) {
  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!affiliate) return { affiliate: null, referrals: [] };

  const { data: referrals } = await supabase
    .from("referrals")
    .select(`*, enrollment(member_id_code, plans(name_en, yearly_price_cents), users:beneficiary_id(name, email))`)
    .eq("affiliate_id", affiliate.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return { affiliate, referrals };
}

// ── Payer / Sponsor Queries ─────────────────────────────────

export async function getPayerDashboard(userId: string) {
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select(`*, enrollment(*, plans(*), credit_accounts(*), users:beneficiary_id(id, name, email, phone))`)
    .eq("payer_id", userId)
    .in("status", ["ACTIVE", "GRACE_PERIOD", "CREATED"]);

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .in("subscription_id", (subscriptions || []).map((s: { id: string }) => s.id))
    .order("created_at", { ascending: false })
    .limit(10);

  return { subscriptions, invoices };
}

// ── Admin Queries ───────────────────────────────────────────

export async function getAdminDashboard() {
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  const { count: activeEnrollments } = await supabase
    .from("enrollment")
    .select("*", { count: "exact", head: true })
    .eq("status", "ACTIVE");

  const { count: pendingEnrollments } = await supabase
    .from("enrollment")
    .select("*", { count: "exact", head: true })
    .eq("status", "UNDER_REVIEW");

  const { count: verifiedDoctors } = await supabase
    .from("doctors")
    .select("*", { count: "exact", head: true })
    .eq("verification_status", "VERIFIED");

  const { count: pendingDoctors } = await supabase
    .from("doctors")
    .select("*", { count: "exact", head: true })
    .eq("verification_status", "PENDING");

  const { data: recentEvents } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  return {
    stats: {
      totalUsers: totalUsers || 0,
      activeEnrollments: activeEnrollments || 0,
      pendingEnrollments: pendingEnrollments || 0,
      verifiedDoctors: verifiedDoctors || 0,
      pendingDoctors: pendingDoctors || 0,
    },
    recentEvents,
  };
}

export async function getAdminMembers() {
  const { data: users } = await supabase
    .from("users")
    .select(`*, capabilities(capability, status)`)
    .order("created_at", { ascending: false });

  return users || [];
}

export async function getAdminDoctors() {
  const { data: doctors } = await supabase
    .from("doctors")
    .select(`*, users:user_id(name, email, phone)`)
    .order("created_at", { ascending: false });

  return doctors || [];
}

export async function getAdminAffiliates() {
  const { data: affiliates } = await supabase
    .from("affiliates")
    .select(`*, users:user_id(name, email, phone)`)
    .order("created_at", { ascending: false });

  return affiliates || [];
}

// ── Plan Queries ──────────────────────────────────────────

export async function getPlans() {
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("is_active", true)
    .order("yearly_price_cents", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, plans: data };
}

export async function getCreditBalance(enrollmentId: string) {
  const year = new Date().getFullYear();
  const { data } = await supabase
    .from("credit_accounts")
    .select("*")
    .eq("enrollment_id", enrollmentId)
    .eq("period_year", year)
    .single();
  return data;
}

export async function getCreditHistory(enrollmentId: string) {
  const year = new Date().getFullYear();
  const { data: account } = await supabase
    .from("credit_accounts")
    .select("id")
    .eq("enrollment_id", enrollmentId)
    .eq("period_year", year)
    .single();

  if (!account) return [];

  const { data } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("credit_account_id", account.id)
    .order("created_at", { ascending: false });

  return data || [];
}
