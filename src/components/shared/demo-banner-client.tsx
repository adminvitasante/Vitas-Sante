"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

// Dismissable simulation-mode banner.
//
// While visible, sets `--banner-h` on <html> so the navbar/sidebar/main
// content can shift down via `top: var(--banner-h, 0px)`. When the user
// dismisses (per browser session) the var is set to 0px and everything
// snaps back to its normal top:0 position.
//
// Persistence: sessionStorage. We don't use localStorage — if a user
// returns later, they should still get reminded that payments are
// simulated, otherwise they'll forget the moment they hit a Stripe action.

const STORAGE_KEY = "vita-demo-banner-dismissed";
const BANNER_HEIGHT = "32px";

export function DemoBannerClient() {
  const [visible, setVisible] = useState(false);

  // Read sessionStorage on mount (client only) and update the CSS var.
  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY) === "1";
    if (!dismissed) {
      setVisible(true);
      document.documentElement.style.setProperty("--banner-h", BANNER_HEIGHT);
    }
    return () => {
      // On unmount (route change, page leave) keep the var in its
      // current state — only the dismiss button changes it.
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    document.documentElement.style.setProperty("--banner-h", "0px");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between gap-3 bg-amber-500 px-4 text-amber-950"
      style={{ height: BANNER_HEIGHT }}
    >
      <div className="flex-1 text-center text-[11px] font-bold tracking-wider uppercase">
        Mode Simulation · les paiements Stripe sont désactivés, les adhésions s&apos;activent automatiquement
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fermer la bannière"
        className="shrink-0 rounded-md p-1 text-amber-950 hover:bg-amber-600/40 transition-colors"
      >
        <Icon name="close" size="sm" />
      </button>
    </div>
  );
}
