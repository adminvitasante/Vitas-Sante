import { auth } from "@/lib/auth";
import { getMemberProfile } from "@/lib/server/queries";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user?.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let capabilities: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let enrollment: any = null;

  if (userId) {
    const data = await getMemberProfile(userId);
    user = data.user;
    capabilities = data.capabilities || [];
    enrollment = data.enrollment;
  }

  const memberName = user?.name || session?.user?.name || "Member";
  const firstName = memberName.split(" ")[0];
  const initials = memberName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const email = user?.email || session?.user?.email || "—";
  const phone = user?.phone || "—";
  const locale = user?.locale || "en";
  const planName = enrollment?.plans?.name_en || "No Plan";
  const enrollmentStatus = enrollment?.status || "—";
  const periodStart = enrollment?.subscriptions?.current_period_start;
  const periodEnd = enrollment?.subscriptions?.current_period_end;
  const memberSince = periodStart
    ? new Date(periodStart).toLocaleDateString("en", { month: "short", year: "numeric" })
    : "—";
  const renewal = periodEnd
    ? new Date(periodEnd).toLocaleDateString("en", { month: "short", year: "numeric" })
    : "—";
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })
    : "—";

  const activeCapabilities = capabilities
    .filter((c: { status: string }) => c.status === "ACTIVE")
    .map((c: { capability: string }) => c.capability);

  const languageLabel = locale === "fr" ? "Français" : locale === "ht" ? "Kreyòl" : "English";

  return (
    <>
      <TopBar
        greeting={`${firstName}'s Profile`}
        subtitle="Manage your personal information and preferences."
        initials={initials}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Header */}
        <section className="lg:col-span-12">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-black">
              {initials}
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-headline font-extrabold text-on-surface">{memberName}</h2>
              <p className="text-on-surface-variant mt-1">{email}</p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-fixed text-primary rounded-full text-xs font-bold">
                  <Icon name="verified" size="sm" /> {planName} Member
                </span>
                {activeCapabilities.map((cap: string) => (
                  <span key={cap} className="inline-flex items-center gap-1 px-3 py-1 bg-tertiary-fixed text-on-tertiary-container rounded-full text-xs font-bold">
                    <Icon name="shield" size="sm" /> {cap}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/member/dashboard"
              className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg transition-shadow flex items-center gap-2"
            >
              <Icon name="arrow_back" size="sm" />
              Back to Dashboard
            </Link>
          </div>
        </section>

        {/* Personal Information */}
        <section className="lg:col-span-7">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-6">Personal Information</h3>
            <dl className="space-y-5">
              {[
                { label: "Full Name", value: memberName, icon: "person" },
                { label: "Email", value: email, icon: "email" },
                { label: "Phone", value: phone, icon: "phone" },
                { label: "Account Created", value: createdAt, icon: "cake" },
                { label: "Member ID", value: enrollment?.member_id_code || "—", icon: "badge" },
                { label: "Language", value: languageLabel, icon: "translate" },
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
                <span className="font-bold text-on-surface">{planName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Status</span>
                <span className="inline-flex items-center gap-1 text-tertiary font-bold text-sm">
                  <span className={`w-2 h-2 rounded-full ${enrollmentStatus === "ACTIVE" ? "bg-tertiary" : "bg-outline"}`} /> {enrollmentStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Member Since</span>
                <span className="font-bold text-on-surface">{memberSince}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Renewal</span>
                <span className="font-bold text-on-surface">{renewal}</span>
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
