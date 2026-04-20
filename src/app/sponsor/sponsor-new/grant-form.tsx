"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { createSponsorGrant } from "@/lib/server/sponsors";

type PlanLite = {
  id: string;
  slug: string;
  name_en: string;
  name_fr: string;
  tier: string;
  yearly_price_cents: number;
  visits_per_year: number;
};

export function SponsorGrantForm({ plans }: { plans: PlanLite[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    planSlug: plans[0]?.slug ?? "",
    seats: 10,
    notes: "",
  });

  const selected = plans.find((p) => p.slug === form.planSlug);
  const totalCents = selected ? selected.yearly_price_cents * form.seats : 0;

  function update<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((p) => ({ ...p, [k]: v }));
    setError(null);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setError(null);

    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const res = await createSponsorGrant({
      planSlug: form.planSlug,
      seats: form.seats,
      notes: form.notes || undefined,
      successUrl: `${origin}/sponsor/overview?funded=1`,
      cancelUrl: `${origin}/sponsor/sponsor-new?canceled=1`,
    });

    setLoading(false);

    if (!res.success) {
      setError(res.error ?? "Échec");
      return;
    }

    if (res.url) {
      window.location.href = res.url;
    }
  }

  return (
    <form onSubmit={submit} className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
          <Icon name="error" size="sm" />
          {error}
        </div>
      )}

      <div>
        <h3 className="font-headline font-bold text-lg text-primary mb-4">
          Choisir le forfait
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {plans.map((p) => {
            const sel = form.planSlug === p.slug;
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => update("planSlug", p.slug)}
                className={`rounded-xl border-2 p-4 text-left transition-colors ${
                  sel
                    ? "border-primary bg-primary-fixed"
                    : "border-outline-variant bg-surface hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline font-bold text-sm text-on-surface">
                    {p.name_fr}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      p.tier === "ELITE"
                        ? "bg-tertiary-fixed text-tertiary"
                        : "bg-secondary-fixed text-secondary"
                    }`}
                  >
                    {p.tier}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mb-2">
                  {p.visits_per_year} visites par an
                </p>
                <p className="font-headline text-lg font-black text-primary">
                  ${(p.yearly_price_cents / 100).toFixed(0)}
                  <span className="text-xs text-on-surface-variant font-normal"> /place/an</span>
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="seats" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
          Nombre de places à financer
        </label>
        <div className="flex items-center gap-3">
          <input
            id="seats"
            type="number"
            min={1}
            max={1000}
            value={form.seats}
            onChange={(e) => update("seats", Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
            className="w-32 rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface text-center font-bold text-lg"
          />
          <div className="flex gap-2">
            {[10, 25, 50, 100].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => update("seats", n)}
                className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                  form.seats === n
                    ? "border-primary bg-primary text-on-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary/50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
          Notes internes (optionnel)
        </label>
        <textarea
          id="notes"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={3}
          placeholder="e.g. Campagne 2026 pour la communauté de Jacmel"
          className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface"
        />
      </div>

      {selected && (
        <div className="rounded-2xl bg-surface-container-low p-5 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">
              {form.seats} × {selected.name_fr}
            </span>
            <span className="font-bold text-on-surface">
              ${((selected.yearly_price_cents * form.seats) / 100).toFixed(2)}
            </span>
          </div>
          <div className="border-t border-outline-variant pt-2 flex items-center justify-between">
            <span className="font-headline font-bold text-on-surface">Total à payer</span>
            <span className="font-headline text-2xl font-extrabold text-primary">
              ${(totalCents / 100).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <Button type="submit" size="lg" disabled={loading || !selected} className="w-full">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Icon name="progress_activity" size="sm" className="animate-spin" />
            Redirection vers paiement...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Icon name="volunteer_activism" size="sm" />
            Financer {form.seats} place{form.seats > 1 ? "s" : ""}
          </span>
        )}
      </Button>
    </form>
  );
}
