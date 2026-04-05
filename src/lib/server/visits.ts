"use server";

import { supabase } from "@/lib/supabase";
import type { VisitType, VisitNetwork } from "@/types/database";

// ── Verify & Initiate Visit ───────────────────────────────

export async function initiateVisit(params: {
  doctorId: string;
  memberIdCode: string;
  visitType: VisitType;
  network?: VisitNetwork;
  idempotencyKey?: string;
}) {
  const { data, error } = await supabase.rpc("initiate_visit", {
    p_doctor_id: params.doctorId,
    p_member_id_code: params.memberIdCode,
    p_visit_type: params.visitType,
    p_network: params.network || "HAITI",
    p_idempotency_key: params.idempotencyKey || null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return data as {
    success: boolean;
    visit_id?: string;
    beneficiary_name?: string;
    member_id_code?: string;
    plan_slug?: string;
    visits_remaining?: number;
    enrollment_status?: string;
    error?: string;
  };
}

// ── Complete Visit (deduct credit) ────────────────────────

export async function completeVisit(params: {
  visitId: string;
  doctorUserId: string;
  notes?: string;
  copayCents?: number;
}) {
  const { data, error } = await supabase.rpc("complete_visit", {
    p_visit_id: params.visitId,
    p_doctor_user_id: params.doctorUserId,
    p_notes: params.notes || null,
    p_copay_cents: params.copayCents || null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return data as {
    success: boolean;
    visit_id?: string;
    credits_remaining?: number;
    transaction_id?: string;
    already_completed?: boolean;
    error?: string;
  };
}

// ── Cancel Visit ──────────────────────────────────────────

export async function cancelVisit(visitId: string) {
  const { error } = await supabase
    .from("visits")
    .update({ status: "CANCELLED" })
    .eq("id", visitId)
    .in("status", ["INITIATED", "VERIFIED", "CONFIRMED"]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ── Get Visit History (for doctor) ────────────────────────

export async function getDoctorVisits(doctorUserId: string, limit = 50, offset = 0) {
  const { data: doctor } = await supabase
    .from("doctors")
    .select("id")
    .eq("user_id", doctorUserId)
    .single();

  if (!doctor) {
    return { success: false, error: "Doctor not found" };
  }

  const { data, error, count } = await supabase
    .from("visits")
    .select(`
      *,
      enrollment!inner(
        member_id_code,
        beneficiary_id,
        users:beneficiary_id(name)
      )
    `, { count: "exact" })
    .eq("doctor_id", doctor.id)
    .order("visited_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, visits: data, total: count };
}

// ── Get Beneficiary Visits ────────────────────────────────

export async function getBeneficiaryVisits(beneficiaryId: string) {
  const { data, error } = await supabase
    .from("visits")
    .select(`
      *,
      doctors!inner(
        license_id,
        specialty,
        clinic_name,
        users:user_id(name)
      )
    `)
    .eq("enrollment.beneficiary_id", beneficiaryId)
    .order("visited_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, visits: data };
}
