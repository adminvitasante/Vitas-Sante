import Link from "next/link";
import { useTranslations } from "next-intl";

export function PublicFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-surface-container-low py-12 px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-2xl mx-auto">
        <div className="space-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Vita Santé" className="h-10" />
          <p className="text-ink-muted text-xs leading-body max-w-xs">{t("tagline")}</p>
        </div>
        <div className="flex flex-col gap-3">
          <h5 className="text-primary font-bold text-sm uppercase tracking-widest mb-2">
            {t("quickLinks")}
          </h5>
          <Link
            href="/plans"
            className="text-ink-muted hover:text-primary text-xs transition-colors"
          >
            {t("plans")}
          </Link>
          <Link
            href="/doctor-apply"
            className="text-ink-muted hover:text-primary text-xs transition-colors"
          >
            {t("joinAsDoctor")}
          </Link>
          <Link
            href="/affiliate-program"
            className="text-ink-muted hover:text-primary text-xs transition-colors"
          >
            {t("affiliateProgram")}
          </Link>
          <a
            href="mailto:support@vitasante.ht"
            className="text-ink-muted hover:text-primary text-xs transition-colors"
          >
            {t("contact")}
          </a>
        </div>
        <div className="flex flex-col gap-6">
          <h5 className="text-primary font-bold text-sm uppercase tracking-widest">
            {t("connectWithUs")}
          </h5>
          <p className="text-ink-muted text-xs leading-body">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <Link
            href="/admin-login"
            className="text-[10px] text-ink-subtle hover:text-primary uppercase tracking-widest transition-colors inline-flex items-center gap-1"
          >
            <span>·</span> Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
