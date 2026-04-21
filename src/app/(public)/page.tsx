import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";

// Hero photograph — stored at /public/photohead.jpg.
// Replace that file to change the hero. Keep landscape ~4:3 or 3:2.
const HERO_IMAGE = "/photohead.jpg";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 md:px-16 lg:px-24 pt-8 md:pt-12 pb-16 md:pb-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 z-10">
            <span className="inline-block mb-6 px-3 py-1 rounded-full bg-warm-subtle text-warm-ink text-xs font-bold tracking-widest uppercase">
              {t("heroTag")}
            </span>
            <h1 className="font-headline font-extrabold text-4xl md:text-6xl text-primary tracking-headline mb-6 leading-headline">
              {t("heroTitle")}
              <br />
              <span className="text-warm">{t("heroTitleAccent")}</span>
            </h1>
            <p className="text-ink-muted text-lg leading-body max-w-xl mb-8">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-primary text-on-primary font-headline font-bold text-base shadow-clinical hover:shadow-lg transition-shadow"
              >
                {t("ctaPrimary")}
              </Link>
              <Link
                href="/plans"
                className="inline-flex items-center justify-center px-7 py-4 rounded-xl border-2 border-primary text-primary font-headline font-bold text-base hover:bg-primary hover:text-on-primary transition-colors"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
            <p className="text-xs text-ink-subtle font-medium tracking-wider">
              {t("heroMicroCopy")}
            </p>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-clinical">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Médecin partenaire Vita Santé en consultation avec une patiente"
                src={HERO_IMAGE}
                className="w-full h-[480px] md:h-[560px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent" />
            </div>

            {/* Trust card — honest info, no fake satisfaction stats */}
            <div className="absolute -bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-72 bg-surface-container-lowest p-5 rounded-2xl shadow-clinical border border-outline-variant/40">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-warm-subtle flex items-center justify-center text-warm-ink shrink-0">
                  <Icon name="verified" size="sm" filled />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest">
                    Réseau Vita Santé
                  </p>
                  <p className="text-sm font-bold text-ink">
                    Port-au-Prince · Cap-Haïtien · Les Cayes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem ───────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-surface-warm">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-primary tracking-headline mb-4">
              {t("problemTitle")}
            </h2>
            <p className="text-ink-muted text-lg leading-body">{t("problemLead")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: 1, icon: "savings" },
              { n: 2, icon: "help" },
              { n: 3, icon: "schedule" },
            ].map(({ n, icon }) => (
              <div
                key={n}
                className="p-8 bg-surface-container-lowest rounded-2xl border-l-4 border-warm"
              >
                <div className="h-10 w-10 rounded-xl bg-warm-subtle flex items-center justify-center text-warm-ink mb-4">
                  <Icon name={icon} size="sm" />
                </div>
                <h3 className="font-headline font-bold text-lg mb-3 text-ink">
                  {t(`problem${n}Title` as "problem1Title")}
                </h3>
                <p className="text-ink-muted text-sm leading-body">
                  {t(`problem${n}Body` as "problem1Body")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-primary tracking-headline mb-4">
              {t("howItWorksTitle")}
            </h2>
            <p className="text-ink-muted text-lg leading-body">
              {t("howItWorksLead")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: 1, icon: "person_add" },
              { n: 2, icon: "tune" },
              { n: 3, icon: "badge" },
              { n: 4, icon: "notifications_active" },
            ].map(({ n, icon }) => (
              <div
                key={n}
                className="p-6 bg-surface-container-lowest rounded-2xl shadow-clinical"
              >
                <div className="h-12 w-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-5">
                  <Icon name={icon} />
                </div>
                <h3 className="font-headline font-bold text-base mb-2 text-ink">
                  {t(`step${n}Title` as "step1Title")}
                </h3>
                <p className="text-ink-muted text-sm leading-body">
                  {t(`step${n}Body` as "step1Body")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans ─────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-primary tracking-headline mb-4">
              {t("plansTitle")}
            </h2>
            <p className="text-ink-muted text-lg leading-body">{t("plansLead")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PlanCard
              label="Essential"
              slug="essential"
              price={99}
              highlighted={false}
              ctaLabel={t("planSelectEssential")}
              visitsLabel={t("planVisitsYear", { n: 6 })}
              labsLabel={t("planLabs", { pct: 15 })}
              copayLabel={t("planCopay")}
            />
            <PlanCard
              label="Advantage"
              slug="advantage"
              price={135}
              highlighted
              ctaLabel={t("planSelectAdvantage")}
              popularLabel={t("planPopular")}
              visitsLabel={t("planVisitsYear", { n: 8 })}
              labsLabel={t("planLabs", { pct: 20 })}
              copayLabel={t("planCopay")}
            />
            <PlanCard
              label="Premium"
              slug="premium"
              price={200}
              highlighted={false}
              ctaLabel={t("planSelectPremium")}
              visitsLabel={t("planVisitsYear", { n: 12 })}
              labsLabel={t("planLabs", { pct: 35 })}
              copayLabel={t("planCopay")}
            />
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/plans"
              className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline underline-offset-4"
            >
              {t("viewAllPlans")}
              <Icon name="arrow_forward" size="sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Network ───────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-primary tracking-headline mb-4">
              {t("networkTitle")}
            </h2>
            <p className="text-ink-muted text-lg leading-body">{t("networkLead")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["PAP", "Nord", "Sud"] as const).map((key) => (
              <div
                key={key}
                className="p-6 bg-surface-container-lowest rounded-2xl border-t-4 border-secondary"
              >
                <Icon name="location_on" className="text-secondary mb-3" />
                <h3 className="font-bold text-ink mb-2">
                  {t(`network${key}` as "networkPAP")}
                </h3>
                <p className="text-sm text-ink-muted leading-body">
                  {t(`network${key}Desc` as "networkPAPDesc")}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-ink-subtle italic">{t("networkNote")}</p>
        </div>
      </section>

      {/* ── For doctors ───────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-surface-warm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="inline-block mb-4 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold tracking-widest uppercase">
              Médecins
            </span>
            <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-primary tracking-headline mb-4">
              {t("forDoctorsTitle")}
            </h2>
            <p className="text-ink-muted text-lg leading-body mb-6">
              {t("forDoctorsLead")}
            </p>
            <Link
              href="/doctor-apply"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-warm text-white font-headline font-bold text-sm shadow-warm hover:opacity-90 transition-opacity"
            >
              {t("forDoctorsCta")}
              <Icon name="arrow_forward" size="sm" />
            </Link>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            {[
              { icon: "verified", label: "Vérification en 5 jours" },
              { icon: "payments", label: "Paiement mensuel" },
              { icon: "schedule", label: "Agenda flexible" },
              { icon: "groups", label: "Patients Diaspora" },
            ].map((b) => (
              <div
                key={b.label}
                className="p-4 bg-surface-container-lowest rounded-xl flex items-center gap-3"
              >
                <Icon name={b.icon} className="text-secondary" size="sm" />
                <span className="text-sm font-bold text-ink">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto bg-primary rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden shadow-clinical">
          <div className="absolute -top-10 -right-10 w-80 h-80 bg-warm/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-white tracking-headline mb-6">
              {t("ctaBandTitle")}
            </h2>
            <p className="text-primary-fixed-dim text-lg leading-body mb-10 max-w-2xl mx-auto">
              {t("ctaBandLead")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary font-headline font-bold text-base hover:bg-warm-subtle transition-colors"
              >
                {t("ctaBandPrimary")}
              </Link>
              <a
                href="mailto:support@vitasante.ht?subject=Demande%20d%27information"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/30 text-white font-headline font-bold text-base hover:bg-white/10 transition-colors"
              >
                {t("ctaBandSecondary")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PlanCard({
  label,
  slug,
  price,
  highlighted,
  ctaLabel,
  popularLabel,
  visitsLabel,
  labsLabel,
  copayLabel,
}: {
  label: string;
  slug: string;
  price: number;
  highlighted: boolean;
  ctaLabel: string;
  popularLabel?: string;
  visitsLabel: string;
  labsLabel: string;
  copayLabel: string;
}) {
  const cardClass = highlighted
    ? "bg-primary text-white shadow-clinical"
    : "bg-surface-container-lowest text-ink shadow-clinical";
  const priceClass = highlighted ? "text-white" : "text-primary";
  const checkClass = highlighted ? "text-secondary-fixed" : "text-secondary";
  const subtextClass = highlighted ? "text-white/70" : "text-ink-muted";
  const labelPillClass = highlighted
    ? "bg-white/20 text-white"
    : "bg-surface-container-high text-primary";

  return (
    <div
      className={`p-10 rounded-3xl flex flex-col items-start relative overflow-hidden transition-all hover:translate-y-[-6px] ${cardClass}`}
    >
      {highlighted && popularLabel && (
        <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-warm text-white text-[10px] font-bold uppercase tracking-widest">
          {popularLabel}
        </div>
      )}
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5 ${labelPillClass}`}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-1 mb-8">
        <span className={`text-4xl font-black font-headline ${priceClass}`}>
          ${price}
        </span>
        <span className={`text-sm ${subtextClass}`}>/an</span>
      </div>
      <ul className="space-y-3 mb-10 w-full">
        {[visitsLabel, labsLabel, copayLabel].map((item) => (
          <li
            key={item}
            className={`flex items-start gap-3 text-sm ${subtextClass}`}
          >
            <Icon
              name="check_circle"
              filled
              size="sm"
              className={`${checkClass} mt-0.5 shrink-0`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/auth/signup?plan=${slug}`}
        className={`w-full mt-auto inline-flex items-center justify-center py-3.5 rounded-xl font-headline font-bold text-sm transition-colors ${
          highlighted
            ? "bg-white text-primary hover:bg-warm-subtle"
            : "border-2 border-primary text-primary hover:bg-primary hover:text-on-primary"
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
