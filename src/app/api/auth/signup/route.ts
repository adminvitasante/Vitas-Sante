import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, firstName, lastName, phone, country, plan } = body;

  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  // Check if user already exists
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  const isDiaspora = country !== "Haiti";
  const name = `${firstName} ${lastName}`;

  // Insert user
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
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }

  // Assign capabilities: diaspora payers are PAYER only, locals get PAYER + BENEFICIARY
  const capabilities: { user_id: string; capability: string }[] = [
    { user_id: user.id, capability: "PAYER" },
  ];
  if (!isDiaspora) {
    capabilities.push({ user_id: user.id, capability: "BENEFICIARY" });
  }

  const { error: capErr } = await supabase
    .from("capabilities")
    .insert(capabilities);

  if (capErr) {
    console.error("Capability insert error:", capErr);
  }

  return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
}
