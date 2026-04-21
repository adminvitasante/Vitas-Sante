import { isSimulationMode } from "@/lib/stripe";

// Visual indicator that the app is running in simulation mode (payments bypassed).
// Auto-shows when Stripe isn't configured (no STRIPE_SECRET_KEY) OR when
// DEMO_MODE=true is set explicitly.
export function DemoBanner() {
  if (!isSimulationMode()) return null;

  return (
    <div className="w-full bg-amber-500 text-amber-950 text-xs font-bold tracking-wider uppercase py-1.5 text-center">
      Mode Simulation · les paiements Stripe sont désactivés, les adhésions s&apos;activent automatiquement
    </div>
  );
}
