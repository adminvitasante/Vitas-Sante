import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { Icon } from "@/components/ui/icon";
import { getBeneficiaryMedicalCard } from "@/lib/server/queries";
import { getSessionUser } from "@/lib/server/authz";
import { memberCodeQrDataUrl } from "@/lib/qr";
import { ShareCard } from "@/components/shared/share-card";

// Payer-scoped view of a dependent's medical card.
// - Authenticated (payer or admin only)
// - Server query verifies the caller is the payer on the beneficiary's subscription
// - Reuses the member medical-card visual, scoped to the dependent
// - ShareCard panel lets the payer push the code to WhatsApp / Email

export default async function DependentCardPage({
  params,
}: {
  params: { id: string };
}) {
  const t = await getTranslations("member.medicalCard");
  const locale = await getLocale();
  const me = await getSessionUser();
  if (!me) redirect("/auth/signin");

  const result = await getBeneficiaryMedicalCard(params.id, me.id);
  if ("error" in result) {
    notFound();
  }

  const user = result.user as {
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
  const enrollment = result.enrollment as {
    id: string;
    status: string;
    member_id_code: string | null;
    plans: { name_fr: string; name_en: string; tier: string; visits_per_year: number } | null;
    credit_accounts: { visits_remaining: number; visits_total: number }[] | null;
    subscriptions: { current_period_end: string } | null;
  } | null;

  if (!user || !enrollment?.member_id_code) {
    notFound();
  }

  const memberCode = enrollment.member_id_code;
  const planName = enrollment.plans?.name_fr ?? enrollment.plans?.name_en ?? "—";
  const planTier = enrollment.plans?.tier ?? "CORE";
  const periodEnd = enrollment.subscriptions?.current_period_end;
  const expiry = periodEnd
    ? new Date(periodEnd).toLocaleDateString(locale, { month: "2-digit", year: "numeric" })
    : null;
  const visitsRemaining = enrollment.credit_accounts?.[0]?.visits_remaining ?? 0;
  const visitsTotal = enrollment.credit_accounts?.[0]?.visits_total ?? 0;

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  const qrDataUrl = await memberCodeQrDataUrl(memberCode);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb + Header */}
      <div className="mb-8">
        <Link
          href="/member/dependents"
          className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-primary mb-4 transition-colors"
        >
          <Icon name="arrow_back" size="sm" />
          Retour aux bénéficiaires
        </Link>
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-primary tracking-headline mb-2">
          Carte de {user.name}
        </h1>
        <p className="text-ink-muted">
          Vous pouvez consulter, télécharger et partager la carte de ce bénéficiaire.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Card visual — mirrored from /member/medical-card */}
        <div className="lg:col-span-8">
          <div className="medical-card-gradient rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-clinical">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
              {/* Initials tile */}
              <div className="relative">
                <div className="w-40 h-52 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl bg-primary-container/40 flex items-center justify-center">
                  <span className="font-headline text-6xl font-extrabold text-white tracking-tighter">
                    {initials}
                  </span>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-secondary p-2 rounded-full border-4 border-primary shadow-lg">
                  <Icon name="verified" size="sm" filled className="text-white" />
                </div>
              </div>

              {/* Identity */}
              <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="space-y-1">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/20">
                      {planTier} · {planName}
                    </span>
                  </div>
                  <h2 className="font-headline text-3xl font-extrabold tracking-tight">
                    {user.name}
                  </h2>
                  <p className="text-primary-fixed-dim font-medium tracking-wide font-mono">
                    ID: {memberCode}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">
                      {t("validUntil")}
                    </p>
                    <p className="font-semibold text-lg">{expiry ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">
                      {t("visitsRemaining")}
                    </p>
                    <p className="font-semibold text-lg">
                      {visitsRemaining} / {visitsTotal}
                    </p>
                  </div>
                </div>

                {user.phone && (
                  <div className="pt-2">
                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mb-2">
                      {t("contact")}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="bg-white/10 px-3 py-1.5 rounded-xl text-xs font-medium">
                        {user.phone}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* QR */}
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-4 rounded-3xl shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="Code membre" className="w-24 h-24" src={qrDataUrl} />
                </div>
                <p className="text-[10px] text-white/40 font-medium tracking-tighter">
                  {t("providerScanOnly")}
                </p>
              </div>
            </div>

            <div className="mt-12 flex justify-between items-end">
              <div className="flex items-center gap-2 opacity-50">
                <Icon name="ecg_heart" className="text-[32px]" />
                <span className="text-sm font-bold tracking-widest">VITA SANTÉ</span>
              </div>
              <div className="text-[10px] text-white/20 font-mono">ACTIVE</div>
            </div>
          </div>
        </div>

        {/* Share panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-clinical">
            <ShareCard
              beneficiaryName={user.name}
              beneficiaryEmail={user.email}
              beneficiaryPhone={user.phone}
              memberCode={memberCode}
              planName={planName}
              beneficiaryId={params.id}
            />
          </div>

          <div className="bg-warm-subtle p-5 rounded-3xl">
            <div className="flex items-start gap-3">
              <Icon name="info" className="text-warm-ink mt-0.5" size="sm" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-warm-ink">
                  Comment {user.name.split(" ")[0]} utilise sa carte
                </p>
                <p className="text-[11px] text-warm-ink/80 leading-relaxed">
                  Elle montre le code {memberCode} ou le QR au médecin
                  Vita Santé. Pas besoin de compte ni de mot de passe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
