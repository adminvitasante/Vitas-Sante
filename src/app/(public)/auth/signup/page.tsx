"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

type Step = 1 | 2 | 3;

interface FormData {
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

const ENROLLMENT_FEE = 25;
const TAX_RATE = 0.05;

export default function SignUpPage() {
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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

  function updateField(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  function validateStep1(): boolean {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  }

  function validateStep2(): boolean {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.dateOfBirth) {
      setError("Please fill in all required fields.");
      return false;
    }
    return true;
  }

  function handleNext() {
    setError(null);
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  }

  function handleBack() {
    setError(null);
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
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
          plan: formData.plan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Enrollment failed. Please try again.");
        return;
      }

      window.location.href = "/auth/signin";
    } catch {
      setError("Enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const selectedPlan = planDetails[formData.plan];
  const subtotal = selectedPlan.price + ENROLLMENT_FEE;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-surface-container-low px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Vita-Sante-Logo.png" alt="Vita Santé" className="h-12 mx-auto" />
          </Link>
          <h1 className="mt-4 font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            Become a Member
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Complete your enrollment in 3 simple steps
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full font-headline text-sm font-bold transition-colors ${
                  s === step
                    ? "clinical-gradient text-white"
                    : s < step
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {s < step ? <Icon name="check" size="sm" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`h-0.5 w-8 rounded-full transition-colors ${
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

          {/* Step 1: Account Creation */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-headline text-xl font-bold text-on-surface">
                Create Your Account
              </h2>
              <p className="text-sm text-on-surface-variant">
                Start with your login credentials.
              </p>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-on-surface">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-on-surface">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-on-surface">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  required
                  placeholder="Repeat your password"
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-headline text-xl font-bold text-on-surface">
                Personal Information
              </h2>
              <p className="text-sm text-on-surface-variant">
                Tell us about yourself so we can personalize your care.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-on-surface">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    required
                    placeholder="Jean"
                    className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-on-surface">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    required
                    placeholder="Baptiste"
                    className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-on-surface">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  required
                  placeholder="+509 0000 0000"
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="mb-1.5 block text-sm font-medium text-on-surface">
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  required
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-on-surface">
                  Country of Residence
                </label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                >
                  <option value="Haiti">Haiti</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="France">France</option>
                  <option value="Dominican Republic">Dominican Republic</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-on-surface">
                  Select Plan
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
                            : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary/50"
                        }`}
                      >
                        <div className="font-headline text-sm font-bold">{plan.name}</div>
                        <div className="text-xs">${plan.price}/yr</div>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-headline text-xl font-bold text-on-surface">
                Review &amp; Confirm
              </h2>
              <p className="text-sm text-on-surface-variant">
                Please review your details before completing enrollment.
              </p>

              {/* Personal Summary */}
              <div className="rounded-2xl bg-surface-container-low p-5">
                <h3 className="mb-3 font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                  Your Information
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-on-surface-variant">Name</dt>
                    <dd className="font-medium text-on-surface">
                      {formData.firstName} {formData.lastName}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-on-surface-variant">Email</dt>
                    <dd className="font-medium text-on-surface">{formData.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-on-surface-variant">Phone</dt>
                    <dd className="font-medium text-on-surface">{formData.phone}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-on-surface-variant">Date of Birth</dt>
                    <dd className="font-medium text-on-surface">{formData.dateOfBirth}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-on-surface-variant">Country</dt>
                    <dd className="font-medium text-on-surface">{formData.country}</dd>
                  </div>
                </dl>
              </div>

              {/* Order Summary */}
              <div className="rounded-2xl bg-surface-container-low p-5">
                <h3 className="mb-3 font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                  Order Summary
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-on-surface-variant">
                      {selectedPlan.name} Plan (Annual)
                    </dt>
                    <dd className="font-medium text-on-surface">
                      ${selectedPlan.price.toFixed(2)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-on-surface-variant">Enrollment Fee</dt>
                    <dd className="font-medium text-on-surface">
                      ${ENROLLMENT_FEE.toFixed(2)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-on-surface-variant">Tax (5%)</dt>
                    <dd className="font-medium text-on-surface">${tax.toFixed(2)}</dd>
                  </div>
                  <div className="border-t border-outline-variant pt-2">
                    <div className="flex justify-between">
                      <dt className="font-headline font-bold text-on-surface">Total</dt>
                      <dd className="font-headline text-lg font-extrabold text-primary">
                        ${total.toFixed(2)}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>

              <p className="text-xs leading-relaxed text-on-surface-variant">
                By completing enrollment, you agree to Vita Sant&eacute; Club&rsquo;s Terms of
                Service and Privacy Policy. Your membership will activate immediately upon payment
                confirmation.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleBack}
                className="flex-1"
              >
                <span className="flex items-center justify-center gap-2">
                  <Icon name="arrow_back" size="sm" />
                  Back
                </span>
              </Button>
            )}

            {step < 3 ? (
              <Button
                type="button"
                size="lg"
                onClick={handleNext}
                className={step === 1 ? "w-full" : "flex-1"}
              >
                <span className="flex items-center justify-center gap-2">
                  Continue
                  <Icon name="arrow_forward" size="sm" />
                </span>
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="progress_activity" size="sm" className="animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Complete Enrollment
                    <Icon name="check_circle" size="sm" />
                  </span>
                )}
              </Button>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Already a member?{" "}
            <Link
              href="/auth/signin"
              className="font-semibold text-primary underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
