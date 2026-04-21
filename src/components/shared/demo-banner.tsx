import { isSimulationMode } from "@/lib/stripe";
import { DemoBannerClient } from "./demo-banner-client";

// Server-side gate: only render the dismissable banner when simulation
// mode is on (no STRIPE_SECRET_KEY or DEMO_MODE=true). The actual
// dismiss UI + CSS-variable bookkeeping lives in the client child so
// it can use sessionStorage and React state.
export function DemoBanner() {
  if (!isSimulationMode()) return null;
  return <DemoBannerClient />;
}
