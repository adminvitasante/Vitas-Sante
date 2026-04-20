"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  approveDoctorApplication,
  rejectDoctorApplication,
} from "@/lib/server/doctors";

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  license_id: string;
  specialty: string;
  clinic_name: string | null;
  clinic_address: string | null;
  region: string | null;
  years_experience: number | null;
  notes: string | null;
  created_at: string;
};

export function ApplicationsReview({ applications }: { applications: Application[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [banner, setBanner] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  function approve(id: string) {
    startTransition(async () => {
      const res = await approveDoctorApplication(id);
      if (!res.success) {
        setBanner({ tone: "error", text: res.error ?? "Échec approbation" });
        return;
      }
      setBanner({
        tone: "success",
        text: res.tempPassword
          ? `Approuvé. Mot de passe temporaire: ${res.tempPassword} — transmettez-le manuellement.`
          : "Candidature approuvée. Le médecin a été ajouté au réseau.",
      });
      router.refresh();
    });
  }

  function confirmReject(id: string) {
    if (!rejectReason.trim()) {
      setBanner({ tone: "error", text: "Veuillez indiquer un motif de rejet." });
      return;
    }
    startTransition(async () => {
      const res = await rejectDoctorApplication(id, rejectReason.trim());
      if (!res.success) {
        setBanner({ tone: "error", text: res.error ?? "Échec rejet" });
        return;
      }
      setBanner({ tone: "success", text: "Candidature rejetée." });
      setRejectingId(null);
      setRejectReason("");
      router.refresh();
    });
  }

  if (applications.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-headline text-xl font-bold text-on-surface">
            Candidatures en attente
          </h3>
          <p className="text-sm text-on-surface-variant">
            {applications.length} candidature{applications.length > 1 ? "s" : ""} à revoir
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
        {applications.map((app) => (
          <article
            key={app.id}
            className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border-l-4 border-amber-400"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h4 className="font-headline text-lg font-bold text-on-surface">
                  {app.full_name}
                </h4>
                <p className="text-secondary text-sm font-semibold uppercase tracking-wide">
                  {app.specialty}
                </p>
              </div>
              <span className="shrink-0 text-[10px] bg-amber-100 text-amber-800 font-bold uppercase tracking-widest px-2 py-1 rounded">
                Pending
              </span>
            </div>

            <dl className="text-sm space-y-1.5 mb-4">
              <Row label="License" value={<span className="font-mono">{app.license_id}</span>} />
              <Row label="Email" value={app.email} />
              {app.phone && <Row label="Phone" value={app.phone} />}
              {app.clinic_name && <Row label="Clinic" value={app.clinic_name} />}
              {app.clinic_address && <Row label="Address" value={app.clinic_address} />}
              {app.region && <Row label="Region" value={app.region} />}
              {app.years_experience && (
                <Row label="Experience" value={`${app.years_experience} ans`} />
              )}
            </dl>

            {app.notes && (
              <div className="mb-4 rounded-xl bg-surface-container-low p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Notes
                </p>
                <p className="text-sm text-on-surface">{app.notes}</p>
              </div>
            )}

            {rejectingId === app.id ? (
              <div className="space-y-3">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={2}
                  placeholder="Motif du rejet (sera communiqué au candidat)"
                  className="w-full rounded-xl border border-outline-variant bg-surface px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setRejectingId(null);
                      setRejectReason("");
                    }}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={() => confirmReject(app.id)}
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
                  onClick={() => setRejectingId(app.id)}
                  disabled={pending}
                  className="flex-1"
                >
                  <span className="flex items-center justify-center gap-1">
                    <Icon name="close" size="sm" />
                    Rejeter
                  </span>
                </Button>
                <Button
                  onClick={() => approve(app.id)}
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

            <p className="mt-3 text-[10px] text-on-surface-variant">
              Soumis le {new Date(app.created_at).toLocaleString("fr-FR")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="text-on-surface-variant w-24 shrink-0">{label}:</dt>
      <dd className="text-on-surface font-medium">{value}</dd>
    </div>
  );
}
