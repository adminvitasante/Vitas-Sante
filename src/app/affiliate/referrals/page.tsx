import { Icon } from "@/components/ui/icon";

export default function ReferralsPage() {
  return (
    <>
      {/* Header Section */}
      <div className="mb-12">
        <span className="text-secondary font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Referral Network</span>
        <h2 className="text-4xl font-headline font-extrabold text-on-primary-fixed tracking-tight mb-4">Referral Tracking</h2>
        <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">Monitor your professional ecosystem&apos;s growth. Track the lifecycle of every healthcare connection from initial referral to clinical conversion.</p>
      </div>

      {/* Filters & Search Bento Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 flex flex-col justify-center border border-slate-100">
          <div className="relative w-full">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
            <input
              className="w-full bg-surface-container-low border-none rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-sm font-body transition-all"
              placeholder="Search by name, plan or status..."
              type="text"
            />
          </div>
        </div>
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-4 flex items-center gap-2 border border-slate-100">
          <button className="flex-1 py-2 px-4 rounded-lg bg-primary-container text-white text-xs font-bold font-headline transition-all">Active</button>
          <button className="flex-1 py-2 px-4 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-xs font-bold font-headline transition-all">Pending Review</button>
          <button className="flex-1 py-2 px-4 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-xs font-bold font-headline transition-all">Expired</button>
          <button className="flex-shrink-0 p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-all">
            <Icon name="filter_list" className="text-[20px]" />
          </button>
        </div>
      </div>

      {/* Referral Table Container */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-headline">Referral Name</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-headline">Date Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-headline">Selected Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-headline">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-headline text-right">Estimated Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Row 1 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="Referral Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNmZFCj7z9uG0guz0jxSSOmufGdPCyE-P3brzc8uhVn5OTNSwpHI5qGfGfPF63eDCZrnh7ojib1n1fq8gn6Fs0lSUYoGdQRKRtSE6JAcjWmL4hSICnhJJ2n-y_52457ByEe6UfUj_NkfWGmZ83bnBzpTh2dmQXqG7lwy96spVV54DmvPGW65cJn1EOuuoTyQ_Sw-bqq5YU-6QgUHLZZh2B_CtxzaxAACoSltEQwXfsk_2FIBMm6jz4C1cbSwmxSRb8oRq_5qNvtk3C" />
                    </div>
                    <div>
                      <div className="font-headline font-bold text-primary">Dr. Jean-Pierre Bastien</div>
                      <div className="text-[11px] text-on-surface-variant">Cardiology Practice &bull; Port-au-Prince</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-on-surface">Oct 12, 2023</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-on-primary-fixed-variant bg-primary-fixed/30 px-2.5 py-1 rounded-full">Atelier Premium Plus</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-tertiary font-bold text-xs bg-tertiary-fixed/40 w-fit px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                    Active
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-headline font-extrabold text-primary">$450.00</td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="Referral Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqhwetiRxPzWQvShEYI1vESLUcU_T7jxmUDxKqknuVGL_5nqOC2zAuE5zdfpcMmdRcxHu1f6SyQeOPkA7hFTeos03Glvx7LWwlgSa5GjJOhdJsxFX4JgYMrAkEGn-H9d2sTA0V-iPJUiLJL1bfvDx7W4AfACy215G_8P-hGw6dP1ZHn3tz15Zlulf7Lr5E5d6iN8ByfoNwK3dZnz6eUmP7Fd_glnGlP8AvgbcaDlcd9hvHX5HcjmJA02ITIXHaPSlRnvlEDS_lOdQr" />
                    </div>
                    <div>
                      <div className="font-headline font-bold text-primary">Marie-Lourdes Cadet</div>
                      <div className="text-[11px] text-on-surface-variant">Private Clinic Admin &bull; Cap-Ha&iuml;tien</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-on-surface">Oct 15, 2023</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-on-secondary-fixed-variant bg-secondary-fixed/30 px-2.5 py-1 rounded-full">Foundation Care</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-bold text-xs bg-surface-container-high w-fit px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                    Pending Review
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-headline font-extrabold text-primary">$120.00</td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="Referral Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYSBQVEJplkf2BrQLkQUsaiHva1Yf9AEUsXpTIj1QFSN3rgN--M7S0SIdfV6MHurKSLp8pY7UEOTjge2V6X0N48nvn-bz6LrysXqEG4Uz1IUOyDPaTciT2FmGLDkpW7Ic2Fu2yP6NWB0tIouXuKqytwpdSqP9vb8wKDyRDQD0WZxxmNgcewh6LYu8wj_VVxYfMLaWEZ3Mvx1vbyniDgZ1WPNiA4tGVEgcm-OM03kTk7su7MQA6pNy3UBsYo_pHCqC2yoe4Xh7T9gT3" />
                    </div>
                    <div>
                      <div className="font-headline font-bold text-primary">Emmanuel Desrosiers</div>
                      <div className="text-[11px] text-on-surface-variant">Wellness Center Director &bull; Jacmel</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-on-surface">Sep 28, 2023</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-on-primary-fixed-variant bg-primary-fixed/30 px-2.5 py-1 rounded-full">Enterprise Solution</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-tertiary font-bold text-xs bg-tertiary-fixed/40 w-fit px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                    Active
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-headline font-extrabold text-primary">$1,200.00</td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="Referral Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCouvjAYN2RbSkfNEpqVpDYRFIH6D8a53gTIRsbn7R1ifuJu570B-sjUPsPbTpBn-qdFFNa-bzjHrLdTIb8XGgaeS1w4fQt2daX92q8dpYQM8C6ATR2_dZvzUxgmb3nCHI-OgY-IhdhuDHC0cTiVJDx1c5f2KMIpLWAkTnbGaqHVFrZ3dvahLvgFZfZo1iMpJMwuM_mcXz2rOfg7QltkV9FwaxCUoT26pc3uobIJphxa5XZZVNd7BuNdvGa8grXhssZkASfZyrlUPOz" />
                    </div>
                    <div>
                      <div className="font-headline font-bold text-primary">Fabienne Laurent</div>
                      <div className="text-[11px] text-on-surface-variant">Diagnostics Partner &bull; P&eacute;tion-Ville</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-on-surface">Aug 05, 2023</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-on-primary-fixed-variant bg-primary-fixed/30 px-2.5 py-1 rounded-full">Atelier Premium</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-error font-bold text-xs bg-error-container/40 w-fit px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-error" />
                    Expired
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-headline font-extrabold text-outline">$0.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="px-6 py-4 bg-surface-container-low/30 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-on-surface-variant font-body">Showing 4 of 124 professional referrals</span>
          <div className="flex gap-2">
            <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-primary transition-all">
              <Icon name="chevron_left" className="text-[18px]" />
            </button>
            <button className="px-3 py-1 rounded-lg bg-white border border-primary text-primary text-xs font-bold">1</button>
            <button className="px-3 py-1 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-white">2</button>
            <button className="px-3 py-1 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-white">3</button>
            <button className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-primary transition-all">
              <Icon name="chevron_right" className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Insights Section (Asymmetric Bento) */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-primary text-white p-8 rounded-xl relative overflow-hidden group shadow-lg">
          <div className="relative z-10">
            <h3 className="font-headline font-bold text-primary-fixed text-lg mb-2">Network Velocity</h3>
            <p className="text-3xl font-headline font-extrabold mb-4">+14%</p>
            <p className="text-sm opacity-80 font-body leading-relaxed">Your referral network is growing faster than the ecosystem average. Maintain this pace to unlock &quot;Executive Partner&quot; status.</p>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <Icon name="trending_up" className="!text-[120px]" />
          </div>
        </div>

        <div className="md:col-span-2 glass-header border border-slate-200 p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h3 className="font-headline font-bold text-primary text-lg mb-2">Unclaimed Revenue</h3>
            <p className="text-4xl font-headline font-extrabold text-secondary mb-2">$1,840.22</p>
            <p className="text-sm text-on-surface-variant font-body">Commissions from 5 pending referrals are awaiting final verification by the Clinical Board.</p>
          </div>
          <div className="h-full w-px bg-slate-200 hidden md:block" />
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button className="bg-primary text-white px-6 py-3 rounded-xl font-headline text-sm font-bold shadow-sm hover:opacity-90 transition-all text-center">Export Report</button>
            <button className="bg-surface-container-low text-primary px-6 py-3 rounded-xl font-headline text-sm font-bold hover:bg-surface-container-high transition-all text-center">View Analytics</button>
          </div>
        </div>
      </div>
    </>
  );
}
