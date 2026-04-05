import { Icon } from "@/components/ui/icon";

export default function SponsorOverview() {
  return (
    <>
      {/* Hero Editorial Header */}
      <header className="mb-12">
        <p className="text-secondary font-semibold tracking-widest uppercase text-xs mb-2">Institutional Dashboard</p>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight max-w-2xl">
          Elevating healthcare standards for our global community.
        </h1>
      </header>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Total Investment */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(0,27,63,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon name="payments" className="text-6xl text-primary" />
          </div>
          <p className="text-sm font-medium text-on-surface-variant mb-4">Total Investment</p>
          <h2 className="text-3xl font-bold text-primary mb-1">$450,200</h2>
          <div className="flex items-center gap-1 text-secondary font-bold text-sm">
            <Icon name="trending_up" className="text-sm" />
            <span>+12.4% vs LY</span>
          </div>
        </div>
        {/* Active Beneficiaries */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(0,27,63,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon name="diversity_3" className="text-6xl text-primary" />
          </div>
          <p className="text-sm font-medium text-on-surface-variant mb-4">Active Beneficiaries</p>
          <h2 className="text-3xl font-bold text-primary mb-1">1,284</h2>
          <div className="flex items-center gap-1 text-secondary font-bold text-sm">
            <Icon name="add" className="text-sm" />
            <span>42 new this month</span>
          </div>
        </div>
        {/* Health Outcomes */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(0,27,63,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon name="monitor_heart" className="text-6xl text-tertiary" />
          </div>
          <p className="text-sm font-medium text-on-surface-variant mb-4">Health Outcomes</p>
          <h2 className="text-3xl font-bold text-tertiary mb-1">94.2%</h2>
          <div className="flex items-center gap-1 text-tertiary font-bold text-sm">
            <Icon name="check_circle" className="text-sm" />
            <span>Exceeding targets</span>
          </div>
        </div>
      </section>

      {/* Main Layout: Chart & Highlights (Asymmetric) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Monthly Trends Chart */}
        <div className="lg:col-span-8 bg-surface-container-low rounded-xl p-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-1">Community Impact Trends</h3>
              <p className="text-sm text-on-surface-variant">Preventative care engagement over the last 6 months</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1 bg-surface-container-lowest text-xs font-bold rounded-lg border border-outline-variant/30">Monthly</button>
              <button className="px-4 py-1 text-xs font-medium rounded-lg text-on-surface-variant">Quarterly</button>
            </div>
          </div>
          {/* Mock Chart Visualization */}
          <div className="relative h-64 flex items-end justify-between px-4 pb-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-outline"></div>
              <div className="border-b border-outline"></div>
              <div className="border-b border-outline"></div>
              <div className="border-b border-outline"></div>
            </div>
            <div className="group relative flex flex-col items-center gap-2">
              <div className="w-12 bg-primary/20 rounded-t-lg h-32 group-hover:bg-primary transition-colors"></div>
              <span className="text-[10px] font-bold text-outline">JAN</span>
            </div>
            <div className="group relative flex flex-col items-center gap-2">
              <div className="w-12 bg-primary/20 rounded-t-lg h-40 group-hover:bg-primary transition-colors"></div>
              <span className="text-[10px] font-bold text-outline">FEB</span>
            </div>
            <div className="group relative flex flex-col items-center gap-2">
              <div className="w-12 bg-primary/20 rounded-t-lg h-48 group-hover:bg-primary transition-colors"></div>
              <span className="text-[10px] font-bold text-outline">MAR</span>
            </div>
            <div className="group relative flex flex-col items-center gap-2">
              <div className="w-12 bg-primary/20 rounded-t-lg h-44 group-hover:bg-primary transition-colors"></div>
              <span className="text-[10px] font-bold text-outline">APR</span>
            </div>
            <div className="group relative flex flex-col items-center gap-2">
              <div className="w-12 bg-primary/20 rounded-t-lg h-56 group-hover:bg-primary transition-colors"></div>
              <span className="text-[10px] font-bold text-outline">MAY</span>
            </div>
            <div className="group relative flex flex-col items-center gap-2">
              <div className="w-12 bg-primary-container rounded-t-lg h-60"></div>
              <span className="text-[10px] font-bold text-primary">JUN</span>
            </div>
          </div>
        </div>

        {/* Wellness Champion Card */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,27,63,0.06)] border border-outline-variant/10">
            <div className="h-48 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Dr. Luc Dessalines"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgPKyvzAyeQJlv1DcDl5_7M95-j2eb1c65AtH_aMPeBJOlx5bfcr_g0_Uarlw-57QetEvCDSVmKYPM-bY0-wlP-eLoxqSQNLNzzUDQSfJsAgn3FdLGeSg2QU_hCcvInpyU9l07W8C_yDItY0Jm8YXqBXN464pe2jWwiNqvUU6wph9QhpCCthuhEyYtSF4kD448XMPqD4DqH6XuNvT-Yfzv9JcwU7liuokheAVvqQMU9opz1Ux64qafl835zS0pnwM1saOcg9nYTJ6c"
              />
              <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
                <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Wellness Champion</span>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold text-primary mb-1">Dr. Luc Dessalines</h4>
              <p className="text-sm text-on-surface-variant mb-4 italic">&ldquo;Transforming healthcare access through community resilience.&rdquo;</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">Dr. Dessalines has facilitated over 200 pediatric screenings this month in our sponsored zones, achieving 100% vaccination compliance.</p>
              <hr className="my-4 border-surface-container" />
              <button className="text-primary text-xs font-bold flex items-center gap-2 hover:gap-3 transition-all">
                VIEW FULL IMPACT STORY <Icon name="arrow_forward" className="text-xs" />
              </button>
            </div>
          </div>

          {/* Sponsor CTA Banner */}
          <div className="bg-gradient-to-br from-primary to-primary-container rounded-xl p-8 text-white relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <Icon name="volunteer_activism" className="text-[160px]" />
            </div>
            <h4 className="text-2xl font-bold mb-3">Scale Your Impact</h4>
            <p className="text-sm text-primary-fixed/80 mb-6 leading-relaxed">We have 142 families in need of immediate preventative care coverage. Every sponsorship changes a life.</p>
            <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm shadow-xl hover:bg-primary-fixed transition-colors active:scale-95">Sponsor New Members</button>
          </div>
        </div>
      </section>

      {/* Secondary Insights / Vitals Row */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/40 backdrop-blur-md border border-outline-variant/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="favorite" className="text-secondary" filled />
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Cardiac Health</span>
          </div>
          <p className="text-2xl font-bold text-primary">+14%</p>
          <p className="text-[10px] text-outline mt-1 uppercase">Reduction in risk factors</p>
        </div>
        <div className="bg-white/40 backdrop-blur-md border border-outline-variant/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="child_care" className="text-secondary" filled />
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Pediatric Care</span>
          </div>
          <p className="text-2xl font-bold text-primary">892</p>
          <p className="text-[10px] text-outline mt-1 uppercase">Children fully covered</p>
        </div>
        <div className="bg-white/40 backdrop-blur-md border border-outline-variant/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="medication" className="text-secondary" filled />
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Med Adherence</span>
          </div>
          <p className="text-2xl font-bold text-primary">98%</p>
          <p className="text-[10px] text-outline mt-1 uppercase">Consistency in chronic care</p>
        </div>
        <div className="bg-white/40 backdrop-blur-md border border-outline-variant/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="psychology" className="text-secondary" filled />
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Mental Wellness</span>
          </div>
          <p className="text-2xl font-bold text-primary">450</p>
          <p className="text-[10px] text-outline mt-1 uppercase">Counseling sessions funded</p>
        </div>
      </section>

      {/* Contextual FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <Icon name="add" />
      </button>
    </>
  );
}
