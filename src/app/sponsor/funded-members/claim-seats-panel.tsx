"use client";

import { useState, useTransition, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { claimSponsorGrantSeat } from "@/lib/server/sponsors";

type Grant = {
  id: string;
  seatsRemaining: number;
  planName: string;
  planSlug: string;
};

export function ClaimSeatsPanel({ grants }: { grants: Grant[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(grants.length === 1);
  const [grantId, setGrantId] = useState(grants[0]?.id ?? "");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [banner, setBanner] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const selectedGrant = grants.find((g) => g.id === grantId) ?? grants[0];

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!selectedGrant) return;

    startTransition(async () => {
      const res = await claimSponsorGrantSeat({
        grantId: selectedGrant.id,
        beneficiaryEmail: form.email,
        beneficiaryName: form.name,
        beneficiaryPhone: form.phone || undefined,
      });

      if (!res.success) {
        setBanner({ tone: "error", text: res.error ?? "Échec assignation" });
        return;
      }

      setBanner({
        tone: "success",
        text: `Place assignée à ${form.name}. L'adhésion est en attente de validation admin.`,
      });
      setForm({ name: "", email: "", phone: "" });
      router.refresh();
    });
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((x) => !x)}
        className="w-full flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
            <Icon name="person_add" size="sm" />
          </div>
          <div className="text-left">
            <h3 className="font-headline font-bold text-primary">Assigner une place</h3>
            <p className="text-xs text-on-surface-variant">
              {grants.reduce((s, g) => s + g.seatsRemaining, 0)} place(s) disponible(s) sur {grants.length} parrainage(s)
            </p>
          </div>
        </div>
        <Icon name={expanded ? "expand_less" : "expand_more"} />
      </button>

      {expanded && (
        <form onSubmit={submit} className="mt-6 space-y-5">
          {banner && (
            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                banner.tone === "success"
                  ? "bg-secondary-container text-on-secondary-container"
                  : "bg-error-container text-on-error-container"
              }`}
            >
              <Icon name={banner.tone === "success" ? "check_circle" : "error"} size="sm" />
              {banner.text}
            </div>
          )}

          {grants.length > 1 && (
            <div>
              <label htmlFor="grantId" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                Parrainage à utiliser
              </label>
              <select
                id="grantId"
                value={grantId}
                onChange={(e) => setGrantId(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm"
              >
                {grants.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.planName} — {g.seatsRemaining} place(s) dispo
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="bname" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                Nom complet *
              </label>
              <input
                id="bname"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
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
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bphone" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Téléphone (optionnel)
            </label>
            <input
              id="bphone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm"
            />
          </div>

          <Button type="submit" size="lg" disabled={pending || !selectedGrant} className="w-full">
            {pending ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="progress_activity" size="sm" className="animate-spin" />
                Assignation...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Icon name="person_add" size="sm" />
                Assigner cette place
              </span>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
