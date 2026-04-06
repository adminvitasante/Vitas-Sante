import { auth } from "@/lib/auth";
import { getPayerDashboard } from "@/lib/server/queries";
import { redirect } from "next/navigation";
import { Icon } from "@/components/ui/icon";

export default async function SponsorOverview() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const { subscriptions } = await getPayerDashboard(userId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allEnrollments = (subscriptions || []).flatMap((s: any) => s.enrollment || []);
  const totalMembers = allEnrollments.length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalInvestmentCents = allEnrollments.reduce((sum: number, e: any) => sum + (e.plans?.yearly_price_cents || 0), 0);
  const totalInvestment = (totalInvestmentCents / 100).toFixed(2);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeSubscriptions = (subscriptions || []).filter((s: any) => s.status === "ACTIVE").length;

  return (
    <>
      {/* Hero Editorial Header */}
      <header className="mb-12">
        <p className="text-secondary font-semibold tracking-widest uppercase text-xs mb-2">Institutional Dashboard</p>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight max-w-2xl">
          Elevating healthcare standards for your community.
        </h1>
      </header>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Total Investment */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(0,27,63,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon name="payments" className="text-6xl text-primary" />
          </div>
          <p className="text-sm font-medium text-on-surface-variant mb-4">Total Investment</p>
          <h2 className="text-3xl font-bold text-primary mb-1">${totalInvestment}</h2>
          <div className="flex items-center gap-1 text-secondary font-bold text-sm">
            <Icon name="account_balance_wallet" className="text-sm" />
            <span>Across all plans</span>
          </div>
        </div>
        {/* Active Beneficiaries */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(0,27,63,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon name="diversity_3" className="text-6xl text-primary" />
          </div>
          <p className="text-sm font-medium text-on-surface-variant mb-4">Funded Members</p>
          <h2 className="text-3xl font-bold text-primary mb-1">{totalMembers}</h2>
          <div className="flex items-center gap-1 text-secondary font-bold text-sm">
            <Icon name="group" className="text-sm" />
            <span>Total beneficiaries</span>
          </div>
        </div>
        {/* Active Subscriptions */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(0,27,63,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon name="verified_user" className="text-6xl text-tertiary" />
          </div>
          <p className="text-sm font-medium text-on-surface-variant mb-4">Active Subscriptions</p>
          <h2 className="text-3xl font-bold text-tertiary mb-1">{activeSubscriptions}</h2>
          <div className="flex items-center gap-1 text-tertiary font-bold text-sm">
            <Icon name="check_circle" className="text-sm" />
            <span>{activeSubscriptions > 0 ? "Coverage active" : "No active coverage"}</span>
          </div>
        </div>
      </section>

      {/* Funded Members Summary */}
      <section className="mb-12">
        <h3 className="text-2xl font-bold text-on-surface mb-6">Funded Members Summary</h3>
        {totalMembers === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-12 text-center">
            <Icon name="group_off" className="text-5xl text-outline mb-4" />
            <p className="text-on-surface-variant text-lg">No funded members yet.</p>
            <p className="text-outline text-sm mt-2">Sponsor new members to see them listed here.</p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-outline">Member</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Plan</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Status</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {allEnrollments.slice(0, 5).map((enrollment: any) => {
                    const member = enrollment.users;
                    const plan = enrollment.plans;
                    const credit = enrollment.credit_accounts?.[0] || enrollment.credit_accounts;
                    const initials = (member?.name || "?")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <tr key={enrollment.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                              {initials}
                            </div>
                            <div>
                              <p className="font-bold text-on-surface">{member?.name || "Unknown"}</p>
                              <p className="text-xs text-outline">{member?.email || ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className="px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold uppercase tracking-wider">
                            {plan?.name_en || plan?.slug || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${enrollment.status === "ACTIVE" ? "bg-tertiary" : "bg-outline"}`}></div>
                            <span className={`text-sm font-semibold ${enrollment.status === "ACTIVE" ? "text-tertiary" : "text-outline"}`}>
                              {enrollment.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-sm text-on-surface">
                          {credit ? `${credit.visits_remaining ?? 0} / ${credit.visits_total ?? 0} visits` : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalMembers > 5 && (
              <div className="px-8 py-4 bg-surface-container-low/30 border-t border-surface-container text-center">
                <p className="text-sm text-outline">
                  Showing <span className="font-bold text-on-surface">5</span> of <span className="font-bold text-on-surface">{totalMembers}</span> funded members.
                  View all in the Funded Members page.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Sponsor CTA Banner */}
      <section>
        <div className="bg-gradient-to-br from-primary to-primary-container rounded-xl p-8 text-white relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <Icon name="volunteer_activism" className="text-[160px]" />
          </div>
          <h4 className="text-2xl font-bold mb-3">Scale Your Impact</h4>
          <p className="text-sm text-primary-fixed/80 mb-6 leading-relaxed max-w-lg">
            Every sponsorship changes a life. Expand your community health coverage by sponsoring new members today.
          </p>
          <a href="/sponsor/sponsor-new" className="inline-block bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm shadow-xl hover:bg-primary-fixed transition-colors active:scale-95">
            Sponsor New Members
          </a>
        </div>
      </section>
    </>
  );
}
