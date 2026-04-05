import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { MemberCardVisual } from "@/components/shared/member-card-visual";

export default function MemberDashboard() {
  return (
    <>
      {/* Header / Top Bar Area */}
      <TopBar
        greeting="Bonjour, Jean-Pierre"
        subtitle="Welcome back to your personalized health sanctuary."
        initials="JP"
      />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Hero Member Card (Span 8) */}
        <section className="lg:col-span-8">
          <div className="relative overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-container p-8 text-white flex flex-col md:flex-row justify-between items-center group">
            <div className="z-10 text-center md:text-left mb-6 md:mb-0">
              <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase mb-4">Premium Member</span>
              <h3 className="text-4xl font-extrabold mb-1">Jean-Pierre Valcourt</h3>
              <p className="text-primary-fixed opacity-90 font-mono tracking-widest text-lg">VSC-88291-HT</p>
              <div className="mt-8 flex gap-4">
                <button className="bg-white text-primary px-6 py-2 rounded-xl font-bold text-sm hover:bg-primary-fixed transition-colors">
                  View Full Profile
                </button>
                <button className="bg-primary/20 border border-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors flex items-center gap-2">
                  <Icon name="download" size="sm" />
                  Download Card
                </button>
              </div>
            </div>
            {/* Digital Card Visualization */}
            <div className="relative z-10 transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
              <MemberCardVisual memberNumber="8829 1000 4521 9901" expiry="12/26" />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Visit Credits (Span 4) */}
        <section className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-container-lowest rounded-full p-8 shadow-sm flex flex-col items-center text-center">
            <h4 className="font-headline font-bold text-on-surface mb-6">Visit Credits Remaining</h4>
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-surface-container-low"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                />
                <circle
                  className="text-secondary"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="70"
                  stroke="currentColor"
                  strokeDasharray="440"
                  strokeDashoffset="110"
                  strokeWidth="12"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-primary">09</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Available</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 w-full">
              <div className="bg-surface-container-low p-3 rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Televisits</p>
                <p className="text-xl font-bold text-primary">06/10</p>
              </div>
              <div className="bg-surface-container-low p-3 rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase">In-Clinic</p>
                <p className="text-xl font-bold text-secondary">03/05</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dependents List (Span 7) */}
        <section className="lg:col-span-7 bg-surface-container-low rounded-full p-8">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-headline font-bold text-xl text-primary">Covered Dependents</h4>
            <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              <Icon name="add" size="sm" /> Add New
            </button>
          </div>
          <div className="space-y-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between group hover:bg-primary/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-full object-cover"
                    alt="close-up portrait of a smiling young haitian girl with braided hair and bright eyes"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6HXpgFMSusYpajpttr6Y__gziyXFmO7Y8g5yFIhrweSE_QRvH0SY5G4iixYJo2VO9zjHb8LzhP41p52qurXNsLfP23G0SyXlA6DV-IUJU5KGLhtfn36_3bqOaFavQqHXlz4qvtADKnAK50pxiQkNoaSeD0K-6qjT4-dVZohW-iYk1w8d0Pe_VznSWJOCalp0aHjekOvJN-jXvD-2Gb1msriTXj0ht9VG92dpqLKMIqVSPYZevNClJoGc99XyRzh9Xe7sm3DIyegWH"
                  />
                </div>
                <div>
                  <h5 className="font-bold text-on-surface">Marie-Claire Valcourt</h5>
                  <p className="text-xs text-slate-500">Daughter &bull; 12 Years Old</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 text-tertiary">
                  <span className="w-2 h-2 bg-tertiary rounded-full" />
                  <span className="text-xs font-bold uppercase">Active</span>
                </div>
                <Icon name="chevron_right" className="text-slate-300 group-hover:text-primary transition-colors" />
              </div>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between group hover:bg-primary/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-full object-cover"
                    alt="portrait of an elderly haitian man with graying hair and kind eyes wearing a clean white shirt"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNsjGgcibbOX_ANxTu4LUbQrnLp4qsB_wQ0xv8b_AOtEutxh5EmSYZEPsXu30pqN5J7sEwR35pJG3SWyCuiWVWIxRcocYV6hwlXkLrMTPz1-TrskzOLYDtkgRfw2gyjYXI3LktbHLVdyHFbykSKEaNAovfzQx3htZaUVlKAnRZaM4YXTZfVkFfqZrdqIXhD8fjbTeJehDchBQH3woKCqLnR0e2vSLDwqUJ3NLNwiOESBWDhrEgJ1WnA-n4r2caTorpqscF7C5BS1Js"
                  />
                </div>
                <div>
                  <h5 className="font-bold text-on-surface">Lucien Valcourt</h5>
                  <p className="text-xs text-slate-500">Father &bull; 74 Years Old</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 text-tertiary">
                  <span className="w-2 h-2 bg-tertiary rounded-full" />
                  <span className="text-xs font-bold uppercase">Active</span>
                </div>
                <Icon name="chevron_right" className="text-slate-300 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        </section>

        {/* Payment History (Span 5) */}
        <section className="lg:col-span-5 bg-surface-container-lowest rounded-full p-8 shadow-sm">
          <h4 className="font-headline font-bold text-xl text-primary mb-8">Recent Payments</h4>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-container">
                  <Icon name="credit_card" />
                </div>
                <div>
                  <p className="font-bold text-sm">Monthly Premium</p>
                  <p className="text-xs text-slate-400">Mar 01, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">$145.00</p>
                <p className="text-[10px] text-tertiary font-bold uppercase">Processed</p>
              </div>
            </div>
            <div className="flex items-center justify-between opacity-70">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-surface-container-low flex items-center justify-center text-slate-400">
                  <Icon name="receipt" />
                </div>
                <div>
                  <p className="font-bold text-sm">Pharmacy Co-pay</p>
                  <p className="text-xs text-slate-400">Feb 14, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-on-surface">$22.50</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Archive</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-10 py-3 border border-outline-variant/30 rounded-xl text-slate-600 font-bold text-sm hover:bg-surface-container-low transition-colors">
            View Billing History
          </button>
        </section>

        {/* Quick Contact Doctor Section (Full Width Asymmetric) */}
        <section className="lg:col-span-12 mt-4">
          <div className="bg-surface-container-low rounded-full overflow-hidden flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 h-64 md:h-80 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-full object-cover"
                alt="professional male haitian doctor in a white clinical coat smiling warmly in a high-end modern medical office"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBXVC5h3DhjfSWPtDs5iaaekSPzK-nKm2OLBuW7XTIW5haFzcqAhNF0ME0R7Q8_qqj3Rw0pZ7GlNFYVVjkRBnsrFXpdRJ4C9eXZD82nPw6qOmjZTJaxPgor0zL3KP2uAgcRc7MzkQJU6Pt9o-6lCytn4do3hbRb_m9A5TqNHiyjsh5cmV0SHFLQ_PwocHHqum2IBzTS37gUugUVtyEqNawxSu96UbYfNw1l7ypJ6u0AmERrTvwWXLQHyExGn16xGOqxNVnAiAWmw77"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-container-low" />
            </div>
            <div className="md:w-2/3 p-8 md:p-12">
              <h4 className="text-3xl font-headline font-extrabold text-primary mb-4">Dedicated Support for the Diaspora</h4>
              <p className="text-on-surface-variant max-w-2xl mb-8 leading-relaxed">
                Need help navigating care for your family in Haiti? Our medical coordinators are available 24/7 to assist with appointment scheduling, pharmacy verification, and specialist referrals.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-shadow flex items-center gap-2">
                  <Icon name="chat_bubble" />
                  Chat with a Care Coordinator
                </button>
                <button className="px-8 py-4 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors">
                  Find a Local Doctor
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center w-full">
        <p className="font-body text-xs text-slate-500 mb-4 md:mb-0">&copy; 2024 Vita Santé Club. All Rights Reserved.</p>
        <div className="flex gap-8">
          <a className="text-slate-400 hover:text-blue-600 transition-colors text-xs font-medium" href="#">Privacy Policy</a>
          <a className="text-slate-400 hover:text-blue-600 transition-colors text-xs font-medium" href="#">Terms of Service</a>
          <a className="text-slate-400 hover:text-blue-600 transition-colors text-xs font-medium" href="#">Compliance</a>
          <a className="text-slate-400 hover:text-blue-600 transition-colors text-xs font-medium" href="#">Global Standards</a>
        </div>
      </footer>
    </>
  );
}
