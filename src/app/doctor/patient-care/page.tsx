import { Icon } from "@/components/ui/icon";

export default function PatientCarePage() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 right-0 left-0 md:left-64 z-40 flex justify-between items-center px-6 py-3 bg-slate-50/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="font-headline font-bold text-lg tracking-tight text-blue-900">Patient Care</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden sm:block">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary w-64 transition-all"
              placeholder="Search roster..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <Icon name="notifications" className="text-slate-500 cursor-pointer hover:bg-slate-100 p-2 rounded-full transition-colors" />
            <Icon name="settings" className="text-slate-500 cursor-pointer hover:bg-slate-100 p-2 rounded-full transition-colors" />
            <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Doctor profile avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDurhin770gFCvyKJwh3qv_Fi0Et4LBMXlGE4DrfH2KMi-IJd_EFMG1LY2AiVvXSLJ2AIXytc3cy-kN_wLuBwnI3dCNcNRUHGSsyL9hCKIROmCfoMnmXDzBlGLDA_TK_I_m7-WCLL9tmV59P--bmD00OPUg75akdvo3QQt1_UyOuBN__VT5wdTeX59o-hBCAm4ootmtzzrhVcFKo76l28Yg9zO7_Ho-F9PF82jTNQ6bHhQ_5K90fYKo_zxiHtWhVM9xh3I6vtiFkGsK"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content Canvas */}
      <div className="pt-24 px-8 pb-12">
        {/* Hero / Welcome */}
        <section className="mb-12">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-2">Good morning, Dr. Celestin</h3>
              <p className="text-on-surface-variant max-w-xl">You have <span className="font-bold text-primary">8 patients</span> scheduled for today. Your first consultation starts in 15 minutes.</p>
            </div>
            <div className="hidden lg:block">
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-tertiary-fixed flex items-center justify-center">
                  <Icon name="analytics" className="text-tertiary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Clinic Efficiency</p>
                  <p className="text-lg font-black text-on-surface">94%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Layout Content */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Upcoming Appointments */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-4 border-primary">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-headline font-bold text-lg">Next Appointment</h4>
                <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full">IN 15 MIN</span>
              </div>
              <div className="flex items-start gap-4 mb-8">
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-full object-cover"
                    alt="Marie-Claire Baptiste"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0ins7BBbX7YCOeMzVJGvgwmNAAtwqAO2yXylconfaCFC2roNAaM7tETZIU-qpaEw3Rhb0hR9e_vqqGb0C2Pmk0GRHf0seR0ViUyp_7mql5VhmXPNEWbaiVOo1hdCOaxiyOaI3SG_pQsK3RyZrGMuvlRc5H9kHhufzZQnv6w9jhiw5RpcSF09JbZmXHOZA2T78pTedltmG7uUm2W_0SrJIlFDc1h6piGIAomEbPaLGjRim8DgLiAKRgcWMAyHCU7IyPG7U3vi8VxB4"
                  />
                </div>
                <div>
                  <h5 className="font-bold text-on-surface">Marie-Claire Baptiste</h5>
                  <p className="text-sm text-on-surface-variant">Type 2 Diabetes Follow-up</p>
                  <div className="flex gap-2 mt-2">
                    <Icon name="calendar_today" className="text-xs text-primary" />
                    <span className="text-xs font-semibold text-primary">10:30 AM</span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary text-white py-4 rounded-xl font-headline font-bold hover:bg-primary-container transition-colors flex items-center justify-center gap-2 group">
                <Icon name="play_circle" filled className="group-hover:translate-x-1 transition-transform" />
                Start Consultation
              </button>
            </div>

            <div className="bg-surface-container-low p-6 rounded-xl">
              <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-500 mb-4">Daily Queue</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <p className="text-sm font-semibold">Jean-Pierre Noel</p>
                  </div>
                  <span className="text-xs text-slate-400">11:15 AM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <p className="text-sm font-semibold">Lucie Desir</p>
                  </div>
                  <span className="text-xs text-slate-400">12:00 PM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <p className="text-sm font-semibold">Samuel Etienne</p>
                  </div>
                  <span className="text-xs text-slate-400">02:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Patient Roster (Main Table) */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-headline font-bold text-xl">Patient Roster</h4>
                  <p className="text-sm text-on-surface-variant">Manage and monitor your assigned clinical roster</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-outline-variant rounded-lg hover:bg-slate-50">
                    <Icon name="filter_list" className="text-slate-600" />
                  </button>
                  <button className="p-2 border border-outline-variant rounded-lg hover:bg-slate-50">
                    <Icon name="download" className="text-slate-600" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Age</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Visit</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-primary text-xs">AM</div>
                          <div>
                            <p className="font-semibold text-sm">Alain Marseille</p>
                            <p className="text-xs text-slate-400">ID: #VS-4492</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          Stable
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">42</td>
                      <td className="px-6 py-4 text-sm text-slate-500">Oct 12, 2023</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:underline text-sm font-bold">View Chart</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center font-bold text-error text-xs">ED</div>
                          <div>
                            <p className="font-semibold text-sm">Elena Duval</p>
                            <p className="text-xs text-slate-400">ID: #VS-9910</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-error-container text-on-error-container">
                          <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                          Critical
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">29</td>
                      <td className="px-6 py-4 text-sm text-slate-500">Nov 05, 2023</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:underline text-sm font-bold">View Chart</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-700 text-xs">RJ</div>
                          <div>
                            <p className="font-semibold text-sm">Ricardo Jean</p>
                            <p className="text-xs text-slate-400">ID: #VS-3321</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          At Risk
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">64</td>
                      <td className="px-6 py-4 text-sm text-slate-500">Nov 01, 2023</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:underline text-sm font-bold">View Chart</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">MH</div>
                          <div>
                            <p className="font-semibold text-sm">Martine Hyppolite</p>
                            <p className="text-xs text-slate-400">ID: #VS-5521</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Recovered
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">51</td>
                      <td className="px-6 py-4 text-sm text-slate-500">Oct 28, 2023</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:underline text-sm font-bold">View Chart</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-surface-container-low flex items-center justify-between">
                <p className="text-xs text-on-surface-variant font-medium">Showing 4 of 248 patients</p>
                <div className="flex gap-4">
                  <button className="text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
                  <button className="text-xs font-bold text-primary">Next Page</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vitals Snapshot */}
        <section className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest/60 backdrop-blur-md p-6 rounded-xl border border-white/50">
              <div className="flex items-center gap-4 mb-4">
                <Icon name="group" className="text-primary" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Cases</span>
              </div>
              <p className="text-3xl font-black text-on-surface">124</p>
              <p className="text-xs text-secondary font-bold mt-1">+12% this month</p>
            </div>
            <div className="bg-surface-container-lowest/60 backdrop-blur-md p-6 rounded-xl border border-white/50">
              <div className="flex items-center gap-4 mb-4">
                <Icon name="event_note" className="text-primary" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Today&apos;s Visits</span>
              </div>
              <p className="text-3xl font-black text-on-surface">08</p>
              <p className="text-xs text-on-surface-variant mt-1">4 morning / 4 afternoon</p>
            </div>
            <div className="bg-surface-container-lowest/60 backdrop-blur-md p-6 rounded-xl border border-white/50">
              <div className="flex items-center gap-4 mb-4">
                <Icon name="pending_actions" className="text-primary" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reports Due</span>
              </div>
              <p className="text-3xl font-black text-on-surface">03</p>
              <p className="text-xs text-error font-bold mt-1">Due by EOD</p>
            </div>
            <div className="bg-surface-container-lowest/60 backdrop-blur-md p-6 rounded-xl border border-white/50">
              <div className="flex items-center gap-4 mb-4">
                <Icon name="star" className="text-primary" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Patient Rating</span>
              </div>
              <p className="text-3xl font-black text-on-surface">4.9</p>
              <p className="text-xs text-on-surface-variant mt-1">Based on 1.2k reviews</p>
            </div>
          </div>
        </section>
      </div>

      {/* Contextual FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-primary/20 active:scale-95 transition-all z-50">
        <Icon name="add_comment" />
      </button>
    </>
  );
}
