import { Icon } from "@/components/ui/icon";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 px-8 py-6 flex justify-between items-center" style={{ background: "rgba(247, 249, 251, 0.8)", backdropFilter: "blur(20px)" }}>
        <div>
          <h2 className="text-2xl font-headline font-extrabold text-primary tracking-tight">Mission Control</h2>
          <p className="text-sm text-on-surface-variant">Executive Overview &amp; Network Systems</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Icon name="notifications" className="text-outline cursor-pointer" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
          </div>
          <div className="flex items-center space-x-3 bg-surface-container-low px-3 py-1.5 rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="User Profile" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO1oIN0lCTXGfIibDIe4SDPY9bnROGe8A87Z8eJAsLTnLb3SxCz-Gjk7X17WrAqFvMIazDv_3DJktFc-YO_BY-m28Y6hYOg_bVcTgS3woxJ-DWOTuQTq8faSw8pxWuAAS9AaHMceQEh3neIKaiqtHBGKyX2EvcQHAsvg8_15YMJOMaC5K7bQUKbEmdzdxLJpb4Nho2RX8aSAieaD_iYuF8OtjEoOIqe_nXOkH6a22fD53Z1IkA8onZtXr4tj49WojLUEsNZ4mPn3vX" />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-primary leading-none">Dr. Jean-Pierre</p>
              <p className="text-[10px] text-on-surface-variant">Chief Administrator</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-8 pb-12 space-y-8">
        {/* KPI Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Members */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-primary-fixed rounded-lg">
                <Icon name="group" className="text-primary" />
              </span>
              <span className="text-secondary text-xs font-bold font-headline">+12% vs LW</span>
            </div>
            <p className="text-sm text-on-surface-variant font-medium">Total Active Members</p>
            <h3 className="text-3xl font-headline font-black text-primary mt-1">14,282</h3>
          </div>
          {/* Monthly Revenue */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-secondary-fixed rounded-lg">
                <Icon name="payments" className="text-secondary" />
              </span>
              <span className="text-secondary text-xs font-bold font-headline">+5.4%</span>
            </div>
            <p className="text-sm text-on-surface-variant font-medium">Monthly Revenue</p>
            <h3 className="text-3xl font-headline font-black text-primary mt-1">$284,500 <span className="text-sm font-normal text-slate-400">USD</span></h3>
          </div>
          {/* Pending Verifications */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] border-l-4 border-error">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-error-container rounded-lg">
                <Icon name="pending_actions" className="text-error" />
              </span>
              <span className="text-error text-xs font-bold font-headline">Action Required</span>
            </div>
            <p className="text-sm text-on-surface-variant font-medium">Pending Verifications</p>
            <h3 className="text-3xl font-headline font-black text-primary mt-1">47</h3>
          </div>
        </section>

        {/* Asymmetric Grid Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Registration Growth Chart */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="text-lg font-bold text-primary font-headline">Registration Growth</h4>
                <p className="text-xs text-on-surface-variant">Network expansion tracking across Haiti</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-surface-container-high rounded-full font-medium">Monthly</button>
                <button className="px-3 py-1 text-xs text-on-surface-variant rounded-full hover:bg-surface-container-low transition-colors">Quarterly</button>
              </div>
            </div>
            <div className="h-64 flex items-end space-x-4">
              <div className="flex-1 bg-surface-container-low rounded-t-lg h-[40%] hover:bg-primary-fixed-dim transition-colors group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">1.2k</div>
              </div>
              <div className="flex-1 bg-surface-container-low rounded-t-lg h-[55%] hover:bg-primary-fixed-dim transition-colors group relative"></div>
              <div className="flex-1 bg-primary-container rounded-t-lg h-[75%] group relative"></div>
              <div className="flex-1 bg-surface-container-low rounded-t-lg h-[60%] hover:bg-primary-fixed-dim transition-colors group relative"></div>
              <div className="flex-1 bg-surface-container-low rounded-t-lg h-[85%] hover:bg-primary-fixed-dim transition-colors group relative"></div>
              <div className="flex-1 bg-primary-container rounded-t-lg h-[95%] group relative"></div>
              <div className="flex-1 bg-surface-container-low rounded-t-lg h-[80%] hover:bg-primary-fixed-dim transition-colors group relative"></div>
            </div>
            <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="lg:col-span-4 bg-surface-container-low p-6 rounded-xl flex flex-col">
            <h4 className="text-lg font-bold text-primary font-headline mb-6">Recent Activity</h4>
            <div className="space-y-6 flex-1 overflow-y-auto max-h-[350px] pr-2">
              <div className="flex space-x-4">
                <div className="relative shrink-0">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <div className="absolute top-4 left-1/2 w-px h-full bg-outline-variant/30"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface leading-tight">New Sponsor: Digicel Haiti</p>
                  <p className="text-xs text-on-surface-variant mt-1">Partnership agreement finalized.</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">2 mins ago</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="relative shrink-0">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="absolute top-4 left-1/2 w-px h-full bg-outline-variant/30"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface leading-tight">Provider Update</p>
                  <p className="text-xs text-on-surface-variant mt-1">Dr. Marie L. updated clinic availability.</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">45 mins ago</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="relative shrink-0">
                  <div className="w-2 h-2 bg-error rounded-full mt-2"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface leading-tight">System Alert</p>
                  <p className="text-xs text-on-surface-variant mt-1">Unusual login attempt from Petion-Ville.</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pending Inscriptions Queue */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h4 className="text-xl font-headline font-extrabold text-primary">Pending Inscriptions</h4>
              <p className="text-sm text-on-surface-variant">Review new health professional applications</p>
            </div>
            <button className="text-sm font-bold text-primary flex items-center hover:underline">
              View All Queue <Icon name="chevron_right" className="ml-1 !text-sm" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Application Card 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] flex flex-col">
              <div className="flex items-center space-x-4 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Doctor Profile" className="w-14 h-14 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3rxBQzuzyHsPfVm3y5O03jmaJTtenzYFrH9xXoz4XSV_k3KEWcpYs8ZcM9yogfrGLIYSDJe6NY-lxciwjU8Vu5nnj_DPVVQijdmZTITwtEbbjAdespIwERkB4nAFsG0OwwGxFSPGdz-VrjmO2Q__zRhW7VZ7KPx2YZGKXBqY1ml1X75b8mCkCqRgHwOmWNFVgHYc63UaC3Eg5PCCoIOcAmZDoLCSmS0KtzW6skaVUl5ue6UkOb6pDsg2LHoD60lii0s1akl0xFXWf" />
                <div>
                  <p className="font-bold text-primary font-headline">Dr. Marie-Laure Celestin</p>
                  <p className="text-xs text-secondary font-medium">Cardiology &bull; Cap-Haitien</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6 bg-surface-container-low p-4 rounded-lg">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">License ID</p>
                  <p className="text-xs font-semibold text-on-surface">#HT-99281-MD</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Applied</p>
                  <p className="text-xs font-semibold text-on-surface">Oct 24, 2023</p>
                </div>
              </div>
              <div className="flex space-x-3 mt-auto">
                <button className="flex-1 py-2 text-xs font-bold text-error border border-error/20 rounded-lg hover:bg-error/5 transition-colors">Reject</button>
                <button className="flex-1 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary-container transition-colors">Approve</button>
              </div>
            </div>
            {/* Application Card 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] flex flex-col">
              <div className="flex items-center space-x-4 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Doctor Profile" className="w-14 h-14 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL5eYsqbzprSECxzJqsfLHwsTijikiU22__SGDNFEkFX6RcfdYGMtqZSAm89PKbp8_EwjDVnARwwNEKtOE7lmN41yxqmUG94eODlMbaA5AamZOng4KMKSY-AdB7tjxGWT00gT_VQc0DNzwMo7dt-39ZENQuwXdNT-Woc-ELIaV1VwMotHWUNwsJReCQ9vMr_rhwgKys-gMEQgtuYJdD4BzMGXSab-sJj5Qnzcbm24AUo8Qo0aJFBGOzxrrOu7130ddv_UddepRYopr" />
                <div>
                  <p className="font-bold text-primary font-headline">Dr. Marc-Andre Noel</p>
                  <p className="text-xs text-secondary font-medium">General Practice &bull; Jacmel</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6 bg-surface-container-low p-4 rounded-lg">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">License ID</p>
                  <p className="text-xs font-semibold text-on-surface">#HT-10442-MD</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Applied</p>
                  <p className="text-xs font-semibold text-on-surface">Oct 25, 2023</p>
                </div>
              </div>
              <div className="flex space-x-3 mt-auto">
                <button className="flex-1 py-2 text-xs font-bold text-error border border-error/20 rounded-lg hover:bg-error/5 transition-colors">Reject</button>
                <button className="flex-1 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary-container transition-colors">Approve</button>
              </div>
            </div>
            {/* Application Card 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] flex flex-col">
              <div className="flex items-center space-x-4 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Doctor Profile" className="w-14 h-14 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvE3ImVHUvEqw2eUl8eTJes9xqjsN6VjIsFrvWWX1mE-4Jv9PriGjWJLWkTc-1YRyRjiiMxQY3SHJDJCzLtOr8lvbtRvrZKmEEVVFlRAUePeNjM6BrGixWAMt19zIy5DhKXQUMBLldFGw7jScBBwRLGYVwbPZCwc1XBeE22CyqPsHcAepZz7U8EOjucwn-55OX1HxKxj9czVnqIlwhzDOIuMsZm7GQlCfgpwj35Wv1MgRGpuotOlfLzf40VFJUCQk1s9joQd5p_g5s" />
                <div>
                  <p className="font-bold text-primary font-headline">Dr. Fabiola Desrosiers</p>
                  <p className="text-xs text-secondary font-medium">Pediatrics &bull; Port-au-Prince</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6 bg-surface-container-low p-4 rounded-lg">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">License ID</p>
                  <p className="text-xs font-semibold text-on-surface">#HT-88320-MD</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Applied</p>
                  <p className="text-xs font-semibold text-on-surface">Oct 26, 2023</p>
                </div>
              </div>
              <div className="flex space-x-3 mt-auto">
                <button className="flex-1 py-2 text-xs font-bold text-error border border-error/20 rounded-lg hover:bg-error/5 transition-colors">Reject</button>
                <button className="flex-1 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary-container transition-colors">Approve</button>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity Table (from console 1) */}
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden mt-4">
          <div className="p-8 border-b border-surface-container">
            <h4 className="font-headline font-bold text-xl text-primary">Recent Activity</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Event</th>
                  <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Category</th>
                  <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Time</th>
                  <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">New doctor registered</span>
                      <span className="text-xs text-on-surface-variant">Dr. Marc Dupont (Neurology)</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-2 py-1 bg-primary-fixed text-primary text-[10px] font-bold rounded uppercase">Doctors</span>
                  </td>
                  <td className="px-8 py-5 text-sm text-on-surface-variant">Today, 09:42 AM</td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-1 text-secondary text-xs font-bold">
                      <Icon name="check_circle" className="!text-sm" />
                      Verified
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Icon name="more_vert" /></button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">Plan &apos;Premium&apos; updated</span>
                      <span className="text-xs text-on-surface-variant">Global pricing adjustment</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded uppercase">Plans</span>
                  </td>
                  <td className="px-8 py-5 text-sm text-on-surface-variant">Yesterday, 04:15 PM</td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-1 text-primary text-xs font-bold">
                      <Icon name="history" className="!text-sm" />
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Icon name="more_vert" /></button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">Member VSC-10292 renewed</span>
                      <span className="text-xs text-on-surface-variant">Annual Platinum Subscription</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-2 py-1 bg-secondary-container text-secondary text-[10px] font-bold rounded uppercase">Members</span>
                  </td>
                  <td className="px-8 py-5 text-sm text-on-surface-variant">Yesterday, 11:20 AM</td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-1 text-secondary text-xs font-bold">
                      <Icon name="task_alt" className="!text-sm" />
                      Completed
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Icon name="more_vert" /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-slate-100 bg-slate-50">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 w-full max-w-7xl mx-auto space-y-4 md:space-y-0">
          <p className="text-xs text-slate-500">&copy; 2024 Vita Sante Club. All Rights Reserved.</p>
          <div className="flex space-x-8">
            <a className="text-xs text-slate-400 hover:text-blue-600 transition-colors" href="#">Privacy Policy</a>
            <a className="text-xs text-slate-400 hover:text-blue-600 transition-colors" href="#">Terms of Service</a>
            <a className="text-xs text-slate-400 hover:text-blue-600 transition-colors" href="#">Compliance</a>
            <a className="text-xs text-slate-400 hover:text-blue-600 transition-colors" href="#">Global Standards</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
