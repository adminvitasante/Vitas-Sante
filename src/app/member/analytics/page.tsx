import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";

export default function AnalyticsPage() {
  return (
    <>
      <TopBar
        greeting="Health Analytics"
        subtitle="Track your health journey and visit history."
        initials="JP"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Stats Overview */}
        <section className="lg:col-span-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Visits", value: "3", icon: "clinical_notes", color: "primary" },
              { label: "Televisits", value: "1", icon: "videocam", color: "secondary" },
              { label: "Credits Used", value: "3/12", icon: "data_usage", color: "tertiary" },
              { label: "Avg. Co-pay", value: "$5.00", icon: "payments", color: "primary" },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm text-center">
                <div className={`h-12 w-12 mx-auto rounded-xl bg-${stat.color}-fixed flex items-center justify-center text-${stat.color} mb-3`}>
                  <Icon name={stat.icon} />
                </div>
                <p className="text-2xl font-black text-on-surface">{stat.value}</p>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Visit History */}
        <section className="lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-6">Visit History</h3>
            <div className="space-y-4">
              {[
                { type: "Specialist", doctor: "Dr. Jean-Baptiste Celestin", date: "10 days ago", status: "Completed", note: "Cardiac assessment, recommended follow-up", icon: "medical_services" },
                { type: "Televisit", doctor: "Dr. Jean-Baptiste Celestin", date: "20 days ago", status: "Completed", note: "Follow-up consultation via video", icon: "videocam" },
                { type: "Generalist", doctor: "Dr. Jean-Baptiste Celestin", date: "30 days ago", status: "Completed", note: "Routine check-up, all vitals normal", icon: "stethoscope" },
              ].map((visit, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-1">
                    <Icon name={visit.icon} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-on-surface">{visit.type}</h4>
                      <span className="text-xs text-tertiary font-bold uppercase shrink-0">{visit.status}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">{visit.doctor} &bull; {visit.date}</p>
                    <p className="text-xs text-on-surface-variant mt-1 italic">{visit.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage Summary */}
        <section className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-6">Coverage Summary</h3>
            <div className="space-y-4">
              {[
                { label: "Labs", pct: 35 },
                { label: "Pharmacy", pct: 35 },
                { label: "Surgery", pct: 0 },
                { label: "Hospitalization", pct: 0 },
              ].map((cov) => (
                <div key={cov.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">{cov.label}</span>
                    <span className="font-bold text-on-surface">{cov.pct}%</span>
                  </div>
                  <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${cov.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-on-surface-variant mt-6">
              Premium plan coverage for Haiti network. Upgrade to Elite for surgery and hospitalization coverage.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
