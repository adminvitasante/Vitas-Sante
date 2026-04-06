import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { getPlans } from "@/lib/server/queries";

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function AdminPlansPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const result = await getPlans();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plans: any[] = result.success && result.plans ? result.plans : [];

  return (
    <div className="min-h-screen px-8 py-8">
      <TopBar
        greeting="Plan Configuration"
        subtitle="Manage membership tiers and coverage parameters"
        initials={session.user.name?.slice(0, 2).toUpperCase() || "AD"}
      />

      {/* Stats */}
      <section className="mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] border-l-4 border-primary inline-block">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Active Plans</p>
          <h3 className="text-3xl font-headline font-extrabold text-primary">{plans.length}</h3>
        </div>
      </section>

      {/* Plans Grid */}
      {plans.length > 0 ? (
        <section>
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Slug</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Tier</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Yearly Price</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Visits/Year</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Lab %</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Pharma %</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Imaging %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {plans.map((plan: any) => (
                    <tr key={plan.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-5">
                        <span className="font-mono text-xs text-slate-500 tracking-wider bg-surface-container-low px-2 py-1 rounded">
                          {plan.slug}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-on-surface">{plan.name_en}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-primary-fixed text-primary">
                          {plan.tier || "STANDARD"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm font-bold text-primary">
                          {formatCents(plan.yearly_price_cents || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm font-semibold text-on-surface">
                          {plan.visits_per_year ?? "Unlimited"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm text-on-surface-variant">
                          {plan.lab_coverage_pct != null ? `${plan.lab_coverage_pct}%` : "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm text-on-surface-variant">
                          {plan.pharma_coverage_pct != null ? `${plan.pharma_coverage_pct}%` : "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm text-on-surface-variant">
                          {plan.imaging_coverage_pct != null ? `${plan.imaging_coverage_pct}%` : "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl p-12 text-center shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
          <Icon name="playlist_remove" className="text-outline !text-4xl mb-3" />
          <p className="text-on-surface-variant font-medium">No active plans found.</p>
        </div>
      )}
    </div>
  );
}
