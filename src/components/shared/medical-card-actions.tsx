"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

// Client-side actions for the medical card. Download hits the server PDF
// endpoint; wallet integrations are honestly disabled until the Pass/Pkpass
// flows exist.

export function MedicalCardActions({ canDownload }: { canDownload: boolean }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setDownloading(true);
    setError(null);

    try {
      const res = await fetch("/api/member/medical-card-pdf");
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Téléchargement impossible" }));
        setError(data.error ?? "Téléchargement impossible");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Try to pull filename from Content-Disposition; fall back to generic.
      const cd = res.headers.get("Content-Disposition") ?? "";
      const match = cd.match(/filename="([^"]+)"/);
      a.download = match?.[1] ?? "vita-sante-card.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError("Téléchargement impossible. Réessayez dans un instant.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-error-container px-4 py-3 text-xs text-on-error-container">
          <Icon name="error" size="sm" />
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={download}
        disabled={!canDownload || downloading}
        className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-2xl group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-3 text-on-surface">
          {downloading ? (
            <Icon name="progress_activity" className="text-primary animate-spin" />
          ) : (
            <Icon name="picture_as_pdf" className="text-primary" />
          )}
          <span className="text-sm font-semibold">
            {downloading ? "Génération du PDF..." : "Télécharger en PDF"}
          </span>
        </div>
        <Icon
          name="chevron_right"
          size="sm"
          className="text-outline group-hover:translate-x-1 transition-transform"
        />
      </button>

      {/* Wallet integrations are honest about their status rather than fake. */}
      <div className="w-full flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl opacity-60 cursor-not-allowed">
        <Icon name="account_balance_wallet" className="text-on-surface-variant" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-on-surface">Apple Wallet</p>
          <p className="text-[10px] text-on-surface-variant">Bientôt disponible</p>
        </div>
      </div>

      <div className="w-full flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl opacity-60 cursor-not-allowed">
        <Icon name="wallet" className="text-on-surface-variant" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-on-surface">Google Wallet</p>
          <p className="text-[10px] text-on-surface-variant">Bientôt disponible</p>
        </div>
      </div>
    </div>
  );
}
