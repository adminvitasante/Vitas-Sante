import { auth } from "@/lib/auth";
import { getAffiliateDashboard } from "@/lib/server/queries";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { redirect } from "next/navigation";

export default async function ReferralsPage() {
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
        <TopBar greeting="Affiliate" subtitle="Referrals" initials="--" />
        <div className="flex flex-col items-center justify-center py-32">
          <Icon name="person_off" className="!text-6xl text-outline mb-4" />
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">No Affiliate Account</h2>
          <p className="text-on-surface-variant max-w-md text-center">You do not have an affiliate account yet. Please contact support or apply to become a partner.</p>
        </div>
      </>
    );
  }

  const activeCount = referrals?.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r: any) => r.status === "ACTIVE"
  ).length ?? 0;
  const pendingCount = referrals?.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r: any) => r.status === "PENDING"
  ).length ?? 0;
  const totalCommission = referrals?.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sum: number, r: any) => sum + (r.commission_cents ?? 0), 0
  ) ?? 0;

  return (
    <>
      <TopBar
        greeting={session.user.name ?? "Partner"}
        subtitle="Referral Network"
        initials={initials}
      />

      {/* Header Section */}
      <div className="mb-12">
        <span className="text-secondary font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Referral Network</span>
        <h2 className="text-4xl font-headline font-extrabold text-on-primary-fixed tracking-tight mb-4">Referral Tracking</h2>
        <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">Monitor your professional network growth. Track the lifecycle of every connection from initial referral to activation.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-slate-100">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Total Referrals</p>
          <p className="text-3xl font-headline font-extrabold text-primary">{referrals?.length ?? 0}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-slate-100">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Active / Pending</p>
          <p className="text-3xl font-headline font-extrabold text-tertiary">{activeCount} <span className="text-on-surface-variant text-lg">/ {pendingCount}</span></p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-slate-100">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Total Commission</p>
          <p className="text-3xl font-headline font-extrabold text-secondary">${(totalCommission / 100).toFixed(2)}</p>
        </div>
      </div>

      {/* Referral Table Container */}
      {referrals && referrals.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-headline">Referral Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-headline">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-headline">Selected Plan</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-headline">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-headline">Rate</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-headline text-right">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {referrals.map((ref: any) => {
                  const name = ref.enrollment?.users?.name ?? "Unknown";
                  const email = ref.enrollment?.users?.email ?? "--";
                  const plan = ref.enrollment?.plans?.name_en ?? "N/A";
                  const statusColor =
                    ref.status === "ACTIVE"
                      ? "text-tertiary bg-tertiary-fixed/40"
                      : ref.status === "PENDING"
                        ? "text-on-surface-variant bg-surface-container-high"
                        : "text-error bg-error-container/40";
                  const dotColor =
                    ref.status === "ACTIVE"
                      ? "bg-tertiary"
                      : ref.status === "PENDING"
                        ? "bg-outline animate-pulse"
                        : "bg-error";

                  return (
                    <tr key={ref.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                            {name[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div className="font-headline font-bold text-primary">{name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{email}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-on-primary-fixed-variant bg-primary-fixed/30 px-2.5 py-1 rounded-full">{plan}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1.5 font-bold text-xs w-fit px-3 py-1 rounded-full ${statusColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                          {ref.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">
                        {ref.commission_rate_pct != null ? `${ref.commission_rate_pct}%` : "--"}
                      </td>
                      <td className="px-6 py-4 text-right font-headline font-extrabold text-primary">
                        ${(ref.commission_cents / 100).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-surface-container-low/30 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-on-surface-variant font-body">Showing {referrals.length} referral{referrals.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-slate-100 p-16 flex flex-col items-center justify-center text-center">
          <Icon name="group_add" className="!text-6xl text-outline mb-4" />
          <h3 className="text-xl font-headline font-bold text-on-surface mb-2">No Referrals Yet</h3>
          <p className="text-on-surface-variant max-w-md">Share your unique referral link to start building your network. Your partner code is <strong>{affiliate.partner_code}</strong>.</p>
        </div>
      )}

      {/* Insights Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-primary text-white p-8 rounded-xl relative overflow-hidden group shadow-lg">
          <div className="relative z-10">
            <h3 className="font-headline font-bold text-primary-fixed text-lg mb-2">Your Tier</h3>
            <p className="text-3xl font-headline font-extrabold mb-4">{affiliate.tier ?? "Standard"}</p>
            <p className="text-sm opacity-80 font-body leading-relaxed">Keep referring to unlock higher commission tiers and exclusive partner benefits.</p>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <Icon name="trending_up" className="!text-[120px]" />
          </div>
        </div>

        <div className="md:col-span-2 glass-header border border-slate-200 p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h3 className="font-headline font-bold text-primary text-lg mb-2">Pending Revenue</h3>
            <p className="text-4xl font-headline font-extrabold text-secondary mb-2">${(affiliate.pending_cents / 100).toFixed(2)}</p>
            <p className="text-sm text-on-surface-variant font-body">Commissions from {pendingCount} pending referral{pendingCount !== 1 ? "s" : ""} awaiting verification.</p>
          </div>
          <div className="h-full w-px bg-slate-200 hidden md:block" />
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="bg-surface-container-low text-primary px-6 py-3 rounded-xl font-headline text-sm font-bold text-center">
              Partner Code: {affiliate.partner_code}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
