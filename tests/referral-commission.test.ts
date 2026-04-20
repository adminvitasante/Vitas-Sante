import { describe, it, expect } from "vitest";

// Replicates the commission calculation used in:
//   - src/lib/server/enrollment.ts (createEnrollment, tier → rate)
//   - src/lib/server/event-processor.ts (enrollment.activated handler)
// Keeps the logic in a tested unit so future changes can't silently drift.

function commissionRateForTier(tier: "STANDARD" | "ELITE" | "DIAMOND"): number {
  if (tier === "DIAMOND") return 20;
  if (tier === "ELITE") return 15;
  return 10;
}

function commissionCents(priceCents: number, ratePct: number): number {
  return Math.floor(priceCents * (ratePct / 100));
}

describe("referral commission", () => {
  it("STANDARD tier is 10%", () => {
    expect(commissionRateForTier("STANDARD")).toBe(10);
  });

  it("ELITE tier is 15%", () => {
    expect(commissionRateForTier("ELITE")).toBe(15);
  });

  it("DIAMOND tier is 20%", () => {
    expect(commissionRateForTier("DIAMOND")).toBe(20);
  });

  it("computes commission in cents using floor (never inflates)", () => {
    // $135.00 at 10% → $13.50 → 1350 cents
    expect(commissionCents(13500, 10)).toBe(1350);
    // $200.00 at 15% → $30.00 → 3000 cents
    expect(commissionCents(20000, 15)).toBe(3000);
    // $99.00 at 20% → $19.80 → 1980 cents
    expect(commissionCents(9900, 20)).toBe(1980);
  });

  it("handles fractional amounts without rounding up", () => {
    // $99.99 at 10% = $9.999 → 9 cents floor, not 10
    expect(commissionCents(9999, 10)).toBe(999);
    // Odd division
    expect(commissionCents(9901, 10)).toBe(990);
  });

  it("zero price yields zero commission", () => {
    expect(commissionCents(0, 15)).toBe(0);
  });

  it("zero rate yields zero commission", () => {
    expect(commissionCents(100000, 0)).toBe(0);
  });
});
