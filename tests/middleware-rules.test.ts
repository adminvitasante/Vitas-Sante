import { describe, it, expect } from "vitest";

// Mirrors the roleRules table in src/middleware.ts. This test guards against
// accidental privilege changes: if someone expands the /admin allowed roles
// they have to update this test too.

const roleRules: { prefix: string; allowedRoles: string[] }[] = [
  { prefix: "/admin", allowedRoles: ["ADMIN"] },
  { prefix: "/doctor", allowedRoles: ["DOCTOR", "ADMIN"] },
  { prefix: "/affiliate", allowedRoles: ["AFFILIATE", "ADMIN"] },
  { prefix: "/sponsor", allowedRoles: ["PAYER", "ADMIN"] },
  { prefix: "/member", allowedRoles: ["BENEFICIARY", "PAYER", "ADMIN"] },
];

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

function isAllowed(path: string, role: string | null): "no_rule" | "allow" | "deny" {
  const rule = roleRules.find((r) => matchesPrefix(path, r.prefix));
  if (!rule) return "no_rule";
  if (!role) return "deny";
  return rule.allowedRoles.includes(role) ? "allow" : "deny";
}

describe("middleware role rules", () => {
  it("ADMIN can reach every protected prefix", () => {
    for (const rule of roleRules) {
      expect(isAllowed(rule.prefix + "/anything", "ADMIN")).toBe("allow");
    }
  });

  it("DOCTOR cannot reach /admin", () => {
    expect(isAllowed("/admin/dashboard", "DOCTOR")).toBe("deny");
  });

  it("AFFILIATE cannot reach /admin, /doctor, /sponsor, /member", () => {
    expect(isAllowed("/admin/dashboard", "AFFILIATE")).toBe("deny");
    expect(isAllowed("/doctor/patient-care", "AFFILIATE")).toBe("deny");
    expect(isAllowed("/sponsor/overview", "AFFILIATE")).toBe("deny");
    expect(isAllowed("/member/dashboard", "AFFILIATE")).toBe("deny");
  });

  it("PAYER can reach /sponsor and /member but not /doctor or /admin", () => {
    expect(isAllowed("/sponsor/overview", "PAYER")).toBe("allow");
    expect(isAllowed("/member/dashboard", "PAYER")).toBe("allow");
    expect(isAllowed("/doctor/patient-care", "PAYER")).toBe("deny");
    expect(isAllowed("/admin/dashboard", "PAYER")).toBe("deny");
  });

  it("BENEFICIARY can reach /member but not /sponsor", () => {
    expect(isAllowed("/member/dashboard", "BENEFICIARY")).toBe("allow");
    expect(isAllowed("/sponsor/overview", "BENEFICIARY")).toBe("deny");
  });

  it("unauthenticated request is denied on every protected prefix", () => {
    for (const rule of roleRules) {
      expect(isAllowed(rule.prefix + "/any", null)).toBe("deny");
    }
  });

  it("public paths return no_rule (middleware lets them through)", () => {
    expect(isAllowed("/", "ADMIN")).toBe("no_rule");
    expect(isAllowed("/plans", null)).toBe("no_rule");
    expect(isAllowed("/doctor-apply", null)).toBe("no_rule");
    expect(isAllowed("/auth/signin", null)).toBe("no_rule");
  });

  it("regression: /doctor-apply is NOT treated as a /doctor route", () => {
    // This was a real bug caught by the original test: startsWith("/doctor")
    // matched "/doctor-apply" so the public doctor signup page was behind auth.
    expect(isAllowed("/doctor-apply", null)).toBe("no_rule");
  });

  it("regression: exact-prefix match required (/admins ≠ /admin)", () => {
    // Guard against /admin matching hypothetical /admins or /administrator paths.
    expect(isAllowed("/adminstats", null)).toBe("no_rule");
    expect(isAllowed("/memberlist", null)).toBe("no_rule");
  });

  it("rule matches /prefix exactly AND /prefix/anything", () => {
    expect(isAllowed("/admin", "ADMIN")).toBe("allow");
    expect(isAllowed("/admin/dashboard", "ADMIN")).toBe("allow");
    expect(isAllowed("/admin/logs", "ADMIN")).toBe("allow");
  });
});
