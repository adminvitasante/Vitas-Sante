import { Icon } from "@/components/ui/icon";

export default function DoctorProfilePage() {
  return (
    <>
      {/* Hero Profile Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-end">
          <div className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Main profile image"
              className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-2xl ring-4 ring-surface-container-lowest"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPp_5_3W_Kn13Mdia0GPONaPPUvb9pEQJXsUKqT_jiAAcYWsR97vYUXMrhb-Z-GyH2VR7hzqxQqk5016mbJjFtLwMXiEsa_1URPAxZYs9ONzy3MCbU_I_rJmNw1ZiqMKP13Y1rd-ygur9GnMI46UegO2zwwtzGtLalCBMwAViYv-NftrZbPSwJxQeZa-xoGbkE2mb9aT7usGOrd1PXKjroodX6yq6LEuf_roNIEXtYjTkeJ3uKt9oKevPCHvz0g29FvaPkX-70LXDT"
            />
            <button className="absolute bottom-4 right-4 bg-primary text-on-primary p-3 rounded-full shadow-lg hover:scale-105 transition-transform">
              <Icon name="photo_camera" />
            </button>
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-widest">Medical Board Verified</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary font-headline tracking-tight mb-2">Dr. Jean-Baptiste Valcourt</h1>
            <p className="text-xl text-outline font-medium">Senior Cardiologist &amp; Medical Director</p>
          </div>
        </div>
      </section>

      {/* Bento Grid Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold font-headline text-primary">Personal Information</h3>
            <button className="text-secondary font-bold flex items-center gap-1 hover:underline">
              <Icon name="edit" className="text-sm" /> Edit
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
            <div>
              <p className="text-xs font-bold text-outline-variant uppercase tracking-widest mb-1">Full Name</p>
              <p className="text-lg font-semibold text-on-surface">Jean-Baptiste Valcourt, MD</p>
            </div>
            <div>
              <p className="text-xs font-bold text-outline-variant uppercase tracking-widest mb-1">Specialty</p>
              <p className="text-lg font-semibold text-on-surface">Interventional Cardiology</p>
            </div>
            <div>
              <p className="text-xs font-bold text-outline-variant uppercase tracking-widest mb-1">License ID</p>
              <p className="text-lg font-semibold text-on-surface">HT-8829-MED-2024</p>
            </div>
            <div>
              <p className="text-xs font-bold text-outline-variant uppercase tracking-widest mb-1">Clinic Location</p>
              <p className="text-lg font-semibold text-on-surface">Centre de Sant&eacute;, P&eacute;tion-Ville, Haiti</p>
            </div>
          </div>
          <div className="mt-12 p-6 rounded-xl bg-surface-container-low border-none">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Clinic Location Map</h4>
            <div className="aspect-video w-full rounded-lg overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Location map"
                className="w-full h-full object-cover grayscale opacity-50"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCB3ciZ8pRwc9pkSg1PmiBHPb0H75cy9NHZD-XRjm_tvUNp0p_j3d_p3Sv_1BKrcVZvOM54dqcwu1ttHt-YVCO85EWeqj2NuQVGy1P0FOwjwwAMFTTNIyFOXCGEG5uQj9X76wcvPm91exZa5zrXVmcD_Ca85l_hQn0kO-URARQSK4KZlyl9LZiNkEUuTmDw6-weVjNh71l9I6KhA3xBvumhuEQUoJsKUKB6dZzsWvHlXdLK3CdnDPrsiESLz0Odysp0eE60tHl-_I5"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="location_on" filled className="text-primary text-4xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings Column */}
        <div className="flex flex-col gap-8">
          {/* Account Security */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold font-headline text-primary mb-6">Account Security</h3>
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <p className="text-xs font-bold text-outline-variant uppercase tracking-widest mb-1">Email Address</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">jb.valcourt@vitasante.ht</p>
                  <Icon name="chevron_right" className="text-outline group-hover:text-primary" />
                </div>
              </div>
              <div className="bg-surface-container-low h-[1px] w-full"></div>
              <div className="group cursor-pointer">
                <p className="text-xs font-bold text-outline-variant uppercase tracking-widest mb-1">Password</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</p>
                  <Icon name="chevron_right" className="text-outline group-hover:text-primary" />
                </div>
                <p className="text-[10px] text-secondary mt-1">Last changed 45 days ago</p>
              </div>
              <div className="bg-surface-container-low h-[1px] w-full"></div>
              <button className="w-full text-left py-2 text-sm font-bold text-error hover:opacity-80 flex items-center gap-2">
                <Icon name="logout" className="text-base" /> Sign Out
              </button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold font-headline text-primary mb-6">Notifications</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Patient Alerts</p>
                  <p className="text-xs text-outline">Real-time emergency signals</p>
                </div>
                <div className="w-12 h-6 bg-secondary-container rounded-full relative p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-on-secondary-container rounded-full absolute right-1"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Clinic Updates</p>
                  <p className="text-xs text-outline">Weekly newsletter &amp; reports</p>
                </div>
                <div className="w-12 h-6 bg-surface-container-highest rounded-full relative p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-outline-variant rounded-full absolute left-1"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">System Security</p>
                  <p className="text-xs text-outline">Critical login warnings</p>
                </div>
                <div className="w-12 h-6 bg-secondary-container rounded-full relative p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-on-secondary-container rounded-full absolute right-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language & Preferences Bar */}
      <div className="max-w-6xl mx-auto mt-16 p-4 bg-surface-container-low rounded-full flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-outline-variant uppercase tracking-widest">Interface Language</span>
          <div className="flex p-1 bg-surface-container-high rounded-full">
            <button className="px-4 py-1 text-xs font-bold bg-white rounded-full shadow-sm">EN</button>
            <button className="px-4 py-1 text-xs font-bold text-outline">FR</button>
          </div>
        </div>
        <p className="text-[10px] text-outline italic">Vita Sant&eacute; Club &copy; 2024. All health data is encrypted according to international standards.</p>
      </div>
    </>
  );
}
