import { Icon } from "@/components/ui/icon";
import Link from "next/link";

const corePlans = [
  {
    name: "Essential / Esansyèl",
    price: "$99",
    depFee: "$55/year",
    features: ["6 Visits/Televisits", "15% Labs & Pharmacy", "$1-$10 per visit"],
    highlighted: false,
  },
  {
    name: "Advantage / Avantaj",
    price: "$135",
    depFee: "$55/year",
    features: ["8 Visits/Televisits", "20% Labs & Pharmacy", "$1-$10 per visit"],
    highlighted: false,
  },
  {
    name: "Premium / Premyòm",
    price: "$200",
    depFee: "$55/year",
    features: ["12 Visits/Televisits", "35% Labs & Pharmacy", "$1-$10 per visit"],
    highlighted: true,
  },
];

const elitePlans = [
  {
    name: "Elite / Elit",
    price: "$365",
    depFee: "$95/year",
    features: ["24 Visits ($1-$10)", "70% Labs/Pharmacy", "70% Surgery/Hosp."],
    style: "bg-primary text-white",
    btnStyle: "bg-white text-primary hover:bg-surface-container-low",
  },
  {
    name: "Elite Plus / Plis",
    price: "$700",
    depFee: "$120/year",
    features: ["50 Visits ($1-$10)", "85% Labs/Pharmacy", "85% Surgery/Hosp.", "At-home Svcs avail."],
    style: "bg-surface-container-lowest border border-primary/20",
    btnStyle: "border border-primary text-primary hover:bg-primary/5",
  },
  {
    name: "Elite Silver / Ajan",
    price: "$1500",
    depFee: "$120/year",
    features: ["99 Visits ($1-$10)", "95% Labs/Pharmacy", "At-home Svcs avail."],
    style: "bg-surface-container-lowest border border-primary/20",
    btnStyle: "border border-primary text-primary hover:bg-primary/5",
  },
  {
    name: "Elite Gold / Lò",
    price: "$3000",
    depFee: "",
    subtitle: "Silver Benefits in Haiti",
    features: ["Access to US Network", "25% Labs US / 10% Surg.", "99 Visits ($50/visit)"],
    style: "bg-surface-container-lowest border-2 border-amber-400",
    btnStyle: "bg-amber-400 text-amber-950 hover:bg-amber-500",
    nameClass: "text-amber-600",
  },
  {
    name: "Elite Platinum",
    price: "$5000",
    depFee: "",
    subtitle: "Premium US Coverage",
    features: ["45% Labs US / 30% Surg.", "99 Visits ($50/visit)", "At-home Services Included"],
    style: "bg-slate-800 text-white border-2 border-slate-300",
    btnStyle: "bg-slate-100 text-slate-900 hover:bg-white",
    nameClass: "text-slate-200",
  },
];

const comparisonRows = [
  { feature: "Yearly Dues", values: ["$99", "$135", "$200", "$365", "$700", "$1500", "$3000", "$5000"] },
  { feature: "Visits/Televisits", values: ["6", "8", "12", "24", "50", "99", "99", "99"] },
  { feature: "Visit Co-pay", values: ["$1-$10", "$1-$10", "$1-$10", "$1-$10", "$1-$10", "$1-$10", "$50", "$50"] },
  { feature: "Labs Coverage", values: ["15%", "20%", "35%", "70%", "85%", "95%", "25% (US)", "45% (US)"] },
  { feature: "Surgery/Hosp.", values: ["—", "—", "—", "70%", "85%", "95%", "10% (US)", "30% (US)"] },
  { feature: "At-home Svcs", values: ["—", "—", "—", "—", "Avail.*", "Avail.*", "Avail.*", "Included*"] },
  { feature: "Dependent Fee", values: ["$55/yr", "$55/yr", "$55/yr", "$95/yr", "$120/yr", "$120/yr", "—", "—"] },
];

const columnHeaders = ["Essential", "Advantage", "Premium", "Elite", "Elite Plus", "Elite Silver", "Elite Gold", "Platinum"];

