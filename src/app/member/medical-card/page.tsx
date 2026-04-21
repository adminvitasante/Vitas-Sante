import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Icon } from "@/components/ui/icon";
import { getMemberMedicalCard } from "@/lib/server/queries";
import { getSessionUser } from "@/lib/server/authz";
import { memberCodeQrDataUrl } from "@/lib/qr";
import { MedicalCardActions } from "@/components/shared/medical-card-actions";

export default async function MedicalCardPage() {
  const t = await getTranslations("member.medicalCard");
  const locale = await getLocale();
  const me = await getSessionUser();
  if (!me) redirect("/auth/signin");

  const { user, enrollment } = await getMemberMedicalCard(me.id);

  const memberName = user?.name ?? me.name ?? "—";
  const memberCode = enrollment?.member_id_code ?? null;
  const planName = enrollment?.plans?.name_fr ?? enrollment?.plans?.name_en ?? null;
  const planTier = enrollment?.plans?.tier ?? null;
  const periodEnd = enrollment?.subscriptions?.current_period_end;
  const expiry = periodEnd
    ? new Date(periodEnd).toLocaleDateString(locale, { month: "2-digit", year: "numeric" })
    : null;
  const enrollmentStatus = enrollment?.status ?? "INACTIVE";
  const visitsRemaining = enrollment?.credit_accounts?.[0]?.visits_remaining ?? null;
  const visitsTotal = enrollment?.credit_accounts?.[0]?.visits_total ?? null;

  // Initials for the avatar tile — replaces the AI-generated stock photo.
  const initials = memberName
    .split(" ")
    .filter(Boolean)
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  // Generate a real QR encoding the member code (scannable by doctor flow).
  const qrDataUrl = memberCode ? await memberCodeQrDataUrl(memberCode) : null;

  const hasActiveCard = Boolean(memberCode && enrollmentStatus === "ACTIVE");

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-on-surface-variant max-w-2xl leading-relaxed">
          {hasActiveCard
            ? t("activeDesc", { plan: planName ?? "" })
            : t("inactiveDesc")}
        </p>
      </div>

      {!hasActiveCard && (
        <div className="mb-8 rounded-3xl bg-amber-50 border border-amber-200 p-6">
          <div className="flex gap-3">
            <Icon name="info" className="text-amber-700" />
            <div>
              <p className="font-bold text-amber-900">{t("inactiveTitle")}</p>
              <p className="text-sm text-amber-800 mt-1">
                {t("inactiveStatus", { status: enrollmentStatus })}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Card */}
        <div className="lg:col-span-8 group perspective-1000">
          <div className="medical-card-gradient rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
              {/* Initials tile — no more AI-generated stock photo. */}
              <div className="relative">
                <div className="w-40 h-52 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl bg-primary-container/40 flex items-center justify-center">
                  <span className="font-headline text-6xl font-extrabold text-white tracking-tighter">
                    {initials}
                  </span>
                </div>
                {hasActiveCard && (
                  <div className="absolute -bottom-3 -right-3 bg-secondary p-2 rounded-full border-4 border-primary shadow-lg">
                    <Icon name="verified" size="sm" filled className="text-white" />
                  </div>
                )}
              </div>

              {/* Identity */}
              <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="space-y-1">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/20">
                      {planTier ? `${planTier} · ${planName ?? ""}` : "Adhésion en attente"}
                    </span>
                  </div>
                  <h2 className="font-headline text-3xl font-extrabold tracking-tight">
                    {memberName}
                  </h2>
                  <p className="text-primary-fixed-dim font-medium tracking-wide font-mono">
                    {memberCode ? `ID: ${memberCode}` : "ID: en attente"}
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
                      {visitsRemaining !== null && visitsTotal !== null
                        ? `${visitsRemaining} / ${visitsTotal}`
                        : "—"}
                    </p>
                  </div>
                </div>

                {user?.phone && (
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

              {/* Real QR code */}
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-4 rounded-3xl shadow-inner">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt="Code membre" className="w-24 h-24" src={qrDataUrl} />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center text-slate-400 text-xs text-center">
                      En attente d&apos;activation
                    </div>
                  )}
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
              <div className="text-[10px] text-white/20 font-mono">
                {hasActiveCard ? "ACTIVE" : enrollmentStatus}
              </div>
            </div>
          </div>
        </div>

        {/* Side Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 space-y-4">
            <h3 className="font-headline font-bold text-lg text-primary">{t("actions")}</h3>
            <MedicalCardActions canDownload={hasActiveCard} />
          </div>

          <div className="bg-primary/5 p-6 rounded-3xl space-y-4">
            <div className="flex items-start gap-3">
              <Icon name="info" className="text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-primary">{t("usageTitle")}</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {t("usageBody")}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                {t("statusLabel")}: {enrollmentStatus}
              </span>
              {enrollmentStatus === "ACTIVE" && (
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Plan Coverage Summary — real data only, no fake blood-type/vaccination. */}
      {hasActiveCard && enrollment?.plans && (
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            icon="medical_services"
            tone="primary"
            label={t("planLabel")}
            value={planName ?? "—"}
          />
          <SummaryCard
            icon="event_repeat"
            tone="secondary"
            label={t("visitsPerYear")}
            value={enrollment.plans.visits_per_year ? String(enrollment.plans.visits_per_year) : "—"}
          />
          <SummaryCard
            icon="account_balance_wallet"
            tone="tertiary"
            label={t("creditsLabel")}
            value={
              visitsRemaining !== null && visitsTotal !== null
                ? `${visitsRemaining} / ${visitsTotal}`
                : "—"
            }
          />
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  tone,
  label,
  value,
}: {
  icon: string;
  tone: "primary" | "secondary" | "tertiary";
  label: string;
  value: string;
}) {
  const toneMap = {
    primary: "bg-primary-fixed/20 text-primary",
    secondary: "bg-secondary-fixed/20 text-secondary",
    tertiary: "bg-tertiary-fixed/20 text-tertiary",
  }[tone];

  return (
    <div className="bg-surface-container-low p-6 rounded-[2rem]">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${toneMap}`}>
          <Icon name={icon} />
        </div>
        <div>
          <p className="text-xs text-on-surface-variant font-medium">{label}</p>
          <p className="text-xl font-bold text-on-surface">{value}</p>
        </div>
      </div>
    </div>
  );
}
