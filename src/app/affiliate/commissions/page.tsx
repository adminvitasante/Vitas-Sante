import { auth } from "@/lib/auth";
import { getAffiliateDashboard } from "@/lib/server/queries";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { redirect } from "next/navigation";

export default async function CommissionsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const { affiliate, referrals } = await getAffiliateDashboard(userId);

  const initials = session.user.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AF";

  if (!affiliate) {
    return (
      <>
        <TopBar greeting="Affiliate" subtitle="Commissions" initials="--" />
        <div className="flex flex-col items-center justify-center py-32">
          <Icon name="person_off" className="!text-6xl text-outline mb-4" />
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">No Affiliate Account</h2>
          <p className="text-on-surface-variant max-w-md text-center">You do not have an affiliate account yet. Please contact support or apply to become a partner.</p>
        </div>
      </>
    );
  }

  const totalEarned = (affiliate.total_earned_cents / 100).toFixed(2);
  const pendingAmount = (affiliate.pending_cents / 100).toFixed(2);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commissionReferrals = referrals?.filter((r: any) => r.commission_cents > 0) ?? [];
  const paidReferrals = commissionReferrals.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r: any) => r.paid_at != null
  );
  const unpaidReferrals = commissionReferrals.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r: any) => r.paid_at == null
  );

  return (
    <>
      <TopBar
        greeting={session.user.name ?? "Partner"}
        subtitle="Commissions & Payments"
        initials={initials}
      />

      {/* Editorial Header */}
      <div className="mb-12 max-w-4xl">
        <span className="text-secondary font-bold tracking-widest text-[10px] uppercase mb-2 block">Partner Earnings</span>
        <h1 className="text-4xl lg:text-5xl font-headline font-extrabold text-on-surface leading-tight tracking-tighter">Commissions &amp; Payments</h1>
        <p className="text-on-surface-variant mt-4 text-lg max-w-2xl leading-relaxed">Track your earnings, pending commissions, and payment history across your entire referral network.</p>
      </div>

      {/* Bento Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Total Earned */}
        <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col justify-between min-h-[180px] shadow-[0_20px_40px_rgba(0,27,63,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon name="account_balance_wallet" className="!text-6xl" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Earned</div>
            <div className="text-3xl font-headline font-extrabold text-primary">${totalEarned}</div>
          </div>
          <div className="text-[11px] font-medium text-on-surface-variant mt-4">
            Lifetime earnings across {commissionReferrals.length} referral{commissionReferrals.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Pending */}
        <div className="bg-surface-container-low rounded-xl p-8 flex flex-col justify-between min-h-[180px] relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Commissions</div>
            <div className="text-3xl font-headline font-extrabold text-on-surface">${pendingAmount}</div>
          </div>
          <div className="text-[11px] font-medium text-on-surface-variant mt-4">
            {unpaidReferrals.length} commission{unpaidReferrals.length !== 1 ? "s" : ""} awaiting payout
          </div>
        </div>

        {/* Tier Info */}
        <div className="bg-primary text-white rounded-xl p-8 flex flex-col justify-between min-h-[180px] shadow-lg shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Icon name="workspace_premium" className="!text-4xl" />
          </div>
          <div>
            <div className="text-xs font-bold text-primary-fixed-dim uppercase tracking-widest mb-1">Partner Tier</div>
            <div className="text-3xl font-headline font-extrabold text-white">{affiliate.tier ?? "Standard"}</div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="w-2 h-2 bg-secondary-fixed rounded-full animate-pulse" />
            <span className="text-[11px] font-medium text-primary-fixed">Status: {affiliate.status ?? "Active"}</span>
          </div>
        </div>
      </div>

      {/* Commission Breakdown */}
      <div className="flex flex-col xl:flex-row gap-12">
        {/* Commission Table */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-headline font-bold text-on-surface">Commission Details</h2>
            <span className="text-xs font-medium text-on-surface-variant">{commissionReferrals.length} record{commissionReferrals.length !== 1 ? "s" : ""}</span>
          </div>

          {commissionReferrals.length > 0 ? (
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Rate</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {commissionReferrals.map((ref: any) => {
                    const isPaid = ref.paid_at != null;
                    const name = ref.enrollment?.users?.name ?? "Unknown";
                    const plan = ref.enrollment?.plans?.name_en ?? "N/A";

                    return (
                      <tr key={ref.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-xs font-bold">
                              {name[0]?.toUpperCase() ?? "?"}
                            </div>
                            <div>
                              <div className="font-bold text-on-surface text-sm">{name}</div>
                              <div className="text-[11px] text-slate-500">{ref.enrollment?.users?.email ?? ""}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-on-surface-variant font-medium">{plan}</td>
                        <td className="px-6 py-5 text-sm font-medium text-on-surface-variant">
                          {ref.commission_rate_pct != null ? `${ref.commission_rate_pct}%` : "--"}
                        </td>
                        <td className="px-6 py-5 text-sm text-on-surface font-extrabold text-right">
                          ${(ref.commission_cents / 100).toFixed(2)}
                        </td>
                        <td className="px-6 py-5 text-center">
                          {isPaid ? (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-tertiary-fixed text-on-tertiary-fixed-variant">Paid</span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-secondary-container text-on-secondary-container">Pending</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
              <Icon name="payments" className="!text-6xl text-outline mb-4" />
              <h3 className="text-xl font-headline font-bold text-on-surface mb-2">No Commissions Yet</h3>
              <p className="text-on-surface-variant max-w-md">Once your referrals are activated, commissions will appear here.</p>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="w-full xl:w-96">
          <h2 className="text-xl font-headline font-bold text-on-surface mb-6">Earnings Summary</h2>
          <div className="space-y-4">
            <div className="bg-surface-container-low rounded-xl p-6 border border-transparent hover:border-outline-variant/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm font-bold text-on-surface">Paid Commissions</div>
                  <div className="text-[11px] text-slate-500 font-medium">{paidReferrals.length} referral{paidReferrals.length !== 1 ? "s" : ""}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-primary">
                    ${(paidReferrals.reduce(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (sum: number, r: any) => sum + (r.commission_cents ?? 0), 0
                    ) / 100).toFixed(2)}
                  </div>
                  <div className="text-[10px] font-bold text-tertiary uppercase">Completed</div>
                </div>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-tertiary h-full" style={{ width: commissionReferrals.length > 0 ? `${(paidReferrals.length / commissionReferrals.length) * 100}%` : "0%" }} />
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-6 border border-transparent hover:border-outline-variant/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm font-bold text-on-surface">Unpaid Commissions</div>
                  <div className="text-[11px] text-slate-500 font-medium">{unpaidReferrals.length} referral{unpaidReferrals.length !== 1 ? "s" : ""}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-secondary">
                    ${(unpaidReferrals.reduce(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (sum: number, r: any) => sum + (r.commission_cents ?? 0), 0
                    ) / 100).toFixed(2)}
                  </div>
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase">Pending</div>
                </div>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full" style={{ width: commissionReferrals.length > 0 ? `${(unpaidReferrals.length / commissionReferrals.length) * 100}%` : "0%" }} />
              </div>
            </div>
          </div>

          {/* Tier Card */}
          <div className="mt-8 p-6 bg-tertiary text-white rounded-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-xs font-bold text-tertiary-fixed mb-1 uppercase tracking-widest">Current Tier</div>
              <div className="text-lg font-headline font-bold mb-4">{affiliate.tier ?? "Standard"} Partner</div>
              <p className="text-sm opacity-80">Total earned: ${totalEarned}</p>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <Icon name="award_star" className="!text-[160px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 border-t border-surface-container-highest pt-8 pb-16 flex flex-col md:flex-row justify-between gap-8 items-start">
        <div className="max-w-md">
          <div className="text-xl font-headline font-extrabold text-primary mb-2">Vita Sant&eacute; Club</div>
          <p className="text-sm text-on-surface-variant leading-relaxed">Payments are processed securely. All referrals undergo validation to ensure the highest standards of care and ethical alignment.</p>
        </div>
        <div className="flex gap-16">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Legal</div>
            <ul className="space-y-2 text-sm font-medium text-on-surface-variant">
              <li><a className="hover:text-primary" href="#">Payment Terms</a></li>
              <li><a className="hover:text-primary" href="#">Compliance Policy</a></li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Account</div>
            <ul className="space-y-2 text-sm font-medium text-on-surface-variant">
              <li><a className="hover:text-primary" href="#">Bank Details</a></li>
              <li><a className="hover:text-primary" href="#">Notification Settings</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
