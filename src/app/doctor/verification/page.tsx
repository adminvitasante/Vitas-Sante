import { auth } from "@/lib/auth";
import { getDoctorProfile } from "@/lib/server/queries";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

export default async function VerificationPage() {
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

  const status = doctor?.verification_status || "UNKNOWN";

  const statusConfig: Record<string, { color: string; bg: string; icon: string; description: string }> = {
    VERIFIED: {
      color: "text-on-secondary-container",
      bg: "bg-secondary-container",
      icon: "verified",
      description: "Your medical license has been verified and approved. You are authorized to conduct consultations through Vita Sante.",
    },
    PENDING: {
      color: "text-amber-800",
      bg: "bg-amber-100",
      icon: "hourglass_top",
      description: "Your verification is currently under review. Our team is validating your credentials. This process typically takes 2-5 business days.",
    },
    SUSPENDED: {
      color: "text-on-error-container",
      bg: "bg-error-container",
      icon: "pause_circle",
      description: "Your verification has been temporarily suspended. Please contact support for more information about the reason and next steps.",
    },
    REVOKED: {
      color: "text-on-error-container",
      bg: "bg-error-container",
      icon: "cancel",
      description: "Your verification has been revoked. Please contact an administrator immediately to resolve this issue.",
    },
    UNKNOWN: {
      color: "text-on-surface-variant",
      bg: "bg-surface-container-high",
      icon: "help",
      description: "Your verification status could not be determined. Please contact support.",
    },
  };

  const config = statusConfig[status] || statusConfig.UNKNOWN;

  return (
    <>
      <TopBar
        greeting={`Dr. ${firstName}`}
        subtitle="Verification Status"
        initials={initials}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Status Hero */}
        <section className="lg:col-span-12">
          <div className={`rounded-3xl p-10 ${config.bg} flex flex-col md:flex-row items-center gap-8`}>
            <div className="h-24 w-24 rounded-full bg-white/30 flex items-center justify-center shrink-0">
              <Icon name={config.icon} className={`text-5xl ${config.color}`} />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Verification Status</p>
              <h3 className={`text-3xl font-extrabold font-headline mb-3 ${config.color}`}>{status}</h3>
              <p className={`text-sm max-w-2xl leading-relaxed ${config.color} opacity-80`}>{config.description}</p>
            </div>
          </div>
        </section>

        {/* License Details */}
        <section className="lg:col-span-6 bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h4 className="font-headline font-bold text-xl text-primary mb-8">License Details</h4>
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

        {/* Verification Timeline */}
        <section className="lg:col-span-6 bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h4 className="font-headline font-bold text-xl text-primary mb-8">Verification Timeline</h4>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Account Created</p>
              <p className="text-lg font-semibold text-on-surface">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })
                  : "--"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Verified At</p>
              <p className="text-lg font-semibold text-on-surface">
                {doctor?.verified_at
                  ? new Date(doctor.verified_at).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })
                  : status === "VERIFIED"
                    ? "Date not recorded"
                    : "Not yet verified"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Clinic Name</p>
              <p className="text-lg font-semibold text-on-surface">{doctor?.clinic_name || "--"}</p>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="lg:col-span-12 bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h4 className="font-headline font-bold text-xl text-primary mb-8">Quick Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Patient Care", icon: "medical_services", href: "/doctor/patient-care" },
              { label: "My Profile", icon: "person", href: "/doctor/profile" },
              { label: "Visit History", icon: "history", href: "/doctor/visit-history" },
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
