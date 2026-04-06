import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { getAdminDoctors } from "@/lib/server/queries";

function statusBadge(status: string) {
  switch (status) {
    case "VERIFIED":
      return "bg-tertiary-fixed text-on-tertiary-fixed";
    case "PENDING":
      return "bg-error-container text-on-error-container";
    case "REJECTED":
      return "bg-surface-container-high text-on-surface-variant";
    default:
      return "bg-surface-container-high text-on-surface-variant";
  }
}

export default async function AdminDoctorsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const doctors = await getAdminDoctors();

  return (
    <div className="min-h-screen px-8 py-8">
      <TopBar
        greeting="Doctor Network"
        subtitle="Manage and verify healthcare professionals"
        initials={session.user.name?.slice(0, 2).toUpperCase() || "AD"}
      />

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] border-l-4 border-primary">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Total Doctors</p>
          <h3 className="text-3xl font-headline font-extrabold text-primary">{doctors.length}</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] border-l-4 border-secondary">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Verified</p>
          <h3 className="text-3xl font-headline font-extrabold text-secondary">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {doctors.filter((d: any) => d.verification_status === "VERIFIED").length}
          </h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] border-l-4 border-error">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Pending Review</p>
          <h3 className="text-3xl font-headline font-extrabold text-error">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {doctors.filter((d: any) => d.verification_status === "PENDING").length}
          </h3>
        </div>
      </section>

      {/* Doctors List */}
      {doctors.length > 0 ? (
        <section>
          <h3 className="font-headline text-xl font-bold text-on-surface mb-6">Provider Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {doctors.map((doctor: any) => (
              <div
                key={doctor.id}
                className="bg-surface-container-lowest p-8 rounded-3xl flex items-start gap-6 shadow-[0_20px_40px_rgba(0,27,63,0.04)] hover:bg-white transition-all border border-transparent hover:border-outline-variant/20"
              >
                <div className="h-16 w-16 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {doctor.users?.name?.slice(0, 2).toUpperCase() || "DR"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="font-headline text-lg font-bold text-on-surface truncate">
                      {doctor.users?.name || "Unknown Doctor"}
                    </h4>
                    <span className={`text-[10px] px-2 py-1 rounded font-bold shrink-0 ${statusBadge(doctor.verification_status)}`}>
                      {doctor.verification_status}
                    </span>
                  </div>
                  {doctor.specialty && (
                    <p className="text-secondary font-semibold text-sm uppercase tracking-wide mb-3">{doctor.specialty}</p>
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
        <div className="bg-surface-container-lowest rounded-3xl p-12 text-center shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
          <Icon name="medical_services" className="text-outline !text-4xl mb-3" />
          <p className="text-on-surface-variant font-medium">No doctors registered yet.</p>
        </div>
      )}
    </div>
  );
}
