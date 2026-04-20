"use client";

import { useState, useTransition, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  promoteUserToAffiliate,
  setAffiliateTier,
  setAffiliateStatus,
} from "@/lib/server/admin-actions";
import type { AffiliateTier } from "@/types/database";

// Promote form to create a new affiliate from an existing user.

export function PromoteAffiliateForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [tier, setTier] = useState<AffiliateTier>("STANDARD");
  const [banner, setBanner] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await promoteUserToAffiliate({
        email: email.trim(),
        partnerCode: code.trim().toUpperCase(),
        tier,
      });
      if (!res.success) {
        setBanner({ tone: "error", text: res.error ?? "Échec" });
        return;
      }
      setBanner({ tone: "success", text: `Affilié créé pour ${email}.` });
      setEmail("");
      setCode("");
      setTier("STANDARD");
      router.refresh();
    });
  }

  return (
    <section className="mb-8 bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
          <Icon name="person_add" size="sm" />
        </div>
        <div>
          <h3 className="font-headline font-bold text-primary">Promouvoir un affilié</h3>
          <p className="text-xs text-on-surface-variant">
            L&apos;utilisateur doit déjà avoir un compte.
          </p>
        </div>
      </div>

      {banner && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
            banner.tone === "success"
              ? "bg-secondary-container text-on-secondary-container"
              : "bg-error-container text-on-error-container"
          }`}
        >
          <Icon name={banner.tone === "success" ? "check_circle" : "error"} size="sm" />
          {banner.text}
        </div>
      )}

      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Email *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="partner@example.com"
            className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Code *
          </label>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="VITA-XXXX"
            className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Niveau
          </label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as AffiliateTier)}
            className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm"
          >
            <option value="STANDARD">Standard (10%)</option>
            <option value="ELITE">Elite (15%)</option>
            <option value="DIAMOND">Diamond (20%)</option>
          </select>
        </div>
        <div className="sm:col-span-4">
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "Création..." : "Créer l'affilié"}
          </Button>
        </div>
      </form>
    </section>
  );
}

// Inline row actions: change tier + suspend/reactivate.

export function AffiliateRowActions({
  affiliateId,
  currentTier,
  currentStatus,
}: {
  affiliateId: string;
  currentTier: AffiliateTier;
  currentStatus: "ACTIVE" | "SUSPENDED" | "REVOKED";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function changeTier(newTier: AffiliateTier) {
    if (newTier === currentTier) return;
    startTransition(async () => {
      const res = await setAffiliateTier(affiliateId, newTier);
      if (!res.success) {
        setErr(res.error ?? "Échec");
        return;
      }
      router.refresh();
    });
  }

  function toggleStatus() {
    const next = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    startTransition(async () => {
      const res = await setAffiliateStatus(affiliateId, next);
      if (!res.success) {
        setErr(res.error ?? "Échec");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentTier}
        onChange={(e) => changeTier(e.target.value as AffiliateTier)}
        disabled={pending}
        className="rounded-lg border border-outline-variant bg-surface px-2 py-1 text-xs font-bold"
      >
        <option value="STANDARD">STANDARD</option>
        <option value="ELITE">ELITE</option>
        <option value="DIAMOND">DIAMOND</option>
      </select>
      <button
        type="button"
        onClick={toggleStatus}
        disabled={pending}
        title={currentStatus === "ACTIVE" ? "Suspendre" : "Réactiver"}
        className={`h-8 px-3 rounded-lg text-xs font-bold transition-colors ${
          currentStatus === "ACTIVE"
            ? "bg-secondary-container text-on-secondary-container hover:bg-error-container hover:text-on-error-container"
            : "bg-error-container text-on-error-container hover:bg-secondary-container hover:text-on-secondary-container"
        }`}
      >
        {currentStatus === "ACTIVE" ? "Actif" : currentStatus}
      </button>
      {err && <span className="text-xs text-error">{err}</span>}
    </div>
  );
}
