import { Icon } from "@/components/ui/icon";

export default function VisitHistoryPage() {
  return (
    <>
      {/* Editorial Header */}
      <header className="max-w-6xl mx-auto mb-12">
        <h1 className="font-headline text-5xl font-extrabold text-on-surface tracking-tight mb-2">Visit History</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl">A curated chronological record of all clinical encounters and registered patient interactions within your atelier.</p>
      </header>

      {/* Filters Section - Asymmetric Balance */}
      <section className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full md:w-auto">
            <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-2 ml-1">Patient Name</label>
            <div className="relative">
              <input
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 text-on-surface text-sm transition-all"
                placeholder="Filter by name..."
                type="text"
              />
              <Icon name="search" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" />
            </div>
          </div>
          <div className="w-full md:w-64">
            <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-2 ml-1">Date Range</label>
            <div className="relative">
              <input
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 text-on-surface text-sm transition-all"
                type="date"
              />
            </div>
          </div>
          <div className="w-full md:w-auto">
            <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-high hover:bg-surface-dim text-on-surface font-semibold text-sm rounded-xl transition-colors">
              <Icon name="tune" className="text-sm" />
              Advanced Filters
            </button>
          </div>
        </div>
      </section>

      {/* Table Section - Tonal Layering */}
      <section className="max-w-6xl mx-auto bg-surface-container-low rounded-2xl overflow-hidden p-1">
        <div className="bg-surface-container-lowest rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-outline">Date &amp; Time</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-outline">Patient</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-outline">Service Type</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-outline">Visit Note Snippet</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-outline text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {/* Entry 1 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-on-surface font-semibold text-sm">Oct 24, 2023</span>
                    <span className="text-xs text-outline">09:15 AM</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-xs font-bold">EM</div>
                    <span className="text-on-surface font-medium text-sm">Elena Moretti</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-container text-on-secondary-container">
                    Specialist
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-on-surface-variant line-clamp-1 max-w-xs">Post-operative follow-up. Healing progressing as expected. No signs of infection...</p>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors">
                    <Icon name="visibility" />
                  </button>
                </td>
              </tr>
              {/* Entry 2 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-on-surface font-semibold text-sm">Oct 23, 2023</span>
                    <span className="text-xs text-outline">02:30 PM</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary text-xs font-bold">JC</div>
                    <span className="text-on-surface font-medium text-sm">Julian Chen</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container-high text-on-surface-variant">
                    Generalist
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-on-surface-variant line-clamp-1 max-w-xs">Annual physical examination. Blood pressure slightly elevated. Recommended diet changes.</p>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors">
                    <Icon name="visibility" />
                  </button>
                </td>
              </tr>
              {/* Entry 3 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-on-surface font-semibold text-sm">Oct 21, 2023</span>
                    <span className="text-xs text-outline">11:00 AM</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-on-primary-container/20 flex items-center justify-center text-primary text-xs font-bold">SB</div>
                    <span className="text-on-surface font-medium text-sm">Sarah Bernard</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-container text-on-secondary-container">
                    Specialist
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-on-surface-variant line-clamp-1 max-w-xs">Dermatological consultation regarding persistent rash. Prescribed topical steroid.</p>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors">
                    <Icon name="visibility" />
                  </button>
                </td>
              </tr>
              {/* Entry 4 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-on-surface font-semibold text-sm">Oct 19, 2023</span>
                    <span className="text-xs text-outline">04:45 PM</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-container text-xs font-bold">MR</div>
                    <span className="text-on-surface font-medium text-sm">Marcus Rodriguez</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container-high text-on-surface-variant">
                    Generalist
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-on-surface-variant line-clamp-1 max-w-xs">Acute respiratory infection. Lungs clear. Advised rest and hydration.</p>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors">
                    <Icon name="visibility" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-6 text-sm text-outline">
          <span>Showing 1-4 of 128 registered encounters</span>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-surface-container-high rounded-lg disabled:opacity-30" disabled>
              <Icon name="chevron_left" />
            </button>
            <span className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold">1</span>
            <button className="px-4 py-2 hover:bg-surface-container-high rounded-lg transition-colors">2</button>
            <button className="px-4 py-2 hover:bg-surface-container-high rounded-lg transition-colors">3</button>
            <button className="p-2 hover:bg-surface-container-high rounded-lg">
              <Icon name="chevron_right" />
            </button>
          </div>
        </div>
      </section>

      {/* Vitals Contextual Card - Asymmetric Layout */}
      <section className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-surface-container-lowest/80 backdrop-blur-md p-8 rounded-2xl border-none flex items-center justify-between overflow-hidden relative">
          <div className="z-10">
            <h3 className="font-headline text-2xl font-bold text-primary mb-2">Clinical Trends</h3>
            <p className="text-on-surface-variant mb-6">Patient volume has increased by 12% this month. Ensure all notes are finalized within 24 hours.</p>
            <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm transition-transform active:scale-95">Generate Monthly Report</button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Icon name="analytics" filled className="text-[160px]" />
          </div>
        </div>
        <div className="bg-tertiary-container/30 p-8 rounded-2xl border-none">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="check_circle" className="text-tertiary" />
            <h3 className="font-headline font-bold text-tertiary">Efficiency Status</h3>
          </div>
          <p className="text-5xl font-headline font-black text-tertiary mb-2">98%</p>
          <p className="text-sm text-on-tertiary-fixed-variant">Note completion rate within the required clinical window.</p>
        </div>
      </section>
    </>
  );
}
