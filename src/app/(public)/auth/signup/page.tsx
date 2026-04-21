"use client";

import { useState, useEffect, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

type Step = 0 | 1 | 2 | 3;
type Flow = "self" | "loved_one" | "org";

interface FormData {
  flow: Flow | null;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  country: string;
  plan: "essential" | "advantage" | "premium";
}

const planDetails = {
  essential: { name: "Essential", price: 99 },
  advantage: { name: "Advantage", price: 135 },
  premium: { name: "Premium", price: 200 },
};

export default function SignUpPage() {
  const t = useTranslations("signup");
  const [step, setStep] = useState<Step>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    flow: null,
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    country: "Haiti",
    plan: "advantage",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref) setReferralCode(ref);
      const planParam = params.get("plan");
      if (planParam === "essential" || planParam === "advantage" || planParam === "premium") {
        setFormData((p) => ({ ...p, plan: planParam }));
      }
      // If a plan is preselected, default flow to self (they picked a plan = they want one).
      if (planParam) {
        setFormData((p) => ({ ...p, flow: "self" }));
      }
    }
  }, []);

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  function validateAccount(): boolean {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError(t("errorRequiredFields"));
      return false;
    }
    if (formData.password.length < 8) {
      setError(t("errorPasswordLength"));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t("errorPasswordMismatch"));
      return false;
    }
    return true;
  }

  function validateInfo(): boolean {
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      setError(t("errorRequiredInfo"));
      return false;
    }
    return true;
  }

  function handleNext() {
    setError(null);
    if (step === 0 && !formData.flow) {
      setError(t("errorRequiredFields"));
      return;
    }
    if (step === 0) setStep(1);
    else if (step === 1 && validateAccount()) setStep(2);
    else if (step === 2 && validateInfo()) setStep(3);
  }

  function handleBack() {
    setError(null);
    if (step > 0) setStep((step - 1) as Step);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          country: formData.country,
          // For self flow, send chosen plan. For loved-one / org flows,
          // no plan at signup — they pick it in the next flow.
          plan: formData.flow === "self" ? formData.plan : undefined,
          flow: formData.flow,
          referralCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("errorGeneric"));
        return;
      }

      // Route based on response + flow.
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      // Simulation or non-checkout path. Redirect based on flow.
      if (formData.flow === "loved_one") {
        // Diaspora / loved-one: they'll add their first beneficiary.
        window.location.href = "/auth/signin?registered=1&next=/member/dependents/new";
      } else if (formData.flow === "org") {
        window.location.href = "/auth/signin?registered=1&next=/sponsor/sponsor-new";
      } else if (data.demoMode) {
        window.location.href = "/auth/signin?demo=1";
      } else {
        window.location.href = "/auth/signin?registered=1";
      }
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  const selectedPlan = planDetails[formData.plan];

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-surface-container-low px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Vita Santé" className="h-12 mx-auto" />
          </Link>
          <h1 className="mt-4 font-headline text-3xl font-extrabold tracking-headline text-ink">
            {t("heading")}
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          {([0, 1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full font-headline text-sm font-bold transition-colors ${
                  s === step
                    ? "bg-primary text-on-primary"
                    : s < step
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {s < step ? <Icon name="check" size="sm" /> : s + 1}
              </div>
              {s < 3 && (
                <div
                  className={`h-0.5 w-6 rounded-full transition-colors ${
                    s < step ? "bg-secondary" : "bg-surface-container-high"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-surface-container-lowest p-8 shadow-clinical"
        >
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
              <Icon name="error" size="sm" />
              {error}
            </div>
          )}

          {/* Step 0: Role Selection */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-headline text-xl font-bold text-ink">
                  {t("roleQuestion")}
                </h2>
                <p className="text-sm text-ink-muted mt-1">{t("roleSubtitle")}</p>
              </div>

              <div className="space-y-3">
                <RoleCard
                  icon="self_care"
                  tone="primary"
                  tag={t("roleSelfTag")}
                  label={t("roleSelfLabel")}
                  desc={t("roleSelfDesc")}
                  selected={formData.flow === "self"}
                  onClick={() => updateField("flow", "self")}
                />
                <RoleCard
                  icon="favorite"
                  tone="warm"
                  tag={t("roleLovedOneTag")}
                  label={t("roleLovedOneLabel")}
                  desc={t("roleLovedOneDesc")}
                  selected={formData.flow === "loved_one"}
                  onClick={() => updateField("flow", "loved_one")}
                />
                <RoleCard
                  icon="volunteer_activism"
                  tone="secondary"
                  tag={t("roleOrgTag")}
                  label={t("roleOrgLabel")}
                  desc={t("roleOrgDesc")}
                  selected={formData.flow === "org"}
                  onClick={() => updateField("flow", "org")}
                />
              </div>
            </div>
          )}

          {/* Step 1: Account */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-headline text-xl font-bold text-ink">
                  {t("accountTitle")}
                </h2>
                <p className="text-sm text-ink-muted mt-1">{t("accountSubtitle")}</p>
              </div>

              <Field
                id="email"
                type="email"
                label={t("emailLabel")}
                placeholder={t("emailPlaceholder")}
                value={formData.email}
                onChange={(v) => updateField("email", v)}
                required
              />
              <Field
                id="password"
                type="password"
                label={t("passwordLabel")}
                placeholder={t("passwordPlaceholder")}
                value={formData.password}
                onChange={(v) => updateField("password", v)}
                required
              />
              <Field
                id="confirmPassword"
                type="password"
                label={t("confirmPasswordLabel")}
                placeholder={t("confirmPasswordPlaceholder")}
                value={formData.confirmPassword}
                onChange={(v) => updateField("confirmPassword", v)}
                required
              />
            </div>
          )}

          {/* Step 2: Personal Info + (if self flow) plan pick */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-headline text-xl font-bold text-ink">
                  {t("infoTitle")}
                </h2>
                <p className="text-sm text-ink-muted mt-1">{t("infoSubtitle")}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="firstName"
                  label={t("firstNameLabel")}
                  value={formData.firstName}
                  onChange={(v) => updateField("firstName", v)}
                  required
                />
                <Field
                  id="lastName"
                  label={t("lastNameLabel")}
                  value={formData.lastName}
                  onChange={(v) => updateField("lastName", v)}
                  required
                />
              </div>
              <Field
                id="phone"
                type="tel"
                label={t("phoneLabel")}
                placeholder={t("phonePlaceholder")}
                value={formData.phone}
                onChange={(v) => updateField("phone", v)}
                required
              />
              <Field
                id="dob"
                type="date"
                label={t("dobLabel")}
                value={formData.dateOfBirth}
                onChange={(v) => updateField("dateOfBirth", v)}
              />
              <div>
                <label
                  htmlFor="country"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  {t("countryLabel")}
                </label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Haiti">Haiti</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="France">France</option>
                  <option value="Dominican Republic">Dominican Republic</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {formData.flow === "self" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    {t("planLabel")}
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(Object.entries(planDetails) as [FormData["plan"], typeof planDetails.essential][]).map(
                      ([key, plan]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => updateField("plan", key)}
                          className={`rounded-xl border-2 px-4 py-3 text-center transition-all ${
                            formData.plan === key
                              ? "border-primary bg-primary-fixed text-primary"
                              : "border-outline-variant bg-surface text-ink-muted hover:border-primary/50"
                          }`}
                        >
                          <div className="font-headline text-sm font-bold">{plan.name}</div>
                          <div className="text-xs">${plan.price}/yr</div>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-headline text-xl font-bold text-ink">{t("reviewTitle")}</h2>
                <p className="text-sm text-ink-muted mt-1">{t("reviewSubtitle")}</p>
              </div>

              <div className="rounded-2xl bg-surface-container-low p-5">
                <dl className="space-y-2 text-sm">
                  <Row label={t("roleQuestion")} value={
                    formData.flow === "self" ? t("roleSelfTag") :
                    formData.flow === "loved_one" ? t("roleLovedOneTag") :
                    t("roleOrgTag")
                  } />
                  <Row label={t("emailLabel")} value={formData.email} />
                  <Row label={t("firstNameLabel")} value={`${formData.firstName} ${formData.lastName}`} />
                  <Row label={t("phoneLabel")} value={formData.phone} />
                  <Row label={t("countryLabel")} value={formData.country} />
                  {formData.flow === "self" && (
                    <Row label={t("planLabel")} value={`${selectedPlan.name} · $${selectedPlan.price}/yr`} />
                  )}
                </dl>
              </div>

              <div className="rounded-xl bg-primary-fixed/40 p-4 text-xs text-primary leading-relaxed">
                {formData.flow === "self" && t("planSelf")}
                {formData.flow === "loved_one" && t("planLovedOne")}
                {formData.flow === "org" && t("planOrg")}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleBack}
                className="flex-1"
              >
                <span className="flex items-center justify-center gap-2">
                  <Icon name="arrow_back" size="sm" />
                  {t("back")}
                </span>
              </Button>
            )}

            {step < 3 ? (
              <Button
                type="button"
                size="lg"
                onClick={handleNext}
                disabled={step === 0 && !formData.flow}
                className={step === 0 ? "w-full" : "flex-1"}
              >
                <span className="flex items-center justify-center gap-2">
                  {t("next")}
                  <Icon name="arrow_forward" size="sm" />
                </span>
              </Button>
            ) : (
              <Button type="submit" size="lg" disabled={loading} className="flex-1">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="progress_activity" size="sm" className="animate-spin" />
                    {t("submitting")}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {t("submit")}
                    <Icon name="check_circle" size="sm" />
                  </span>
                )}
              </Button>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-ink-muted">
            {t("alreadyMember")}{" "}
            <Link
              href="/auth/signin"
              className="font-semibold text-primary underline underline-offset-4"
            >
              {t("signInLink")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
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
        className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
      />
    </div>
  );
}

function RoleCard({
  icon,
  tone,
  tag,
  label,
  desc,
  selected,
  onClick,
}: {
  icon: string;
  tone: "primary" | "warm" | "secondary";
  tag: string;
  label: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}) {
  const tones = {
    primary: {
      border: selected ? "border-primary" : "border-outline-variant",
      bg: selected ? "bg-primary-fixed/40" : "bg-surface",
      iconBg: "bg-primary-fixed text-primary",
      tagBg: "bg-primary-fixed text-primary",
    },
    warm: {
      border: selected ? "border-warm" : "border-outline-variant",
      bg: selected ? "bg-warm-subtle" : "bg-surface",
      iconBg: "bg-warm-subtle text-warm-ink",
      tagBg: "bg-warm-subtle text-warm-ink",
    },
    secondary: {
      border: selected ? "border-secondary" : "border-outline-variant",
      bg: selected ? "bg-secondary-container/40" : "bg-surface",
      iconBg: "bg-secondary-fixed text-secondary",
      tagBg: "bg-secondary-fixed text-secondary",
    },
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${tones.border} ${tones.bg}`}
    >
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${tones.iconBg}`}>
          <Icon name={icon} size="sm" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${tones.tagBg}`}>
              {tag}
            </span>
          </div>
          <p className="font-headline font-bold text-sm text-ink mb-1">{label}</p>
          <p className="text-xs text-ink-muted leading-relaxed">{desc}</p>
        </div>
        {selected && (
          <Icon name="check_circle" filled size="sm" className="text-primary shrink-0" />
        )}
      </div>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-medium text-ink text-right">{value}</dd>
    </div>
  );
}
