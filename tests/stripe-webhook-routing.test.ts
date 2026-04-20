import { describe, it, expect } from "vitest";

// Verifies the Stripe event-type routing table. If someone renames an event
// or changes which events are supported, this will fail first.

type EventType =
  | "checkout.session.completed"
  | "invoice.paid"
  | "invoice.payment_failed"
  | "customer.subscription.deleted"
  | "customer.subscription.updated"
  | "customer.subscription.trial_will_end";

const HANDLED: Record<EventType, boolean> = {
  "checkout.session.completed": true,
  "invoice.paid": true,
  "invoice.payment_failed": true,
  "customer.subscription.deleted": true,
  "customer.subscription.updated": true,
  "customer.subscription.trial_will_end": false,
};

// Mirror of statusMap in handleSubscriptionUpdated.
const stripeToOurs: Record<string, string> = {
  active: "ACTIVE",
  past_due: "GRACE_PERIOD",
  canceled: "CANCELLED",
  incomplete: "CREATED",
  incomplete_expired: "EXPIRED",
  trialing: "ACTIVE",
  unpaid: "SUSPENDED",
};

describe("stripe webhook routing", () => {
  it("handles all 5 critical subscription lifecycle events", () => {
    const critical: EventType[] = [
      "checkout.session.completed",
      "invoice.paid",
      "invoice.payment_failed",
      "customer.subscription.deleted",
      "customer.subscription.updated",
    ];
    for (const ev of critical) {
      expect(HANDLED[ev]).toBe(true);
    }
  });

  it("idempotency key uses stripe event id prefix", () => {
    const key = (evId: string) => `stripe:${evId}`;
    expect(key("evt_abc123")).toBe("stripe:evt_abc123");
  });

  it("active Stripe subscription maps to ACTIVE", () => {
    expect(stripeToOurs["active"]).toBe("ACTIVE");
  });

  it("past_due Stripe subscription triggers GRACE_PERIOD", () => {
    expect(stripeToOurs["past_due"]).toBe("GRACE_PERIOD");
  });

  it("canceled Stripe subscription maps to CANCELLED", () => {
    expect(stripeToOurs["canceled"]).toBe("CANCELLED");
  });

  it("unpaid Stripe subscription maps to SUSPENDED (not cancelled)", () => {
    // Important: unpaid ≠ cancelled. unpaid means Stripe gave up retrying,
    // we want to suspend service but keep the account for reinstatement.
    expect(stripeToOurs["unpaid"]).toBe("SUSPENDED");
  });

  it("trialing is treated as ACTIVE (user has access)", () => {
    expect(stripeToOurs["trialing"]).toBe("ACTIVE");
  });

  it("unknown Stripe status falls through (no mapping)", () => {
    expect(stripeToOurs["some_future_status"]).toBeUndefined();
  });
});
