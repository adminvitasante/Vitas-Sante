"use server";

// Capability-based authorization helpers for server components + actions.
// Usage:
//   const me = await requireCapability("DOCTOR");  // throws if not authorized
//   const me = await getSessionWithCapability("ADMIN");  // returns null if not authorized

import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { CapabilityType } from "@/types/database";
import { AuthzError } from "@/lib/server/authz-errors";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  capabilities: CapabilityType[];
};

// Load the authenticated user along with their ACTIVE capabilities.
// Returns null if no session.
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { data: caps } = await supabase
    .from("capabilities")
    .select("capability, status")
    .eq("user_id", session.user.id)
    .eq("status", "ACTIVE");

  const capabilities = (caps ?? []).map((c: { capability: string }) => c.capability as CapabilityType);

  return {
    id: session.user.id,
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    role: session.user.role ?? "BENEFICIARY",
    capabilities,
  };
}

// Require at least one of the given capabilities; returns null otherwise.
// Use in server components to gate rendering: `const me = await getSessionWithCapability("ADMIN")`.
export async function getSessionWithCapability(
  ...required: CapabilityType[]
): Promise<SessionUser | null> {
  const me = await getSessionUser();
  if (!me) return null;
  if (required.length === 0) return me;
  const ok = required.some((r) => me.capabilities.includes(r));
  return ok ? me : null;
}

// Throws if the current user doesn't have the capability.
// Use in server actions to guarantee the caller is authorized.
export async function requireCapability(
  ...required: CapabilityType[]
): Promise<SessionUser> {
  const me = await getSessionUser();
  if (!me) {
    throw new AuthzError("Not authenticated");
  }
  if (required.length === 0) return me;
  const ok = required.some((r) => me.capabilities.includes(r));
  if (!ok) {
    throw new AuthzError(
      `Missing required capability (need one of: ${required.join(", ")})`
    );
  }
  return me;
}
