"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Icon } from "@/components/ui/icon";

// Small pill toggle for switching UI language. Calls /api/locale to set the
// cookie (and persist to users.locale if authenticated), then refreshes the
// route tree so every server component re-renders in the new language.

export function LanguageToggle({
  variant = "nav",
}: {
  variant?: "nav" | "settings";
}) {
  const router = useRouter();
  const currentLocale = useLocale();
  const [pending, startTransition] = useTransition();
  const [busyLocale, setBusyLocale] = useState<string | null>(null);

  function switchTo(next: "fr" | "en") {
    if (next === currentLocale) return;
    setBusyLocale(next);
    startTransition(async () => {
      try {
        await fetch("/api/locale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale: next }),
        });
        router.refresh();
      } finally {
        setBusyLocale(null);
      }
    });
  }

  if (variant === "settings") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface p-1">
        {(["fr", "en"] as const).map((loc) => {
          const active = currentLocale === loc;
          const busy = pending && busyLocale === loc;
          return (
            <button
              key={loc}
              type="button"
              onClick={() => switchTo(loc)}
              disabled={pending}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                active
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              } ${pending && !active ? "opacity-50" : ""}`}
            >
              {busy ? "..." : loc === "fr" ? "Français" : "English"}
            </button>
          );
        })}
      </div>
    );
  }

  // Nav variant — compact pill
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full bg-surface-container-low p-0.5 text-xs font-bold">
      {(["fr", "en"] as const).map((loc) => {
        const active = currentLocale === loc;
        const busy = pending && busyLocale === loc;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchTo(loc)}
            disabled={pending}
            aria-label={`Switch to ${loc === "fr" ? "French" : "English"}`}
            className={`px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors ${
              active
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {busy ? <Icon name="progress_activity" size="sm" className="animate-spin" /> : loc}
          </button>
        );
      })}
    </div>
  );
}
