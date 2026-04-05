import { Icon } from "@/components/ui/icon";

export default function FundedMembersPage() {
  return (
    <>
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-secondary font-semibold text-sm tracking-widest uppercase mb-2 block">Institutional Management</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">Funded Members Directory</h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Review and manage your institution&apos;s active healthcare sponsorships. Monitor coverage status and health outcomes for your supported community.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-primary text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-container transition-all">
            <Icon name="person_add" /> Sponsor New Member
          </button>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="bg-surface-container-low p-2 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
          <input
            className="w-full bg-surface-container-lowest border-none py-4 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface"
            placeholder="Search by name, ID, or plan type..."
            type="text"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-4 bg-surface-container-lowest text-on-surface font-medium rounded-xl flex items-center justify-center gap-2 border border-transparent hover:border-outline-variant transition-all">
            <Icon name="filter_list" /> Filters
          </button>
          <button className="flex-1 md:flex-none px-6 py-4 bg-surface-container-lowest text-on-surface font-medium rounded-xl flex items-center justify-center gap-2 border border-transparent hover:border-outline-variant transition-all">
            <Icon name="file_download" /> Export
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-outline">Member Name</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Plan Type</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Coverage Period</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Health Status</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {/* Member Row 1 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="Jean-Baptiste Dupont" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBI4km6JDNmK-zaGKto9gzximBoEEvsUfiFd1nn_pfpZvTpX4J_7_2ah6SrrN4xTWJxOIp_bEFeMU_oGv2Qg0_iNGuZjg-eEdG-FO_7cFXFMKj-rP3wOY6DwMK3BItAWkaIPCMm1d5rNvy_tK3UUsc9o2xptVo54cOQ_k1lC8PViL2W8XmF9VV_Esbq-1R8_iuZrFn2mHaSip0QvQM2s7Yb1-ppadsHCqfPgzbpvBtUI11eGy96X4a_TQCtuJRAptdoWJJy_FRUHrhM" />
                    <div>
                      <p className="font-bold text-on-surface text-lg">Jean-Baptiste Dupont</p>
                      <p className="text-xs text-outline font-medium tracking-tight">ID: VSC-1029-HT</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold uppercase tracking-wider">Elite Premium</span>
                </td>
                <td className="px-6 py-6">
                  <p className="text-sm font-medium text-on-surface">Jan 2024 — Dec 2024</p>
                  <p className="text-[11px] text-secondary font-semibold">10 months remaining</p>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                    <span className="text-sm font-semibold text-tertiary">Active/Covered</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <button className="px-4 py-2 text-primary font-bold hover:bg-primary-fixed rounded-lg transition-all text-sm">Details</button>
                </td>
              </tr>
              {/* Member Row 2 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="Marie-Claire Saint-Lot" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnhub7tXtn9An8nr9yR40MjQAngX6HlPFxsHrKcDbzuTZchcREKeWy7IgnJHzVfNKRD6AlBserQUcewbbHOZPl6pAe8g5cyYlA-aT7wo4CcUfSt2DO3xEoEaOy28kg45mkIjiRkel_uYWz1LNI7jG95Qkr_s6Qvd0AUDiGZ5_S4TwpJYBMAH5DjcmK5poZOERI4GkVittkZFS8Ng2EizUIlVj5opHgMrZOE-9YYZKSWX8YmVz-LHoyYEADMs45iXnhWSxQqIjAGfxb" />
                    <div>
                      <p className="font-bold text-on-surface text-lg">Marie-Claire Saint-Lot</p>
                      <p className="text-xs text-outline font-medium tracking-tight">ID: VSC-8841-HT</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider">Family Essential</span>
                </td>
                <td className="px-6 py-6">
                  <p className="text-sm font-medium text-on-surface">Mar 2024 — Mar 2025</p>
                  <p className="text-[11px] text-outline font-medium italic">Recently Renewed</p>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                    <span className="text-sm font-semibold text-tertiary">Active/Covered</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <button className="px-4 py-2 text-primary font-bold hover:bg-primary-fixed rounded-lg transition-all text-sm">Details</button>
                </td>
              </tr>
              {/* Member Row 3 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="Emmanuel Célestin" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm8oy3VAYVnVL8HcGtJFUqIm7URAXd9Z7Uj5lYH1pz2F990BEBCU6Jz-DYc73d4o_xmBpLeD3wGd5mlwbeIf4pjhHz9802WBYeIMAV9eQD5ajrSZf8knVfxL49DM3eRdSxKwUn4GCqqWXElTjfVkhJMmPb5ro5tdrw3g8X1LdsIUlZK0iWMMf9ZeMmftGgdjymn0sx1PL-z6r8pXu254n98EwJxiychl8p_tIjq3S1f0okdJSnZmlme02W-HjAUYw5piBmcp-FbbgS" />
                    <div>
                      <p className="font-bold text-on-surface text-lg">Emmanuel Célestin</p>
                      <p className="text-xs text-outline font-medium tracking-tight">ID: VSC-5520-HT</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="px-4 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold uppercase tracking-wider">Vitality+</span>
                </td>
                <td className="px-6 py-6">
                  <p className="text-sm font-medium text-on-surface">Jun 2023 — Jun 2024</p>
                  <p className="text-[11px] text-error font-bold italic">Expiring in 14 days</p>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                    <span className="text-sm font-semibold text-tertiary">Active/Covered</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <button className="px-4 py-2 text-primary font-bold hover:bg-primary-fixed rounded-lg transition-all text-sm">Details</button>
                </td>
              </tr>
              {/* Member Row 4 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="Fabienne Guerrier" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfwO4J739qsPTNUbVU33mjKow_G5_dEQTiVmwJOGg61p-0VfTRS82Wynv2u56tUq6JHj5999kkwT1yrke0yQeLvrloHTskL7aI7N1Ll0Zy6zjAiA0CT54uyRmYaWbRjn_3TVBcy4cUpzI3wNSp1Vql6z6-3dLYIoC1JQb49Y4lxKSAoAKk0BblphZfk8JVI5ZHBcBEbBBNiuvGB8iivSfS9mgaAqW-ajj7KYMJ2xGQRJIWndbY93AmLRUzIbCMlnoRylL8u0cjCrNm" />
                    <div>
                      <p className="font-bold text-on-surface text-lg">Fabienne Guerrier</p>
                      <p className="text-xs text-outline font-medium tracking-tight">ID: VSC-0032-HT</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold uppercase tracking-wider">Elite Premium</span>
                </td>
                <td className="px-6 py-6">
                  <p className="text-sm font-medium text-on-surface">Aug 2023 — Aug 2024</p>
                  <p className="text-[11px] text-secondary font-semibold">4 months remaining</p>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                    <span className="text-sm font-semibold text-tertiary">Active/Covered</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <button className="px-4 py-2 text-primary font-bold hover:bg-primary-fixed rounded-lg transition-all text-sm">Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-8 py-6 bg-surface-container-low/30 border-t border-surface-container flex items-center justify-between">
          <p className="text-sm text-outline">Showing <span className="font-bold text-on-surface">1-4</span> of <span className="font-bold text-on-surface">124</span> funded members</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-surface-container-high transition-all disabled:opacity-30" disabled>
              <Icon name="chevron_left" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-primary text-white font-bold text-sm">1</button>
            <button className="w-10 h-10 rounded-lg hover:bg-surface-container-high font-medium text-sm">2</button>
            <button className="w-10 h-10 rounded-lg hover:bg-surface-container-high font-medium text-sm">3</button>
            <span className="px-2">...</span>
            <button className="w-10 h-10 rounded-lg hover:bg-surface-container-high font-medium text-sm">31</button>
            <button className="p-2 rounded-lg hover:bg-surface-container-high transition-all">
              <Icon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Analytics Teaser (Asymmetric Layout) */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container p-8 rounded-2xl text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Impact Summary</h3>
            <p className="text-on-primary-container/80 max-w-sm">Your institution is currently supporting 124 lives with a 98% active coverage rate. The health satisfaction score among your members is up 12% this quarter.</p>
          </div>
          <div className="flex items-end gap-12 mt-8 relative z-10">
            <div>
              <p className="text-4xl font-extrabold tracking-tighter">124</p>
              <p className="text-xs uppercase tracking-widest text-on-primary-container">Total Members</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold tracking-tighter">$42.8k</p>
              <p className="text-xs uppercase tracking-widest text-on-primary-container">Funded to Date</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold tracking-tighter">98.2%</p>
              <p className="text-xs uppercase tracking-widest text-on-primary-container">Adherence Rate</p>
            </div>
          </div>
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-2xl flex flex-col justify-center border border-surface-container group hover:shadow-xl hover:shadow-primary/5 transition-all">
          <Icon name="clinical_notes" className="text-4xl text-secondary mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">Quick Reports</h3>
          <p className="text-on-surface-variant text-sm mb-6">Download the latest clinical outcome report for your sponsored group.</p>
          <button className="mt-auto py-3 text-secondary font-bold border-b-2 border-secondary/20 hover:border-secondary transition-all text-left flex items-center gap-2">
            Generate Report <Icon name="arrow_forward" className="text-sm" />
          </button>
        </div>
      </section>
    </>
  );
}
