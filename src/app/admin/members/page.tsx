import { Icon } from "@/components/ui/icon";

export default function AdminMembersPage() {
  return (
    <div className="min-h-screen">
      {/* TopNavBar */}
      <header className="flex justify-between items-center h-16 px-8 sticky top-0 z-40 bg-white/80 backdrop-blur-md text-sm shadow-sm">
        <div className="flex items-center gap-8">
          <span className="text-primary font-bold text-lg">Admin Console</span>
          <nav className="hidden md:flex gap-6">
            <a className="text-blue-700 font-semibold transition-opacity hover:opacity-80" href="#">Directives</a>
            <a className="text-slate-600 transition-opacity hover:opacity-80" href="#">Live Monitor</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex items-center bg-surface-container-low rounded-full px-4 py-1.5 focus-within:bg-white focus-within:ring-2 ring-primary/20 transition-all">
            <Icon name="search" className="text-slate-400 !text-lg" />
            <input className="bg-transparent border-none focus:ring-0 text-xs w-48 placeholder:text-slate-400" placeholder="Search members..." type="text" />
          </div>
          <button className="p-2 text-slate-600 hover:text-primary transition-colors">
            <Icon name="notifications" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Administrator Avatar" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5Rpsy6XcU-j6cetcPg6YrhHQKWan-Vl2j_lQKJ3W4pfQat8C9qr91i0lqr84MrlfFREwAoyF6odwVxL4D5VRWhaDbHf6Z2WGzale-Av22JQ7JYJj9FctnGvYC24pfdggWPEHkM9_QjlJocSqHybczBcJf8rrOER0V8JgmFpmxkH_548NVlVFS6b6UKOsDoKwzSJsRhXcvZfT3UmCuDMvBo2yIh5HbPhTfsa0ABmBnBvpix7LSEbdAJMXp9qZROvV5nVKYzdbemb-q" />
            <Icon name="account_circle" className="text-slate-600" />
          </div>
        </div>
      </header>

      {/* Page Header Section */}
      <section className="px-10 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">
              <span>Directives</span>
              <Icon name="chevron_right" className="!text-[10px]" />
              <span className="text-primary">Member Management</span>
            </nav>
            <h2 className="font-headline text-4xl font-extrabold text-on-background tracking-tight">Active Registrations</h2>
            <p className="text-on-surface-variant mt-2 max-w-xl">Oversee and manage the complete lifecycle of clinical members within the Vita Azure ecosystem.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-surface-container-low text-on-surface font-semibold px-6 py-3 rounded-xl hover:bg-surface-container-high transition-colors flex items-center gap-2">
              <Icon name="filter_list" />
              Filters
            </button>
            <button className="bg-gradient-to-br from-primary to-primary-container text-white font-bold px-6 py-3 rounded-xl hover:opacity-95 transition-all shadow-lg shadow-primary/10 flex items-center gap-2">
              <Icon name="person_add" />
              New Member
            </button>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="px-10 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Total Members</p>
          <h3 className="text-3xl font-headline font-extrabold text-primary">2,842</h3>
          <div className="flex items-center gap-1 mt-2 text-tertiary text-xs font-bold">
            <Icon name="trending_up" className="!text-sm" />
            <span>12% from last month</span>
          </div>
        </div>
        <div className="md:col-span-1 bg-surface-container-lowest p-6 rounded-xl border-l-4 border-secondary">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Premium Tier</p>
          <h3 className="text-3xl font-headline font-extrabold text-secondary">1,105</h3>
          <p className="text-xs text-on-surface-variant mt-2">Active Vita Directives</p>
        </div>
        <div className="md:col-span-2 bg-gradient-to-r from-primary to-primary-container p-6 rounded-xl text-white flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold">System Integrity Check</h4>
            <p className="text-primary-fixed-dim text-sm mt-1">98.4% of member documentation is verified for Q3.</p>
          </div>
          <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm transition-all text-xs font-bold uppercase tracking-widest">
            Run Audit
          </button>
        </div>
      </section>

      {/* Filterable Member Table */}
      <section className="px-10 pb-12">
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
          {/* Bulk Actions Toolbar */}
          <div className="px-6 py-4 flex items-center justify-between bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input className="rounded text-primary focus:ring-primary" type="checkbox" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select All</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-200"></div>
              <div className="flex items-center gap-4">
                <button className="text-slate-400 hover:text-primary flex items-center gap-1.5 transition-colors">
                  <Icon name="mail" className="!text-lg" />
                  <span className="text-xs font-semibold">Message</span>
                </button>
                <button className="text-slate-400 hover:text-error flex items-center gap-1.5 transition-colors">
                  <Icon name="archive" className="!text-lg" />
                  <span className="text-xs font-semibold">Archive</span>
                </button>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Showing 1-8 of 2,842 members
            </div>
          </div>

          {/* Main Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Member Identity</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">NIF / Identifier</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Medical Plan</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">City</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {/* Row 1 */}
                <tr className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="Member Avatar" className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvzO1ywh2OgV4Ys5yN0fR4-q8uNF1akSqSxyxklEvbzDujBVKtcwN13mtIgO9Paxck000vtY8ftgR5h5RUL9Sabygr439cqLaFcVKSKZz2gp8zn4GtCKjrEQz35FK3Rk5qKvqa2tNLPquM7Sm2CI8mlbVxKLBtXayu6dMxhmRbAX4cUQ5uohU8ZzaMvxtH922R74LQGr7mdaAqfuzEb3gakBX25JdbTDsA191O3NGBm-gT1CRrR2nM6V1rkNU4QT1zV4gZnOBdt86M" />
                      <div>
                        <p className="text-sm font-bold text-on-surface">Jean-Claude Baptiste</p>
                        <p className="text-[11px] text-slate-400">j.baptiste@atelier.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-mono text-xs text-slate-500 tracking-wider">003-452-981-1</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/5 text-primary">Vita Azure Plus</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs text-slate-600">Port-au-Prince</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      <span className="text-xs font-bold text-secondary">Verified</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-primary/5 rounded-lg text-slate-400 hover:text-primary transition-all">
                      <Icon name="more_vert" />
                    </button>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="Member Avatar" className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFXKeobcHVIVpVPLNJWpqgadxuMtDyfg18DxR6szVaLl2-zBTcEl1-_d5aRtMGI5qQkmCAbuyeO3JBBU9hYUuHIhkTTKBhyGEGgPZo0qsmn713usXj8cqT6UqbSb5vk33YTgyy_Gg8zVbol8xnuIVWdFMtbsy0BsykOpREkKeeLifeECMw1BSptj12MAEaYSXG_2LKANVvyXOf5MXkWEFvXsoRMvD0AHBfVfk596BAzkDF-y6tOw_jmJhdbJrc65SdiInVe9BKo0ST" />
                      <div>
                        <p className="text-sm font-bold text-on-surface">Marie-Claire Estim&#233;</p>
                        <p className="text-[11px] text-slate-400">mc.estime@atelier.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-mono text-xs text-slate-500 tracking-wider">005-221-344-2</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/5 text-primary">Essential Care</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs text-slate-600">Cap-Ha&#239;tien</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      <span className="text-xs font-bold text-secondary">Verified</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-primary/5 rounded-lg text-slate-400 hover:text-primary transition-all">
                      <Icon name="more_vert" />
                    </button>
                  </td>
                </tr>
                {/* Row 3 */}
                <tr className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="Member Avatar" className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRb8J5jFkkVqugJAQdYPLCZm8FEpfP9Wd_GldehI0Cv1lE_fgUtCg-WYORF1g8XDeFe31rPc5gbGT3eSZDA-K1Um6htwW_dXtlDqael9N44Eq1aSAVcJkeGtNOvo5Rj77jTh8OzSQe1EbMrxtFd1saAhoTtHMzSqBHfSaXW3rDPFvgLwHTj7sb91GrIsEAWq9L0Zpup21TZIBwsjgmGVTWAIYhPC2Vwt-_yEBw2g27XEbtB6l_2xaQUAKOnBupjC-2y4bDdLbLKuUI" />
                      <div>
                        <p className="text-sm font-bold text-on-surface">Pierre-Louis Desrosiers</p>
                        <p className="text-[11px] text-slate-400">p.desrosiers@atelier.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-mono text-xs text-slate-500 tracking-wider">009-883-112-9</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/5 text-primary">Vita Azure Plus</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs text-slate-600">Jacmel</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                      <span className="text-xs font-bold text-error">Pending</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-primary/5 rounded-lg text-slate-400 hover:text-primary transition-all">
                      <Icon name="more_vert" />
                    </button>
                  </td>
                </tr>
                {/* Row 4 */}
                <tr className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="Member Avatar" className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAorCabOzCuxb71mLUyAUxMCGNdV9s3wptFCxDJyqz5kGTnzKBcCdydjGjIwuZ3i0rYXTQ2vCo5aWWvv7IQwZZhXLmOOlCm-FIzISTSGOobuAwBdyV-Bh4p5DkBbJgURmOickEctq8KxPxsR2Kq1sCqG0u8OJ0WhWtvnlfJ2QT7u2OpxF_C5PeSwLmhtGVxFk37Ud83ebrlXC3_xUvQPYg0YVomUaXbDbgxBFv6Bh7giGJ8ZKvXG-_zuE2CgzS0-GlCn-P6D64uk5JH" />
                      <div>
                        <p className="text-sm font-bold text-on-surface">Frantz Junior Narcisse</p>
                        <p className="text-[11px] text-slate-400">f.narcisse@atelier.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-mono text-xs text-slate-500 tracking-wider">001-499-562-4</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/5 text-primary">Premium Atelier</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs text-slate-600">P&#233;tion-Ville</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      <span className="text-xs font-bold text-secondary">Verified</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-primary/5 rounded-lg text-slate-400 hover:text-primary transition-all">
                      <Icon name="more_vert" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="px-6 py-6 flex items-center justify-between border-t border-slate-50">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Rows per page:</span>
              <select className="text-xs border-none bg-transparent font-bold text-primary focus:ring-0 cursor-pointer">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-primary transition-colors disabled:opacity-30" disabled>
                <Icon name="chevron_left" />
              </button>
              <div className="flex items-center gap-1">
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">1</span>
                <span className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer">2</span>
                <span className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer">3</span>
                <span className="px-2 text-slate-400">...</span>
                <span className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer">14</span>
              </div>
              <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                <Icon name="chevron_right" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contextual Activity Layer */}
      <section className="px-10 pb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-container-low p-8 rounded-2xl">
          <h4 className="font-headline text-xl font-bold mb-6">Recent Verifications</h4>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
              <div>
                <p className="text-sm font-bold">Marie-Claire Estim&#233; verified by Dr. J. Rigaud</p>
                <p className="text-xs text-slate-500 mt-1">NIF documents checked and signed off manually for Vita Azure Plus enrollment.</p>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-2 inline-block">2 hours ago</span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div>
                <p className="text-sm font-bold">System Audit: Batch #410 Completed</p>
                <p className="text-xs text-slate-500 mt-1">Automated scan of 400 members in the West Department showed 0 discrepancies.</p>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-2 inline-block">5 hours ago</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-secondary/10 to-primary/10 p-8 rounded-2xl border border-white/40">
          <h4 className="font-headline text-xl font-bold mb-4">Plan Distribution</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Vita Azure Plus</span>
                <span>45%</span>
              </div>
              <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[45%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Essential Care</span>
                <span>30%</span>
              </div>
              <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[30%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Premium Atelier</span>
                <span>25%</span>
              </div>
              <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                <div className="h-full bg-on-tertiary-container w-[25%]"></div>
              </div>
            </div>
          </div>
          <button className="mt-8 w-full py-3 rounded-xl bg-white text-primary font-bold text-sm shadow-sm hover:shadow-md transition-all">
            View Full Analytics
          </button>
        </div>
      </section>
    </div>
  );
}
