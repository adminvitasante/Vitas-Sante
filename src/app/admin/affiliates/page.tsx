import { Icon } from "@/components/ui/icon";

export default function AdminAffiliatesPage() {
  return (
    <div className="min-h-screen">
      {/* TopNavBar */}
      <header className="flex justify-between items-center h-16 px-8 sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm text-sm">
        <div className="flex items-center gap-8">
          <span className="text-blue-900 font-bold text-lg">Admin Console</span>
          <nav className="hidden md:flex gap-6">
            <a className="text-slate-600 hover:text-blue-600 transition-opacity" href="#">Directives</a>
            <a className="text-blue-700 font-semibold" href="#">Live Monitor</a>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative flex items-center">
            <Icon name="search" className="absolute left-3 text-slate-400" />
            <input className="pl-10 pr-4 py-1.5 bg-slate-50 border-none rounded-full text-xs w-64 focus:ring-2 focus:ring-primary/20" placeholder="Search affiliates..." type="text" />
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <button className="hover:opacity-80 transition-opacity">
              <Icon name="notifications" />
            </button>
            <button className="hover:opacity-80 transition-opacity">
              <Icon name="account_circle" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Header Section */}
        <section className="mb-10">
          <div className="flex justify-between items-end">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Affiliate Ecosystem</h2>
              <p className="text-on-surface-variant text-lg font-light leading-relaxed">
                Precision tracking for our clinical partners. Monitor conversions, validate credentials, and optimize surgical agent commissions.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 rounded-xl bg-surface-container-low text-primary font-semibold text-sm hover:bg-surface-container-high transition-colors">
                Export Ledger
              </button>
              <button className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-bold text-sm shadow-lg shadow-primary/10 hover:opacity-90 transition-opacity">
                Network Overview
              </button>
            </div>
          </div>
        </section>

        {/* KPI Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="col-span-1 md:col-span-1 bg-surface-container-lowest p-6 rounded-xl border-none transition-transform hover:scale-[1.02] duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-blue-50 text-primary rounded-lg">
                <Icon name="payments" />
              </span>
              <span className="text-xs font-bold text-secondary flex items-center gap-1">+12.4% <Icon name="trending_up" className="!text-[14px]" /></span>
            </div>
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">Total Payouts</p>
            <h3 className="text-2xl font-bold font-headline">$428,904.00</h3>
            <p className="text-[10px] text-slate-400 mt-2">Fiscal Year 2024</p>
          </div>
          <div className="col-span-1 md:col-span-1 bg-surface-container-lowest p-6 rounded-xl border-none transition-transform hover:scale-[1.02] duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-secondary-container text-on-secondary-container rounded-lg">
                <Icon name="data_exploration" />
              </span>
              <span className="text-xs font-bold text-secondary flex items-center gap-1">+4.2% <Icon name="trending_up" className="!text-[14px]" /></span>
            </div>
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">Avg. Conversion</p>
            <h3 className="text-2xl font-bold font-headline">18.6%</h3>
            <p className="text-[10px] text-slate-400 mt-2">Industry Average: 12.1%</p>
          </div>
          <div className="col-span-1 md:col-span-1 bg-surface-container-lowest p-6 rounded-xl border-none transition-transform hover:scale-[1.02] duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-tertiary-fixed text-on-tertiary-fixed rounded-lg">
                <Icon name="pending_actions" />
              </span>
            </div>
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">Pending Requests</p>
            <h3 className="text-2xl font-bold font-headline">14</h3>
            <p className="text-[10px] text-slate-400 mt-2">6 requiring immediate review</p>
          </div>
          <div className="col-span-1 md:col-span-1 bg-surface-container-lowest p-6 rounded-xl border-none transition-transform hover:scale-[1.02] duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-error-container text-on-error-container rounded-lg">
                <Icon name="hourglass_empty" />
              </span>
            </div>
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">Unpaid Commissions</p>
            <h3 className="text-2xl font-bold font-headline text-error">$12,450.20</h3>
            <p className="text-[10px] text-slate-400 mt-2">Next cycle: Friday</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Agent Tracking List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline">Performance Leaderboard</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><Icon name="filter_list" /></button>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><Icon name="sort" /></button>
              </div>
            </div>

            {/* Agent Cards */}
            <div className="space-y-4">
              {/* Agent Item 1 */}
              <div className="bg-surface-container-lowest p-5 rounded-xl flex items-center gap-6 group hover:bg-surface-bright transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-14 h-14 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHyabg_yDkWdBnh1tJhXrma39NXy51Y65GN5o2fSNXS4xrVJNxfmRHPidOaljHVPvF6JjWK18JDIovMtOufBFvSA_nhYwyhNtyK8Rj3nuTOFoQaKjCE1v1niV64QFzAsUNWlY7rzXfbd1FCzaE-drxtMcG9UbnVGfSQtDkd6RwHQj6iqfsZuayD3I5ZaHyMc6qNidl_VZeT2yTYJR19LM_fQ_5JFTE-xKzXGI2f0hff5NqbODNARl48Lwcmk2JcpaxHpEnBjZ6jGgL" alt="Agent avatar" />
                <div className="flex-1">
                  <h4 className="font-bold text-on-surface">Dr. Marc Andreessen</h4>
                  <p className="text-xs text-slate-400">Cardiology Specialist &bull; Zurich, CH</p>
                </div>
                <div className="text-right px-6 border-x border-slate-100">
                  <p className="text-xs text-slate-400 mb-0.5">Conversion</p>
                  <p className="font-bold text-secondary">24.8%</p>
                </div>
                <div className="text-right px-6 border-r border-slate-100">
                  <p className="text-xs text-slate-400 mb-0.5">YTD Earnings</p>
                  <p className="font-bold text-primary">$84,200</p>
                </div>
                <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-primary/5 text-primary transition-all">
                  <Icon name="chevron_right" />
                </button>
              </div>

              {/* Agent Item 2 */}
              <div className="bg-surface-container-lowest p-5 rounded-xl flex items-center gap-6 group hover:bg-surface-bright transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-14 h-14 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXjCDr4pnZnAs4yBls9VZoQ4Qun2Pjr0JjxSUZeM60MLq2fvaVrK-IEwYWKiLNAHWU0nJ9npcqji440wgiioEOsaz2apaoy83iFuZwYfNJJu_1CIR3tu9xSDTS3tvrR010HyUHhDOnDGUSh0Grge8ZEt03z4FLYysYVovg21-raY0jmJIHPnOi72iHedMfjAm_RjzypkfA8eKkMoZunWVJNpwUC_Psm2vBVvsR60gmiDhgURmDYT45FcR912_r5S80y9KTovZkqLCg" alt="Agent avatar" />
                <div className="flex-1">
                  <h4 className="font-bold text-on-surface">Sarah Wellington</h4>
                  <p className="text-xs text-slate-400">Surgical Sales Lead &bull; London, UK</p>
                </div>
                <div className="text-right px-6 border-x border-slate-100">
                  <p className="text-xs text-slate-400 mb-0.5">Conversion</p>
                  <p className="font-bold text-secondary">19.2%</p>
                </div>
                <div className="text-right px-6 border-r border-slate-100">
                  <p className="text-xs text-slate-400 mb-0.5">YTD Earnings</p>
                  <p className="font-bold text-primary">$62,150</p>
                </div>
                <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-primary/5 text-primary transition-all">
                  <Icon name="chevron_right" />
                </button>
              </div>

              {/* Agent Item 3 */}
              <div className="bg-surface-container-lowest p-5 rounded-xl flex items-center gap-6 group hover:bg-surface-bright transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-14 h-14 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0gVggWCf-qENNx_g1IQ_Hlshtec7INdeYywNGyuGksqVNWxq2WOcqS_PA-NRKhPUKwEZcxmfshglAHTtj0KH_weFuV2qpn-AG22rQRsnEOnTDTjyBoEwTFxAdoLUQ_WIfm6OPormrWWQ0N_zSFGnFQstBw8UFsbJ3giFKGb7uBbyzDDZSvrAi3oJJAJFDMvnkKSBuyVoWNRDihCUrwjpc0oLPUl6Gu-C1Fw5riweiQqpDR1hybKpMjh2LEbilVU7p5zfBie9V8Eaq" alt="Agent avatar" />
                <div className="flex-1">
                  <h4 className="font-bold text-on-surface">Thomas Kovacs</h4>
                  <p className="text-xs text-slate-400">Device Consultant &bull; Berlin, DE</p>
                </div>
                <div className="text-right px-6 border-x border-slate-100">
                  <p className="text-xs text-slate-400 mb-0.5">Conversion</p>
                  <p className="font-bold text-slate-400">11.5%</p>
                </div>
                <div className="text-right px-6 border-r border-slate-100">
                  <p className="text-xs text-slate-400 mb-0.5">YTD Earnings</p>
                  <p className="font-bold text-primary">$31,400</p>
                </div>
                <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-primary/5 text-primary transition-all">
                  <Icon name="chevron_right" />
                </button>
              </div>
            </div>

            {/* Performance Graph Area */}
            <div className="bg-surface-container-low p-8 rounded-2xl relative overflow-hidden h-64 flex flex-col justify-end">
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent"></div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Network Growth</p>
                <h4 className="text-3xl font-bold font-headline mb-4 text-blue-950">Projected Q4 Upside</h4>
                <div className="flex items-end gap-1 h-20">
                  <div className="w-full bg-primary/20 rounded-t h-[40%]"></div>
                  <div className="w-full bg-primary/20 rounded-t h-[55%]"></div>
                  <div className="w-full bg-primary/20 rounded-t h-[45%]"></div>
                  <div className="w-full bg-primary/30 rounded-t h-[70%]"></div>
                  <div className="w-full bg-primary/40 rounded-t h-[85%]"></div>
                  <div className="w-full bg-primary rounded-t h-[100%] shadow-lg shadow-primary/20"></div>
                  <div className="w-full bg-primary-container rounded-t h-[90%] opacity-50"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-8">
            {/* Approval Queue */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold font-headline mb-6 flex justify-between items-center">
                Approval Queue
                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter">New Applications</span>
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Icon name="person_add" className="text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Dr. Elena Rodriguez</p>
                    <p className="text-[11px] text-slate-500 mb-3">Neurology Specialist &bull; 14 years exp.</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 bg-secondary text-white text-[11px] font-bold rounded-lg hover:opacity-90">Approve</button>
                      <button className="px-3 py-1.5 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-lg hover:bg-slate-200">Review</button>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-50 pt-6 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Icon name="medical_information" className="text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">MediCorp Solutions</p>
                    <p className="text-[11px] text-slate-500 mb-3">Group Agency &bull; 45 Agents</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 bg-secondary text-white text-[11px] font-bold rounded-lg hover:opacity-90">Approve</button>
                      <button className="px-3 py-1.5 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-lg hover:bg-slate-200">Review</button>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-8 text-primary text-xs font-bold py-2 border border-primary/10 rounded-xl hover:bg-primary/5 transition-colors">
                View All Applications
              </button>
            </div>

            {/* Payment History Log */}
            <div className="bg-surface-container-low p-6 rounded-2xl">
              <h3 className="text-lg font-bold font-headline mb-4">Payment History</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-on-surface">Batch #88219</p>
                    <p className="text-[10px] text-slate-500">Oct 12, 2024 &bull; 24 Agents</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">$42,500.00</p>
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Completed</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-on-surface">Batch #88218</p>
                    <p className="text-[10px] text-slate-500">Oct 05, 2024 &bull; 18 Agents</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">$18,240.50</p>
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Completed</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm opacity-50">
                  <div>
                    <p className="font-medium text-on-surface">Batch #88217</p>
                    <p className="text-[10px] text-slate-500">Sep 28, 2024 &bull; 31 Agents</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">$31,900.00</p>
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Action Card */}
            <div className="relative rounded-2xl overflow-hidden p-6 text-white h-48 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-container to-blue-900 opacity-90"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjgD8ok22N4E1AouNV4BqEgQRfy96jOUKtiyfNt5YjL1JV4_hk7umHzaQSGANfcutn8ErP_PlmZ8eU5mPIHxAsnXDLrf3EUU8RDv4UDeXtP6wkeVx_HwtL2RPAoIGqSp1YKfPbsl9iA4BciYykLcJpwi7B7YZAoKVzAxTggn8Rd4h0jqH1EMpa4JCVhnVDmMphvFddFwrb3VoOymCEGic_65wEZFfb9LNzWEPnUdPxY5eXzP8mKnHd255proiUjPkhJ4BaPBguE2OW" alt="Background pattern" />
              </div>
              <div className="relative z-10">
                <h4 className="text-xl font-bold font-headline">Tier Calibration</h4>
                <p className="text-xs text-blue-100 mt-2">Adjust global commission scales for the upcoming surgical cycle.</p>
              </div>
              <div className="relative z-10 flex justify-end">
                <button className="bg-white text-primary px-4 py-2 rounded-xl text-xs font-bold shadow-xl">
                  Configure Rates
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
