import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";

export default function ProfilePage() {
  return (
    <>
      <TopBar
        greeting="My Profile"
        subtitle="Manage your personal information and preferences."
        initials="JP"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Header */}
        <section className="lg:col-span-12">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-black">
              JP
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-headline font-extrabold text-on-surface">Jean-Pierre Valcourt</h2>
              <p className="text-on-surface-variant mt-1">jean@member.ht</p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-fixed text-primary rounded-full text-xs font-bold">
                  <Icon name="verified" size="sm" /> Premium Member
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-tertiary-fixed text-on-tertiary-container rounded-full text-xs font-bold">
                  <Icon name="location_on" size="sm" /> Haiti
                </span>
              </div>
            </div>
            <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg transition-shadow flex items-center gap-2">
              <Icon name="edit" size="sm" />
              Edit Profile
            </button>
          </div>
        </section>

        {/* Personal Information */}
        <section className="lg:col-span-7">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-6">Personal Information</h3>
            <dl className="space-y-5">
              {[
                { label: "Full Name", value: "Jean-Pierre Valcourt", icon: "person" },
                { label: "Email", value: "jean@member.ht", icon: "email" },
                { label: "Phone", value: "+509 3456 7890", icon: "phone" },
                { label: "Date of Birth", value: "March 15, 1985", icon: "cake" },
                { label: "Member ID", value: "VSC-88291-HT", icon: "badge" },
                { label: "Language", value: "Fran\u00e7ais", icon: "translate" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 py-3 border-b border-outline-variant/20 last:border-0">
                  <div className="h-10 w-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                    <Icon name={item.icon} size="sm" />
                  </div>
                  <div className="flex-1">
                    <dt className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{item.label}</dt>
                    <dd className="text-sm font-medium text-on-surface mt-0.5">{item.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Membership & Security */}
        <section className="lg:col-span-5 flex flex-col gap-8">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-6">Membership</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Plan</span>
                <span className="font-bold text-on-surface">Premium</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Status</span>
                <span className="inline-flex items-center gap-1 text-tertiary font-bold text-sm">
                  <span className="w-2 h-2 bg-tertiary rounded-full" /> Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Member Since</span>
                <span className="font-bold text-on-surface">Jan 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Renewal</span>
                <span className="font-bold text-on-surface">Jan 2025</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-6">Security</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                <span className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <Icon name="lock" size="sm" className="text-primary" />
                  Change Password
                </span>
                <Icon name="chevron_right" size="sm" className="text-on-surface-variant" />
              </button>
              <button className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                <span className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <Icon name="security" size="sm" className="text-primary" />
                  Two-Factor Authentication
                </span>
                <Icon name="chevron_right" size="sm" className="text-on-surface-variant" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
