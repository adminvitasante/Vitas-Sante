"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

// Affiliate referral-link card with functional copy-to-clipboard.
// Builds the URL from window.location.origin so it matches the deployed host.
export function ReferralLink({ partnerCode }: { partnerCode: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const url = origin ? `${origin}/auth/signup?ref=${partnerCode}` : `.../signup?ref=${partnerCode}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API.
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex-1 w-full flex items-center gap-2">
      <div className="flex-1 bg-surface-container-low px-6 py-4 rounded-xl font-mono text-sm text-primary border-b-2 border-primary truncate">
        {url}
      </div>
      <button
        type="button"
        onClick={copy}
        className={`p-4 rounded-xl transition-colors ${
          copied
            ? "bg-secondary text-white"
            : "bg-primary text-white hover:bg-primary-container"
        }`}
        aria-label={copied ? "Lien copié" : "Copier le lien"}
      >
        <Icon name={copied ? "check" : "content_copy"} className="block" />
      </button>
    </div>
  );
}
