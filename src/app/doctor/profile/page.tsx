import { auth } from "@/lib/auth";
import { getDoctorProfile } from "@/lib/server/queries";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

export default async function DoctorProfilePage() {
  const session = await auth();
  const userId = session?.user?.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let doctor: any = null;

  if (userId) {
    const data = await getDoctorProfile(userId);
    user = data.user;
    doctor = data.doctor;
  }

  const doctorName = user?.name || session?.user?.name || "Doctor";
  const firstName = doctorName.split(" ")[0];
  const initials = doctorName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const verificationColors: Record<string, string> = {
    VERIFIED: "bg-secondary-container text-on-secondary-container",
    PENDING: "bg-amber-100 text-amber-800",
    SUSPENDED: "bg-error-container text-on-error-container",
    REVOKED: "bg-error-container text-on-error-container",
  };
  const verificationClass = verificationColors[doctor?.verification_status] || "bg-surface-container-high text-on-surface-variant";

  return (
    <>
      <TopBar
        greeting={`Dr. ${firstName}`}
        subtitle="Your professional profile"
        initials={initials}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Header Card */}
        <section className="lg:col-span-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 text-white">
            <div className="z-10 relative">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${verificationClass}`}>
                  {doctor?.verification_status || "UNKNOWN"}
                </span>
              </div>
              <h3 className="text-4xl font-extrabold font-headline mb-1">{doctorName}</h3>
              <p className="text-primary-fixed opacity-90 text-lg">
                {doctor?.specialty || "General Practice"}
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Personal Information */}
        <section className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-headline font-bold text-xl text-primary">Personal Information</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
            <div>
              <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Full Name</p>
              <p className="text-lg font-semibold text-on-surface">{user?.name || "--"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Email Address</p>
              <p className="text-lg font-semibold text-on-surface">{user?.email || "--"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Phone Number</p>
              <p className="text-lg font-semibold text-on-surface">{user?.phone || "--"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Member Since</p>
              <p className="text-lg font-semibold text-on-surface">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })
                  : "--"}
              </p>
            </div>
          </div>
        </section>

        {/* Doctor Details */}
        <section className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h4 className="font-headline font-bold text-xl text-primary mb-8">Professional Details</h4>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">License ID</p>
              <p className="text-lg font-semibold text-on-surface font-mono">{doctor?.license_id || "--"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Specialty</p>
              <p className="text-lg font-semibold text-on-surface">{doctor?.specialty || "--"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Region</p>
              <p className="text-lg font-semibold text-on-surface">{doctor?.region || "--"}</p>
            </div>
          </div>
        </section>

        {/* Clinic Information */}
        <section className="lg:col-span-12 bg-surface-container-low rounded-3xl p-8">
          <h4 className="font-headline font-bold text-xl text-primary mb-8">Clinic Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
            <div>
              <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Clinic Name</p>
              <p className="text-lg font-semibold text-on-surface">{doctor?.clinic_name || "--"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Clinic Address</p>
              <p className="text-lg font-semibold text-on-surface">{doctor?.clinic_address || "--"}</p>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="lg:col-span-12 bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h4 className="font-headline font-bold text-xl text-primary mb-8">Quick Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Patient Care", icon: "medical_services", href: "/doctor/patient-care" },
              { label: "Visit History", icon: "history", href: "/doctor/visit-history" },
              { label: "Verification Status", icon: "verified_user", href: "/doctor/verification" },
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
      </div>
    </>
  );
}
