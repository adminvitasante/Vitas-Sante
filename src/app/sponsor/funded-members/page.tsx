import { auth } from "@/lib/auth";
import { getPayerDashboard } from "@/lib/server/queries";
import { redirect } from "next/navigation";
import { Icon } from "@/components/ui/icon";

export default async function FundedMembersPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const { subscriptions } = await getPayerDashboard(userId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allEnrollments = (subscriptions || []).flatMap((s: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s.enrollment || []).map((e: any) => ({
      ...e,
      subscriptionStatus: s.status,
      periodStart: s.current_period_start,
      periodEnd: s.current_period_end,
    }))
  );

  return (
    <>
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-secondary font-semibold text-sm tracking-widest uppercase mb-2 block">Institutional Management</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">Funded Members Directory</h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Review and manage your institution&apos;s active healthcare sponsorships. Monitor coverage status and credit balances for your supported community.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/sponsor/sponsor-new" className="px-6 py-3 bg-primary text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-container transition-all">
            <Icon name="person_add" /> Sponsor New Member
          </a>
        </div>
      </header>

      {/* Members Table */}
      {allEnrollments.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-16 text-center">
          <Icon name="group_off" className="text-6xl text-outline mb-4" />
          <h3 className="text-xl font-bold text-on-surface mb-2">No Funded Members Yet</h3>
          <p className="text-on-surface-variant max-w-md mx-auto">
            You haven&apos;t sponsored any members yet. Get started by sponsoring your first member.
          </p>
          <a href="/sponsor/sponsor-new" className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-container transition-all">
            Sponsor a Member
          </a>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-outline">Member Name</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Email</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Plan</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Credits</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Coverage Period</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {allEnrollments.map((enrollment: any) => {
                  const member = enrollment.users;
                  const plan = enrollment.plans;
                  const credit = enrollment.credit_accounts?.[0] || enrollment.credit_accounts;
                  const initials = (member?.name || "?")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  const periodStart = enrollment.periodStart
                    ? new Date(enrollment.periodStart).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : "N/A";
                  const periodEnd = enrollment.periodEnd
                    ? new Date(enrollment.periodEnd).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : "N/A";

                  const isActive = enrollment.status === "ACTIVE";

                  return (
                    <tr key={enrollment.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface text-lg">{member?.name || "Unknown"}</p>
                            <p className="text-xs text-outline font-medium tracking-tight">{member?.phone || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm text-on-surface-variant">{member?.email || "N/A"}</td>
                      <td className="px-6 py-6">
                        <span className="px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold uppercase tracking-wider">
                          {plan?.name_en || plan?.slug || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        {credit ? (
                          <div>
                            <p className="text-sm font-bold text-on-surface">
                              {credit.visits_remaining ?? 0} / {credit.visits_total ?? 0}
                            </p>
                            <p className="text-[11px] text-outline">visits remaining</p>
                          </div>
                        ) : (
                          <span className="text-sm text-outline">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm font-medium text-on-surface">{periodStart} &mdash; {periodEnd}</p>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isActive ? "bg-tertiary" : "bg-outline"}`}></div>
                          <span className={`text-sm font-semibold ${isActive ? "text-tertiary" : "text-outline"}`}>
                            {enrollment.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-6 bg-surface-container-low/30 border-t border-surface-container flex items-center justify-between">
            <p className="text-sm text-outline">
              Showing <span className="font-bold text-on-surface">{allEnrollments.length}</span> funded member{allEnrollments.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      {/* Impact Summary */}
      {allEnrollments.length > 0 && (
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container p-8 rounded-2xl text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Impact Summary</h3>
              <p className="text-on-primary-container/80 max-w-sm">
                Your institution is currently supporting {allEnrollments.length} {allEnrollments.length === 1 ? "life" : "lives"} with sponsored healthcare coverage.
              </p>
            </div>
            <div className="flex items-end gap-12 mt-8 relative z-10">
              <div>
                <p className="text-4xl font-extrabold tracking-tighter">{allEnrollments.length}</p>
                <p className="text-xs uppercase tracking-widest text-on-primary-container">Total Members</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold tracking-tighter">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {allEnrollments.filter((e: any) => e.status === "ACTIVE").length}
                </p>
                <p className="text-xs uppercase tracking-widest text-on-primary-container">Active</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-2xl flex flex-col justify-center border border-surface-container group hover:shadow-xl hover:shadow-primary/5 transition-all">
            <Icon name="clinical_notes" className="text-4xl text-secondary mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Quick Reports</h3>
            <p className="text-on-surface-variant text-sm mb-6">View impact reports for your sponsored group.</p>
            <a href="/sponsor/impact-reports" className="mt-auto py-3 text-secondary font-bold border-b-2 border-secondary/20 hover:border-secondary transition-all text-left flex items-center gap-2">
              View Reports <Icon name="arrow_forward" className="text-sm" />
            </a>
          </div>
        </section>
      )}
    </>
  );
}
