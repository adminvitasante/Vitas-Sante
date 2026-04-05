import { Icon } from "@/components/ui/icon";

export default function BillingPage() {
  return (
    <>
      {/* Editorial Header Section */}
      <section className="mb-12">
        <h1 className="font-headline font-extrabold text-primary text-5xl tracking-tight mb-2">Billing &amp; Financial Treasury</h1>
        <p className="text-on-surface-variant font-body max-w-2xl leading-relaxed">
          Review your institutional investments, manage recurring health grants, and oversee the fiscal health of your member pool. Our high-precision ledger ensures complete transparency for every funded life.
        </p>
      </section>

      {/* KPI Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Lifetime Investment */}
        <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between h-48 border-l-4 border-primary">
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Total Lifetime Investment</span>
            <h3 className="text-4xl font-headline font-bold text-primary mt-2">&euro;842,500.00</h3>
          </div>
          <div className="flex items-center text-secondary text-sm font-medium">
            <Icon name="trending_up" className="mr-1 text-sm" filled />
            +12.4% from last quarter
          </div>
        </div>
        {/* Next Payment */}
        <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between h-48 border-l-4 border-secondary">
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Next Payment Due</span>
            <h3 className="text-4xl font-headline font-bold text-on-surface mt-2">&euro;12,240.00</h3>
          </div>
          <p className="text-slate-500 text-sm font-medium">Auto-debit scheduled for Oct 15, 2023</p>
        </div>
        {/* Members Funded */}
        <div className="bg-primary text-white p-8 rounded-xl flex flex-col justify-between h-48 relative overflow-hidden">
          <div className="relative z-10">
            <span className="font-bold text-blue-200 uppercase tracking-widest text-[10px]">Active Members Funded</span>
            <h3 className="text-4xl font-headline font-bold mt-2">1,248</h3>
          </div>
          <div className="relative z-10 flex items-center text-blue-100 text-sm">
            <Icon name="verified_user" className="mr-1 text-sm" />
            Full coverage enabled
          </div>
          {/* Abstract Gradient Swirl */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full"></div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment History Table (Column Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-headline font-bold text-primary">Transaction History</h2>
            <button className="text-primary font-bold text-sm flex items-center hover:underline">
              Download All (PDF)
              <Icon name="download" className="ml-1 text-sm" />
            </button>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant/10">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Invoice ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm font-medium text-primary">#INV-99234</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Sep 15, 2023</td>
                  <td className="px-6 py-4 text-sm font-bold text-on-surface">&euro;12,240.00</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase">Paid</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">visibility</button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm font-medium text-primary">#INV-99112</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Aug 15, 2023</td>
                  <td className="px-6 py-4 text-sm font-bold text-on-surface">&euro;11,980.00</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase">Paid</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">visibility</button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm font-medium text-primary">#INV-98871</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Jul 15, 2023</td>
                  <td className="px-6 py-4 text-sm font-bold text-on-surface">&euro;12,240.00</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded-full uppercase">Pending</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">visibility</button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm font-medium text-primary">#INV-98700</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Jun 15, 2023</td>
                  <td className="px-6 py-4 text-sm font-bold text-on-surface">&euro;11,400.00</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase">Paid</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">visibility</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods & Card Management */}
        <div className="space-y-6">
          <h2 className="text-2xl font-headline font-bold text-primary">Payment Methods</h2>
          <div className="space-y-4">
            {/* Primary Method */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <Icon name="contactless" className="text-white text-3xl" />
                  <div className="text-white text-xs font-bold uppercase tracking-widest opacity-60">Primary Method</div>
                </div>
                <div className="text-white text-xl font-mono mb-6">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4492</div>
                <div className="flex justify-between items-end">
                  <div className="text-white">
                    <div className="text-[8px] uppercase opacity-50 font-bold">Holder</div>
                    <div className="text-sm font-bold">GEN-HEALTH CORP</div>
                  </div>
                  <div className="text-white text-right">
                    <div className="text-[8px] uppercase opacity-50 font-bold">Expires</div>
                    <div className="text-sm font-bold">12/26</div>
                  </div>
                </div>
              </div>
              {/* Glass shine effect */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rotate-45 blur-2xl"></div>
            </div>
            {/* Alternate Method */}
            <div className="bg-surface-container-lowest p-6 rounded-xl flex items-center justify-between border border-outline-variant/10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-8 bg-surface-container rounded flex items-center justify-center">
                  <Icon name="account_balance" className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">SEPA Direct Debit</p>
                  <p className="text-xs text-slate-500">Ending in ****8821</p>
                </div>
              </div>
              <button className="material-symbols-outlined text-slate-400 hover:text-error">delete</button>
            </div>
            {/* Add New Button */}
            <button className="w-full border-2 border-dashed border-outline-variant rounded-xl py-4 flex flex-col items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-all group">
              <Icon name="add_circle" className="mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">Add New Source</span>
            </button>
          </div>
          {/* Auto-Refill Settings */}
          <div className="bg-secondary-container/30 p-6 rounded-xl">
            <h4 className="font-headline font-bold text-on-secondary-container mb-2">Automated Replenishment</h4>
            <p className="text-xs text-on-secondary-container/80 mb-4 leading-relaxed">
              Funds will be automatically drawn when the member pool credit drops below &euro;5,000.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-on-secondary-container">Status: Active</span>
              <div className="w-10 h-6 bg-secondary rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation & Support Section */}
      <section className="mt-20 pt-10 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h5 className="font-headline font-bold text-primary mb-3">Fiscal Compliance</h5>
            <p className="text-sm text-slate-500 leading-relaxed">All invoices are compliant with EU healthcare funding regulations and include VAT breakdowns for your region.</p>
          </div>
          <div>
            <h5 className="font-headline font-bold text-primary mb-3">Auditing Tools</h5>
            <p className="text-sm text-slate-500 leading-relaxed">Access per-member spending reports in the Impact Reports section for quarterly audits.</p>
          </div>
          <div>
            <h5 className="font-headline font-bold text-primary mb-3">Institutional Support</h5>
            <p className="text-sm text-slate-500 leading-relaxed">Need a customized billing structure? Contact your dedicated Vita Sant&eacute; account manager.</p>
            <a className="text-secondary text-sm font-bold mt-2 block hover:underline" href="#">Request Consultation</a>
          </div>
        </div>
      </section>
    </>
  );
}
