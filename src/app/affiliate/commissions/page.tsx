import { Icon } from "@/components/ui/icon";

export default function CommissionsPage() {
  return (
    <>
      {/* Editorial Header */}
      <div className="mb-12 max-w-4xl">
        <span className="text-secondary font-bold tracking-widest text-[10px] uppercase mb-2 block">Partner Earnings</span>
        <h1 className="text-4xl lg:text-5xl font-headline font-extrabold text-on-surface leading-tight tracking-tighter">Commissions &amp; Payments</h1>
        <p className="text-on-surface-variant mt-4 text-lg max-w-2xl leading-relaxed">A detailed overview of your editorial contributions and financial growth within the Atelier ecosystem. Track every patient journey you facilitate.</p>
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
            <div className="text-3xl font-headline font-extrabold text-primary">$42,850.00</div>
          </div>
          <div className="text-[11px] font-medium text-tertiary flex items-center gap-1 mt-4">
            <Icon name="trending_up" className="text-[14px]" />
            +12.4% from last month
          </div>
        </div>

        {/* Pending Validation */}
        <div className="bg-surface-container-low rounded-xl p-8 flex flex-col justify-between min-h-[180px] relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Validation</div>
            <div className="text-3xl font-headline font-extrabold text-on-surface">$3,120.45</div>
          </div>
          <div className="text-[11px] font-medium text-on-surface-variant mt-4">
            Awaiting 30-day clinical verification
          </div>
        </div>

        {/* Next Payout */}
        <div className="bg-primary text-white rounded-xl p-8 flex flex-col justify-between min-h-[180px] shadow-lg shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Icon name="event_upcoming" className="!text-4xl" />
          </div>
          <div>
            <div className="text-xs font-bold text-primary-fixed-dim uppercase tracking-widest mb-1">Next Payout Date</div>
            <div className="text-3xl font-headline font-extrabold text-white">Oct 15, 2024</div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="w-2 h-2 bg-secondary-fixed rounded-full animate-pulse" />
            <span className="text-[11px] font-medium text-primary-fixed">Scheduled: Auto-deposit</span>
          </div>
        </div>
      </div>

      {/* Main Layout: Payouts & Commission Breakdown */}
      <div className="flex flex-col xl:flex-row gap-12">
        {/* Payout History Table */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-headline font-bold text-on-surface">Payout History</h2>
            <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              <Icon name="download" className="text-[18px]" />
              Export CSV
            </button>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Payout ID</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-5 font-manrope font-bold text-primary text-sm">#PA-99201</td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant font-medium">Sep 15, 2024</td>
                  <td className="px-6 py-5 text-sm text-on-surface font-extrabold text-right">$8,450.00</td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-tertiary-fixed text-on-tertiary-fixed-variant">Paid</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-5 font-manrope font-bold text-primary text-sm">#PA-98842</td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant font-medium">Aug 15, 2024</td>
                  <td className="px-6 py-5 text-sm text-on-surface font-extrabold text-right">$7,120.00</td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-tertiary-fixed text-on-tertiary-fixed-variant">Paid</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-5 font-manrope font-bold text-primary text-sm">#PA-98511</td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant font-medium">Jul 15, 2024</td>
                  <td className="px-6 py-5 text-sm text-on-surface font-extrabold text-right">$9,880.00</td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-secondary-container text-on-secondary-container">Processing</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-5 font-manrope font-bold text-primary text-sm">#PA-98105</td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant font-medium">Jun 15, 2024</td>
                  <td className="px-6 py-5 text-sm text-on-surface font-extrabold text-right">$6,230.50</td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-error-container text-on-error-container">Failed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission Breakdown Sidebar */}
        <div className="w-full xl:w-96">
          <h2 className="text-xl font-headline font-bold text-on-surface mb-6">Commission Breakdown</h2>
          <div className="space-y-4">
            {/* Breakdown Item 1 */}
            <div className="bg-surface-container-low rounded-xl p-6 border border-transparent hover:border-outline-variant/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm font-bold text-on-surface">Executive Health Check</div>
                  <div className="text-[11px] text-slate-500 font-medium">Patient: Luc Dupont</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-primary">$450.00</div>
                  <div className="text-[10px] font-bold text-secondary uppercase">20% Tier</div>
                </div>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-full" />
              </div>
              <div className="mt-2 text-[10px] text-slate-500">Credited: Sep 28, 2024</div>
            </div>

            {/* Breakdown Item 2 */}
            <div className="bg-surface-container-low rounded-xl p-6 border border-transparent hover:border-outline-variant/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm font-bold text-on-surface">Longevity Program Plus</div>
                  <div className="text-[11px] text-slate-500 font-medium">Patient: Elena Rossi</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-primary">$1,200.00</div>
                  <div className="text-[10px] font-bold text-secondary uppercase">Elite Partner</div>
                </div>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[85%]" />
              </div>
              <div className="mt-2 text-[10px] text-slate-500">Credited: Sep 24, 2024</div>
            </div>

            {/* Breakdown Item 3 */}
            <div className="bg-surface-container-low rounded-xl p-6 border border-transparent hover:border-outline-variant/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm font-bold text-on-surface">Genetic Consultation</div>
                  <div className="text-[11px] text-slate-500 font-medium">Patient: Marcus Weber</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-primary">$180.00</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Standard</div>
                </div>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[40%]" />
              </div>
              <div className="mt-2 text-[10px] text-slate-500">Credited: Sep 22, 2024</div>
            </div>
          </div>

          {/* Growth Opportunity Card */}
          <div className="mt-8 p-6 bg-tertiary text-white rounded-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-xs font-bold text-tertiary-fixed mb-1 uppercase tracking-widest">Growth Opportunity</div>
              <div className="text-lg font-headline font-bold mb-4">You&apos;re $2,400 away from the Diamond Tier</div>
              <button className="bg-white text-tertiary px-4 py-2 rounded-lg text-xs font-bold hover:bg-tertiary-fixed transition-colors">View Tier Benefits</button>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <Icon name="award_star" className="!text-[160px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Disclaimer Section */}
      <div className="mt-24 border-t border-surface-container-highest pt-8 pb-16 flex flex-col md:flex-row justify-between gap-8 items-start">
        <div className="max-w-md">
          <div className="text-xl font-headline font-extrabold text-primary mb-2">The Clinical Atelier</div>
          <p className="text-sm text-on-surface-variant leading-relaxed">Payments are processed securely via our medical billing infrastructure. All referrals undergo clinical validation to ensure the highest standards of patient care and ethical alignment.</p>
        </div>
        <div className="flex gap-16">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Legal</div>
            <ul className="space-y-2 text-sm font-medium text-on-surface-variant">
              <li><a className="hover:text-primary" href="#">Payment Terms</a></li>
              <li><a className="hover:text-primary" href="#">Compliance Policy</a></li>
              <li><a className="hover:text-primary" href="#">Tax Documents</a></li>
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
