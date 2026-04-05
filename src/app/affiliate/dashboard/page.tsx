import { Icon } from "@/components/ui/icon";

export default function AffiliateDashboard() {
  return (
    <>
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-extrabold text-primary font-headline tracking-tight leading-tight mb-2">Affiliate Workspace</h2>
          <p className="text-on-surface-variant leading-relaxed max-w-lg">Manage your health network expansion, track commission evolution, and access certified marketing materials.</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-full px-6 py-2">
          <div className="text-right">
            <p className="text-xs font-bold text-primary font-headline">DR. JULIEN MOREAU</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Global Partner ID: #8829</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
            JM
          </div>
        </div>
      </header>

      {/* KPI Grid: Tonal Layering */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-surface-container-lowest p-8 rounded-xl tonal-shadow relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Total Members Referred</p>
            <h3 className="text-5xl font-black text-primary font-headline mb-2">1,284</h3>
            <div className="flex items-center text-tertiary font-bold text-sm">
              <Icon name="trending_up" className="text-sm mr-1" />
              <span>+12.5% this month</span>
            </div>
          </div>
          <Icon name="groups" className="absolute -right-4 -bottom-4 !text-9xl text-surface-container-low opacity-40 group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl tonal-shadow relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Commissions Due</p>
            <h3 className="text-5xl font-black text-primary font-headline mb-2">$4,290.50</h3>
            <p className="text-xs text-on-surface-variant">Scheduled for payout on Oct 1st</p>
          </div>
          <Icon name="pending_actions" className="absolute -right-4 -bottom-4 !text-9xl text-surface-container-low opacity-40 group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl tonal-shadow relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Commissions Paid</p>
            <h3 className="text-5xl font-black text-secondary font-headline mb-2">$32,840</h3>
            <p className="text-xs text-on-surface-variant">Lifetime earnings to date</p>
          </div>
          <Icon name="verified" className="absolute -right-4 -bottom-4 !text-9xl text-surface-container-low opacity-40 group-hover:scale-110 transition-transform duration-500" />
        </div>
      </section>

      {/* Referral & Analytics Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Referral Link Generator */}
        <div className="lg:col-span-4 flex flex-col space-y-8">
          <div className="bg-surface-container-low p-8 rounded-xl">
            <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-6">Unique Referral Link</h4>
            <p className="text-xs text-on-surface-variant mb-4">Share this unique link with your medical network to track new members automatically.</p>
            <div className="relative">
              <input
                className="w-full bg-surface-container-lowest border-none rounded-lg py-4 pl-4 pr-12 text-sm font-medium text-primary focus:ring-2 focus:ring-primary/20"
                readOnly
                type="text"
                value="vitasante.club/ref/drmoreau"
              />
              <button className="absolute right-2 top-2 p-2 text-primary hover:bg-surface-container-high rounded-md transition-colors">
                <Icon name="content_copy" />
              </button>
            </div>
            <div className="mt-6 flex gap-2">
              <button className="flex-1 bg-surface-container-lowest py-3 rounded-lg text-[10px] font-bold uppercase text-primary tracking-widest border border-outline-variant/20 hover:bg-white transition-colors">Generate QR</button>
              <button className="flex-1 bg-surface-container-lowest py-3 rounded-lg text-[10px] font-bold uppercase text-primary tracking-widest border border-outline-variant/20 hover:bg-white transition-colors">Shorten Link</button>
            </div>
          </div>

          <div className="bg-primary-container p-8 rounded-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Marketing Materials</h4>
              <p className="text-xl font-bold mb-6 font-headline">Access Certified Assets</p>
              <button className="w-full bg-white text-primary font-bold py-3 rounded-xl text-xs uppercase tracking-tight flex items-center justify-center gap-2">
                <Icon name="download" className="text-sm" />
                Brand Guidelines &amp; Media Kit
              </button>
            </div>
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Commission Evolution Chart */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl tonal-shadow">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Payout Evolution</h4>
              <p className="text-xs text-on-surface-variant">Past 6 months growth</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-surface-container-low rounded-full text-[10px] font-bold text-primary">Monthly</span>
              <span className="px-3 py-1 text-[10px] font-bold text-on-surface-variant">Quarterly</span>
            </div>
          </div>

          {/* Mockup Chart Area */}
          <div className="h-64 flex items-end justify-between gap-4 pt-4">
            <div className="w-full bg-surface-container-low rounded-t-lg h-24 hover:bg-primary/20 transition-colors cursor-pointer relative group">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface opacity-0 group-hover:opacity-100">$2.1k</span>
            </div>
            <div className="w-full bg-surface-container-low rounded-t-lg h-32 hover:bg-primary/20 transition-colors cursor-pointer relative group">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface opacity-0 group-hover:opacity-100">$2.8k</span>
            </div>
            <div className="w-full bg-surface-container-low rounded-t-lg h-40 hover:bg-primary/20 transition-colors cursor-pointer relative group">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface opacity-0 group-hover:opacity-100">$3.5k</span>
            </div>
            <div className="w-full bg-surface-container-low rounded-t-lg h-36 hover:bg-primary/20 transition-colors cursor-pointer relative group">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface opacity-0 group-hover:opacity-100">$3.2k</span>
            </div>
            <div className="w-full bg-surface-container-low rounded-t-lg h-52 hover:bg-primary/20 transition-colors cursor-pointer relative group">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface opacity-0 group-hover:opacity-100">$4.8k</span>
            </div>
            <div className="w-full bg-primary-container rounded-t-lg h-60 hover:opacity-90 transition-colors cursor-pointer relative group">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-100">$5.4k</span>
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-4">
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
          </div>
        </div>
      </section>

      {/* Recent Referrals Table Section */}
      <section className="bg-surface-container-lowest p-8 rounded-xl tonal-shadow overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Recent Referrals</h4>
          <button className="text-xs font-bold text-primary-container flex items-center gap-1 hover:underline">
            View Full Directory
            <Icon name="chevron_right" className="text-sm" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Member Name</th>
                <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Date Joined</th>
                <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Selected Plan</th>
                <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                <th className="pb-4 text-right text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Comm. Est.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {/* Row 1 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-low overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="w-full h-full object-cover" alt="portrait of a professional woman with neutral medical background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRFC5pSbJSpY1AQAZPq-s2QQAv69WhHxJbu_JYDl2kesryQJTH8h--xwsgVDCJSLJtZtLWXweq2GSE0AFVNzkU0ZJnxa9orNocXVbmj3MnrFUAikio0zMg4YfMMqmXfoYCVl7ATEBdwP4wCYmr3oowoIr7r1rap146JrBz7nKi1RiSPwLTqbGIkXM96eN1_4S-MG-L4uD1M9fJIkbplzSqhmkXXI5jXriRoqYemK89wOLMfwqH7wH6fWNoUcj3RPuboqUkUxQC2cob" />
                    </div>
                    <span className="text-sm font-semibold text-on-surface">Alice Dubois</span>
                  </div>
                </td>
                <td className="py-5 text-sm text-on-surface-variant">Sep 24, 2024</td>
                <td className="py-5">
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-tight">Global Wellness Plus</span>
                </td>
                <td className="py-5">
                  <div className="flex items-center gap-2 text-tertiary text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-tertiary" />
                    Active
                  </div>
                </td>
                <td className="py-5 text-right font-headline font-bold text-primary">$120.00</td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-low overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="w-full h-full object-cover" alt="portrait of a professional man in business casual attire smiling" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvTBdmshhcaCcK0bPa377Zc6HnX9MDicD9aHdZxDf1GIARuXfy9mSwESNheR9oLHBsvlOekqzIvhHkr0uyCJKwy3Kraw8irDCt0aFDa6QD_H11PcQEW6AeuFvPReuSfK2w3-UjJloGUwV-uRjzrL6cRDMZ5yNdvfW9kVDq4uwtnPw0XKEoieJ7Q5myKhMOUsYqZXGTnJSRSNrVLH3YSz67mrKt7pscRpI9p6j7ORz2qwoCZ9j7rUxtgiimI5oC0f93Ay1uzNjbl6Vh" />
                    </div>
                    <span className="text-sm font-semibold text-on-surface">Marc Lefebvre</span>
                  </div>
                </td>
                <td className="py-5 text-sm text-on-surface-variant">Sep 22, 2024</td>
                <td className="py-5">
                  <span className="px-3 py-1 bg-primary-fixed text-primary rounded-full text-[10px] font-bold uppercase tracking-tight">Executive Elite</span>
                </td>
                <td className="py-5">
                  <div className="flex items-center gap-2 text-tertiary text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-tertiary" />
                    Active
                  </div>
                </td>
                <td className="py-5 text-right font-headline font-bold text-primary">$180.00</td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-low overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="w-full h-full object-cover" alt="close-up portrait of a medical professional woman in clinic setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9AIxqdHSk7uVT6jMmaxXfuveJHfOO8QF7cPiZ7ivo09ejM7Zbwp1WO1fiAXyxOXee1xLAcwnvHUXwYoE3u6z24IAT4SFfSJpBajlatuV4uL2pghIBtsuE5n0ZkikNRH7XiSI811JHhCGOpWy7MsDKqvBXn-VJTtfWyUP2Xe0Xcnc6XKZfUhys9iNSayHGFgc9uSyNIoU_C_3qL7qqXlkWaaZrXZCwjml2cInbTezXzsqOtfQLK6fJPuO6hoXnzQsFdvJY_RrXeFqk" />
                    </div>
                    <span className="text-sm font-semibold text-on-surface">Sophie Laurent</span>
                  </div>
                </td>
                <td className="py-5 text-sm text-on-surface-variant">Sep 20, 2024</td>
                <td className="py-5">
                  <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-[10px] font-bold uppercase tracking-tight">Family Core</span>
                </td>
                <td className="py-5">
                  <div className="flex items-center gap-2 text-primary-container text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                    Pending Review
                  </div>
                </td>
                <td className="py-5 text-right font-headline font-bold text-on-surface-variant opacity-50">$45.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center py-12 w-full max-w-7xl mx-auto">
          <div className="mb-6 md:mb-0">
            <p className="font-inter text-xs text-slate-500">&copy; 2024 Vita Sant&eacute; Club. All Rights Reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-inter text-xs text-slate-400 hover:text-blue-600 transition-colors" href="#">Privacy Policy</a>
            <a className="font-inter text-xs text-slate-400 hover:text-blue-600 transition-colors" href="#">Terms of Service</a>
            <a className="font-inter text-xs text-slate-400 hover:text-blue-600 transition-colors" href="#">Compliance</a>
            <a className="font-inter text-xs text-slate-400 hover:text-blue-600 transition-colors" href="#">Global Standards</a>
          </div>
        </div>
      </footer>
    </>
  );
}
