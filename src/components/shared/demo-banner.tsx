// Visual indicator that the app is running in demo mode. Reads the public
// env var at build time so client components can render it without a fetch.
// Set NEXT_PUBLIC_DEMO_MODE=true in Vercel to show.

export function DemoBanner() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") return null;

  return (
    <div className="w-full bg-amber-500 text-amber-950 text-xs font-bold tracking-wider uppercase py-1.5 text-center">
      Mode Démonstration · les paiements Stripe sont désactivés, les adhésions s&apos;activent automatiquement
    </div>
  );
}
