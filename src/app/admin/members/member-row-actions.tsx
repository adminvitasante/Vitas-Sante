"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { setCapabilityStatus } from "@/lib/server/admin-actions";
import type { CapabilityType } from "@/types/database";

type Capability = { capability: CapabilityType; status: "ACTIVE" | "SUSPENDED" | "REVOKED" };

// Inline per-user actions:
//   - Click a capability chip to toggle ACTIVE ↔ SUSPENDED
//   - Promote to admin (if not already admin)
// Wraps the setCapabilityStatus server action with busy/toast UX.

export function MemberRowActions({
  userId,
  capabilities,
  isSelf,
}: {
  userId: string;
  capabilities: Capability[];
  isSelf: boolean;
}) {
  const t = useTranslations("admin.members");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [busyCap, setBusyCap] = useState<CapabilityType | null>(null);

  const hasAdmin = capabilities.some(
    (c) => c.capability === "ADMIN" && c.status === "ACTIVE"
  );

  function toggle(cap: CapabilityType, current: "ACTIVE" | "SUSPENDED" | "REVOKED") {
    const next = current === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setBusyCap(cap);
    setErr(null);
    startTransition(async () => {
      const res = await setCapabilityStatus(userId, cap, next);
      setBusyCap(null);
      if (!res.success) {
        setErr(res.error ?? "Échec");
        return;
      }
      router.refresh();
    });
  }

  function grantAdmin() {
    setBusyCap("ADMIN");
    setErr(null);
    startTransition(async () => {
      const res = await setCapabilityStatus(userId, "ADMIN", "ACTIVE");
      setBusyCap(null);
      if (!res.success) {
        setErr(res.error ?? "Échec");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-1.5 items-start">
      <div className="flex flex-wrap gap-1.5">
        {capabilities.length === 0 ? (
          <span className="text-xs text-outline">{t("capNone")}</span>
        ) : (
          capabilities.map((cap) => {
            const busy = pending && busyCap === cap.capability;
            const active = cap.status === "ACTIVE";
            const disabled =
              busy || (isSelf && cap.capability === "ADMIN" && active);
            return (
              <button
                key={cap.capability}
                type="button"
                onClick={() => toggle(cap.capability, cap.status)}
                disabled={disabled}
                title={
                  disabled && isSelf
                    ? t("cantRevokeSelf")
                    : active
                      ? t("clickToSuspend")
                      : t("clickToReactivate")
                }
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider transition-colors ${
                  active
                    ? "bg-secondary-container text-secondary hover:bg-error-container hover:text-error"
                    : "bg-surface-container-high text-on-surface-variant line-through hover:bg-secondary-container hover:text-secondary hover:no-underline"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {busy ? "..." : cap.capability}
              </button>
            );
          })
        )}
        {!hasAdmin && !isSelf && (
          <button
            type="button"
            onClick={grantAdmin}
            disabled={pending}
            title={t("promoteAdmin")}
            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-primary-fixed text-primary hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-0.5">
              <Icon name="add" size="sm" className="!text-xs" />
              ADMIN
            </span>
          </button>
        )}
      </div>
      {err && <span className="text-[10px] text-error">{err}</span>}
    </div>
  );
}
