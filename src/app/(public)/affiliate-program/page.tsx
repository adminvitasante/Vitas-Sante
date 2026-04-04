import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

const steps = [
  {
    step: 1,
    icon: "person_add",
    title: "Sign Up as an Affiliate",
    description:
      "Create your free affiliate account in minutes. No upfront costs, no inventory, no risk. You get a unique referral link and a personalized dashboard to track your performance.",
  },
  {
    step: 2,
    icon: "share",
    title: "Share with Your Network",
    description:
      "Spread the word about Vita Sant\u00e9 Club with your community, friends, family, and social media followers. Use your unique referral link, and we provide marketing materials to help you succeed.",
  },
  {
    step: 3,
    icon: "payments",
    title: "Earn Commissions",
    description:
      "For every new member who enrolls through your link, you earn a generous commission. Payments are processed monthly, and there is no cap on how much you can earn. Top affiliates earn $500+ per month.",
  },
];

const benefits = [
  {
    icon: "trending_up",
    title: "Recurring Revenue",
    description:
      "Earn commissions not just on the first enrollment, but on every annual renewal. Build a sustainable income stream that grows over time.",
  },
  {
    icon: "dashboard",
    title: "Real-Time Dashboard",
    description:
      "Track clicks, sign-ups, and earnings in real time with your dedicated affiliate portal. Full transparency on every referral.",
  },
  {
    icon: "support_agent",
    title: "Dedicated Support",
    description:
      "Our affiliate success team is here to help you maximize your earnings with personalized strategies, assets, and support.",
  },
  {
    icon: "campaign",
    title: "Marketing Materials",
    description:
      "Access professionally designed banners, social media posts, email templates, and landing pages to boost your conversion rates.",
  },
];

export default function AffiliateProgramPage() {
  return (
    <div className="bg-surface">
      {/* ── Hero ── */}
      <section className="clinical-gradient py-24 lg:py-32">
        <div className="mx-auto max-w-screen-2xl px-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/60">
            Affiliate Program
          </p>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
            Earn While Empowering Health
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Join our affiliate network and earn generous commissions by referring members to Vita
            Sant&eacute; Club. Help your community access quality healthcare while building a
            sustainable income.
          </p>
          <div className="mt-10">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                <span className="flex items-center gap-2">
                  Apply Now
                  <Icon name="arrow_forward" size="sm" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-surface-container-lowest py-20 lg:py-28">
        <div className="mx-auto max-w-screen-2xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-secondary">
              Simple Process
            </p>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-on-surface-variant">
              Three simple steps to start earning with Vita Sant&eacute; Club.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="relative rounded-3xl bg-surface-container-low p-8 shadow-clinical transition-all hover:shadow-lg"
              >
                <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-headline text-sm font-bold text-on-primary">
                  {item.step}
                </div>
                <div className="mb-6 mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed">
                  <Icon name={item.icon} filled className="text-primary" size="lg" />
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-on-surface-variant">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="bg-surface-container-low py-20 lg:py-28">
        <div className="mx-auto max-w-screen-2xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-secondary">
              Why Join Us
            </p>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
              Affiliate Benefits
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-3xl bg-surface-container-lowest p-6 shadow-clinical transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-fixed">
                  <Icon name={benefit.icon} filled className="text-secondary" />
                </div>
                <h3 className="font-headline text-lg font-bold text-on-surface">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="clinical-gradient py-20 lg:py-28">
        <div className="mx-auto max-w-screen-lg px-6 text-center">
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Ready to Start Earning?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Join hundreds of affiliates who are already making a difference in Haitian healthcare
            while earning sustainable income.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Become an Affiliate
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="ghost"
                size="lg"
                className="border-white text-white hover:bg-white/10 hover:text-white"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
