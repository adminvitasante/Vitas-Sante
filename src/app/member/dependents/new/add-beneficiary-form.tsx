"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { addBeneficiaryAndCheckout } from "@/lib/server/diaspora";

type PlanLite = {
  id: string;
  slug: string;
  name_en: string;
  name_fr: string;
  tier: string;
  yearly_price_cents: number;
  dependent_fee_cents: number;
  visits_per_year: number;
};

export function AddBeneficiaryForm({ plans }: { plans: PlanLite[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    beneficiaryEmail: "",
    beneficiaryName: "",
    beneficiaryPhone: "",
    planSlug: plans.find((p) => p.slug === "advantage")?.slug ?? plans[0]?.slug ?? "",
    referralCode: "",
  });

  const selected = plans.find((p) => p.slug === form.planSlug);
  const totalCents = selected
    ? selected.yearly_price_cents + selected.dependent_fee_cents
    : 0;

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
    setError(null);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const res = await addBeneficiaryAndCheckout({
      beneficiaryEmail: form.beneficiaryEmail,
      beneficiaryName: form.beneficiaryName,
      beneficiaryPhone: form.beneficiaryPhone || undefined,
      planSlug: form.planSlug,
      referralCode: form.referralCode || undefined,
      successUrl: `${origin}/member/dependents?added=1`,
      cancelUrl: `${origin}/member/dependents/new?canceled=1`,
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
    <form
      onSubmit={submit}
      className="rounded-3xl bg-surface-container-lowest p-8 shadow-sm space-y-6"
    >
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
          <Icon name="error" size="sm" />
          {error}
        </div>
      )}

      <div>
        <h3 className="font-headline font-bold text-lg text-primary mb-2">
          Informations du bénéficiaire
        </h3>
        <p className="text-sm text-on-surface-variant mb-4">
          La personne qui recevra les soins. Si elle n&apos;a pas de compte, nous lui en créerons un.
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="bname" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Nom complet *
            </label>
            <input
              id="bname"
              required
              value={form.beneficiaryName}
              onChange={(e) => update("beneficiaryName", e.target.value)}
              placeholder="Sarah Valcourt"
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="bemail" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Email *
            </label>
            <input
              id="bemail"
              type="email"
              required
              value={form.beneficiaryEmail}
              onChange={(e) => update("beneficiaryEmail", e.target.value)}
              placeholder="sarah@exemple.ht"
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="bphone" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Téléphone
            </label>
            <input
              id="bphone"
              type="tel"
              value={form.beneficiaryPhone}
              onChange={(e) => update("beneficiaryPhone", e.target.value)}
              placeholder="+509 0000 0000"
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-headline font-bold text-lg text-primary mb-4">
          Forfait
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {plans.map((p) => {
            const selected = form.planSlug === p.slug;
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => update("planSlug", p.slug)}
                className={`rounded-xl border-2 p-4 text-left transition-colors ${
                  selected
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
                      p.tier === "ELITE" ? "bg-tertiary-fixed text-tertiary" : "bg-secondary-fixed text-secondary"
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
                  <span className="text-xs text-on-surface-variant font-normal"> /an</span>
                </p>
                {p.dependent_fee_cents > 0 && (
                  <p className="text-[10px] text-on-surface-variant mt-1">
                    + ${(p.dependent_fee_cents / 100).toFixed(0)} frais bénéficiaire
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="ref" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
          Code de parrainage (optionnel)
        </label>
        <input
          id="ref"
          value={form.referralCode}
          onChange={(e) => update("referralCode", e.target.value)}
          placeholder="VITA-XXXXX"
          className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm font-mono"
        />
      </div>

      {selected && (
        <div className="rounded-2xl bg-surface-container-low p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-on-surface-variant">Forfait {selected.name_fr}</span>
            <span className="font-bold text-on-surface">${(selected.yearly_price_cents / 100).toFixed(2)}</span>
          </div>
          {selected.dependent_fee_cents > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-on-surface-variant">Frais bénéficiaire</span>
              <span className="font-bold text-on-surface">
                ${(selected.dependent_fee_cents / 100).toFixed(2)}
              </span>
            </div>
          )}
          <div className="border-t border-outline-variant pt-2 flex items-center justify-between">
            <span className="font-headline font-bold text-on-surface">Total</span>
            <span className="font-headline text-xl font-extrabold text-primary">
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
            Continuer vers le paiement
            <Icon name="arrow_forward" size="sm" />
          </span>
        )}
      </Button>
    </form>
  );
}
