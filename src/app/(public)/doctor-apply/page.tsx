"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

// Public-facing doctor application form. Submissions land in doctor_applications;
// an admin reviews and then calls verify_doctor() to promote the applicant.
export default function DoctorApplyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    licenseId: "",
    specialty: "",
    clinicName: "",
    clinicAddress: "",
    region: "",
    yearsExperience: "",
    notes: "",
  });

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
    setError(null);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/doctor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Submission failed. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-surface-container-low px-4 py-12">
        <div className="w-full max-w-md rounded-3xl bg-surface-container-lowest p-10 text-center shadow-clinical">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container">
            <Icon name="check_circle" className="text-secondary !text-4xl" />
          </div>
          <h1 className="font-headline text-2xl font-extrabold text-on-surface">
            Candidature reçue
          </h1>
          <p className="mt-3 text-sm text-on-surface-variant">
            Notre équipe vérifie votre licence et vous revient par email sous 3 à 5 jours ouvrés.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-semibold text-primary underline underline-offset-4"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-surface-container-low px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Vita Santé" className="h-10 mx-auto" />
          </Link>
          <h1 className="mt-4 font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            Rejoindre le réseau Vita Santé
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Médecins, cliniques et hôpitaux. Nous vérifions chaque candidature avant activation.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-3xl bg-surface-container-lowest p-8 shadow-clinical space-y-5"
        >
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
              <Icon name="error" size="sm" />
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom complet" id="fullName" value={form.fullName} onChange={(v) => update("fullName", v)} required />
            <Field label="Email professionnel" id="email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Téléphone" id="phone" type="tel" value={form.phone} onChange={(v) => update("phone", v)} />
            <Field label="Numéro de licence" id="licenseId" value={form.licenseId} onChange={(v) => update("licenseId", v)} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Spécialité" id="specialty" value={form.specialty} onChange={(v) => update("specialty", v)} required placeholder="e.g. Médecine générale, Cardiologie" />
            <Field label="Années d'expérience" id="yearsExperience" type="number" value={form.yearsExperience} onChange={(v) => update("yearsExperience", v)} />
          </div>
          <Field label="Nom du cabinet / clinique" id="clinicName" value={form.clinicName} onChange={(v) => update("clinicName", v)} />
          <Field label="Adresse du cabinet" id="clinicAddress" value={form.clinicAddress} onChange={(v) => update("clinicAddress", v)} />
          <Field label="Région" id="region" value={form.region} onChange={(v) => update("region", v)} placeholder="e.g. Ouest, Artibonite, Sud" />

          <div>
            <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-on-surface">
              Notes complémentaires
            </label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Autres informations utiles à notre équipe de vérification"
            />
          </div>

          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="progress_activity" size="sm" className="animate-spin" />
                Envoi en cours...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Soumettre ma candidature
                <Icon name="arrow_forward" size="sm" />
              </span>
            )}
          </Button>

          <p className="text-center text-xs text-on-surface-variant">
            Déjà médecin Vita Santé?{" "}
            <Link href="/auth/signin" className="font-semibold text-primary underline underline-offset-4">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-on-surface">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
      />
    </div>
  );
}
