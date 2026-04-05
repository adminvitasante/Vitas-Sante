import { Icon } from "@/components/ui/icon";

export default function SponsorNewPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-outline mb-4">
            <span>Sponsor Portal</span>
            <Icon name="chevron_right" className="text-sm" />
            <span>Funded Members</span>
            <Icon name="chevron_right" className="text-sm" />
            <span className="text-primary font-semibold">New Beneficiary</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-2">Register New Member</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg">Add a single beneficiary to your corporate sponsorship plan or use the bulk upload for multiple enrollments.</p>
        </div>
        <button className="bg-secondary-container text-on-secondary-container px-6 py-3 rounded-xl flex items-center gap-2 font-semibold hover:bg-secondary-fixed transition-colors duration-200">
          <Icon name="upload_file" />
          Bulk Upload CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Stepper */}
        <div className="lg:col-span-3 space-y-8 sticky top-28">
          <div className="flex flex-col gap-8 border-l-2 border-surface-container-high">
            <div className="pl-6 relative">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-primary-fixed"></div>
              <span className="block text-sm font-bold uppercase tracking-widest text-primary mb-1">Step 1</span>
              <h3 className="text-lg font-bold text-on-surface leading-tight">Beneficiary Information</h3>
            </div>
            <div className="pl-6 relative opacity-40">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-outline-variant ring-4 ring-surface"></div>
              <span className="block text-sm font-bold uppercase tracking-widest text-outline mb-1">Step 2</span>
              <h3 className="text-lg font-bold text-on-surface leading-tight">Plan Selection</h3>
            </div>
            <div className="pl-6 relative opacity-40">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-outline-variant ring-4 ring-surface"></div>
              <span className="block text-sm font-bold uppercase tracking-widest text-outline mb-1">Step 3</span>
              <h3 className="text-lg font-bold text-on-surface leading-tight">Review &amp; Confirm</h3>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-tertiary">
            <div className="flex items-center gap-3 mb-3 text-tertiary">
              <Icon name="verified_user" />
              <span className="font-bold text-sm">Secure Enrollment</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Data is encrypted using military-grade standards. Members will receive their digital Vita Sant&eacute; ID within 24 hours.
            </p>
          </div>
        </div>

        {/* Right: Form Content */}
        <div className="lg:col-span-9">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.06)] p-8 md:p-12">
            <form className="space-y-12">
              {/* Personal Info */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <Icon name="person" filled />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Personal Details</h2>
                    <p className="text-sm text-outline">Ensure details match official government ID (CIN/NIF).</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant px-1">Full Legal Name</label>
                    <input className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="e.g. Marie-Louise Desir" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant px-1">Date of Birth</label>
                    <input className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant px-1">Email Address</label>
                    <input className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="m.desir@example.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant px-1">Phone Number (WhatsApp preferred)</label>
                    <input className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="+509 0000 0000" type="tel" />
                  </div>
                </div>
              </section>

              {/* Address Info */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                    <Icon name="location_on" filled />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Haiti Residential Address</h2>
                    <p className="text-sm text-outline">Used for home care visits and medicine delivery.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant px-1">Street Address</label>
                    <input className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="123 Rue de la Paix" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant px-1">City/Commune</label>
                    <select className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all appearance-none">
                      <option>Pétion-Ville</option>
                      <option>Port-au-Prince</option>
                      <option>Cap-Haïtien</option>
                      <option>Jacmel</option>
                      <option>Delmas</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant px-1">Department</label>
                    <select className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all appearance-none">
                      <option>Ouest</option>
                      <option>Nord</option>
                      <option>Sud</option>
                      <option>Artibonite</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Form Actions */}
              <div className="pt-8 border-t border-surface-container flex flex-col sm:flex-row justify-between items-center gap-4">
                <button className="text-outline font-bold px-8 py-4 hover:text-on-surface transition-colors flex items-center gap-2" type="button">
                  <Icon name="arrow_back" />
                  Cancel
                </button>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button className="bg-surface-container-high text-on-surface font-bold px-8 py-4 rounded-xl hover:bg-surface-dim transition-colors" type="button">
                    Save Draft
                  </button>
                  <button className="bg-gradient-to-br from-primary to-primary-container text-white font-bold px-12 py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2" type="button">
                    Next: Select Plan
                    <Icon name="arrow_forward" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Bento Info Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-container text-on-primary-container p-8 rounded-xl flex flex-col justify-between min-h-[200px]">
              <Icon name="inventory_2" className="text-4xl" />
              <div>
                <h4 className="font-bold text-xl mb-1">Flexible Tiers</h4>
                <p className="text-sm opacity-80 leading-relaxed">Upgrade or downgrade member plans at any monthly renewal cycle.</p>
              </div>
            </div>
            <div className="bg-secondary-container text-on-secondary-container p-8 rounded-xl flex flex-col justify-between min-h-[200px]">
              <Icon name="group_add" className="text-4xl" />
              <div>
                <h4 className="font-bold text-xl mb-1">Institutional Perks</h4>
                <p className="text-sm opacity-80 leading-relaxed">Groups of 50+ qualify for our Custom Wellness Program integrations.</p>
              </div>
            </div>
            <div className="bg-tertiary-container text-on-tertiary-container p-8 rounded-xl flex flex-col justify-between min-h-[200px]">
              <Icon name="speed" className="text-4xl" />
              <div>
                <h4 className="font-bold text-xl mb-1">Instant Coverage</h4>
                <p className="text-sm opacity-80 leading-relaxed">Emergency tele-consultations are active immediately upon payment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