export default function PlansPage() {
  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      <header className="relative px-6 py-16 md:py-24 max-w-screen-2xl mx-auto overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block py-1 px-3 mb-6 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase">
            Premium Health Coverage
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold font-headline text-primary mb-6 leading-tight tracking-tighter">
            Our Insurance Plans
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed mb-8">
            Discover a digital sanctuary for your health. Select the tier that matches your lifestyle and secure your medical future with Haiti&apos;s leading medical network.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full -z-0 opacity-20 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-bl from-primary-container to-transparent rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
        </div>
      </header>

      {/* Plans Grid */}
      <section className="px-6 max-w-screen-2xl mx-auto mb-32">
        {/* Core Tiers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-headline text-primary mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-primary/30" />
            Core Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {corePlans.map((plan) => (
              <div
                key={plan.name}
                className={`group bg-surface-container-lowest rounded-xl p-8 flex flex-col transition-all duration-300 hover:shadow-2xl border border-surface-variant ${plan.highlighted ? "relative" : ""}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 right-6 bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Recommended
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-bold font-headline text-on-surface mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-primary">{plan.price}</span>
                    <span className="text-on-surface-variant text-sm">/year (USD)</span>
                  </div>
                  <div className="mt-2 text-xs text-secondary font-bold">Dep: {plan.depFee}</div>
                </div>
                <ul className="space-y-4 mb-12 flex-grow">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Icon name="check_circle" size="sm" filled className="text-secondary" />
                      <span className="text-sm text-on-surface-variant">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup">
                  <button className="w-full py-4 text-sm font-bold font-headline border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors">
                    S&apos;inscrire
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Elite Tiers */}
        <div>
          <h2 className="text-2xl font-bold font-headline text-primary mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-primary/30" />
            Elite Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {elitePlans.map((plan) => (
              <div key={plan.name} className={`rounded-xl p-6 flex flex-col ${plan.style}`}>
                <div className="mb-6">
                  <h4 className={`text-lg font-bold font-headline mb-1 ${plan.nameClass || ""}`}>
                    {plan.name}
                  </h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold">{plan.price}</span>
                    <span className="opacity-70 text-xs">/yr</span>
                  </div>
                  {plan.depFee && (
                    <div className="mt-2 text-[10px] text-secondary font-bold">Dep: {plan.depFee}</div>
                  )}
                  {plan.subtitle && (
                    <div className={`mt-2 text-[10px] font-bold uppercase ${plan.nameClass === "text-amber-600" ? "text-amber-600" : "text-slate-400"}`}>
                      {plan.subtitle}
                    </div>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-grow text-xs">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Icon name="done" size="sm" className="text-secondary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 text-xs font-bold font-headline rounded-lg transition-colors ${plan.btnStyle}`}>
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="px-6 max-w-screen-2xl mx-auto mb-32">
        <h2 className="text-3xl font-bold font-headline text-primary mb-12">Detailed Plan Comparison</h2>
        <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-variant overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1200px]">
              <thead>
                <tr className="border-b border-surface-container-high">
                  <th className="py-6 pr-4 font-headline font-bold text-on-surface-variant text-sm uppercase tracking-widest sticky left-0 bg-surface-container-lowest z-10 w-48">
                    Feature
                  </th>
                  {columnHeaders.map((h) => (
                    <th
                      key={h}
                      className={`py-6 text-center font-headline font-bold px-4 ${
                        h === "Elite" ? "text-white bg-primary rounded-t-lg" :
                        h === "Elite Gold" ? "text-amber-600" :
                        h === "Platinum" ? "text-slate-700" :
                        "text-primary"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/50 text-sm">
                {comparisonRows.map((row) => (
                  <tr key={row.feature}>
                    <td className="py-6 font-medium text-on-surface sticky left-0 bg-surface-container-lowest z-10">
                      {row.feature}
                    </td>
                    {row.values.map((val, i) => (
                      <td
                        key={i}
                        className={`py-6 text-center ${
                          i === 3 ? "font-bold bg-primary/5" :
                          i === 6 ? "text-amber-600" :
                          i === 7 ? "text-slate-700" :
                          ""
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-on-surface-variant italic">
            <p>* At-home services are subject to an extra fee and location availability. Platinum members receive priority scheduling.</p>
            <p>† Gold and Platinum tiers include all Silver tier benefits within our Haiti network plus the indicated US coverage.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 max-w-4xl mx-auto mb-32">
        <h2 className="text-3xl font-bold font-headline text-center text-primary mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group bg-surface-container-low rounded-xl overflow-hidden" open>
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
              <h4 className="font-bold text-on-surface font-headline">Comment puis-je payer mes cotisations annuelles ?</h4>
              <Icon name="expand_more" className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="p-6 pt-0 text-on-surface-variant text-sm leading-relaxed border-t border-surface-container-high/30">
              All plans are billed annually. You can pay via the Member Portal using international credit cards (Visa/Mastercard), local bank transfers, or mobile payment solutions. Annual billing ensures no interruption in your healthcare access.
            </div>
          </details>
          <details className="group bg-surface-container-low rounded-xl overflow-hidden">
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
              <h4 className="font-bold text-on-surface font-headline">What is the &quot;US Network&quot; access for Gold/Platinum?</h4>
              <Icon name="expand_more" className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="p-6 pt-0 text-on-surface-variant text-sm leading-relaxed border-t border-surface-container-high/30">
              Members in these elite tiers gain access to our partner clinics and specialists in South Florida and select US cities. This includes partial reimbursement for lab work and major surgical procedures performed within our specified US provider network.
            </div>
          </details>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 max-w-screen-2xl mx-auto mb-20">
        <div className="relative rounded-3xl overflow-hidden bg-primary p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold font-headline text-white mb-6">
              Need expert advice for your selection?
            </h2>
            <p className="text-primary-fixed-dim text-lg">
              Speak with our healthcare advisors for a tailored recommendation based on your medical history.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4">
            <button className="bg-secondary text-white px-8 py-4 rounded-xl font-bold font-headline shadow-lg hover:bg-on-secondary-container transition-colors">
              Request a Callback
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold font-headline hover:bg-white/20 transition-colors">
              View Network Map
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
