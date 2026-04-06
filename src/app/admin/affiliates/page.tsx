import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { getAdminAffiliates } from "@/lib/server/queries";

function tierBadge(tier: string) {
  switch (tier?.toUpperCase()) {
    case "GOLD":
      return "bg-amber-100 text-amber-800";
    case "SILVER":
      return "bg-slate-200 text-slate-700";
    case "BRONZE":
      return "bg-orange-100 text-orange-800";
    case "PLATINUM":
      return "bg-primary-fixed text-primary";
    default:
      return "bg-surface-container-high text-on-surface-variant";
  }
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function AdminAffiliatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const affiliates = await getAdminAffiliates();

  return (
    <div className="min-h-screen px-8 py-8">
      <TopBar
        greeting="Affiliate Ecosystem"
        subtitle="Track partner performance and commissions"
        initials={session.user.name?.slice(0, 2).toUpperCase() || "AD"}
      />

      {/* KPI Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] border-l-4 border-primary">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Total Affiliates</p>
          <h3 className="text-3xl font-headline font-extrabold text-primary">{affiliates.length}</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] border-l-4 border-secondary">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Total Earned</p>
          <h3 className="text-3xl font-headline font-extrabold text-secondary">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {formatCents(affiliates.reduce((sum: number, a: any) => sum + (a.total_earned_cents || 0), 0))}
          </h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] border-l-4 border-error">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Total Pending</p>
          <h3 className="text-3xl font-headline font-extrabold text-error">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {formatCents(affiliates.reduce((sum: number, a: any) => sum + (a.pending_cents || 0), 0))}
          </h3>
        </div>
      </section>

      {/* Affiliates Table */}
      {affiliates.length > 0 ? (
        <section>
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Partner Code</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Tier</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Total Earned</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Pending</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {affiliates.map((affiliate: any) => (
                    <tr key={affiliate.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                            {affiliate.users?.name?.slice(0, 2).toUpperCase() || "??"}
                          </div>
                          <span className="text-sm font-bold text-on-surface">{affiliate.users?.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface-variant">
                        {affiliate.users?.email || "N/A"}
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-mono text-xs text-slate-500 tracking-wider bg-surface-container-low px-2 py-1 rounded">
                          {affiliate.partner_code || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${tierBadge(affiliate.tier)}`}>
                          {affiliate.tier || "STANDARD"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm font-bold text-primary">
                          {formatCents(affiliate.total_earned_cents || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className={`text-sm font-bold ${(affiliate.pending_cents || 0) > 0 ? "text-error" : "text-on-surface-variant"}`}>
                          {formatCents(affiliate.pending_cents || 0)}
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
          <Icon name="handshake" className="text-outline !text-4xl mb-3" />
          <p className="text-on-surface-variant font-medium">No affiliates registered yet.</p>
        </div>
      )}
    </div>
  );
}
