"use server";

import { supabase } from "@/lib/supabase";

// ── Dashboard Queries ─────────────────────────────────────

export async function getMemberDashboard(userId: string) {
  // Get enrollment with plan and credits
  const { data: enrollment } = await supabase
    .from("enrollment")
    .select(`
      *,
      plans(*),
      credit_accounts(*),
      subscriptions!inner(payer_id, status)
    `)
    .eq("beneficiary_id", userId)
    .eq("status", "ACTIVE")
    .single();

  // Get recent visits
  const { data: visits } = await supabase
    .from("visits")
    .select(`
      *,
      doctors(users:user_id(name), specialty, clinic_name)
    `)
    .eq("enrollment_id", enrollment?.id)
    .eq("status", "COMPLETED")
    .order("visited_at", { ascending: false })
    .limit(5);

  // Get user info
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  return { enrollment, visits, user };
}

export async function getPayerDashboard(userId: string) {
  // Get subscription with all enrollments
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select(`
      *,
      enrollment(
        *,
        plans(*),
        credit_accounts(*),
        users:beneficiary_id(id, name, email, phone)
      )
    `)
    .eq("payer_id", userId)
    .in("status", ["ACTIVE", "GRACE_PERIOD", "CREATED"]);

  // Get invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .in("subscription_id", (subscriptions || []).map((s: { id: string }) => s.id))
    .order("created_at", { ascending: false })
    .limit(10);

  return { subscriptions, invoices };
}

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
    .select(`
      *,
      enrollment(
        member_id_code,
        plans(name_en, slug),
        users:beneficiary_id(name)
      )
    `)
    .eq("doctor_id", doctor.id)
    .gte("visited_at", today)
    .order("visited_at", { ascending: true });

  // Stats
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

  return {
    doctor,
    todayVisits,
    stats: {
      totalVisits: totalVisits || 0,
      todayCompleted: todayCompleted || 0,
    },
  };
}

export async function getAffiliateDashboard(userId: string) {
  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!affiliate) return { affiliate: null, referrals: [] };

  const { data: referrals } = await supabase
    .from("referrals")
    .select(`
      *,
      enrollment(
        member_id_code,
        plans(name_en, yearly_price_cents),
        users:beneficiary_id(name, email)
      )
    `)
    .eq("affiliate_id", affiliate.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return { affiliate, referrals };
}

export async function getAdminDashboard() {
  // Counts
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

  // Recent events
  const { data: recentEvents } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  // Pending enrollment reviews
  const { data: pendingReviews } = await supabase
    .from("enrollment")
    .select(`
      *,
      plans(name_en, slug),
      users:beneficiary_id(name, email),
      subscriptions(users:payer_id(name, email))
    `)
    .eq("status", "UNDER_REVIEW")
    .order("created_at", { ascending: true })
    .limit(10);

  return {
    stats: {
      totalUsers: totalUsers || 0,
      activeEnrollments: activeEnrollments || 0,
      pendingEnrollments: pendingEnrollments || 0,
      verifiedDoctors: verifiedDoctors || 0,
      pendingDoctors: pendingDoctors || 0,
    },
    recentEvents,
    pendingReviews,
  };
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
