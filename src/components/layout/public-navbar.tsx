import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { LanguageToggle } from "@/components/shared/language-toggle";

export function PublicNavbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 glass-effect shadow-sm">
      <nav className="flex justify-between items-center px-6 py-4 w-full max-w-screen-2xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tighter text-primary font-headline">
          Vita Santé Club
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-on-surface-variant hover:text-primary font-body text-sm transition-colors">About</Link>
            <Link href="/plans" className="text-on-surface-variant hover:text-primary font-body text-sm transition-colors">Plans</Link>
            <Link href="/affiliate-program" className="text-on-surface-variant hover:text-primary font-body text-sm transition-colors">Affiliate</Link>
            <LanguageToggle />
          </div>
          <Link href="/auth/signin" className="bg-primary text-white px-6 py-2.5 rounded-xl font-headline text-sm font-semibold tracking-tight hover:opacity-90 transition-all">
            Member Login
          </Link>
        </div>
        <div className="md:hidden">
          <Icon name="menu" className="text-primary" />
        </div>
      </nav>
    </header>
  );
}
