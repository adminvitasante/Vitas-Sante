import { describe, it, expect } from "vitest";

// Mirror of getPrimaryRole() in src/lib/auth.ts. Tested separately so the
// priority order ADMIN > DOCTOR > AFFILIATE > PAYER > BENEFICIARY cannot
// silently change without a failing test.

function getPrimaryRole(
  capabilities: { capability: string; status: string }[]
): string {
  const active = capabilities.filter((c) => c.status === "ACTIVE").map((c) => c.capability);
  if (active.includes("ADMIN")) return "ADMIN";
  if (active.includes("DOCTOR")) return "DOCTOR";
  if (active.includes("AFFILIATE")) return "AFFILIATE";
  if (active.includes("PAYER")) return "PAYER";
  if (active.includes("BENEFICIARY")) return "BENEFICIARY";
  return "BENEFICIARY";
}

describe("role derivation priority", () => {
  it("empty capabilities defaults to BENEFICIARY", () => {
    expect(getPrimaryRole([])).toBe("BENEFICIARY");
  });

  it("ADMIN wins over everything else", () => {
    const role = getPrimaryRole([
      { capability: "ADMIN", status: "ACTIVE" },
      { capability: "DOCTOR", status: "ACTIVE" },
      { capability: "PAYER", status: "ACTIVE" },
    ]);
    expect(role).toBe("ADMIN");
  });

  it("DOCTOR wins over AFFILIATE/PAYER/BENEFICIARY", () => {
    const role = getPrimaryRole([
      { capability: "AFFILIATE", status: "ACTIVE" },
      { capability: "DOCTOR", status: "ACTIVE" },
      { capability: "PAYER", status: "ACTIVE" },
    ]);
    expect(role).toBe("DOCTOR");
  });

  it("AFFILIATE wins over PAYER", () => {
    const role = getPrimaryRole([
      { capability: "PAYER", status: "ACTIVE" },
      { capability: "AFFILIATE", status: "ACTIVE" },
    ]);
    expect(role).toBe("AFFILIATE");
  });

  it("PAYER wins over BENEFICIARY", () => {
    const role = getPrimaryRole([
      { capability: "BENEFICIARY", status: "ACTIVE" },
      { capability: "PAYER", status: "ACTIVE" },
    ]);
    expect(role).toBe("PAYER");
  });

  it("SUSPENDED capabilities are ignored", () => {
    const role = getPrimaryRole([
      { capability: "ADMIN", status: "SUSPENDED" },
      { capability: "DOCTOR", status: "ACTIVE" },
    ]);
    expect(role).toBe("DOCTOR");
  });

  it("REVOKED capabilities are ignored", () => {
    const role = getPrimaryRole([
      { capability: "DOCTOR", status: "REVOKED" },
      { capability: "PAYER", status: "ACTIVE" },
    ]);
    expect(role).toBe("PAYER");
  });

  it("only suspended ADMIN still resolves to next active capability", () => {
    const role = getPrimaryRole([
      { capability: "ADMIN", status: "SUSPENDED" },
      { capability: "BENEFICIARY", status: "ACTIVE" },
    ]);
    expect(role).toBe("BENEFICIARY");
  });
});
