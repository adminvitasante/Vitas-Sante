import { auth } from "@/lib/auth";
import { getAffiliateDashboard } from "@/lib/server/queries";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { redirect } from "next/navigation";

export default async function AffiliateDashboard() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const { affiliate, referrals } = await getAffiliateDashboard(userId);

  if (!affiliate) {
    return (
      <>
        <TopBar greeting="Affiliate" subtitle="Dashboard" initials="--" />
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
  const referralCount = referrals?.length ?? 0;
  const activeReferrals = referrals?.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r: any) => r.status === "ACTIVE"
  ).length ?? 0;
  const initials = session.user.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AF";

  return (
    <>
      <TopBar
        greeting={session.user.name ?? "Partner"}
        subtitle={`Partner Code: ${affiliate.partner_code}`}
        initials={initials}
      />

      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-extrabold text-primary font-headline tracking-tight leading-tight mb-2">Affiliate Workspace</h2>
          <p className="text-on-surface-variant leading-relaxed max-w-lg">Manage your health network expansion, track commission evolution, and access certified marketing materials.</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-full px-6 py-2">
          <div className="text-right">
            <p className="text-xs font-bold text-primary font-headline uppercase">{session.user.name ?? "Partner"}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Partner Code: {affiliate.partner_code}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
            {initials}
          </div>
        </div>
      </header>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-surface-container-lowest p-8 rounded-xl tonal-shadow relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Total Referrals</p>
            <h3 className="text-5xl font-black text-primary font-headline mb-2">{referralCount}</h3>
            <div className="flex items-center text-tertiary font-bold text-sm">
              <Icon name="groups" className="text-sm mr-1" />
              <span>{activeReferrals} active</span>
            </div>
          </div>
          <Icon name="groups" className="absolute -right-4 -bottom-4 !text-9xl text-surface-container-low opacity-40 group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl tonal-shadow relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Pending Commissions</p>
            <h3 className="text-5xl font-black text-primary font-headline mb-2">${pendingAmount}</h3>
            <p className="text-xs text-on-surface-variant">Awaiting validation</p>
          </div>
          <Icon name="pending_actions" className="absolute -right-4 -bottom-4 !text-9xl text-surface-container-low opacity-40 group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl tonal-shadow relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Total Earned</p>
            <h3 className="text-5xl font-black text-secondary font-headline mb-2">${totalEarned}</h3>
            <p className="text-xs text-on-surface-variant">Lifetime earnings &middot; Tier: {affiliate.tier ?? "Standard"}</p>
          </div>
          <Icon name="verified" className="absolute -right-4 -bottom-4 !text-9xl text-surface-container-low opacity-40 group-hover:scale-110 transition-transform duration-500" />
        </div>
      </section>

      {/* Referral Link & Info */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-4 flex flex-col space-y-8">
          <div className="bg-surface-container-low p-8 rounded-xl">
            <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-6">Unique Referral Link</h4>
            <p className="text-xs text-on-surface-variant mb-4">Share this unique link with your network to track new members automatically.</p>
            <div className="relative">
              <input
                className="w-full bg-surface-container-lowest border-none rounded-lg py-4 pl-4 pr-12 text-sm font-medium text-primary focus:ring-2 focus:ring-primary/20"
                readOnly
                type="text"
                value={`vitasante.club/ref/${affiliate.partner_code}`}
              />
              <button className="absolute right-2 top-2 p-2 text-primary hover:bg-surface-container-high rounded-md transition-colors">
                <Icon name="content_copy" />
              </button>
            </div>
          </div>

          <div className="bg-primary-container p-8 rounded-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Account Status</h4>
              <p className="text-xl font-bold mb-2 font-headline">{affiliate.status ?? "Active"}</p>
              <p className="text-sm opacity-80">Tier: {affiliate.tier ?? "Standard"}</p>
            </div>
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Recent Referrals Preview */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl tonal-shadow">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Recent Referrals</h4>
              <p className="text-xs text-on-surface-variant">{referralCount} total referrals</p>
            </div>
          </div>

          {referrals && referrals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/10">
                    <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Member</th>
                    <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Plan</th>
                    <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                    <th className="pb-4 text-right text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {referrals.slice(0, 5).map((ref: any) => (
                    <tr key={ref.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-xs font-bold">
                            {ref.enrollment?.users?.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <span className="text-sm font-semibold text-on-surface">{ref.enrollment?.users?.name ?? "Unknown"}</span>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-tight">
                          {ref.enrollment?.plans?.name_en ?? "N/A"}
                        </span>
                      </td>
                      <td className="py-5">
                        <div className={`flex items-center gap-2 text-xs font-semibold ${ref.status === "ACTIVE" ? "text-tertiary" : "text-on-surface-variant"}`}>
                          <span className={`w-2 h-2 rounded-full ${ref.status === "ACTIVE" ? "bg-tertiary" : "bg-outline animate-pulse"}`} />
                          {ref.status}
                        </div>
                      </td>
                      <td className="py-5 text-right font-headline font-bold text-primary">
                        ${(ref.commission_cents / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="group_add" className="!text-5xl text-outline mb-3" />
              <p className="text-on-surface-variant">No referrals yet. Share your link to get started!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center py-12 w-full max-w-7xl mx-auto">
          <div className="mb-6 md:mb-0">
            <p className="font-inter text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Vita Sant&eacute; Club. Tous droits r&eacute;serv&eacute;s.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              className="font-inter text-xs text-slate-400 hover:text-primary transition-colors"
              href="mailto:support@vitasante.ht"
            >
              support@vitasante.ht
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
