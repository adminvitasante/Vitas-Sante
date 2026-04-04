import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-surface">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-surface-container-lowest">
        <div className="mx-auto max-w-screen-2xl px-6 py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <h1 className="font-headline text-4xl font-extrabold leading-tight tracking-tight text-on-surface md:text-5xl lg:text-6xl">
                Your health is our mission.{" "}
                <span className="text-primary">In Haiti and for the Diaspora.</span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-on-surface-variant">
                Vita Sant&eacute; Club connects you with Haiti&rsquo;s finest medical professionals,
                modern clinics, and a comprehensive care network &mdash; whether you live on the
                island or across the globe.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/plans">
                  <Button size="lg">
                    <span className="flex items-center gap-2">
                      Explore Plans
                      <Icon name="arrow_forward" size="sm" />
                    </span>
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="ghost" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE1OiEnsf-LwHBBcq-igkaU12at_5_z6XZtmOT3k0rpAtFvG2uCrWa1RN1J2lq7qOupWo_g5tIJ5hnuQlmlRu-j_x_a3bEENqh6XcbuDNjS3oPW4w35nGuHBEYcnl24LOs-aQ9JIPrwPZY3OuV7wsMPKYCyD9ZH9oZ4RuF9wdYqYq99P8lRu31iPKwgDR3Ki21qkUWR3DvKaqIJm-brbszrTAO94e6GI65HKnjKAMw6nhcAiT7bF5n5ZUAHj4bNc3CsfXY0xStEaiC"
                  alt="Professional healthcare provider ready to assist"
                  className="h-auto w-full max-w-md rounded-3xl object-cover shadow-clinical"
                />
                {/* Floating stats card */}
                <div className="glass-effect absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl bg-surface-container-lowest/90 px-5 py-4 shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-on-secondary">
                    <Icon name="thumb_up" filled size="md" />
                  </div>
                  <div>
                    <p className="font-headline text-2xl font-extrabold text-primary">98%</p>
                    <p className="text-xs font-medium text-on-surface-variant">
                      Positive Satisfaction
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="bg-surface-container-low py-20 lg:py-28">
        <div className="mx-auto max-w-screen-2xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-secondary">
              Who We Are
            </p>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
              The Clinical Atelier Philosophy
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-on-surface-variant">
              We blend world-class medical standards with deep cultural understanding, creating a
              healthcare experience designed specifically for the Haitian community.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Mission Card */}
            <div className="group rounded-3xl bg-surface-container-lowest p-8 shadow-clinical transition-all hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed">
                <Icon name="emergency" filled className="text-primary" size="lg" />
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface">Our Mission</h3>
              <p className="mt-3 leading-relaxed text-on-surface-variant">
                To democratize access to quality healthcare for every Haitian &mdash; at home and
                abroad. Through strategic partnerships with clinics, pharmacies, and specialists, we
                remove the barriers that separate families from the care they deserve.
              </p>
            </div>

            {/* Vision Card */}
            <div className="group rounded-3xl bg-surface-container-lowest p-8 shadow-clinical transition-all hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-fixed">
                <Icon name="visibility" filled className="text-secondary" size="lg" />
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface">Our Vision</h3>
              <p className="mt-3 leading-relaxed text-on-surface-variant">
                A Haiti where distance is never an obstacle to health. We envision a connected
                medical ecosystem that empowers diaspora members to provide care for loved ones with
                dignity, transparency, and clinical excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Plans ── */}
      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-screen-2xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-secondary">
              Membership Plans
            </p>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
              Invest in Health, Not Worry
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-on-surface-variant">
              Choose a plan that fits your needs. Every membership includes access to our vetted
              medical network across Haiti.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Essential */}
            <div className="flex flex-col rounded-3xl bg-surface-container-lowest p-8 shadow-clinical">
              <div className="mb-6">
                <h3 className="font-headline text-lg font-bold text-on-surface">Essential</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Core coverage for individuals
                </p>
              </div>
              <div className="mb-6">
                <span className="font-headline text-4xl font-extrabold text-primary">$99</span>
                <span className="text-sm text-on-surface-variant">/year</span>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {[
                  "Primary care consultations",
                  "Basic lab work coverage",
                  "24/7 telemedicine access",
                  "Pharmacy network discounts",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <Icon name="check_circle" filled size="sm" className="mt-0.5 text-secondary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup">
                <Button variant="ghost" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Advantage (Highlighted) */}
            <div className="relative flex flex-col rounded-3xl clinical-gradient p-8 text-white shadow-lg">
              <div className="absolute -top-3 right-6 rounded-full bg-secondary px-4 py-1 text-xs font-bold uppercase tracking-wider text-on-secondary">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="font-headline text-lg font-bold text-white">Advantage</h3>
                <p className="mt-1 text-sm text-white/70">
                  Enhanced protection for families
                </p>
              </div>
              <div className="mb-6">
                <span className="font-headline text-4xl font-extrabold text-white">$135</span>
                <span className="text-sm text-white/70">/year</span>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {[
                  "Everything in Essential",
                  "Specialist referral network",
                  "Emergency room coverage",
                  "Dental & vision basics",
                  "Family member add-ons",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-white/90">
                    <Icon name="check_circle" filled size="sm" className="mt-0.5 text-secondary-fixed" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup">
                <Button className="w-full bg-white text-primary hover:bg-white/90">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Premium */}
            <div className="flex flex-col rounded-3xl bg-surface-container-lowest p-8 shadow-clinical">
              <div className="mb-6">
                <h3 className="font-headline text-lg font-bold text-on-surface">Premium</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Comprehensive VIP coverage
                </p>
              </div>
              <div className="mb-6">
                <span className="font-headline text-4xl font-extrabold text-primary">$200</span>
                <span className="text-sm text-on-surface-variant">/year</span>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {[
                  "Everything in Advantage",
                  "International specialist consults",
                  "Medical evacuation assistance",
                  "Concierge health coordinator",
                  "Priority appointment booking",
                  "Annual executive health exam",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <Icon name="check_circle" filled size="sm" className="mt-0.5 text-secondary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup">
                <Button variant="ghost" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Medical Network ── */}
      <section className="bg-surface-container-low py-20 lg:py-28">
        <div className="mx-auto max-w-screen-2xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-secondary">
              Our Reach
            </p>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
              A Network Built for Haiti
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "location_city",
                title: "Port-au-Prince Hub",
                description:
                  "Our flagship network of 20+ partner clinics and hospitals in the capital, providing the widest range of specialist services and emergency care.",
              },
              {
                icon: "explore",
                title: "Northern District",
                description:
                  "Expanding coverage across Cap-Ha\u00EFtien, Gonaives, and surrounding communities with 15+ affiliated care centers and mobile health units.",
              },
              {
                icon: "public",
                title: "Southern Coverage",
                description:
                  "Serving Les Cayes, Jacmel, and the southern peninsula with growing partnerships ensuring no region is left behind in quality healthcare.",
              },
            ].map((region) => (
              <div
                key={region.title}
                className="rounded-3xl bg-surface-container-lowest p-8 shadow-clinical transition-all hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed">
                  <Icon name={region.icon} filled className="text-primary" />
                </div>
                <h3 className="font-headline text-lg font-bold text-on-surface">
                  {region.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                  {region.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="clinical-gradient py-20 lg:py-28">
        <div className="mx-auto max-w-screen-2xl px-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/60">
            15,000+ members trust Vita Sant&eacute; Club
          </p>
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Ready to secure your future?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Join thousands of Haitians who have chosen proactive, dignified healthcare for
            themselves and their families.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                <span className="flex items-center gap-2">
                  Become a Member
                  <Icon name="arrow_forward" size="sm" />
                </span>
              </Button>
            </Link>
            <Link href="/plans">
              <Button
                variant="ghost"
                size="lg"
                className="border-white text-white hover:bg-white/10 hover:text-white"
              >
                Compare Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
