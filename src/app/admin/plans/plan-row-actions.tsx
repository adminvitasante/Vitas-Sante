"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { togglePlanActive, updatePlanPricing } from "@/lib/server/admin-actions";

type Plan = {
  id: string;
  slug: string;
  is_active: boolean;
  yearly_price_cents: number;
  dependent_fee_cents: number;
};

export function PlanRowActions({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [yearlyUsd, setYearlyUsd] = useState((plan.yearly_price_cents / 100).toFixed(2));
  const [depFeeUsd, setDepFeeUsd] = useState((plan.dependent_fee_cents / 100).toFixed(2));
  const [err, setErr] = useState<string | null>(null);

  function toggle() {
    startTransition(async () => {
      const res = await togglePlanActive(plan.id, !plan.is_active);
      if (!res.success) {
        setErr(res.error ?? "Échec");
        return;
      }
      router.refresh();
    });
  }

  function save() {
    const yearly = Math.round(parseFloat(yearlyUsd) * 100);
    const dep = Math.round(parseFloat(depFeeUsd) * 100);
    if (!Number.isFinite(yearly) || !Number.isFinite(dep) || yearly < 0 || dep < 0) {
      setErr("Prix invalides.");
      return;
    }
    startTransition(async () => {
      const res = await updatePlanPricing({
        planId: plan.id,
        yearlyPriceCents: yearly,
        dependentFeeCents: dep,
      });
      if (!res.success) {
        setErr(res.error ?? "Échec");
        return;
      }
      setEditing(false);
      setErr(null);
      router.refresh();
    });
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
            Prix/an
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={yearlyUsd}
            onChange={(e) => setYearlyUsd(e.target.value)}
            className="w-24 rounded-lg border border-outline-variant bg-surface px-2 py-1 text-xs font-mono"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
            Dépendant
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={depFeeUsd}
            onChange={(e) => setDepFeeUsd(e.target.value)}
            className="w-20 rounded-lg border border-outline-variant bg-surface px-2 py-1 text-xs font-mono"
          />
        </div>
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="h-8 px-3 rounded-lg bg-primary text-on-primary text-xs font-bold"
        >
          {pending ? "..." : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={() => { setEditing(false); setErr(null); }}
          className="h-8 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs font-bold"
        >
          Annuler
        </button>
        {err && <span className="text-xs text-error">{err}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        title={plan.is_active ? "Désactiver ce forfait" : "Activer ce forfait"}
        className={`h-8 px-3 rounded-lg text-xs font-bold transition-colors ${
          plan.is_active
            ? "bg-secondary-container text-on-secondary-container hover:bg-secondary/20"
            : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
        }`}
      >
        {plan.is_active ? "✓ Actif" : "Inactif"}
      </button>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="h-8 px-3 rounded-lg bg-primary-fixed text-primary text-xs font-bold hover:bg-primary hover:text-on-primary"
      >
        <Icon name="edit" size="sm" />
      </button>
    </div>
  );
}
