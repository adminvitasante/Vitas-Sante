"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  approveEnrollmentAction,
  rejectEnrollmentAction,
} from "@/lib/server/admin-actions";

type Enrollment = {
  id: string;
  status: string;
  created_at: string;
  plans: { slug: string; name_en: string; name_fr: string; yearly_price_cents: number } | null;
  users: { id: string; name: string; email: string; phone: string | null; is_diaspora: boolean } | null;
  subscriptions: { payer_id: string; users: { name: string; email: string } | null } | null;
};

export function EnrollmentsReview({ enrollments }: { enrollments: Enrollment[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [banner, setBanner] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  function approve(id: string) {
    startTransition(async () => {
      const res = await approveEnrollmentAction(id);
      if (!res.success) {
        setBanner({ tone: "error", text: res.error ?? "Échec approbation" });
        return;
      }
      setBanner({ tone: "success", text: "Adhésion approuvée. Carte membre générée." });
      router.refresh();
    });
  }

  function confirmReject(id: string) {
    if (!rejectReason.trim()) {
      setBanner({ tone: "error", text: "Veuillez indiquer un motif." });
      return;
    }
    startTransition(async () => {
      const res = await rejectEnrollmentAction(id, rejectReason.trim());
      if (!res.success) {
        setBanner({ tone: "error", text: res.error ?? "Échec rejet" });
        return;
      }
      setBanner({ tone: "success", text: "Adhésion rejetée. Le payeur sera notifié." });
      setRejectingId(null);
      setRejectReason("");
      router.refresh();
    });
  }

  if (enrollments.length === 0) {
    return (
      <section className="mb-10 bg-secondary-container/30 rounded-3xl p-6 text-center">
        <Icon name="check_circle" className="text-secondary !text-3xl mb-2" />
        <p className="font-bold text-on-surface">Aucune adhésion en attente</p>
        <p className="text-sm text-on-surface-variant">
          Toutes les inscriptions ont été traitées.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-headline text-xl font-bold text-on-surface">
            Adhésions en attente
          </h3>
          <p className="text-sm text-on-surface-variant">
            {enrollments.length} inscription{enrollments.length > 1 ? "s" : ""} à approuver ou rejeter
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enrollments.map((enr) => {
          const payerIsSelf = enr.subscriptions?.payer_id === enr.users?.id;
          return (
            <article
              key={enr.id}
              className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border-l-4 border-amber-400"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h4 className="font-headline text-lg font-bold text-on-surface">
                    {enr.users?.name ?? "—"}
                  </h4>
                  <p className="text-sm text-on-surface-variant">
                    {enr.users?.email ?? "—"}
                    {enr.users?.is_diaspora && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-primary-fixed text-primary font-bold">
                        DIASPORA
                      </span>
                    )}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] bg-amber-100 text-amber-800 font-bold uppercase tracking-widest px-2 py-1 rounded">
                  {enr.status}
                </span>
              </div>

              <dl className="text-sm space-y-1.5 mb-4">
                <Row label="Forfait" value={`${enr.plans?.name_fr ?? enr.plans?.name_en ?? "—"}`} />
                <Row
                  label="Prix"
                  value={`$${((enr.plans?.yearly_price_cents ?? 0) / 100).toFixed(2)} / an`}
                />
                {enr.users?.phone && <Row label="Téléphone" value={enr.users.phone} />}
                {!payerIsSelf && enr.subscriptions?.users && (
                  <Row
                    label="Payeur"
                    value={`${enr.subscriptions.users.name} (${enr.subscriptions.users.email})`}
                  />
                )}
                <Row label="Soumis le" value={new Date(enr.created_at).toLocaleString("fr-FR")} />
              </dl>

              {rejectingId === enr.id ? (
                <div className="space-y-3">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={2}
                    placeholder="Motif du rejet (communiqué au payeur)"
                    className="w-full rounded-xl border border-outline-variant bg-surface px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => { setRejectingId(null); setRejectReason(""); }}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={() => confirmReject(enr.id)}
                      disabled={pending}
                      className="flex-1 !bg-error !text-on-error"
                    >
                      {pending ? "..." : "Confirmer rejet"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setRejectingId(enr.id)}
                    disabled={pending}
                    className="flex-1"
                  >
                    <span className="flex items-center justify-center gap-1">
                      <Icon name="close" size="sm" />
                      Rejeter
                    </span>
                  </Button>
                  <Button
                    onClick={() => approve(enr.id)}
                    disabled={pending}
                    className="flex-1"
                  >
                    <span className="flex items-center justify-center gap-1">
                      <Icon name="check" size="sm" />
                      Approuver
                    </span>
                  </Button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-on-surface-variant w-20 shrink-0">{label}:</dt>
      <dd className="text-on-surface font-medium">{value}</dd>
    </div>
  );
}
