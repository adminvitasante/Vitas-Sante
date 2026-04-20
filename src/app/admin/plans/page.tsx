import { redirect } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { getSessionWithCapability } from "@/lib/server/authz";
import { supabase } from "@/lib/supabase";
import { PlanRowActions } from "./plan-row-actions";

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function AdminPlansPage() {
  const me = await getSessionWithCapability("ADMIN");
  if (!me) redirect("/auth/signin");

  // Show all plans including inactive ones for admin management.
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .order("yearly_price_cents", { ascending: true });

  const initials = me.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const activeCount = (plans ?? []).filter((p) => p.is_active).length;

  return (
    <div className="min-h-screen px-8 py-8">
      <TopBar
        greeting="Plan Configuration"
        subtitle="Activer, désactiver et ajuster les prix des forfaits"
        initials={initials}
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border-l-4 border-primary">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter mb-1">
            Forfaits actifs
          </p>
          <h3 className="text-3xl font-headline font-extrabold text-primary">
            {activeCount} / {plans?.length ?? 0}
          </h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border-l-4 border-secondary">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter mb-1">
            Inactifs (cachés du catalogue public)
          </p>
          <h3 className="text-3xl font-headline font-extrabold text-on-surface">
            {(plans?.length ?? 0) - activeCount}
          </h3>
        </div>
      </section>

      {plans && plans.length > 0 ? (
        <section>
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    <Th>Slug</Th>
                    <Th>Nom (FR)</Th>
                    <Th>Niveau</Th>
                    <Th>Prix/an</Th>
                    <Th>Dépendant</Th>
                    <Th>Visites/an</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {plans.map((plan: {
                    id: string;
                    slug: string;
                    name_fr: string;
                    name_en: string;
                    tier: string;
                    yearly_price_cents: number;
                    dependent_fee_cents: number;
                    visits_per_year: number;
                    is_active: boolean;
                  }) => (
                    <tr
                      key={plan.id}
                      className={`hover:bg-surface-container-low transition-colors ${
                        !plan.is_active ? "opacity-60" : ""
                      }`}
                    >
                      <td className="px-6 py-5">
                        <span className="font-mono text-xs text-on-surface-variant tracking-wider bg-surface-container-low px-2 py-1 rounded">
                          {plan.slug}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-on-surface">
                          {plan.name_fr ?? plan.name_en}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          plan.tier === "ELITE"
                            ? "bg-tertiary-fixed text-tertiary"
                            : "bg-primary-fixed text-primary"
                        }`}>
                          {plan.tier}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-primary">
                          {formatCents(plan.yearly_price_cents)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface">
                        {plan.dependent_fee_cents > 0
                          ? formatCents(plan.dependent_fee_cents)
                          : "—"}
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface text-center">
                        {plan.visits_per_year}
                      </td>
                      <td className="px-6 py-5">
                        <PlanRowActions plan={plan} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl p-12 text-center shadow-sm">
          <Icon name="playlist_remove" className="text-outline !text-4xl mb-3" />
          <p className="text-on-surface-variant font-medium">Aucun forfait configuré.</p>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest text-left">
      {children}
    </th>
  );
}
