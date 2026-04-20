import { describe, it, expect } from "vitest";

// Signup branch logic from src/app/api/auth/signup/route.ts.
// These are pure derivations — the actual route has side effects we don't test here.

function deriveCapabilities(isDiaspora: boolean): string[] {
  const caps = ["PAYER"];
  if (!isDiaspora) caps.push("BENEFICIARY");
  return caps;
}

function isDiasporaFromCountry(country: string | undefined): boolean {
  return Boolean(country && country !== "Haiti");
}

function shouldCreateEnrollment(plan: string | undefined, isDiaspora: boolean): boolean {
  // Self-paying (non-diaspora) users with a plan get auto-enrolled.
  // Diaspora users create enrollment separately via /member/dependents/new.
  return Boolean(plan && !isDiaspora);
}

describe("signup capability assignment", () => {
  it("diaspora user gets PAYER only", () => {
    expect(deriveCapabilities(true)).toEqual(["PAYER"]);
  });

  it("local (non-diaspora) user gets PAYER + BENEFICIARY", () => {
    expect(deriveCapabilities(false)).toEqual(["PAYER", "BENEFICIARY"]);
  });
});

describe("diaspora country detection", () => {
  it("Haiti is not diaspora", () => {
    expect(isDiasporaFromCountry("Haiti")).toBe(false);
  });

  it("United States is diaspora", () => {
    expect(isDiasporaFromCountry("United States")).toBe(true);
  });

  it("Canada is diaspora", () => {
    expect(isDiasporaFromCountry("Canada")).toBe(true);
  });

  it("undefined country is treated as not-diaspora (defaults to local)", () => {
    expect(isDiasporaFromCountry(undefined)).toBe(false);
  });

  it("empty string is treated as not-diaspora", () => {
    expect(isDiasporaFromCountry("")).toBe(false);
  });
});

describe("signup enrollment branch", () => {
  it("diaspora user with plan does NOT auto-enroll (adds beneficiary separately)", () => {
    expect(shouldCreateEnrollment("advantage", true)).toBe(false);
  });

  it("local user with plan auto-enrolls (self-pays)", () => {
    expect(shouldCreateEnrollment("advantage", false)).toBe(true);
  });

  it("no plan means no auto-enrollment even for locals", () => {
    expect(shouldCreateEnrollment(undefined, false)).toBe(false);
  });

  it("no plan means no auto-enrollment for diaspora either", () => {
    expect(shouldCreateEnrollment(undefined, true)).toBe(false);
  });
});

describe("referral code extraction", () => {
  function extractRefFromUrl(url: string): string | null {
    try {
      return new URL(url).searchParams.get("ref");
    } catch {
      return null;
    }
  }

  it("extracts ref from signup URL", () => {
    expect(extractRefFromUrl("https://vitasante.ht/auth/signup?ref=VITA-MARIE")).toBe("VITA-MARIE");
  });

  it("returns null when no ref param", () => {
    expect(extractRefFromUrl("https://vitasante.ht/auth/signup")).toBeNull();
  });

  it("returns null on invalid URL", () => {
    expect(extractRefFromUrl("not-a-url")).toBeNull();
  });

  it("handles ref with special characters", () => {
    expect(extractRefFromUrl("https://x.com/signup?ref=VITA-JEAN-PIERRE")).toBe("VITA-JEAN-PIERRE");
  });
});
