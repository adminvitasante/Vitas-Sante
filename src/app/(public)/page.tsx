import { Icon } from "@/components/ui/icon";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[870px] flex items-center px-6 md:px-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10 text-left">
            <h1 className="font-headline font-extrabold text-5xl md:text-7xl text-primary leading-[1.1] mb-6 tracking-tight">
              Your health is our mission. <br />
              <span className="text-primary-container">In Haiti and for the Diaspora.</span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Access premium medical care and secure health coverage for you and your loved ones, bridging the gap between distances with trust and clinical excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup">
                <button className="clinical-gradient text-white px-8 py-4 rounded-xl font-headline font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform">
                  S&apos;inscrire maintenant
                </button>
              </Link>
              <Link href="/plans">
                <button className="px-8 py-4 rounded-xl font-headline font-bold text-lg text-primary hover:bg-surface-container-high transition-colors">
                  Voir le r&eacute;seau
                </button>
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-secondary-container/30 rounded-full blur-3xl"></div>
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl transform rotate-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Professional Black Haitian male doctor in a modern medical setting"
                className="w-full h-[600px] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE1OiEnsf-LwHBBcq-igkaU12at_5_z6XZtmOT3k0rpAtFvG2uCrWa1RN1J2lq7qOupWo_g5tIJ5hnuQlmlRu-j_x_a3bEENqh6XcbuDNjS3oPW4w35nGuHBEYcnl24LOs-aQ9JIPrwPZY3OuV7wsMPKYCyD9ZH9oZ4RuF9wdYqYq99P8lRu31iPKwgDR3Ki21qkUWR3DvKaqIJm-brbszrTAO94e6GI65HKnjKAMw6nhcAiT7bF5n5ZUAHj4bNc3CsfXY0xStEaiC"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            </div>
            {/* Stats Card Float */}
            <div className="absolute bottom-12 -left-12 bg-white/90 glass-effect p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Icon name="favorite" filled className="text-secondary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">Satisfaction</p>
                  <p className="text-2xl font-black text-primary">98% Positive</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
            <div className="col-span-1">
              <div className="w-16 h-1 bg-secondary mb-8"></div>
              <h2 className="font-headline font-extrabold text-4xl text-on-primary-fixed mb-6 tracking-tighter">The Clinical Atelier Philosophy</h2>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                We believe healthcare is not a transaction—it is a curated journey. Our vision is to provide a sanctuary of health for the Haitian community, regardless of geographic boundaries.
              </p>
            </div>
            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 bg-surface-container-lowest rounded-2xl border-l-4 border-primary">
                <Icon name="clinical_notes" size="lg" className="text-primary mb-4" />
                <h3 className="font-headline font-bold text-xl mb-3 text-primary">Mission</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Deploying world-class medical standards to every corner of Haiti, ensuring every member receives dignified and precise care.
                </p>
              </div>
              <div className="p-8 bg-surface-container-lowest rounded-2xl border-l-4 border-secondary">
                <Icon name="visibility" size="lg" className="text-secondary mb-4" />
                <h3 className="font-headline font-bold text-xl mb-3 text-secondary">Vision</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  To be the digital bridge that connects the Haitian Diaspora to the well-being of their families back home through a trusted medical ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline font-extrabold text-4xl text-primary mb-4">Choose Your Membership</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Transparent plans designed to meet the diverse needs of families in Haiti and those supporting from abroad.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-surface-container-lowest p-10 rounded-3xl flex flex-col items-start transition-all hover:translate-y-[-8px]">
              <span className="px-4 py-1 bg-surface-container-high rounded-full text-xs font-bold text-primary mb-6">ESSENTIAL</span>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-primary">$99</span>
                <span className="text-on-surface-variant text-sm">/year</span>
              </div>
              <ul className="space-y-4 mb-10 w-full">
                <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Icon name="check_circle" filled size="sm" className="text-secondary" />
                  6 Visits/Televisits
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Icon name="check_circle" filled size="sm" className="text-secondary" />
                  15% Labs & Pharmacy
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Icon name="check_circle" filled size="sm" className="text-secondary" />
                  $1-$10 per visit
                </li>
              </ul>
              <Link href="/auth/signup?plan=essential" className="w-full mt-auto">
                <button className="w-full py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors">Select Essential</button>
              </Link>
            </div>

            {/* Standard Plan */}
            <div className="clinical-gradient p-10 rounded-3xl flex flex-col items-start relative overflow-hidden text-white transition-all hover:translate-y-[-8px] shadow-2xl">
              <div className="absolute top-0 right-0 p-4 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rotate-45 translate-x-10 translate-y-2 w-40 text-center">Popular</div>
              <span className="px-4 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-6">ADVANTAGE</span>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-white">$135</span>
                <span className="text-white/70 text-sm">/year</span>
              </div>
              <ul className="space-y-4 mb-10 w-full">
                <li className="flex items-center gap-3 text-sm">
                  <Icon name="check_circle" filled size="sm" className="text-secondary-fixed" />
                  8 Visits/Televisits
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Icon name="check_circle" filled size="sm" className="text-secondary-fixed" />
                  20% Labs & Pharmacy
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Icon name="check_circle" filled size="sm" className="text-secondary-fixed" />
                  $1-$10 per visit
                </li>
              </ul>
              <Link href="/auth/signup?plan=advantage" className="w-full mt-auto">
                <button className="w-full py-4 bg-white text-primary font-bold rounded-xl hover:bg-opacity-90 transition-opacity">Select Advantage</button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-surface-container-lowest p-10 rounded-3xl flex flex-col items-start transition-all hover:translate-y-[-8px]">
              <span className="px-4 py-1 bg-tertiary-fixed text-tertiary rounded-full text-xs font-bold mb-6">PREMIUM</span>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-primary">$200</span>
                <span className="text-on-surface-variant text-sm">/year</span>
              </div>
              <ul className="space-y-4 mb-10 w-full">
                <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Icon name="check_circle" filled size="sm" className="text-secondary" />
                  12 Visits/Televisits
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Icon name="check_circle" filled size="sm" className="text-secondary" />
                  35% Labs & Pharmacy
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Icon name="check_circle" filled size="sm" className="text-secondary" />
                  $1-$10 per visit
                </li>
              </ul>
              <Link href="/auth/signup?plan=premium" className="w-full mt-auto">
                <button className="w-full py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors">Select Premium</button>
              </Link>
            </div>
          </div>

          {/* Elite Tiers Teaser */}
          <div className="mt-12 relative rounded-3xl overflow-hidden clinical-gradient p-8 md:p-12">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="diamond" filled className="text-amber-400" />
                  <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
                    Elite Collection
                  </span>
                </div>
                <h3 className="font-headline text-2xl md:text-3xl font-extrabold text-white mb-2">
                  Need more coverage? Explore our Elite Tiers.
                </h3>
                <p className="text-primary-fixed-dim text-sm md:text-base max-w-xl">
                  From <span className="font-bold text-white">$365</span> to <span className="font-bold text-white">$5,000</span>/year — including surgery coverage, at-home services, and exclusive US network access for Gold & Platinum members.
                </p>
              </div>
              <Link href="/plans" className="shrink-0">
                <button className="bg-white text-primary px-8 py-4 rounded-xl font-headline font-bold text-sm hover:bg-surface-container-lowest transition-colors flex items-center gap-2 shadow-lg">
                  View All 8 Plans
                  <Icon name="arrow_forward" size="sm" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Network Map Section */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-headline font-extrabold text-4xl text-primary mb-6">Our Medical Network</h2>
              <p className="text-on-surface-variant mb-8 text-lg">
                Vita Sant&eacute; Club partners with the most reputable clinics and hospitals across Haiti. From Port-au-Prince to Cap-Ha&iuml;tien, our members are never far from expert care.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors">
                  <Icon name="location_on" className="text-primary" />
                  <div>
                    <h4 className="font-bold text-primary">Port-au-Prince Hub</h4>
                    <p className="text-sm text-on-surface-variant">4 Major Medical Centers + 12 Diagnostic Labs</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors">
                  <Icon name="location_on" className="text-primary" />
                  <div>
                    <h4 className="font-bold text-primary">Northern District</h4>
                    <p className="text-sm text-on-surface-variant">2 Hospitals in Cap-Ha&iuml;tien</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors">
                  <Icon name="location_on" className="text-primary" />
                  <div>
                    <h4 className="font-bold text-primary">Southern Coverage</h4>
                    <p className="text-sm text-on-surface-variant">Specialized Clinic in Les Cayes</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative bg-surface-container-high rounded-3xl overflow-hidden min-h-[450px] shadow-inner group">
              {/* Map Placeholder */}
              <div
                className="absolute inset-0 grayscale contrast-125 opacity-40 mix-blend-multiply bg-center bg-cover"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAx53atZlH-iT7d3Be0C9iwiPC10k21bLGMPHDix2ipemb7lcpFh1vldZ7wu3wLyCw23v0x-Sy3kfhVhOswdCldQf3Jl6TQPSxWto3MC7ke2VhfnDkDl8bwPEDHXFQKurk8gQvh3aIlJDPqPaBf493Bu5sOSmWUsU6tDQ5Hxh5uawdOcpulhNeAmpmr5tFgvCj7-ikwfWDD7Z52M335qdqlb1W1ds5qfvACkC7oV5lZyKCqRCoxYOqK_W7aodq2ahcG3pRjP0YuD6kA')" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 glass-effect p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4">
                  <Icon name="map" filled size="xl" className="text-primary mb-4" />
                  <h4 className="font-headline font-bold text-xl text-primary mb-2">Interactive Network Map</h4>
                  <p className="text-sm text-on-surface-variant mb-6">Explore our growing list of 50+ affiliated health partners across the nation.</p>
                  <Link href="/plans">
                    <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-all">
                      Explorer les forfaits
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / Trust CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto clinical-gradient rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="font-headline font-extrabold text-4xl text-white mb-6">Ready to secure your future?</h2>
            <p className="text-primary-fixed-dim text-lg mb-10 max-w-2xl mx-auto">Join the 15,000+ members who trust Vita Sant&eacute; Club for their daily healthcare needs and emergency coverage.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/signup">
                <button className="bg-white text-primary font-bold px-10 py-4 rounded-xl text-lg hover:bg-surface-container-lowest transition-colors">Start Your Journey</button>
              </Link>
              <a href="mailto:support@vitasante.ht?subject=Demande%20d%27information">
                <button className="bg-primary-container/30 border border-white/20 text-white font-bold px-10 py-4 rounded-xl text-lg hover:bg-white/10 transition-colors">Contact Our Advisors</button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
