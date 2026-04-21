import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { getDoctorDashboard } from "@/lib/server/queries";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { VisitWorkflow } from "@/components/shared/visit-workflow";
import Link from "next/link";

export default async function PatientCarePage() {
  const t = await getTranslations("doctor.patientCare");
  const session = await auth();
  const userId = session?.user?.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let doctor: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let todayVisits: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let stats: any = null;

  if (userId) {
    const data = await getDoctorDashboard(userId);
    doctor = data.doctor;
    todayVisits = data.todayVisits || [];
    stats = data.stats;
  }

  const doctorName = session?.user?.name || "Doctor";
  const firstName = doctorName.split(" ")[0];
  const initials = doctorName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!doctor) {
    return (
      <>
        <TopBar
          greeting={t("greeting", { firstName })}
          subtitle={t("subtitle")}
          initials={initials}
        />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Icon name="person_off" className="text-6xl text-outline-variant mb-4" />
          <h3 className="font-headline font-bold text-xl text-on-surface-variant mb-2">{t("profileMissing")}</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar
        greeting={t("greeting", { firstName })}
        subtitle={t("subtitle")}
        initials={initials}
      />

      {/* Visit initiator + completer */}
      {doctor.verification_status === "VERIFIED" && userId && (
        <VisitWorkflow doctorId={doctor.id} doctorUserId={userId} />
      )}

      {doctor.verification_status !== "VERIFIED" && (
        <div className="mb-6 rounded-3xl bg-amber-50 p-6 border border-amber-200">
          <div className="flex gap-3">
            <Icon name="warning" className="text-amber-700" />
            <div>
              <p className="font-bold text-amber-900">{t("notVerifiedTitle")}</p>
              <p className="text-sm text-amber-800 mt-1">
                {t("notVerifiedBody", { status: doctor.verification_status })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-12 w-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <Icon name="event_note" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t("todayVisits")}</p>
              <p className="text-3xl font-black text-on-surface">{String(todayVisits.length).padStart(2, "0")}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-12 w-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <Icon name="check_circle" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t("todayCompleted")}</p>
              <p className="text-3xl font-black text-on-surface">{String(stats?.todayCompleted ?? 0).padStart(2, "0")}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-12 w-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <Icon name="analytics" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t("totalVisits")}</p>
              <p className="text-3xl font-black text-on-surface">{stats?.totalVisits ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Visits */}
      <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm mb-10">
        <div className="flex justify-between items-center mb-8">
          <h4 className="font-headline font-bold text-xl text-primary">{t("queueTitle")}</h4>
          <Link href="/doctor/visit-history" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
            {t("quickVisitHistory")} <Icon name="chevron_right" size="sm" />
          </Link>
        </div>

        {todayVisits.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <Icon name="event_busy" className="text-4xl mb-2 opacity-40" />
            <p className="text-sm font-medium">{t("queueEmpty")}</p>
            <p className="text-xs text-slate-400 mt-1">{t("queueEmptyHint")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {todayVisits.map((visit: any) => {
              const patientName = visit.enrollment?.users?.name || "Unknown Patient";
              const planName = visit.enrollment?.plans?.name_en || "No Plan";
              const visitType = visit.visit_type?.toLowerCase().replace("_", " ") || "visit";
              const visitTime = visit.visited_at
                ? new Date(visit.visited_at).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })
                : "--:--";
              const statusColors: Record<string, string> = {
                COMPLETED: "bg-secondary-container text-on-secondary-container",
                PENDING: "bg-amber-100 text-amber-800",
                CANCELLED: "bg-error-container text-on-error-container",
              };
              const statusClass = statusColors[visit.status] || "bg-surface-container-high text-on-surface-variant";

              return (
                <div key={visit.id} className="bg-surface-container-low p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                      <Icon
                        name={visit.visit_type === "TELEVISIT" ? "videocam" : visit.visit_type === "SPECIALIST" ? "medical_services" : "stethoscope"}
                      />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-on-surface">{patientName}</h5>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <span className="capitalize">{visitType}</span> &bull; {planName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-on-surface-variant">{visitTime}</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusClass}`}>
                      {visit.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick Links */}
      <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
        <h4 className="font-headline font-bold text-xl text-primary mb-8">{t("quickActionsTitle")}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t("quickVisitHistory"), icon: "history", href: "/doctor/visit-history" },
            { label: t("quickProfile"), icon: "person", href: "/doctor/profile" },
            { label: t("quickVerification"), icon: "verified_user", href: "/doctor/verification" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-4 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-xl group"
            >
              <div className="h-10 w-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <Icon name={item.icon} size="sm" />
              </div>
              <span className="font-bold text-sm text-on-surface">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
