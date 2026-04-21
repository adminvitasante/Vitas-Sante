import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { getAdminDashboard } from "@/lib/server/queries";
import { getSessionWithCapability } from "@/lib/server/authz";

export default async function AdminDashboard() {
  const t = await getTranslations("admin.dashboard");
  const locale = await getLocale();
  const me = await getSessionWithCapability("ADMIN");
  if (!me) redirect("/auth/signin");

  const { stats, recentEvents } = await getAdminDashboard();
  const session = { user: { name: me.name } };

  return (
    <div className="min-h-screen px-8 py-8">
      <TopBar
        greeting={t("greeting")}
        subtitle={t("subtitle")}
        initials={session.user.name?.slice(0, 2).toUpperCase() || "AD"}
      />

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-primary-fixed rounded-lg">
              <Icon name="group" className="text-primary" />
            </span>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">{t("kpiTotalUsers")}</p>
          <h3 className="text-3xl font-headline font-black text-primary mt-1">
            {stats.totalUsers.toLocaleString()}
          </h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-secondary-fixed rounded-lg">
              <Icon name="how_to_reg" className="text-secondary" />
            </span>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">{t("kpiActiveEnrollments")}</p>
          <h3 className="text-3xl font-headline font-black text-primary mt-1">
            {stats.activeEnrollments.toLocaleString()}
          </h3>
        </div>

        <Link
          href="/admin/members"
          className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] border-l-4 border-error hover:shadow-lg transition-shadow block"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-error-container rounded-lg">
              <Icon name="pending_actions" className="text-error" />
            </span>
            <span className="text-error text-xs font-bold font-headline">{t("reviewArrow")}</span>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">{t("kpiPendingEnrollments")}</p>
          <h3 className="text-3xl font-headline font-black text-primary mt-1">
            {stats.pendingEnrollments.toLocaleString()}
          </h3>
        </Link>

        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-primary-fixed rounded-lg">
              <Icon name="verified" className="text-primary" />
            </span>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">{t("kpiVerifiedDoctors")}</p>
          <h3 className="text-3xl font-headline font-black text-primary mt-1">
            {stats.verifiedDoctors.toLocaleString()}
          </h3>
        </div>

        <Link
          href="/admin/doctors"
          className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] border-l-4 border-tertiary hover:shadow-lg transition-shadow block"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-tertiary-fixed rounded-lg">
              <Icon name="hourglass_empty" className="text-tertiary" />
            </span>
            <span className="text-tertiary text-xs font-bold font-headline">{t("reviewArrow")}</span>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">{t("kpiPendingDoctors")}</p>
          <h3 className="text-3xl font-headline font-black text-primary mt-1">
            {stats.pendingDoctors.toLocaleString()}
          </h3>
        </Link>
      </section>

      {/* Recent Events */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h4 className="text-xl font-headline font-extrabold text-primary">{t("recentEventsTitle")}</h4>
            <p className="text-sm text-on-surface-variant">{t("recentEventsSub")}</p>
          </div>
        </div>

        {recentEvents && recentEvents.length > 0 ? (
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">{t("colEventType")}</th>
                    <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">{t("colActor")}</th>
                    <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">{t("colTime")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {recentEvents.map((event: any) => (
                    <tr key={event.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-on-surface">{event.event_type}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-on-surface-variant">{event.actor_id || t("systemActor")}</span>
                      </td>
                      <td className="px-8 py-5 text-sm text-on-surface-variant">
                        {new Date(event.created_at).toLocaleString(locale)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-3xl p-12 text-center shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
            <Icon name="event_busy" className="text-outline !text-4xl mb-3" />
            <p className="text-on-surface-variant font-medium">{t("noEvents")}</p>
          </div>
        )}
      </section>
    </div>
  );
}
