import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { LanguageToggle } from "@/components/shared/language-toggle";

export function PublicNavbar() {
  const t = useTranslations("nav");

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 glass-effect shadow-sm backdrop-blur-xl">
      <nav className="flex justify-between items-center px-6 py-4 w-full max-w-screen-2xl mx-auto">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Vita Santé" className="h-10" />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-ink-muted hover:text-primary font-body text-sm transition-colors"
            >
              {t("about")}
            </Link>
            <Link
              href="/plans"
              className="text-ink-muted hover:text-primary font-body text-sm transition-colors"
            >
              {t("plans")}
            </Link>
            <Link
              href="/affiliate-program"
              className="text-ink-muted hover:text-primary font-body text-sm transition-colors"
            >
              {t("affiliate")}
            </Link>
            <Link
              href="/doctor-apply"
              className="text-ink-muted hover:text-primary font-body text-sm transition-colors"
            >
              {t("forDoctors")}
            </Link>
            <LanguageToggle variant="nav" />
          </div>
          <Link
            href="/auth/signin"
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-headline text-sm font-semibold tracking-tight hover:opacity-90 transition-all"
          >
            {t("memberLogin")}
          </Link>
        </div>
        <div className="md:hidden">
          <Icon name="menu" className="text-primary" />
        </div>
      </nav>
    </header>
  );
}
