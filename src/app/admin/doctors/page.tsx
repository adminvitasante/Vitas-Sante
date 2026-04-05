import { Icon } from "@/components/ui/icon";

export default function AdminDoctorsPage() {
  return (
    <div className="min-h-screen">
      {/* TopNavBar */}
      <header className="flex justify-between items-center h-16 px-8 sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-8">
          <span className="text-sm font-semibold text-blue-900">Admin Console</span>
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-blue-700 font-semibold text-sm transition-opacity" href="#">Directives</a>
            <a className="text-slate-600 text-sm hover:text-blue-600 transition-opacity" href="#">Live Monitor</a>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Icon name="search" className="!text-sm" />
            </span>
            <input className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-primary/20" placeholder="Search professionals..." type="text" />
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <button className="hover:opacity-80 transition-opacity"><Icon name="notifications" /></button>
            <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Administrator Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoQ1RsukKkcg6lVWr3XoG3HrKrwLNRBdZVOQw62fId0VQkjOT41lRvXz-YnsVixEyZ9xwJoMoe-W4FxetqApb1Lhoruvz396a9MO1V8aKeUlxTw0OSirXDnXPv8LO1ZtJjn_FGQRSgHE13p_-57bCurY0DXbGOMc_qgmaYNHzKsGM8xAjOjFX0EklvXby6mOHvGxTe7rMdNe2qYWjTrI2lXLw5d_0aG0Cxg6LDbMj_LRnED9mH-79ZJq6chY9hPCL92xaDeqiaDEnn" />
            </div>
          </div>
        </div>
      </header>

      <div className="p-10 max-w-7xl mx-auto">
        {/* Hero / Header Section */}
        <section className="mb-12 flex justify-between items-end">
          <div className="max-w-2xl">
            <h2 className="font-headline text-5xl font-extrabold tracking-tight text-primary mb-4 leading-tight">Managing the <br />Doctor Network</h2>
            <p className="text-lg text-on-surface-variant font-light leading-relaxed">Curating Haiti&apos;s most prestigious medical collective. Validate credentials, monitor performance, and expand the reach of professional healthcare.</p>
          </div>
          <div>
            <button className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold flex items-center gap-3 shadow-2xl shadow-primary/30 active:scale-95 transition-all">
              <Icon name="person_add" />
              Add New Doctor
            </button>
          </div>
        </section>

        {/* Stats Tonal Row */}
        <div className="grid grid-cols-4 gap-6 mb-16">
          <div className="bg-surface-container-low p-6 rounded-xl">
            <span className="text-primary font-headline text-3xl font-bold block mb-1">142</span>
            <span className="text-on-surface-variant text-sm font-medium uppercase tracking-wider">Active Partners</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-secondary">
            <span className="text-secondary font-headline text-3xl font-bold block mb-1">98%</span>
            <span className="text-on-surface-variant text-sm font-medium uppercase tracking-wider">Verification Rate</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl">
            <span className="text-primary font-headline text-3xl font-bold block mb-1">12k+</span>
            <span className="text-on-surface-variant text-sm font-medium uppercase tracking-wider">Consultations</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl">
            <span className="text-tertiary font-headline text-3xl font-bold block mb-1">8</span>
            <span className="text-on-surface-variant text-sm font-medium uppercase tracking-wider">Pending Review</span>
          </div>
        </div>

        {/* Bento Grid List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-headline text-xl font-bold text-on-surface">Partner Registry</h3>
              <div className="flex gap-4">
                <select className="bg-surface-container-low border-none rounded-lg text-sm px-4 py-2 focus:ring-primary">
                  <option>Specialty: All</option>
                  <option>Cardiology</option>
                  <option>Pediatrics</option>
                  <option>Neurology</option>
                </select>
                <button className="bg-surface-container-low p-2 rounded-lg text-on-surface-variant">
                  <Icon name="filter_list" />
                </button>
              </div>
            </div>

            {/* Doctors Asymmetric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-surface-container-lowest p-8 rounded-xl flex items-start gap-6 group hover:bg-white transition-all shadow-sm border border-transparent hover:border-outline-variant/20">
                <div className="relative h-24 w-24 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="Dr. Jean-Pierre portrait" className="h-full w-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkemSlpyCNRNeKss2qEDFPwgxdqgYQhmU--pFmJJix7zK7JGeQszIhvvLN87zkOi_XPsVjeqlDVNbygY45kuykQpTrzNMBtS0Ebah0WD7SBHNJz02jnX8HI3FEIFtnQCWBFqJDxDt9NLUzjnyHAfoC--CQXgIHVBieQxyZkyzkYyL5Wp4Hjypo8DmpKk-9r3ZOcgKKU_D3wy-V1E8PEj3CqR3VAuhMxYA-lv5yJTCoyxyA6LF-58eOzDrnq9SSThycvzGB4e9kaOHK" />
                  <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-1 rounded-full border-4 border-white">
                    <Icon name="verified" filled className="!text-xs" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-headline text-lg font-bold text-on-surface">Dr. Jean-Baptiste Pierre</h4>
                      <p className="text-secondary font-semibold text-sm uppercase tracking-wide mb-3">Cardiology specialist</p>
                    </div>
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] px-2 py-1 rounded font-bold">VERIFIED</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <Icon name="location_on" className="!text-sm" />
                      P&#233;tion-Ville, Port-au-Prince
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <Icon name="event_note" className="!text-sm" />
                      1,240 Consultations
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs font-bold text-primary hover:underline">View Portfolio</button>
                    <span className="text-outline-variant">&bull;</span>
                    <button className="text-xs font-bold text-on-surface-variant hover:text-error">Flag Record</button>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-xl flex items-start gap-6 group hover:bg-white transition-all shadow-sm border border-transparent hover:border-outline-variant/20">
                <div className="relative h-24 w-24 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="Dr. Marie Lucienne portrait" className="h-full w-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBBF6BnWf5nKSitKmGzYcbfGTPfVdACiB-dFSCS8Fo5C5rH4Rp9-pYOCDRz7K9XXOGRHJteanLsbCJQHUL8pyWQ3o0PiqyEpVhN4pCMppuFpqtx4uSiwbR_qUd8ssT4aHnd1LZp7NF0RHFSseHXdIlhxhBvZ__Y6TIYta36FyXptAeBfmfy4JJ217VSo2Q3JWrUELYhDcrnZi-de5YZNLXtsO-3yUSozBpfYO2Dgfwq9ojojY4sUAGdg-kZvX7jgN68F1fbR3pZNRe" />
                  <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-1 rounded-full border-4 border-white">
                    <Icon name="verified" filled className="!text-xs" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-headline text-lg font-bold text-on-surface">Dr. Marie Lucienne Duval</h4>
                      <p className="text-secondary font-semibold text-sm uppercase tracking-wide mb-3">Neurology specialist</p>
                    </div>
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] px-2 py-1 rounded font-bold">VERIFIED</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <Icon name="location_on" className="!text-sm" />
                      Cap-Ha&#239;tien Medical Center
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <Icon name="event_note" className="!text-sm" />
                      892 Consultations
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs font-bold text-primary hover:underline">View Portfolio</button>
                    <span className="text-outline-variant">&bull;</span>
                    <button className="text-xs font-bold text-on-surface-variant hover:text-error">Flag Record</button>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-xl flex items-start gap-6 group hover:bg-white transition-all shadow-sm border border-transparent hover:border-outline-variant/20">
                <div className="relative h-24 w-24 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="Dr. Emmanuel portrait" className="h-full w-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXnVmAYzYernRe4PmFw-3bAgureNdiaU3oEM3jj2yG2yEvdfROn2UG_EfzeEVTvjWd2WMjhbihGSRXVD9jdTHmkURiipqYzd_6NEvElYxvQGhDl16Z3zna2Wn_qWoWkHKUNr9Ji2PDOv9wNSAR6EJNHiCFcmHUwIB5yr1mLFymJ-PNgBEFhtiGpiiwqk4acyqOzx1Rjz7CYlZsFsKcmW05b0Dwfl8WW3TK6RCquIPPKTPbXGSVi3KMtJTQHF4go8U1jIP4TEyV1DKv" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-headline text-lg font-bold text-on-surface">Dr. Emmanuel Saint-Just</h4>
                      <p className="text-secondary font-semibold text-sm uppercase tracking-wide mb-3">Internal Medicine</p>
                    </div>
                    <span className="bg-error-container text-on-error-container text-[10px] px-2 py-1 rounded font-bold">PENDING</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <Icon name="location_on" className="!text-sm" />
                      Jacmel Clinic South
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <Icon name="event_note" className="!text-sm" />
                      0 Consultations (New)
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs font-bold text-primary hover:underline">Verify Credentials</button>
                    <span className="text-outline-variant">&bull;</span>
                    <button className="text-xs font-bold text-on-surface-variant hover:text-error">Reject</button>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-surface-container-lowest p-8 rounded-xl flex items-start gap-6 group hover:bg-white transition-all shadow-sm border border-transparent hover:border-outline-variant/20">
                <div className="relative h-24 w-24 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="Dr. Fabienne portrait" className="h-full w-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBONXysd4k9FRkvEwe06UaH-o-H3DE2u8T1JuyDsKhzaO0H9FORt2cbAUakA0XduneP5-HE1GnTmLZM8T_2Ez3L7tHW5HLDTgbZQ05wIMvAP69zPWjVfNzsjNuuK0WyLkY5s8s72LnstTayi8j-YJeNX1QNdchI3Xfsib8ORgkXh606AEYUuQ84CLKviZYGmK1zKiig0GulgNO-veKlMm_qVdYo3vtc4G7kVEEq5uoj-uktlUc9jRyh-EbjcdF25VP0IEdStBZQozHF" />
                  <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-1 rounded-full border-4 border-white">
                    <Icon name="verified" filled className="!text-xs" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-headline text-lg font-bold text-on-surface">Dr. Fabienne Cadet</h4>
                      <p className="text-secondary font-semibold text-sm uppercase tracking-wide mb-3">Pediatrics</p>
                    </div>
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] px-2 py-1 rounded font-bold">VERIFIED</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <Icon name="location_on" className="!text-sm" />
                      Delmas 40 Pediatric Hub
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <Icon name="event_note" className="!text-sm" />
                      2,105 Consultations
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs font-bold text-primary hover:underline">View Portfolio</button>
                    <span className="text-outline-variant">&bull;</span>
                    <button className="text-xs font-bold text-on-surface-variant hover:text-error">Flag Record</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Doctor Flow */}
        <section className="mt-20 border-t border-outline-variant/30 pt-16">
          <div className="bg-primary p-12 rounded-2xl relative overflow-hidden">
            {/* Aesthetic Background Texture */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
              <svg className="h-full w-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M45.7,-78.3C58.3,-71.4,67.1,-57.1,74.2,-42.6C81.3,-28.1,86.7,-13.4,85.2,1.1C83.7,15.6,75.4,29.9,65.8,42.5C56.2,55.1,45.4,65.9,32.4,72.4C19.5,78.9,4.4,81.1,-11.2,79.5C-26.8,77.9,-42.8,72.5,-55.8,63.1C-68.8,53.7,-78.8,40.3,-82.9,25.6C-87,10.9,-85.2,-5.1,-79.8,-19.7C-74.4,-34.3,-65.4,-47.5,-53.2,-54.6C-41,-61.7,-25.5,-62.7,-11.1,-63.4C3.3,-64.1,45.7,-78.3,45.7,-78.3Z" fill="#FFFFFF" transform="translate(100 100)" />
              </svg>
            </div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="font-headline text-3xl font-extrabold text-white mb-4">Expanding Haiti&apos;s Medical Excellence</h3>
                <p className="text-primary-fixed-dim text-lg mb-8 leading-relaxed">Our multi-stage verification process ensures that only the most qualified Haitian professionals are integrated into our high-precision healthcare network.</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-white">
                    <Icon name="check_circle" className="text-secondary-fixed" />
                    Credential &amp; Diploma Authentication
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <Icon name="check_circle" className="text-secondary-fixed" />
                    Sanitary Inspection of Physical Clinic
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <Icon name="check_circle" className="text-secondary-fixed" />
                    Bilingual Proficiency Assessment
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-2xl">
                <h4 className="font-headline text-xl font-bold text-primary mb-6">Quick Registration</h4>
                <form className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Full Name</label>
                    <input className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary" placeholder="Enter professional name" type="text" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Specialty</label>
                      <input className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary" placeholder="e.g. Oncology" type="text" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Haitian ID / License</label>
                      <input className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary" placeholder="License No." type="text" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Clinic Photo</label>
                    <div className="border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center text-on-surface-variant">
                      <Icon name="upload_file" size="lg" className="mb-2" />
                      <span className="text-xs">Drag and drop clinic verification photos</span>
                    </div>
                  </div>
                  <button className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-container transition-colors shadow-lg" type="button">Initiate Verification</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-20 py-12 border-t border-outline-variant/20 px-8 text-on-surface-variant flex justify-between items-center bg-white">
        <p className="text-sm">&copy; 2024 Clinical Atelier Administration. Confidential Data Access Only.</p>
        <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
          <a className="hover:text-primary" href="#">Compliance</a>
          <a className="hover:text-primary" href="#">Data Privacy</a>
          <a className="hover:text-primary" href="#">Network Status</a>
        </div>
      </footer>
    </div>
  );
}
