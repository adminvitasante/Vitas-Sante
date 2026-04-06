import { auth } from "@/lib/auth";
import { getMemberAnalytics } from "@/lib/server/queries";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
export default async function AnalyticsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let enrollment: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let visits: any[] = [];
  let totalVisits = 0;
  let televisits = 0;

  if (userId) {
    const data = await getMemberAnalytics(userId);
    enrollment = data.enrollment;
    visits = data.visits || [];
    totalVisits = data.stats.totalVisits;
    televisits = data.stats.televisits;
  }

  const memberName = session?.user?.name || "Member";
  const firstName = memberName.split(" ")[0];
  const initials = memberName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Credit info
  const ca = enrollment?.credit_accounts?.[0];
  const creditsRemaining = ca?.visits_remaining ?? 0;
  const creditsTotal = ca?.visits_total ?? 0;
  const creditsUsed = creditsTotal - creditsRemaining;

  // Average copay
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedWithCopay = visits.filter((v: any) => v.copay_amount_cents > 0);
  const avgCopay =
    completedWithCopay.length > 0
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (completedWithCopay.reduce((sum: number, v: any) => sum + v.copay_amount_cents, 0) / completedWithCopay.length / 100).toFixed(2)
      : "0.00";

  // Coverage from plan
  const plan = enrollment?.plans;
  const coverageItems = [
    { label: "Labs", pct: plan?.coverage_labs_pct ?? 0 },
    { label: "Pharmacy", pct: plan?.coverage_pharmacy_pct ?? 0 },
    { label: "Surgery", pct: plan?.coverage_surgery_pct ?? 0 },
    { label: "Hospitalization", pct: plan?.coverage_hospitalization_pct ?? 0 },
  ];

  return (
    <>
      <TopBar
        greeting={`${firstName}'s Analytics`}
        subtitle="Track your health journey and visit history."
        initials={initials}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Stats Overview */}
        <section className="lg:col-span-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Visits", value: String(totalVisits), icon: "clinical_notes", color: "primary" },
              { label: "Televisits", value: String(televisits), icon: "videocam", color: "secondary" },
              { label: "Credits Used", value: `${creditsUsed}/${creditsTotal}`, icon: "data_usage", color: "tertiary" },
              { label: "Avg. Co-pay", value: `$${avgCopay}`, icon: "payments", color: "primary" },
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
            {visits.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <Icon name="event_busy" className="text-4xl mb-2 opacity-40" />
                <p className="text-sm">No visits recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {visits.map((visit: any) => {
                  const visitType = visit.visit_type?.toLowerCase().replace("_", " ") || "visit";
                  const iconName =
                    visit.visit_type === "TELEVISIT"
                      ? "videocam"
                      : visit.visit_type === "SPECIALIST"
                        ? "medical_services"
                        : "stethoscope";
                  const doctorName = visit.doctors?.users?.name || "Doctor";
                  const dateStr = visit.visited_at
                    ? new Date(visit.visited_at).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })
                    : "—";

                  return (
                    <div key={visit.id} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-1">
                        <Icon name={iconName} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-sm text-on-surface capitalize">{visitType}</h4>
                          <span className="text-xs text-tertiary font-bold uppercase shrink-0">{visit.status}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">{doctorName} &bull; {dateStr}</p>
                        {visit.copay_amount_cents > 0 && (
                          <p className="text-xs text-on-surface-variant mt-1">
                            Co-pay: ${(visit.copay_amount_cents / 100).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Coverage Summary */}
        <section className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-6">Coverage Summary</h3>
            <div className="space-y-4">
              {coverageItems.map((cov) => (
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
              {plan?.name_en || "Current"} plan coverage for Haiti network.
              {plan?.slug !== "elite" && " Upgrade to Elite for expanded coverage."}
            </p>
          </div>

          {/* Credits Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm mt-8">
            <h3 className="font-headline font-bold text-lg text-primary mb-6">Visit Credits</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-on-surface-variant">Remaining</span>
              <span className="text-2xl font-black text-primary">{creditsRemaining}</span>
            </div>
            <div className="h-3 bg-surface-container-low rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-secondary rounded-full transition-all"
                style={{ width: `${creditsTotal > 0 ? (creditsRemaining / creditsTotal) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-on-surface-variant">
              <span>{creditsUsed} used</span>
              <span>{creditsTotal} total</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
