"use server";

import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { requireCapability } from "@/lib/server/authz";

// ── Admin: list doctor applications ──────────────────────

export async function getDoctorApplications(status?: "PENDING" | "APPROVED" | "REJECTED") {
  await requireCapability("ADMIN");

  let query = supabase
    .from("doctor_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data } = await query;
  return data ?? [];
}

// ── Admin: approve a doctor application ──────────────────
// Creates the user (if new), creates the doctors row, grants DOCTOR capability,
// and calls the verify_doctor RPC to fire the doctor.verified event.

export async function approveDoctorApplication(applicationId: string) {
  const admin = await requireCapability("ADMIN");

  const { data: app, error: appErr } = await supabase
    .from("doctor_applications")
    .select("*")
    .eq("id", applicationId)
    .eq("status", "PENDING")
    .single();

  if (appErr || !app) {
    return { success: false, error: "Candidature introuvable ou déjà traitée" };
  }

  // Resolve or create the doctor's user account.
  let userId = app.user_id;
  let tempPassword: string | null = null;

  if (!userId) {
    // Check if an account exists with this email.
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", app.email)
      .maybeSingle();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create a new user with a random password; they reset on first login.
      tempPassword = cryptoRandom(16);
      const passwordHash = await bcrypt.hash(tempPassword, 12);

      const { data: newUser, error: userErr } = await supabase
        .from("users")
        .insert({
          email: app.email,
          name: app.full_name,
          phone: app.phone,
          password_hash: passwordHash,
          locale: "fr",
        })
        .select("id")
        .single();

      if (userErr || !newUser) {
        return { success: false, error: "Impossible de créer le compte utilisateur" };
      }
      userId = newUser.id;
    }
  }

  // Insert the doctors row (idempotent on user_id).
  const { data: existingDoctor } = await supabase
    .from("doctors")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  let doctorId = existingDoctor?.id;

  if (!doctorId) {
    const { data: newDoctor, error: docErr } = await supabase
      .from("doctors")
      .insert({
        user_id: userId,
        license_id: app.license_id,
        specialty: app.specialty,
        clinic_name: app.clinic_name,
        clinic_address: app.clinic_address,
        region: app.region,
        verification_status: "PENDING",
      })
      .select("id")
      .single();

    if (docErr || !newDoctor) {
      return { success: false, error: `Erreur insertion doctors: ${docErr?.message}` };
    }
    doctorId = newDoctor.id;
  }

  // Fire the verify_doctor RPC — this transitions PENDING→VERIFIED, grants
  // the DOCTOR capability, and emits the doctor.verified event.
  const { error: rpcErr } = await supabase.rpc("verify_doctor", {
    p_doctor_id: doctorId,
    p_admin_id: admin.id,
  });

  if (rpcErr) {
    return { success: false, error: `Erreur verify_doctor: ${rpcErr.message}` };
  }

  // Mark the application approved.
  await supabase
    .from("doctor_applications")
    .update({
      status: "APPROVED",
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin.id,
    })
    .eq("id", applicationId);

  return { success: true, doctorId, userId, tempPassword };
}

// ── Admin: reject a doctor application ───────────────────

export async function rejectDoctorApplication(applicationId: string, reason: string) {
  const admin = await requireCapability("ADMIN");

  const { error } = await supabase
    .from("doctor_applications")
    .update({
      status: "REJECTED",
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin.id,
      rejection_reason: reason,
    })
    .eq("id", applicationId)
    .eq("status", "PENDING");

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Public: verified doctor directory ────────────────────
// Members use this to find bookable doctors. Returns only VERIFIED doctors.

export async function getVerifiedDoctors(params?: {
  specialty?: string;
  region?: string;
}) {
  let query = supabase
    .from("doctors")
    .select("id, license_id, specialty, clinic_name, clinic_address, region, users:user_id(name)")
    .eq("verification_status", "VERIFIED")
    .order("specialty");

  if (params?.specialty) query = query.ilike("specialty", `%${params.specialty}%`);
  if (params?.region) query = query.ilike("region", `%${params.region}%`);

  const { data } = await query;
  return data ?? [];
}

// ── Helper ───────────────────────────────────────────────

function cryptoRandom(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < length; i++) {
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return s;
}
