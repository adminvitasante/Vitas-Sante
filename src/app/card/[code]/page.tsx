import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { memberCodeQrDataUrl } from "@/lib/qr";
import { Icon } from "@/components/ui/icon";

// Public, no-auth, read-only view of a member card.
// Anyone with the VSC-XXXXX-HT code can open this URL and show it at
// a clinic. No sensitive data beyond what the beneficiary's physical
// card already carries: name, member code, plan, credits, expiry, QR.
//
// Standalone page (no public navbar/footer) so the beneficiary sees a
// clean, self-contained card on their phone.

export const dynamic = "force-dynamic";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function PublicCardPage({
  params,
}: {
  params: { code: string };
}) {
  const code = decodeURIComponent(params.code).toUpperCase();

  // Basic format guard — VSC-XXXXX-HT shape only
  if (!/^VSC-\d+-[A-Z]{2}$/.test(code)) {
    notFound();
  }

  const { data: enrollment } = await supabase
    .from("enrollment")
    .select(
      `id, status, member_id_code, activated_at,
       plans(name_fr, name_en, tier, visits_per_year),
       credit_accounts(visits_remaining, visits_total),
       subscriptions!inner(current_period_end),
       users:beneficiary_id(name, phone)`
    )
    .eq("member_id_code", code)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (!enrollment) {
    notFound();
  }

  const user = enrollment.users as unknown as { name: string; phone: string | null };
  const plan = enrollment.plans as unknown as {
    name_fr: string;
    name_en: string;
    tier: string;
    visits_per_year: number;
  } | null;
  const sub = enrollment.subscriptions as unknown as { current_period_end: string };
  const credit = (enrollment.credit_accounts as unknown as
    { visits_remaining: number; visits_total: number }[])[0];

  const planName = plan?.name_fr ?? plan?.name_en ?? "Vita Santé";
  const planTier = plan?.tier ?? "CORE";
  const expiry = sub.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString("fr-FR", {
        month: "2-digit",
        year: "numeric",
      })
    : "—";
  const visitsRemaining = credit?.visits_remaining ?? 0;
  const visitsTotal = credit?.visits_total ?? 0;

  const initials =
    user.name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const qrDataUrl = await memberCodeQrDataUrl(code);

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col items-center py-10 px-4">
      <Link href="/" className="mb-6 opacity-80 hover:opacity-100 transition-opacity">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Vita Santé" className="h-10" />
      </Link>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="medical-card-gradient rounded-[2rem] p-8 text-white relative overflow-hidden shadow-clinical">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-6">
            {/* Header row */}
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-2 py-0.5 bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/20">
                  {planTier} · {planName}
                </span>
              </div>
              <div className="bg-secondary p-1.5 rounded-full border-2 border-primary">
                <Icon name="verified" size="sm" filled className="text-white" />
              </div>
            </div>

            {/* Name + initials */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center">
                <span className="font-headline text-2xl font-extrabold text-white">
                  {initials}
                </span>
              </div>
              <div>
                <h1 className="font-headline text-xl font-extrabold tracking-tight">
                  {user.name}
                </h1>
                <p className="text-primary-fixed-dim text-sm font-mono tracking-wider mt-1">
                  {code}
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-sm">
              <div>
                <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">
                  Valable jusqu&apos;au
                </p>
                <p className="font-semibold text-base">{expiry}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">
                  Visites restantes
                </p>
                <p className="font-semibold text-base">
                  {visitsRemaining} / {visitsTotal}
                </p>
              </div>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center gap-2 pt-4 border-t border-white/10">
              <div className="bg-white p-3 rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Code membre" className="w-28 h-28" src={qrDataUrl} />
              </div>
              <p className="text-[10px] text-white/40 font-medium tracking-tighter">
                POUR SCAN MÉDECIN UNIQUEMENT
              </p>
            </div>

            {/* Brand */}
            <div className="flex items-center gap-2 opacity-60 pt-2 border-t border-white/10">
              <Icon name="ecg_heart" className="text-xl" />
              <span className="text-xs font-bold tracking-widest">VITA SANTÉ</span>
            </div>
          </div>
        </div>

        {/* Instructions for the beneficiary */}
        <div className="mt-6 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
          <h2 className="font-headline font-bold text-primary mb-3 text-sm">
            Comment utiliser cette carte
          </h2>
          <ol className="space-y-2 text-xs text-on-surface leading-relaxed">
            <li className="flex gap-2">
              <span className="font-bold text-primary">1.</span>
              Rendez-vous chez un médecin du réseau Vita Santé.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary">2.</span>
              Présentez ce code ou faites scanner le QR : <span className="font-mono font-bold">{code}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary">3.</span>
              Le médecin vérifie votre éligibilité en quelques secondes. Aucun paiement à avancer.
            </li>
          </ol>
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-[11px] text-ink-subtle">
            Des questions ?{" "}
            <a
              href="mailto:support@vitasante.ht"
              className="text-primary font-semibold underline underline-offset-4"
            >
              support@vitasante.ht
            </a>
          </p>
          <p className="text-[10px] text-ink-subtle">
            Cette carte est gérée par Vita Santé Club.
          </p>
        </div>
      </div>
    </div>
  );
}
