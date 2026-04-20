import { redirect } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { getAdminDoctors } from "@/lib/server/queries";
import { getSessionWithCapability } from "@/lib/server/authz";
import { getDoctorApplications } from "@/lib/server/doctors";
import { ApplicationsReview } from "./applications-review";

function statusBadge(status: string) {
  switch (status) {
    case "VERIFIED":
      return "bg-tertiary-fixed text-on-tertiary-fixed";
    case "PENDING":
      return "bg-amber-100 text-amber-800";
    case "REJECTED":
    case "REVOKED":
      return "bg-error-container text-on-error-container";
    default:
      return "bg-surface-container-high text-on-surface-variant";
  }
}

export default async function AdminDoctorsPage() {
  const me = await getSessionWithCapability("ADMIN");
  if (!me) redirect("/auth/signin");

  const [doctors, pendingApps] = await Promise.all([
    getAdminDoctors(),
    getDoctorApplications("PENDING"),
  ]);

  const initials = me.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen px-8 py-8">
      <TopBar
        greeting="Doctor Network"
        subtitle="Manage, verify, and onboard healthcare professionals"
        initials={initials}
      />

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          label="Total Doctors"
          value={doctors.length}
          icon="medical_services"
          tone="primary"
        />
        <StatCard
          label="Verified"
          value={doctors.filter((d: { verification_status: string }) => d.verification_status === "VERIFIED").length}
          icon="verified"
          tone="secondary"
        />
        <StatCard
          label="Pending Verification"
          value={doctors.filter((d: { verification_status: string }) => d.verification_status === "PENDING").length}
          icon="hourglass_empty"
          tone="tertiary"
        />
        <StatCard
          label="New Applications"
          value={pendingApps.length}
          icon="assignment_ind"
          tone="error"
        />
      </section>

      {/* Applications review */}
      <ApplicationsReview applications={pendingApps} />

      {/* Existing doctor registry */}
      {doctors.length > 0 ? (
        <section>
          <h3 className="font-headline text-xl font-bold text-on-surface mb-6">
            Provider Registry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doctor: {
              id: string;
              specialty: string;
              verification_status: string;
              clinic_name: string | null;
              region: string | null;
              users: { name: string; email: string } | null;
            }) => (
              <div
                key={doctor.id}
                className="bg-surface-container-lowest p-8 rounded-3xl flex items-start gap-6 shadow-sm border border-transparent hover:border-outline-variant/20"
              >
                <div className="h-16 w-16 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {doctor.users?.name?.slice(0, 2).toUpperCase() || "DR"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="font-headline text-lg font-bold text-on-surface truncate">
                      {doctor.users?.name || "Unknown Doctor"}
                    </h4>
                    <span
                      className={`text-[10px] px-2 py-1 rounded font-bold shrink-0 ${statusBadge(
                        doctor.verification_status
                      )}`}
                    >
                      {doctor.verification_status}
                    </span>
                  </div>
                  {doctor.specialty && (
                    <p className="text-secondary font-semibold text-sm uppercase tracking-wide mb-3">
                      {doctor.specialty}
                    </p>
                  )}
                  <div className="space-y-1.5">
                    {doctor.users?.email && (
                      <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                        <Icon name="mail" className="!text-sm" />
                        <span className="truncate">{doctor.users.email}</span>
                      </div>
                    )}
                    {doctor.clinic_name && (
                      <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                        <Icon name="local_hospital" className="!text-sm" />
                        {doctor.clinic_name}
                      </div>
                    )}
                    {doctor.region && (
                      <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                        <Icon name="location_on" className="!text-sm" />
                        {doctor.region}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl p-12 text-center shadow-sm">
          <Icon name="medical_services" className="text-outline !text-4xl mb-3" />
          <p className="text-on-surface-variant font-medium">Aucun médecin enregistré.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: string;
  tone: "primary" | "secondary" | "tertiary" | "error";
}) {
  const toneClasses = {
    primary: "border-primary bg-primary-fixed text-primary",
    secondary: "border-secondary bg-secondary-fixed text-secondary",
    tertiary: "border-tertiary bg-tertiary-fixed text-tertiary",
    error: "border-error bg-error-container text-error",
  }[tone];

  return (
    <div className={`bg-surface-container-lowest p-6 rounded-3xl shadow-sm border-l-4 ${toneClasses.split(" ")[0]}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">
          {label}
        </p>
        <span className={`h-8 w-8 rounded-lg flex items-center justify-center ${toneClasses.split(" ").slice(1).join(" ")}`}>
          <Icon name={icon} size="sm" />
        </span>
      </div>
      <h3 className="text-3xl font-headline font-extrabold text-on-surface">{value}</h3>
    </div>
  );
}
