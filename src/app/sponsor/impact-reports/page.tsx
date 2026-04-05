import { Icon } from "@/components/ui/icon";

export default function ImpactReportsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Clinical Impact &amp; Outcomes</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg">Detailed analysis of the sponsored demographic&apos;s health trajectory and program utilization for Q3 2024.</p>
        </div>
        <button className="flex items-center gap-3 bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-primary/20 transition-all">
          <Icon name="download" />
          Download PDF Report
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/5 rounded-lg text-primary">
              <Icon name="group_add" filled />
            </div>
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">+12.4% vs LY</span>
          </div>
          <h4 className="text-outline font-medium text-sm mb-1">Lives Covered</h4>
          <p className="text-4xl font-extrabold text-on-surface">14,820</p>
          <div className="absolute bottom-0 left-0 h-1 bg-primary w-1/3 group-hover:w-full transition-all duration-500"></div>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-tertiary/5 rounded-lg text-tertiary">
              <Icon name="health_and_safety" filled />
            </div>
            <span className="text-xs font-bold text-tertiary uppercase tracking-widest">On Track</span>
          </div>
          <h4 className="text-outline font-medium text-sm mb-1">Preventative Care Utilization %</h4>
          <p className="text-4xl font-extrabold text-on-surface">68.5%</p>
          <div className="absolute bottom-0 left-0 h-1 bg-tertiary w-2/3 group-hover:w-full transition-all duration-500"></div>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-error/5 rounded-lg text-error">
              <Icon name="warning" filled />
            </div>
            <span className="text-xs font-bold text-error uppercase tracking-widest">-4.2% Reduction</span>
          </div>
          <h4 className="text-outline font-medium text-sm mb-1">Critical Health Alerts</h4>
          <p className="text-4xl font-extrabold text-on-surface">42</p>
          <div className="absolute bottom-0 left-0 h-1 bg-error w-1/4 group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-xl p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-bold text-on-surface">Healthcare Usage Trends</h3>
              <p className="text-sm text-on-surface-variant">Aggregate daily utilization across all clinics</p>
            </div>
            <div className="flex gap-2 bg-surface-container-highest p-1 rounded-lg">
              <button className="px-4 py-1.5 rounded-md bg-white text-xs font-bold shadow-sm">Monthly</button>
              <button className="px-4 py-1.5 rounded-md text-xs font-bold text-on-surface-variant">Weekly</button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            <div className="w-full bg-primary-fixed/30 rounded-t-lg h-[40%] hover:bg-primary transition-colors"></div>
            <div className="w-full bg-primary-fixed/30 rounded-t-lg h-[55%] hover:bg-primary transition-colors"></div>
            <div className="w-full bg-primary-fixed/30 rounded-t-lg h-[45%] hover:bg-primary transition-colors"></div>
            <div className="w-full bg-primary-fixed/30 rounded-t-lg h-[70%] hover:bg-primary transition-colors"></div>
            <div className="w-full bg-primary-fixed/30 rounded-t-lg h-[60%] hover:bg-primary transition-colors"></div>
            <div className="w-full bg-primary-fixed/30 rounded-t-lg h-[85%] hover:bg-primary transition-colors"></div>
            <div className="w-full bg-primary-fixed/30 rounded-t-lg h-[75%] hover:bg-primary transition-colors"></div>
            <div className="w-full bg-primary-fixed/30 rounded-t-lg h-[65%] hover:bg-primary transition-colors"></div>
            <div className="w-full bg-primary-fixed/30 rounded-t-lg h-[90%] hover:bg-primary transition-colors"></div>
            <div className="w-full bg-primary-fixed/30 rounded-t-lg h-[80%] hover:bg-primary transition-colors"></div>
            <div className="w-full bg-primary-fixed/30 rounded-t-lg h-[95%] hover:bg-primary transition-colors"></div>
            <div className="w-full bg-primary-fixed/30 rounded-t-lg h-[88%] hover:bg-primary transition-colors"></div>
          </div>
          <div className="flex justify-between mt-4 px-4 text-xs font-bold text-outline uppercase tracking-wider">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>
        {/* Secondary Metric Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10">
          <h3 className="text-xl font-bold mb-6">Patient Satisfaction</h3>
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12" />
              <circle className="text-secondary" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.9" strokeDashoffset="44.2" strokeWidth="12" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-on-surface">9.2</span>
              <span className="text-xs font-bold text-outline uppercase tracking-widest">NPS Score</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Quality of Care</span>
              <span className="font-bold">96%</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full">
              <div className="bg-secondary h-full w-[96%] rounded-full"></div>
            </div>
            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-on-surface-variant">Access Response</span>
              <span className="font-bold">88%</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full">
              <div className="bg-secondary h-full w-[88%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Impact Breakdown (Bento Grid) */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-on-surface">Program Impact Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Mental Health */}
          <div className="md:col-span-2 bg-surface-container-lowest rounded-xl overflow-hidden group">
            <div className="relative h-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Mental Health" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvACJ_FNoGy_GKzWNGV5wc2oDw2i588RjyGvFY8gugdQlkI1W7SFszDtme-QyXUF-1Ti4pNqAmiIP9ncZIljrJ3XpHrxGI9diIrQSqMTTkktrxZ_QjLJ4rckXCOVkP9PUdWmwTsKG0_J6VIX5xAaInjSL0hdyEhFKvPBVMmbh_ZdQvI4obB0CbvjLtZOPLbXnJ-VwbkCai8dZqurs0yQA26LiFL2JCr5-YsnODWLQEz3pvoB4B0xNaKw_WTjs8NfMGgRdhGfYpr5LY" />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface to-transparent opacity-60"></div>
              <div className="absolute bottom-6 left-6">
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Sector Lead</span>
                <h3 className="text-2xl font-bold text-white mt-2">Mental Health</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-outline uppercase mb-1">Impact Score</p>
                  <p className="text-3xl font-extrabold text-primary">A+</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-outline uppercase mb-1">Clinical Recovery</p>
                  <p className="text-lg font-bold text-on-surface">32% Increase</p>
                </div>
              </div>
            </div>
          </div>
          {/* Metabolic */}
          <div className="bg-surface-container-low rounded-xl p-6 flex flex-col justify-between">
            <div>
              <Icon name="monitor_heart" className="text-secondary text-4xl mb-4" />
              <h3 className="text-xl font-bold text-on-surface mb-2">Metabolic</h3>
              <p className="text-sm text-on-surface-variant">Glucose and BMI tracking optimization.</p>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold">18%</span>
                <span className="text-xs font-bold text-secondary">Stabilized</span>
              </div>
              <div className="w-full bg-outline-variant/30 h-1 rounded-full">
                <div className="bg-secondary h-full w-[45%] rounded-full"></div>
              </div>
            </div>
          </div>
          {/* Preventative */}
          <div className="bg-primary text-white rounded-xl p-6 flex flex-col justify-between">
            <div>
              <Icon name="verified_user" className="text-primary-fixed text-4xl mb-4" />
              <h3 className="text-xl font-bold mb-2">Preventative</h3>
              <p className="text-sm text-primary-fixed/80">Screening adherence and vaccination rates.</p>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold">92%</span>
                <span className="text-xs font-bold text-primary-fixed">Adherence</span>
              </div>
              <div className="w-full bg-white/20 h-1 rounded-full">
                <div className="bg-white h-full w-[92%] rounded-full"></div>
              </div>
            </div>
          </div>
          {/* Specialty Care */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-tertiary-fixed rounded-lg flex items-center justify-center text-on-tertiary-fixed">
                <Icon name="biotech" />
              </div>
              <h3 className="font-bold">Specialty Care</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-outline">Referral Speed</span>
                <span className="text-sm font-bold text-on-surface">2.4 Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-outline">Provider Rating</span>
                <span className="text-sm font-bold text-on-surface">4.8/5.0</span>
              </div>
            </div>
          </div>
          {/* Population Health Stats */}
          <div className="md:col-span-3 bg-surface-container-lowest rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 border border-outline-variant/10">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Population Demographics</h3>
              <p className="text-on-surface-variant text-sm mb-6">The current utilization skew shows a significant engagement from the 35-50 age bracket, representing a core focus for metabolic health initiatives.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <span className="text-xs font-bold text-outline uppercase block mb-1">Avg Age</span>
                  <span className="text-xl font-bold">42.8 Yrs</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <span className="text-xs font-bold text-outline uppercase block mb-1">Gender Dist</span>
                  <span className="text-xl font-bold">54/46 F:M</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-64 h-48 bg-surface-container-high rounded-xl relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover" alt="Analytics Dashboard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAETRBcImCMPHr4DXB55-axlskS9WsnjOcEcyJOBnMnqwUQibKXV8uYr8t7Wafuc_saPGwM7kqyA9m_OYRuYgK5xH5hKBAxpsxWNLQonpvIHKhZg_7kDTXbrYjMoSEvBKlw-rTzcUswMOQx6MOquoUKlP3SCA-zSa0hxL8d87QvB4kZZTHg8_x4rp0cJJmuBY-mXPxUe9blJYN-Juxy61c-7IH8i91L40iJQxWV0xGd8Pjiiddwf6C9GtYroTc402v8KKfKVAYQyUrB" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="h-24"></div>
    </div>
  );
}
