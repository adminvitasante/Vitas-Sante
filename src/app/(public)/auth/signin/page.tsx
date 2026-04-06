"use client";

import { useState, FormEvent } from "react";
import { signIn, getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

const roleRedirects: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  DOCTOR: "/doctor/patient-care",
  AFFILIATE: "/affiliate/dashboard",
  PAYER: "/member/dashboard",
  BENEFICIARY: "/member/dashboard",
};

const devUsers = [
  { label: "Member", email: "jean@member.ht", icon: "person" },
  { label: "Diaspora", email: "marie@diaspora.us", icon: "public" },
  { label: "Doctor", email: "doctor@vitasante.ht", icon: "medical_services" },
  { label: "Affiliate", email: "affiliate@vitasante.ht", icon: "handshake" },
  { label: "Sponsor", email: "sponsor@vitasante.ht", icon: "volunteer_activism" },
  { label: "Admin", email: "admin@vitasante.ht", icon: "admin_panel_settings" },
];

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function doLogin(loginEmail: string, loginPassword: string) {
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // Fetch session to get role for redirect
        const session = await getSession();
        const role = (session?.user as { role?: string })?.role || "BENEFICIARY";
        const redirect = roleRedirects[role] || "/member/dashboard";
        window.location.href = redirect;
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await doLogin(email, password);
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-surface-container-low px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Vita-Sante-Logo.png" alt="Vita Santé" className="h-12 mx-auto" />
          </Link>
          <h1 className="mt-4 font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Sign in to access your health dashboard
          </p>
        </div>

        {/* Sign-in Form */}
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

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-on-surface">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="mt-8 w-full disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="progress_activity" size="sm" className="animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Don&rsquo;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-primary underline underline-offset-4">
              Enroll now
            </Link>
          </p>
        </form>

        {/* Quick Login Panel */}
        <div className="rounded-3xl border-2 border-dashed border-outline-variant bg-surface-container-lowest p-6">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="bolt" size="sm" className="text-secondary" />
            <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-secondary">
              Quick Access
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {devUsers.map((user) => (
              <button
                key={user.email}
                type="button"
                onClick={() => doLogin(user.email, "dev-password")}
                disabled={loading}
                className="rounded-xl bg-surface-container-low px-3 py-3 text-xs font-medium text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-primary disabled:opacity-50 flex flex-col items-center gap-1"
              >
                <Icon name={user.icon} size="sm" className="text-primary" />
                <div className="font-headline font-bold">{user.label}</div>
                <div className="truncate text-[10px] opacity-60 max-w-full">{user.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
