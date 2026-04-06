import { auth } from "@/lib/auth";
import { getPayerDashboard } from "@/lib/server/queries";
import { redirect } from "next/navigation";
import { Icon } from "@/components/ui/icon";

export default async function ImpactReportsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const { subscriptions } = await getPayerDashboard(userId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allEnrollments = (subscriptions || []).flatMap((s: any) => s.enrollment || []);
  const totalMembers = allEnrollments.length;

  // Gather unique plans
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const planNames = new Set(allEnrollments.map((e: any) => e.plans?.name_en || e.plans?.slug).filter(Boolean));
  const totalPlansDistributed = planNames.size;

  // Total credits provided (sum of visits_total from credit_accounts)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalCreditsProvided = allEnrollments.reduce((sum: number, e: any) => {
    const credit = e.credit_accounts?.[0] || e.credit_accounts;
    return sum + (credit?.visits_total || 0);
  }, 0);

  // Total credits remaining
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalCreditsRemaining = allEnrollments.reduce((sum: number, e: any) => {
    const credit = e.credit_accounts?.[0] || e.credit_accounts;
    return sum + (credit?.visits_remaining || 0);
  }, 0);

  const creditsUsed = totalCreditsProvided - totalCreditsRemaining;
  const utilizationRate = totalCreditsProvided > 0 ? Math.round((creditsUsed / totalCreditsProvided) * 100) : 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalInvestmentCents = allEnrollments.reduce((sum: number, e: any) => sum + (e.plans?.yearly_price_cents || 0), 0);
  const totalInvestment = (totalInvestmentCents / 100).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Impact Reports &amp; Outcomes</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg">
            Overview of your sponsorship impact, credit utilization, and community health contributions.
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/5 rounded-lg text-primary">
              <Icon name="group_add" filled />
            </div>
          </div>
          <h4 className="text-outline font-medium text-sm mb-1">Members Funded</h4>
          <p className="text-4xl font-extrabold text-on-surface">{totalMembers}</p>
          <div className="absolute bottom-0 left-0 h-1 bg-primary w-1/3 group-hover:w-full transition-all duration-500"></div>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary/5 rounded-lg text-secondary">
              <Icon name="category" filled />
            </div>
          </div>
          <h4 className="text-outline font-medium text-sm mb-1">Plans Distributed</h4>
          <p className="text-4xl font-extrabold text-on-surface">{totalPlansDistributed}</p>
          <div className="absolute bottom-0 left-0 h-1 bg-secondary w-1/2 group-hover:w-full transition-all duration-500"></div>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-tertiary/5 rounded-lg text-tertiary">
              <Icon name="health_and_safety" filled />
            </div>
          </div>
          <h4 className="text-outline font-medium text-sm mb-1">Total Credits Provided</h4>
          <p className="text-4xl font-extrabold text-on-surface">{totalCreditsProvided}</p>
          <p className="text-xs text-outline mt-1">visits across all members</p>
          <div className="absolute bottom-0 left-0 h-1 bg-tertiary w-2/3 group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>

      {/* Utilization & Investment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Credit Utilization */}
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10">
          <h3 className="text-xl font-bold mb-6">Credit Utilization</h3>
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12" />
              <circle
                className="text-secondary"
                cx="96"
                cy="96"
                fill="transparent"
                r="88"
                stroke="currentColor"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - utilizationRate / 100)}`}
                strokeWidth="12"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-on-surface">{utilizationRate}%</span>
              <span className="text-xs font-bold text-outline uppercase tracking-widest">Utilized</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Credits Used</span>
              <span className="font-bold">{creditsUsed} visits</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full">
              <div className="bg-secondary h-full rounded-full" style={{ width: `${utilizationRate}%` }}></div>
            </div>
            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-on-surface-variant">Credits Remaining</span>
              <span className="font-bold">{totalCreditsRemaining} visits</span>
            </div>
          </div>
        </div>

        {/* Investment Summary */}
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10">
          <h3 className="text-xl font-bold mb-6">Investment Summary</h3>
          <div className="space-y-8">
            <div>
              <p className="text-sm text-outline uppercase tracking-widest mb-2">Total Investment</p>
              <p className="text-4xl font-extrabold text-primary">${totalInvestment}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-4 rounded-lg">
                <span className="text-xs font-bold text-outline uppercase block mb-1">Members</span>
                <span className="text-xl font-bold">{totalMembers}</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-lg">
                <span className="text-xs font-bold text-outline uppercase block mb-1">Plan Types</span>
                <span className="text-xl font-bold">{totalPlansDistributed}</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-lg">
                <span className="text-xs font-bold text-outline uppercase block mb-1">Total Credits</span>
                <span className="text-xl font-bold">{totalCreditsProvided}</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-lg">
                <span className="text-xs font-bold text-outline uppercase block mb-1">Utilization</span>
                <span className="text-xl font-bold">{utilizationRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Breakdown */}
      {totalMembers > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-on-surface">Plan Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from(planNames).map((planName) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const planEnrollments = allEnrollments.filter((e: any) => (e.plans?.name_en || e.plans?.slug) === planName);
              const count = planEnrollments.length;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const planCredits = planEnrollments.reduce((sum: number, e: any) => {
                const credit = e.credit_accounts?.[0] || e.credit_accounts;
                return sum + (credit?.visits_total || 0);
              }, 0);

              return (
                <div key={planName as string} className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary-fixed rounded-lg flex items-center justify-center text-primary">
                      <Icon name="shield" />
                    </div>
                    <h3 className="font-bold text-on-surface">{planName as string}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-outline">Members</span>
                      <span className="text-sm font-bold text-on-surface">{count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-outline">Total Credits</span>
                      <span className="text-sm font-bold text-on-surface">{planCredits} visits</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {totalMembers === 0 && (
        <div className="bg-surface-container-lowest rounded-2xl p-16 text-center">
          <Icon name="analytics" className="text-6xl text-outline mb-4" />
          <h3 className="text-xl font-bold text-on-surface mb-2">No Data Yet</h3>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Impact reports will appear once you have sponsored members with active enrollments.
          </p>
        </div>
      )}

      <div className="h-24"></div>
    </div>
  );
}
