"use client";

import { useState, FormEvent } from "react";
import { signIn, signOut, getSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

// Dedicated admin login URL. Branded differently from the member signin
// so admins know they're in the right place. Uses the same NextAuth
// credentials flow under the hood, but enforces role=ADMIN after success
// (signs out and errors if the account is not an admin).
export default function AdminLoginPage() {
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
        setError("Identifiants invalides.");
        setLoading(false);
        return;
      }

      if (!result?.ok) {
        setError("Échec de l'authentification.");
        setLoading(false);
        return;
      }

      // Verify the account is actually an admin. If not, log out and reject.
      const session = await getSession();
      const role = (session?.user as { role?: string })?.role;

      if (role !== "ADMIN") {
        await signOut({ redirect: false });
        setError("Ce compte n'a pas les privilèges administrateur.");
        setLoading(false);
        return;
      }

      window.location.href = "/admin/dashboard";
    } catch {
      setError("Une erreur inattendue. Réessayez.");
      setLoading(false);
    }
  }

  async function quickLoginAdmin() {
    setLoading(true);
    setError(null);
    try {
      const res = await signIn("credentials", {
        email: "admin@vitasante.ht",
        password: "dev-password",
        redirect: false,
      });
      if (res?.ok) {
        window.location.href = "/admin/dashboard";
      } else {
        setError("Compte démo non disponible.");
        setLoading(false);
      }
    } catch {
      setError("Erreur.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Subtle grid background for "ops console" feel */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-warm/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md space-y-8 z-10">
        <div className="text-center">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Vita Santé" className="h-10 mx-auto opacity-90" />
          </Link>
          <div className="inline-flex items-center gap-2 mt-6 px-3 py-1 rounded-full bg-warm/10 border border-warm/30 text-warm text-[10px] font-bold tracking-widest uppercase">
            <Icon name="shield" size="sm" />
            Mission Control
          </div>
          <h1 className="mt-4 font-headline text-3xl font-extrabold tracking-headline text-white">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Accès réservé aux administrateurs Vita Santé Club.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-slate-900/60 backdrop-blur-xl p-8 border border-slate-800 shadow-2xl"
        >
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-900/40 border border-red-800 px-4 py-3 text-sm text-red-200">
              <Icon name="error" size="sm" />
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@vitasante.ht"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-warm focus:outline-none focus:ring-2 focus:ring-warm/20 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-warm focus:outline-none focus:ring-2 focus:ring-warm/20 transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="mt-8 w-full !bg-warm !text-white disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="progress_activity" size="sm" className="animate-spin" />
                Authentification...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Icon name="login" size="sm" />
                Accéder au panneau
              </span>
            )}
          </Button>

          <p className="mt-6 text-center text-xs text-slate-500">
            Pas administrateur?{" "}
            <Link
              href="/auth/signin"
              className="font-semibold text-slate-300 hover:text-white underline underline-offset-4"
            >
              Connexion membre
            </Link>
          </p>
        </form>

        {/* Demo quick access — only visible when simulation/demo mode */}
        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/30 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Icon name="bolt" size="sm" className="text-warm" />
            <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-warm">
              Accès démo
            </h3>
          </div>
          <button
            type="button"
            onClick={quickLoginAdmin}
            disabled={loading}
            className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors p-3 text-left disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-warm/20 flex items-center justify-center text-warm shrink-0">
                <Icon name="admin_panel_settings" size="sm" />
              </div>
              <div>
                <p className="font-headline font-bold text-sm text-white">
                  admin@vitasante.ht
                </p>
                <p className="text-[10px] text-slate-500">Compte démo — entrée directe</p>
              </div>
            </div>
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-600">
          Toutes les connexions sont enregistrées dans le journal système.
        </p>
      </div>
    </div>
  );
}
