"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

const devUsers = [
  { label: "Member", email: "jean@member.ht", role: "member" },
  { label: "Doctor", email: "doctor@vitasante.ht", role: "doctor" },
  { label: "Affiliate", email: "affiliate@vitasante.ht", role: "affiliate" },
  { label: "Sponsor", email: "sponsor@vitasante.ht", role: "sponsor" },
  { label: "Admin", email: "admin@vitasante.ht", role: "admin" },
];

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        window.location.href = "/";
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDevLogin(email: string) {
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password: "password",
        redirect: false,
      });

      if (result?.error) {
        setError("Dev login failed. Ensure the dev auth provider is configured.");
      } else if (result?.ok) {
        window.location.href = "/";
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-surface-container-low px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block font-headline text-2xl font-extrabold tracking-tighter text-primary"
          >
            Vita Sant&eacute; Club
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
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-on-surface"
              >
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
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-on-surface"
              >
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
            <Link
              href="/auth/signup"
              className="font-semibold text-primary underline underline-offset-4"
            >
              Enroll now
            </Link>
          </p>
        </form>

        {/* Dev Quick Login Panel */}
        {process.env.NODE_ENV === "development" && (
          <div className="rounded-3xl border-2 border-dashed border-outline-variant bg-surface-container-lowest p-6">
            <div className="mb-4 flex items-center gap-2">
              <Icon name="terminal" size="sm" className="text-secondary" />
              <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-secondary">
                Dev Quick Login
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {devUsers.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => handleDevLogin(user.email)}
                  disabled={loading}
                  className="rounded-xl bg-surface-container-low px-3 py-2.5 text-xs font-medium text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-primary disabled:opacity-50"
                >
                  <div className="font-headline font-bold">{user.label}</div>
                  <div className="mt-0.5 truncate text-[10px] opacity-60">{user.email}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
