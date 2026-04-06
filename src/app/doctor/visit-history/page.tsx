import { auth } from "@/lib/auth";
import { getDoctorVisitHistory } from "@/lib/server/queries";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

export default async function VisitHistoryPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let visits: any[] = [];

  if (userId) {
    visits = await getDoctorVisitHistory(userId);
  }

  const doctorName = session?.user?.name || "Doctor";
  const firstName = doctorName.split(" ")[0];
  const initials = doctorName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <TopBar
        greeting={`Dr. ${firstName}`}
        subtitle="Complete record of all clinical encounters"
        initials={initials}
      />

      {/* Visit History Table */}
      <section className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-headline font-bold text-xl text-primary">Visit History</h4>
              <p className="text-sm text-on-surface-variant mt-1">
                {visits.length} {visits.length === 1 ? "encounter" : "encounters"} recorded
              </p>
            </div>
            <Link
              href="/doctor/patient-care"
              className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
            >
              <Icon name="arrow_back" size="sm" /> Back to Patient Care
            </Link>
          </div>
        </div>

        {visits.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <Icon name="history" className="text-6xl mb-4 opacity-30" />
            <h3 className="font-headline font-bold text-xl text-on-surface-variant mb-2">No Visit History</h3>
            <p className="text-sm max-w-sm mx-auto">
              Your clinical encounters will appear here once patients are registered and visits are completed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-outline">Date</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-outline">Patient</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-outline">Visit Type</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-outline">Status</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-outline">Copay</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-outline">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {visits.map((visit: any) => {
                  const patientName = visit.enrollment?.users?.name || "Unknown";
                  const planName = visit.enrollment?.plans?.name_en || "--";
                  const visitDate = visit.visited_at
                    ? new Date(visit.visited_at).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })
                    : "--";
                  const visitType = visit.visit_type?.toLowerCase().replace("_", " ") || "--";
                  const copay = visit.copay_amount_cents
                    ? `$${(visit.copay_amount_cents / 100).toFixed(2)}`
                    : "--";

                  const statusColors: Record<string, string> = {
                    COMPLETED: "bg-secondary-container text-on-secondary-container",
                    PENDING: "bg-amber-100 text-amber-800",
                    CANCELLED: "bg-error-container text-on-error-container",
                  };
                  const statusClass = statusColors[visit.status] || "bg-surface-container-high text-on-surface-variant";

                  return (
                    <tr key={visit.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-5">
                        <span className="text-on-surface font-semibold text-sm">{visitDate}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-xs font-bold">
                            {patientName
                              .split(" ")
                              .map((w: string) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <span className="text-on-surface font-medium text-sm">{patientName}</span>
                            <p className="text-[10px] text-slate-400">{planName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container-high text-on-surface-variant capitalize">
                          {visitType}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusClass}`}>
                          {visit.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-semibold text-on-surface">{copay}</span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-on-surface-variant line-clamp-1 max-w-xs">
                          {visit.notes || "No notes recorded"}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
