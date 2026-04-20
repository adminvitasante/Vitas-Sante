import { redirect } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { getSessionWithCapability } from "@/lib/server/authz";
import { getPlans } from "@/lib/server/queries";
import { SponsorGrantForm } from "./grant-form";

export default async function SponsorNewPage() {
  const me = await getSessionWithCapability("PAYER", "ADMIN");
  if (!me) redirect("/auth/signin");

  const plansResult = await getPlans();
  const plans = plansResult.success ? plansResult.plans ?? [] : [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-outline mb-4 text-sm">
          <span>Sponsor Portal</span>
          <Icon name="chevron_right" className="!text-base" />
          <span className="text-primary font-semibold">Financer de nouveaux bénéficiaires</span>
        </nav>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2 font-headline">
          Financer de nouveaux bénéficiaires
        </h1>
        <p className="text-on-surface-variant max-w-2xl">
          Bonjour <span className="font-semibold text-on-surface">{me.name}</span>. Choisissez un forfait, le nombre de places à financer, et réglez en une transaction. Vous assignerez ensuite les places à des bénéficiaires spécifiques depuis votre tableau de bord.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-5">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-4">
              Comment ça marche
            </h3>
            <ol className="space-y-4 text-sm text-on-surface">
              <Step
                n={1}
                title="Choisissez le forfait"
                desc="Essentiel, Avantage, Premium, ou un niveau Elite selon votre budget et la population ciblée."
              />
              <Step
                n={2}
                title="Nombre de places"
                desc="Achetez entre 1 et 1000 adhésions en une seule transaction."
              />
              <Step
                n={3}
                title="Paiement Stripe"
                desc="Carte bancaire ou virement. Facture institutionnelle disponible."
              />
              <Step
                n={4}
                title="Assignation"
                desc="Une fois le paiement confirmé, assignez les places à des bénéficiaires par email depuis Funded Members."
              />
            </ol>

            <div className="mt-6 rounded-xl bg-primary-fixed p-4 text-primary text-sm">
              <Icon name="info" className="!text-base mb-1" />
              <p>
                Les places non assignées restent disponibles dans votre compte. Aucune date d&apos;expiration avant 12 mois.
              </p>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-7">
          <SponsorGrantForm plans={plans} />
        </section>
      </div>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="flex gap-4">
      <span className="shrink-0 h-8 w-8 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center">
        {n}
      </span>
      <div>
        <p className="font-bold text-on-surface">{title}</p>
        <p className="text-on-surface-variant text-xs mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </li>
  );
}
