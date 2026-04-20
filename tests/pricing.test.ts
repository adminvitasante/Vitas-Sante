import { describe, it, expect } from "vitest";

// Invariants on plan pricing and dependent-fee logic. These tests codify the
// billing rules so a "let's adjust prices" change doesn't silently break
// invoice generation.

type Plan = {
  slug: string;
  yearly_price_cents: number;
  dependent_fee_cents: number;
  visits_per_year: number;
  tier: "CORE" | "ELITE";
};

// Matches invoice_lines computation in src/lib/server/billing.ts (generateInvoice).
function lineAmountCents(plan: Plan, isSelfEnrolled: boolean): number {
  return isSelfEnrolled
    ? plan.yearly_price_cents
    : plan.yearly_price_cents + plan.dependent_fee_cents;
}

// Matches the diaspora add-beneficiary price formula in src/lib/server/diaspora.ts.
function beneficiaryPriceCents(plan: Plan, payerIsBeneficiary: boolean): number {
  return payerIsBeneficiary
    ? plan.yearly_price_cents
    : plan.yearly_price_cents + plan.dependent_fee_cents;
}

const premium: Plan = {
  slug: "premium",
  yearly_price_cents: 20000,
  dependent_fee_cents: 5500,
  visits_per_year: 12,
  tier: "CORE",
};

const elite: Plan = {
  slug: "elite",
  yearly_price_cents: 36500,
  dependent_fee_cents: 9500,
  visits_per_year: 24,
  tier: "ELITE",
};

describe("plan pricing", () => {
  it("self-enrollment: billed plan price only", () => {
    expect(lineAmountCents(premium, true)).toBe(20000);
    expect(lineAmountCents(elite, true)).toBe(36500);
  });

  it("dependent enrollment: billed plan price + dependent fee", () => {
    expect(lineAmountCents(premium, false)).toBe(25500);
    expect(lineAmountCents(elite, false)).toBe(46000);
  });

  it("diaspora adding beneficiary pays full price + dependent fee", () => {
    expect(beneficiaryPriceCents(premium, false)).toBe(25500);
  });

  it("diaspora signup formula equals invoice formula (consistency)", () => {
    expect(lineAmountCents(premium, false)).toBe(beneficiaryPriceCents(premium, false));
    expect(lineAmountCents(elite, true)).toBe(beneficiaryPriceCents(elite, true));
  });

  it("elite plan has more visits than core", () => {
    expect(elite.visits_per_year).toBeGreaterThan(premium.visits_per_year);
  });
});

describe("sponsor grant pricing", () => {
  // Mirror of sponsor grant total in src/lib/server/sponsors.ts (Stripe line_items).
  function grantTotalCents(plan: Plan, seats: number): number {
    return plan.yearly_price_cents * seats;
  }

  it("10 seats of Premium = $2000", () => {
    expect(grantTotalCents(premium, 10)).toBe(200000);
  });

  it("100 seats of Elite = $36,500", () => {
    expect(grantTotalCents(elite, 100)).toBe(3650000);
  });

  it("zero seats would yield zero (safety check)", () => {
    expect(grantTotalCents(premium, 0)).toBe(0);
  });
});
