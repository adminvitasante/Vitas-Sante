import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-surface-container-low py-12 px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-2xl mx-auto">
        <div className="space-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Vita Santé" className="h-10" />
          <p className="text-on-surface-variant text-xs leading-relaxed max-w-xs">
            Providing premium medical infrastructure and health solutions for the Haitian nation and its global diaspora.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h5 className="text-primary font-bold text-sm uppercase tracking-widest mb-2">Quick Links</h5>
          <Link href="/about" className="text-on-surface-variant hover:text-primary text-xs transition-colors">About Us</Link>
          <Link href="/plans" className="text-on-surface-variant hover:text-primary text-xs transition-colors">Medical Network</Link>
          <Link href="/doctor-apply" className="text-on-surface-variant hover:text-primary text-xs transition-colors">Join as Doctor</Link>
          <Link href="/affiliate-program" className="text-on-surface-variant hover:text-primary text-xs transition-colors">Become an Affiliate</Link>
          <Link href="#" className="text-on-surface-variant hover:text-primary text-xs transition-colors">Privacy Policy</Link>
        </div>
        <div className="flex flex-col gap-6">
          <h5 className="text-primary font-bold text-sm uppercase tracking-widest">Connect With Us</h5>
          <p className="text-on-surface-variant text-xs leading-relaxed">
            &copy; {new Date().getFullYear()} Vita Santé Club. All rights reserved. Haiti Medical Network.
          </p>
        </div>
      </div>
    </footer>
  );
}
