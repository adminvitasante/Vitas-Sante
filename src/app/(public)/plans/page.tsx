import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

const plans = [
  {
    name: "Essential",
    price: 99,
    period: "year",
    tagline: "Core coverage for individuals",
    highlighted: false,
    features: [
      { text: "Primary care consultations", included: true },
      { text: "Basic lab work coverage", included: true },
      { text: "24/7 telemedicine access", included: true },
      { text: "Pharmacy network discounts", included: true },
      { text: "Specialist referral network", included: false },
      { text: "Emergency room coverage", included: false },
      { text: "Dental & vision basics", included: false },
      { text: "International specialist consults", included: false },
      { text: "Medical evacuation assistance", included: false },
      { text: "Concierge health coordinator", included: false },
    ],
  },
  {
    name: "Advantage",
    price: 135,
    period: "year",
    tagline: "Enhanced protection for families",
    highlighted: true,
    features: [
      { text: "Primary care consultations", included: true },
      { text: "Basic lab work coverage", included: true },
      { text: "24/7 telemedicine access", included: true },
      { text: "Pharmacy network discounts", included: true },
      { text: "Specialist referral network", included: true },
      { text: "Emergency room coverage", included: true },
      { text: "Dental & vision basics", included: true },
      { text: "International specialist consults", included: false },
      { text: "Medical evacuation assistance", included: false },
      { text: "Concierge health coordinator", included: false },
    ],
  },
  {
    name: "Premium",
    price: 200,
    period: "year",
    tagline: "Comprehensive VIP coverage",
    highlighted: false,
    features: [
      { text: "Primary care consultations", included: true },
      { text: "Basic lab work coverage", included: true },
      { text: "24/7 telemedicine access", included: true },
      { text: "Pharmacy network discounts", included: true },
      { text: "Specialist referral network", included: true },
      { text: "Emergency room coverage", included: true },
      { text: "Dental & vision basics", included: true },
      { text: "International specialist consults", included: true },
      { text: "Medical evacuation assistance", included: true },
      { text: "Concierge health coordinator", included: true },
    ],
  },
];

export default function PlansPage() {
  return (
    <div className="bg-surface">
      {/* ── Hero ── */}
      <section className="clinical-gradient py-24 lg:py-32">
        <div className="mx-auto max-w-screen-2xl px-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/60">
            Membership Plans
          </p>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Compare Plans &amp; Choose Yours
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Every plan gives you access to our vetted network of clinics, doctors, and pharmacies
            across Haiti. Choose the level of coverage that fits your needs.
          </p>
        </div>
      </section>

      {/* ── Plan Cards ── */}
      <section className="bg-surface-container-low py-20 lg:py-28">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl p-8 transition-all ${
                  plan.highlighted
                    ? "clinical-gradient text-white shadow-lg scale-[1.02]"
                    : "bg-surface-container-lowest shadow-clinical"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 right-6 rounded-full bg-secondary px-4 py-1 text-xs font-bold uppercase tracking-wider text-on-secondary">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className={`font-headline text-xl font-bold ${
                      plan.highlighted ? "text-white" : "text-on-surface"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${
                      plan.highlighted ? "text-white/70" : "text-on-surface-variant"
                    }`}
                  >
                    {plan.tagline}
                  </p>
                </div>

                <div className="mb-8">
                  <span
                    className={`font-headline text-5xl font-extrabold ${
                      plan.highlighted ? "text-white" : "text-primary"
                    }`}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.highlighted ? "text-white/70" : "text-on-surface-variant"
                    }`}
                  >
                    /{plan.period}
                  </span>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className={`flex items-start gap-2 text-sm ${
                        feature.included
                          ? plan.highlighted
                            ? "text-white/90"
                            : "text-on-surface-variant"
                          : plan.highlighted
                            ? "text-white/30"
                            : "text-on-surface-variant/40"
                      }`}
                    >
                      <Icon
                        name={feature.included ? "check_circle" : "cancel"}
                        filled
                        size="sm"
                        className={`mt-0.5 ${
                          feature.included
                            ? plan.highlighted
                              ? "text-secondary-fixed"
                              : "text-secondary"
                            : plan.highlighted
                              ? "text-white/20"
                              : "text-outline-variant"
                        }`}
                      />
                      {feature.text}
                    </li>
                  ))}
                </ul>

                <Link href="/auth/signup">
                  {plan.highlighted ? (
                    <Button className="w-full bg-white text-primary hover:bg-white/90">
                      Get Started
                    </Button>
                  ) : (
                    <Button variant="ghost" className="w-full">
                      Get Started
                    </Button>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ teaser */}
          <div className="mt-16 text-center">
            <p className="text-on-surface-variant">
              Have questions about which plan is right for you?{" "}
              <Link href="/about" className="font-semibold text-primary underline underline-offset-4">
                Contact our team
              </Link>{" "}
              and we will help you decide.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
