import Stripe from "stripe";

// Stripe client. Constructed with a placeholder if STRIPE_SECRET_KEY is
// missing so module load never throws. Real API calls still fail if the
// key is missing — that's why every call site must first check
// isStripeConfigured() and fall back to simulation mode if false.
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_placeholder_unused_when_simulating",
  {
    apiVersion: "2024-06-20",
    typescript: true,
  }
);

// True when a real Stripe secret key is configured. When false, the app
// runs in simulation mode: signup/dependents/sponsor-grants activate
// directly against the DB without hitting Stripe.
export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return Boolean(key && key.startsWith("sk_") && !key.includes("placeholder"));
}

// True when the app should simulate payments. Happens when:
//   - STRIPE_SECRET_KEY is missing (no real Stripe account yet), OR
//   - DEMO_MODE=true is set (explicit demo override even with real keys)
export function isSimulationMode(): boolean {
  if (process.env.DEMO_MODE === "true") return true;
  return !isStripeConfigured();
}
