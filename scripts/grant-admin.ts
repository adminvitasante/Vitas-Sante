#!/usr/bin/env tsx
/**
 * Grants ADMIN capability to a user by email.
 *
 * Usage:
 *   npx tsx scripts/grant-admin.ts user@example.com
 *
 * If no account exists with that email, creates one with a random
 * temporary password (printed once; change it at first login).
 *
 * Env required:
 *   DATABASE_URL              (Supabase direct connection)
 *   OR NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *
 * Safe to re-run. Idempotent on (user_id, capability).
 */

import { randomBytes, scryptSync } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx tsx scripts/grant-admin.ts <email>");
    process.exit(1);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error(
      "Missing env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY\n" +
      "(copy them from your Vercel project's Environment Variables)."
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // Look up existing user.
  const { data: existing } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("email", email)
    .maybeSingle();

  let userId: string;
  let tempPassword: string | null = null;

  if (existing) {
    userId = existing.id;
    console.log(`✓ Found existing account: ${existing.name} <${existing.email}>`);
  } else {
    // Create the account with a random temp password.
    tempPassword = randomPassword(16);
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        email,
        name: email.split("@")[0],
        password_hash: passwordHash,
        locale: "fr",
        is_diaspora: false,
      })
      .select("id")
      .single();

    if (error || !newUser) {
      console.error("Failed to create user:", error?.message);
      process.exit(1);
    }

    userId = newUser.id;
    console.log(`✓ Created new account for ${email}`);
  }

  // Grant ADMIN capability (idempotent).
  const { error: capErr } = await supabase
    .from("capabilities")
    .upsert(
      { user_id: userId, capability: "ADMIN", status: "ACTIVE" },
      { onConflict: "user_id,capability" }
    );

  if (capErr) {
    console.error("Failed to grant ADMIN:", capErr.message);
    process.exit(1);
  }

  console.log(`✓ ADMIN capability granted to ${email}`);

  if (tempPassword) {
    console.log("");
    console.log("━".repeat(60));
    console.log("⚠  Temporary password — communicate out-of-band:");
    console.log(`   ${tempPassword}`);
    console.log("━".repeat(60));
    console.log("Ask the admin to change it after first login.");
  }

  console.log("\nThey can now sign in at /auth/signin");
}

function randomPassword(length: number): string {
  // URL-safe characters, cryptographically random.
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[bytes[i] % chars.length];
  }
  return out;
}

// Avoid TypeScript unused import complaint.
void scryptSync;

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
