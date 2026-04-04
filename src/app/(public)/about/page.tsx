import { Icon } from "@/components/ui/icon";

export default function AboutPage() {
  return (
    <div className="bg-surface">
      {/* ── Hero ── */}
      <section className="clinical-gradient py-24 lg:py-32">
        <div className="mx-auto max-w-screen-2xl px-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/60">
            Our Story
          </p>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
            A Sanctuary of Health for Haiti
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Founded with a singular conviction &mdash; that every Haitian deserves dignified,
            accessible healthcare &mdash; Vita Sant&eacute; Club bridges the gap between world-class
            medical standards and the communities that need them most.
          </p>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="bg-surface-container-lowest py-20 lg:py-28">
        <div className="mx-auto max-w-screen-2xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-secondary">
              What Drives Us
            </p>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
              Our Core Values
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "favorite",
                title: "Dignity First",
                description:
                  "Every interaction, every consultation, every service is designed around the principle that healthcare is a fundamental human right &mdash; not a luxury. We treat every member with the respect and compassion they deserve.",
              },
              {
                icon: "connect_without_contact",
                title: "Bridging Distances",
                description:
                  "Whether you are in Port-au-Prince or Paris, Brooklyn or Boston, our platform ensures you can provide care for your loved ones in Haiti with full transparency, real-time updates, and trusted medical professionals.",
              },
              {
                icon: "workspace_premium",
                title: "Clinical Excellence",
                description:
                  "We partner exclusively with accredited clinics, licensed physicians, and vetted pharmacies. Our rigorous standards mean you can trust that every provider in our network meets international quality benchmarks.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="rounded-3xl bg-surface-container-low p-8 shadow-clinical transition-all hover:shadow-lg"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed">
                  <Icon name={value.icon} filled className="text-primary" size="lg" />
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface">{value.title}</h3>
                <p className="mt-3 leading-relaxed text-on-surface-variant">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-surface-container-low py-20 lg:py-28">
        <div className="mx-auto max-w-screen-2xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
              Impact in Numbers
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-on-surface-variant">
              Our growing community is proof that quality healthcare in Haiti is not just a dream
              &mdash; it is a movement.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "15,000+", label: "Members", icon: "group" },
              { value: "50+", label: "Clinics", icon: "local_hospital" },
              { value: "98%", label: "Satisfaction", icon: "thumb_up" },
              { value: "4", label: "Regions", icon: "map" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-3xl bg-surface-container-lowest p-8 text-center shadow-clinical"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-fixed">
                  <Icon name={stat.icon} filled className="text-primary" size="lg" />
                </div>
                <p className="font-headline text-4xl font-extrabold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-on-surface-variant">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story Section ── */}
      <section className="bg-surface-container-lowest py-20 lg:py-28">
        <div className="mx-auto max-w-screen-lg px-6">
          <div className="text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-secondary">
              The Beginning
            </p>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
              Born from Necessity, Built with Purpose
            </h2>
            <div className="mx-auto mt-8 max-w-3xl space-y-6 text-left text-on-surface-variant leading-relaxed">
              <p>
                Vita Sant&eacute; Club was born from a deeply personal experience shared by millions
                of Haitians living abroad: the helplessness of knowing a loved one needs medical
                care back home but having no reliable way to ensure they receive it.
              </p>
              <p>
                Our founders, members of the Haitian diaspora themselves, experienced firsthand the
                frustration of sending money for medical emergencies with no guarantee it would reach
                the right hands or the right hospitals. They envisioned a system where trust is built
                into every transaction, where quality is verified at every step, and where distance
                would never again mean powerlessness.
              </p>
              <p>
                Today, Vita Sant&eacute; Club stands as Haiti&rsquo;s most trusted health membership
                platform &mdash; a bridge between the diaspora&rsquo;s resources and the
                homeland&rsquo;s needs, powered by technology and grounded in the values of the
                Haitian people.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
