import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";

export default function SettingsPage() {
  return (
    <>
      <TopBar
        greeting="Settings"
        subtitle="Manage your account preferences."
        initials="JP"
      />

      <div className="max-w-3xl space-y-8">
        {/* Notifications */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-primary mb-6">Notifications</h3>
          <div className="space-y-5">
            {[
              { label: "Appointment Reminders", desc: "Get notified before upcoming visits", enabled: true },
              { label: "Payment Receipts", desc: "Email confirmation for payments", enabled: true },
              { label: "Health Tips", desc: "Weekly wellness recommendations", enabled: false },
              { label: "Plan Renewal Alerts", desc: "Reminders before your plan renews", enabled: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-outline-variant/20 last:border-0">
                <div>
                  <p className="text-sm font-bold text-on-surface">{item.label}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                </div>
                <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${item.enabled ? "bg-primary" : "bg-surface-container-high"}`}>
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${item.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Language & Region */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-primary mb-6">Language &amp; Region</h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="translate" size="sm" className="text-primary" />
                <span className="text-sm font-medium text-on-surface">Language</span>
              </div>
              <select className="rounded-xl border border-outline-variant bg-surface px-4 py-2 text-sm text-on-surface focus:border-primary focus:outline-none">
                <option>Fran&ccedil;ais</option>
                <option>English</option>
                <option>Krey&ograve;l</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="schedule" size="sm" className="text-primary" />
                <span className="text-sm font-medium text-on-surface">Time Zone</span>
              </div>
              <select className="rounded-xl border border-outline-variant bg-surface px-4 py-2 text-sm text-on-surface focus:border-primary focus:outline-none">
                <option>America/Port-au-Prince (EST)</option>
                <option>America/New_York (EST)</option>
                <option>Europe/Paris (CET)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-error/20">
          <h3 className="font-headline font-bold text-lg text-error mb-2">Danger Zone</h3>
          <p className="text-sm text-on-surface-variant mb-6">These actions are irreversible. Please proceed with caution.</p>
          <div className="flex flex-wrap gap-4">
            <button className="px-5 py-2.5 border border-error text-error rounded-xl text-sm font-bold hover:bg-error/5 transition-colors">
              Deactivate Account
            </button>
            <button className="px-5 py-2.5 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-bold hover:bg-surface-container-low transition-colors">
              Export My Data
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
