import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Public endpoint that persists a doctor application for admin review.
// The form at /doctor-apply posts here. Admin then calls verify_doctor() after
// real-world license verification.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    fullName,
    email,
    phone,
    licenseId,
    specialty,
    clinicName,
    clinicAddress,
    region,
    yearsExperience,
    notes,
  } = body;

  if (!fullName || !email || !licenseId || !specialty) {
    return NextResponse.json(
      { error: "Nom, email, numéro de licence et spécialité sont requis." },
      { status: 400 }
    );
  }

  // If the applicant already has a Vita Santé account, link it.
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  // Dedupe: if there's already a pending application for this license, reject.
  const { data: existingApp } = await supabase
    .from("doctor_applications")
    .select("id, status")
    .eq("license_id", licenseId)
    .in("status", ["PENDING", "APPROVED"])
    .maybeSingle();

  if (existingApp) {
    return NextResponse.json(
      {
        error:
          existingApp.status === "APPROVED"
            ? "Ce numéro de licence est déjà approuvé."
            : "Une candidature avec ce numéro de licence est déjà en cours.",
      },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("doctor_applications")
    .insert({
      user_id: existingUser?.id ?? null,
      full_name: fullName,
      email,
      phone: phone || null,
      license_id: licenseId,
      specialty,
      clinic_name: clinicName || null,
      clinic_address: clinicAddress || null,
      region: region || null,
      years_experience: yearsExperience ? parseInt(yearsExperience, 10) : null,
      notes: notes || null,
      status: "PENDING",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Doctor application insert error:", error);
    return NextResponse.json(
      { error: "Échec de l'enregistrement. Veuillez réessayer." },
      { status: 500 }
    );
  }

  // Notify every admin that a new application is pending.
  const { data: admins } = await supabase
    .from("capabilities")
    .select("user_id")
    .eq("capability", "ADMIN")
    .eq("status", "ACTIVE");

  for (const a of admins ?? []) {
    await supabase.from("notifications").insert({
      user_id: a.user_id,
      channel: "IN_APP",
      priority: "HIGH",
      subject: "Nouvelle candidature médecin",
      body: `${fullName} (${specialty}) a soumis une candidature. Licence ${licenseId}.`,
      link_url: "/admin/doctors",
      metadata: { application_id: data.id, license_id: licenseId },
      idempotency_key: `doctor_app:${data.id}:${a.user_id}`,
    });
  }

  return NextResponse.json({ success: true, applicationId: data.id }, { status: 201 });
}
