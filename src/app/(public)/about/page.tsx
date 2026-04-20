import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[870px] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Senior Haitian Male Doctor"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTuC7Izm57Khty4DNEhTRclqdrugglcoZ6AMOtZu1UXpWcQahaF8St_6dck0M2eodCIEWIeTg2fOcv9e_BhMsar_Upu4deSQ-MxDl_GWGJDmVwLIkXewd6Pu-QGKf0chQi3n_szh8Zz3pMVIi3sB5U1cOPFzO6SJP3UaKtVO9XTEcaJs9UJQJmEZMvkttV3XZ-505gjpEQOneSDk7ewMacAZ85hXE1S5DIi0IfzueN63kRcabMVOiPZ0VIeBZgEzr3C2t_sG1hmj7I"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent"></div>
        </div>
        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-2xl">
            <span className="text-on-primary-container bg-primary-container/30 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block">
              The Clinical Atelier
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-8 tracking-tighter">
              The Most Comprehensive Concierge Medicine Available.
            </h1>
            <div className="flex gap-4">
              <Link
                href="/auth/signup"
                className="bg-secondary text-on-secondary px-8 py-4 rounded-xl font-bold tracking-wide hover:brightness-110 transition-all"
              >
                Rejoindre le Club
              </Link>
              <Link
                href="/plans"
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold tracking-wide hover:bg-white/20 transition-all"
              >
                Notre réseau
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Conviction (Asymmetric Layout) */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-display-md text-4xl md:text-5xl font-extrabold text-primary mb-10 leading-tight">
                Our Conviction
              </h2>
              <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed font-light">
                <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                  Our conviction resides in improving the quality of life of the members of our
                  community. Vita Sante Club addresses the most important challenge in the
                  healthcare ecosystem: the high price of healthcare services.
                </p>
                <p>
                  The Club proposes an improved experience in the delivery of health services for
                  its members, residents of the United States or visitors, with the possibility of
                  out of pocket payment that leads to constant and consistent access to the health
                  system.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Medical Consultation"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1wb81MjvgQqUewbs1EmOPQp0gzywq4a7wrIyFqN8gU-eDzgeiB9NO1DCzTh1hhYmkR1qXGtYo71qCYJUAP_ri170hbtCcq_RvXsICaglwjkIwSWQHJXzUM3i3_P9KI4wFMYiY1aN6_Y7QqsV2Poj4_ANT7MVplVj2q-jL2QXk8bhbS9UOB3tAJLzrspELKp5UjLqWrpbkuz307rPzbpFqZnUL06OjOXVcz5s_O2oBHTjNBnEJfkFveBAYUm2YwTv9m7frVN8WFmxR"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-tertiary text-on-tertiary p-8 rounded-xl max-w-xs hidden md:block shadow-xl">
                <p className="font-manrope font-bold text-2xl italic">
                  &quot;Precision care, Haitian soul.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach (Bento Grid) */}
      <section className="py-24 bg-surface-container-low">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="max-w-xl">
              <h2 className="text-4xl font-extrabold text-primary mb-4">Our Approach</h2>
              <p className="text-on-surface-variant">
                We redefine the medical journey through a meticulous blend of tradition and
                innovation.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="md:col-span-2 bg-surface-container-lowest p-10 rounded-xl flex flex-col justify-between group hover:bg-primary transition-all duration-500">
              <Icon
                name="shield_with_heart"
                filled
                className="text-4xl text-secondary group-hover:text-on-primary-container"
              />
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-primary group-hover:text-white mb-4">
                  Dignity
                </h3>
                <p className="text-on-surface-variant group-hover:text-primary-fixed">
                  Every interaction is rooted in absolute respect for the individual and their
                  cultural heritage.
                </p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-surface-container-lowest p-10 rounded-xl group hover:bg-secondary transition-all duration-500">
              <Icon
                name="volunteer_activism"
                className="text-4xl text-secondary group-hover:text-on-secondary"
              />
              <h3 className="text-xl font-bold text-primary group-hover:text-white mt-8 mb-4">
                Compassion
              </h3>
              <p className="text-on-surface-variant group-hover:text-secondary-fixed text-sm">
                Human connection is the first step toward true healing.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-surface-container-lowest p-10 rounded-xl group hover:bg-tertiary transition-all duration-500">
              <Icon
                name="biotech"
                className="text-4xl text-secondary group-hover:text-on-tertiary"
              />
              <h3 className="text-xl font-bold text-primary group-hover:text-white mt-8 mb-4">
                Technology
              </h3>
              <p className="text-on-surface-variant group-hover:text-tertiary-fixed text-sm">
                State-of-the-art diagnostic tools integrated seamlessly into care.
              </p>
            </div>
            {/* Card 4 (Full width on small, last spot on large) */}
            <div className="md:col-span-4 bg-primary-container p-12 rounded-xl flex items-center justify-between">
              <div className="max-w-md">
                <h3 className="text-3xl font-bold text-on-primary-fixed mb-4">Direct Access</h3>
                <p className="text-on-primary-fixed-variant text-lg">
                  Remove the barriers between you and your physician. Real-time availability,
                  redefined.
                </p>
              </div>
              <Icon
                name="key"
                className="text-7xl text-primary opacity-20 hidden lg:block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Member Experience */}
      <section className="py-32 bg-surface">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Modern Hospital Hallway"
                  className="rounded-xl shadow-2xl w-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHyUmdJ5NbxRfgukBZLJLT8lJeMWVP4itlZkvhOKuwkc_s6BanHOw92K6KDDvMIf1mraiNy2zGbMNy8f9P5bQ_EsPkFVwvwBtkhW36LM_lXT8JEP7uafk5dLEdFhdMLUroyovAyRk_UPWW7KNXa3uIcGnkbC3DC3aeCnhjSFDCDVpjdH90wFVAg3zHGaH-gj1esVfWScH1ncv8KkqvgAPmN3Mds-7ETcUlo9DcV3HXsv9GlR21WCrZ9G68cYA51IJKNkkCddQBiuA5"
                />
                <div className="absolute top-12 -right-12 bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 hidden xl:block">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Live Vitals
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-primary">Priority Care</div>
                  <div className="text-sm text-secondary font-medium">99.8% Response Rate</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-8">
                The Member Experience
              </h2>
              <p className="text-xl text-on-surface-variant font-light mb-10 leading-relaxed">
                We have dismantled the traditional waiting room experience. At Vita Sant&eacute;
                Club, the doctor-patient relationship is a sacred partnership supported by precision
                and empathy.
              </p>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary-container flex items-center justify-center rounded-full">
                    <Icon name="health_and_safety" className="text-on-secondary-container" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-primary mb-2">Universal Commitment</h4>
                    <p className="text-on-surface-variant">
                      Our firm commitment is that{" "}
                      <span className="text-primary font-bold">
                        no one is left without medical care
                      </span>
                      . We provide the safety net our community deserves.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-fixed flex items-center justify-center rounded-full">
                    <Icon
                      name="support_agent"
                      className="text-on-primary-fixed-variant"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-primary mb-2">
                      24/7 Concierge Support
                    </h4>
                    <p className="text-on-surface-variant">
                      Direct access to your medical team, ensuring questions are answered and care
                      is delivered when it matters most.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto bg-primary rounded-[2rem] p-12 md:p-20 relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 relative z-10">
            Ready for a new standard of care?
          </h2>
          <p className="text-primary-fixed text-lg md:text-xl mb-12 max-w-2xl mx-auto relative z-10">
            Join a community where your health is the highest priority. Experience Vita
            Sant&eacute; Club today.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6 relative z-10">
            <Link
              href="/auth/signup"
              className="bg-white text-primary px-10 py-5 rounded-xl font-bold text-lg hover:bg-primary-fixed transition-colors"
            >
              Devenir membre
            </Link>
            <a
              href="mailto:support@vitasante.ht?subject=Prendre%20rendez-vous"
              className="bg-primary-container text-white border border-white/20 px-10 py-5 rounded-xl font-bold text-lg hover:bg-primary/50 transition-colors"
            >
              Prendre rendez-vous
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
