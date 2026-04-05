"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

export default function AdminPlansPage() {
  const [labCoverage, setLabCoverage] = useState(95);
  const [pharmaCoverage, setPharmaCoverage] = useState(90);
  const [surgeryCoverage, setSurgeryCoverage] = useState(100);
  const [annualPremium, setAnnualPremium] = useState(12500);
  const [deductible, setDeductible] = useState(500);

  return (
    <div className="min-h-screen">
      {/* TopNavBar */}
      <header className="flex justify-between items-center h-16 px-8 sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-8">
          <span className="text-blue-900 text-sm font-semibold">Admin Console</span>
          <div className="flex gap-6">
            <a className="text-slate-600 hover:text-blue-600 transition-opacity text-sm" href="#">Directives</a>
            <a className="text-blue-700 font-semibold text-sm" href="#">Live Monitor</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input className="bg-surface-container-low border-none rounded-full py-2 px-4 text-sm w-64 focus:ring-2 focus:ring-primary" placeholder="Search parameters..." type="text" />
            <Icon name="search" className="absolute right-3 top-2 text-slate-400 !text-lg" />
          </div>
          <button className="text-slate-600 hover:opacity-80 transition-opacity">
            <Icon name="notifications" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Administrator Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn0MBhWtphlqhazFGfisQdTdGJQCCrzb9Jc5I5e_tr3SMoyUpp0WdnVwjy5i-XLfrcvjDEmtH0lFFWmVGUptesoDNz_yQQVWP7VkNfvXoyrRwdCh0Qd0hurdIm418DLG3rqiDywtw1pl_MFZRUBAJp9j3vFWGPeeaxDB_Ego4lPpMUEl5ckKauuGWrg_dJK0KFaXbHGvzIDiZIWe6hVF-6J3LhD1q9qAkkxHRbGoPYWoqcttYY-0NdFB-u04jP9af81ElmuzGyFOoL" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 bg-surface">
        {/* Editorial Header */}
        <section className="mb-12">
          <div className="max-w-4xl">
            <h2 className="text-5xl font-headline font-extrabold tracking-tight text-on-surface mb-4 leading-tight">Tiered Benefit <span className="text-primary-container">Orchestration</span></h2>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl">
              Configure the architectural foundations of your medical coverage. Adjust membership costs, coverage ratios, and clinical limits across our eight distinct tiers with real-time impact forecasting.
            </p>
          </div>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Plan Selector & Basic Info (Left Column) */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Icon name="tune" className="text-primary" />
                Active Configuration
              </h3>
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Select Membership Tier</label>
                <div className="grid grid-cols-1 gap-2">
                  <button className="flex justify-between items-center p-4 rounded-lg bg-surface-container-low border-l-4 border-primary text-primary font-bold">
                    <span>Elite Platinum</span>
                    <span className="text-xs bg-primary/10 px-2 py-1 rounded">Active</span>
                  </button>
                  <button className="flex justify-between items-center p-4 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors">
                    <span>Platinum Gold</span>
                  </button>
                  <button className="flex justify-between items-center p-4 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors">
                    <span>Advanced Plus</span>
                  </button>
                  <button className="flex justify-between items-center p-4 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors">
                    <span>Standard Global</span>
                  </button>
                  <button className="flex justify-between items-center p-4 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors">
                    <span>Essential Core</span>
                  </button>
                  <button className="text-primary text-sm font-semibold mt-2 hover:underline text-left pl-4">+ View 3 Other Tiers</button>
                </div>
              </div>
            </div>
            <div className="bg-primary-container rounded-xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-lg font-bold mb-2">Impact Forecast</h4>
                <p className="text-primary-fixed-dim text-sm mb-6">Real-time simulation of changes to the &quot;Elite Platinum&quot; tier.</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm">Revenue Delta</span>
                    <span className="text-2xl font-bold">+12.4%</span>
                  </div>
                  <div className="w-full bg-primary/30 h-1 rounded-full">
                    <div className="bg-secondary-fixed w-3/4 h-1 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm">Member Retention Risk</span>
                    <span className="text-2xl font-bold text-secondary-fixed">LOW</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Configuration Workbench (Right Column) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Financial Parameters */}
            <div className="bg-surface-container-lowest p-8 rounded-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-headline font-bold">Financial Parameters</h3>
                <span className="text-xs font-medium px-3 py-1 bg-surface-container text-outline rounded-full">Modified 2d ago</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="block text-sm font-semibold">Annual Membership Premium</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input
                      className="w-full bg-surface-container-low border-none rounded-xl pl-8 pr-4 py-4 text-xl font-bold focus:ring-2 focus:ring-primary"
                      type="number"
                      value={annualPremium}
                      onChange={(e) => setAnnualPremium(Number(e.target.value))}
                    />
                  </div>
                  <p className="text-xs text-slate-400">Previous value: $11,200. Adjusts for regional inflation.</p>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-semibold">Deductible Threshold</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input
                      className="w-full bg-surface-container-low border-none rounded-xl pl-8 pr-4 py-4 text-xl font-bold focus:ring-2 focus:ring-primary"
                      type="number"
                      value={deductible}
                      onChange={(e) => setDeductible(Number(e.target.value))}
                    />
                  </div>
                  <p className="text-xs text-slate-400">Global standard for Elite tiers.</p>
                </div>
              </div>
            </div>

            {/* Benefit Percentages */}
            <div className="bg-surface-container-lowest p-8 rounded-xl">
              <h3 className="text-2xl font-headline font-bold mb-8">Benefit Coverage Matrix</h3>
              <div className="space-y-10">
                {/* Lab Coverage */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                        <Icon name="biotech" />
                      </div>
                      <span className="font-bold">Laboratory &amp; Diagnostics</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">{labCoverage}%</span>
                  </div>
                  <input
                    className="w-full h-2 bg-surface-container-low rounded-lg appearance-none cursor-pointer accent-primary"
                    max={100}
                    min={0}
                    type="range"
                    value={labCoverage}
                    onChange={(e) => setLabCoverage(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-slate-400 px-1">
                    <span>Standard: 80%</span>
                    <span>Maximum: 100%</span>
                  </div>
                </div>

                {/* Pharmacy Coverage */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-secondary">
                        <Icon name="medication" />
                      </div>
                      <span className="font-bold">Pharmaceuticals</span>
                    </div>
                    <span className="text-2xl font-bold text-secondary">{pharmaCoverage}%</span>
                  </div>
                  <input
                    className="w-full h-2 bg-surface-container-low rounded-lg appearance-none cursor-pointer accent-secondary"
                    max={100}
                    min={0}
                    type="range"
                    value={pharmaCoverage}
                    onChange={(e) => setPharmaCoverage(Number(e.target.value))}
                  />
                </div>

                {/* Surgery Coverage */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                        <Icon name="surgical" />
                      </div>
                      <span className="font-bold">Complex Surgery</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">{surgeryCoverage}%</span>
                  </div>
                  <input
                    className="w-full h-2 bg-surface-container-low rounded-lg appearance-none cursor-pointer accent-purple-600"
                    max={100}
                    min={0}
                    type="range"
                    value={surgeryCoverage}
                    onChange={(e) => setSurgeryCoverage(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Clinical Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-container-lowest p-8 rounded-xl">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Icon name="event_available" className="text-secondary" />
                  Annual Visit Limits
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">Specialist Consults</span>
                    <div className="flex items-center gap-3">
                      <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center">-</button>
                      <span className="font-bold w-8 text-center">Unlimited</span>
                      <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center">+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">Mental Health Sessions</span>
                    <div className="flex items-center gap-3">
                      <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center">-</button>
                      <span className="font-bold w-8 text-center">52</span>
                      <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center">+</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-8 rounded-xl border border-dashed border-outline-variant flex flex-col items-center justify-center text-center">
                <Icon name="add_circle" size="lg" className="text-slate-300 mb-2" />
                <p className="font-semibold text-slate-500">Add Limit Constraint</p>
                <p className="text-xs text-slate-400 mt-1">E.g. In-home nursing, Rehab</p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex justify-end gap-4 pt-8">
              <button className="px-8 py-3 rounded-xl font-semibold text-outline hover:bg-surface-container transition-colors">Discard Draft</button>
              <button className="px-8 py-3 rounded-xl font-semibold bg-primary text-white shadow-xl shadow-primary/30 hover:opacity-90 transition-opacity">Deploy Configuration Updates</button>
            </div>
          </div>
        </div>

        {/* Demographic Impact Visualization */}
        <section className="mt-16">
          <h3 className="text-2xl font-headline font-bold mb-8">Demographic Transition Analysis</h3>
          <div className="bg-surface-container-low rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-surface-container-lowest p-6 rounded-xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Affected Members</p>
                <h4 className="text-3xl font-extrabold text-primary">12,402</h4>
                <p className="text-xs text-secondary font-medium mt-2 flex items-center gap-1">
                  <Icon name="trending_up" className="!text-sm" />
                  +3.1% from Q3
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Average Utilization</p>
                <h4 className="text-3xl font-extrabold text-primary">82%</h4>
                <div className="mt-3 flex gap-1">
                  <div className="h-1 flex-1 bg-primary rounded-full"></div>
                  <div className="h-1 flex-1 bg-primary rounded-full"></div>
                  <div className="h-1 flex-1 bg-primary rounded-full"></div>
                  <div className="h-1 flex-1 bg-slate-200 rounded-full"></div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tier Migration</p>
                <h4 className="text-3xl font-extrabold text-on-surface">450</h4>
                <p className="text-xs text-slate-400 mt-2">Predicted upgrades to Elite</p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Net Promoter Score</p>
                <h4 className="text-3xl font-extrabold text-on-surface">78</h4>
                <p className="text-xs text-slate-400 mt-2">Stable premium sentiment</p>
              </div>
            </div>
            <div className="mt-12 h-64 w-full relative">
              {/* Faux Data Visualization */}
              <div className="absolute inset-0 flex items-end justify-between px-10">
                <div className="w-12 bg-primary/10 rounded-t-lg h-32 relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Jan</div>
                </div>
                <div className="w-12 bg-primary/20 rounded-t-lg h-48"></div>
                <div className="w-12 bg-primary/40 rounded-t-lg h-36"></div>
                <div className="w-12 bg-primary/60 rounded-t-lg h-56"></div>
                <div className="w-12 bg-primary/80 rounded-t-lg h-44"></div>
                <div className="w-12 bg-primary rounded-t-lg h-64"></div>
                <div className="w-12 bg-primary rounded-t-lg h-52"></div>
                <div className="w-12 bg-primary rounded-t-lg h-[232px]"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-outline-variant/30"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
