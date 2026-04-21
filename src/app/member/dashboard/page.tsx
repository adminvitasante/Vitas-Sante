import { auth } from "@/lib/auth";
import { getTranslations, getLocale } from "next-intl/server";
import { getMemberDashboard } from "@/lib/server/queries";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { MemberCardVisual } from "@/components/shared/member-card-visual";
import Link from "next/link";

export default async function MemberDashboard() {
  const t = await getTranslations("member.dashboard");
  const locale = await getLocale();
  const session = await auth();
  const userId = session?.user?.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let enrollment: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let visits: any[] = [];
  let creditsRemaining = 0;
  let creditsTotal = 0;

  if (userId) {
    const data = await getMemberDashboard(userId);
    user = data.user;
    enrollment = data.enrollment;
    visits = data.visits || [];

    if (enrollment?.credit_accounts?.length > 0) {
      const ca = enrollment.credit_accounts[0];
      creditsRemaining = ca.visits_remaining ?? 0;
      creditsTotal = ca.visits_total ?? 0;
    }
  }

  const memberName = user?.name || session?.user?.name || "Member";
  const firstName = memberName.split(" ")[0];
  const initials = memberName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const planName = enrollment?.plans?.name_en || "No Plan";
  const memberCode = enrollment?.member_id_code || "---";
  const periodEnd = enrollment?.subscriptions?.current_period_end;
  const expiry = periodEnd
    ? new Date(periodEnd).toLocaleDateString(locale, { month: "2-digit", year: "2-digit" })
    : "--/--";
  const creditsUsed = creditsTotal - creditsRemaining;
  const creditsPct = creditsTotal > 0 ? (creditsRemaining / creditsTotal) * 100 : 0;
  const dashOffset = 440 - (440 * creditsPct) / 100;

  return (
    <>
      <TopBar
        greeting={t("greeting", { name: firstName })}
        subtitle={t("subtitle")}
        initials={initials}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Hero Member Card */}
        <section className="lg:col-span-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 text-white flex flex-col md:flex-row justify-between items-center group">
            <div className="z-10 text-center md:text-left mb-6 md:mb-0">
              <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                {t("planBadge", { plan: planName })}
              </span>
              <h3 className="text-4xl font-extrabold mb-1">{memberName}</h3>
              <p className="text-primary-fixed opacity-90 font-mono tracking-widest text-lg">{memberCode}</p>
              <div className="mt-8 flex gap-4">
                <Link
                  href="/member/profile"
                  className="bg-white text-primary px-6 py-2 rounded-xl font-bold text-sm hover:bg-primary-fixed transition-colors"
                >
                  {t("viewProfile")}
                </Link>
                <Link
                  href="/member/medical-card"
                  className="bg-primary/20 border border-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Icon name="badge" size="sm" />
                  {t("medicalCard")}
                </Link>
              </div>
            </div>
            <div className="relative z-10 transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
              <MemberCardVisual memberNumber={memberCode} expiry={expiry} />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Visit Credits */}
        <section className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
            <h4 className="font-headline font-bold text-on-surface mb-6">{t("credits")}</h4>
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-surface-container-low" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12" />
                <circle className="text-secondary" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset={dashOffset} strokeWidth="12" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-primary">{String(creditsRemaining).padStart(2, "0")}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{t("creditsAvailable")}</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 w-full">
              <div className="bg-surface-container-low p-3 rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase">{t("creditsTotal")}</p>
                <p className="text-xl font-bold text-primary">{creditsTotal}</p>
              </div>
              <div className="bg-surface-container-low p-3 rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase">{t("creditsUsed")}</p>
                <p className="text-xl font-bold text-secondary">{creditsUsed}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Visits */}
        <section className="lg:col-span-7 bg-surface-container-low rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-headline font-bold text-xl text-primary">{t("recentVisits")}</h4>
            <Link href="/member/analytics" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              {t("quickAnalytics")}
              <Icon name="chevron_right" size="sm" />
            </Link>
          </div>
          {visits.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <Icon name="event_busy" className="text-4xl mb-2 opacity-40" />
              <p className="text-sm">{t("noVisits")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {visits.map((visit) => (
                <div key={visit.id} className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between group hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                      <Icon
                        name={visit.visit_type === "TELEVISIT" ? "videocam" : visit.visit_type === "SPECIALIST" ? "medical_services" : "stethoscope"}
                        size="sm"
                      />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-on-surface capitalize">
                        {visit.visit_type?.toLowerCase().replace("_", " ")}
                      </h5>
                      <p className="text-xs text-slate-500">
                        {visit.doctors?.users?.name || "Doctor"} &bull;{" "}
                        {new Date(visit.visited_at).toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase text-tertiary">{visit.status}</span>
                    {visit.copay_amount_cents > 0 && (
                      <span className="text-sm font-bold text-on-surface">${(visit.copay_amount_cents / 100).toFixed(2)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Links */}
        <section className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h4 className="font-headline font-bold text-xl text-primary mb-8">{t("quickActions")}</h4>
          <div className="space-y-3">
            {[
              { label: t("quickViewCard"), icon: "badge", href: "/member/medical-card" },
              { label: t("quickDependents"), icon: "groups", href: "/member/dependents" },
              { label: t("quickPayments"), icon: "payments", href: "/member/payments" },
              { label: t("quickAnalytics"), icon: "monitoring", href: "/member/analytics" },
              { label: t("quickSupport"), icon: "help", href: "/member/support" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-xl group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <Icon name={item.icon} size="sm" />
                  </div>
                  <span className="font-bold text-sm text-on-surface">{item.label}</span>
                </div>
                <Icon name="chevron_right" size="sm" className="text-slate-300 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* Diaspora Support Banner */}
        <section className="lg:col-span-12 mt-4">
          <div className="bg-surface-container-low rounded-3xl overflow-hidden flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 h-64 md:h-80 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-full object-cover"
                alt="professional male haitian doctor in a white clinical coat smiling warmly in a high-end modern medical office"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBXVC5h3DhjfSWPtDs5iaaekSPzK-nKm2OLBuW7XTIW5haFzcqAhNF0ME0R7Q8_qqj3Rw0pZ7GlNFYVVjkRBnsrFXpdRJ4C9eXZD82nPw6qOmjZTJaxPgor0zL3KP2uAgcRc7MzkQJU6Pt9o-6lCytn4do3hbRb_m9A5TqNHiyjsh5cmV0SHFLQ_PwocHHqum2IBzTS37gUugUVtyEqNawxSu96UbYfNw1l7ypJ6u0AmERrTvwWXLQHyExGn16xGOqxNVnAiAWmw77"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-container-low" />
            </div>
            <div className="md:w-2/3 p-8 md:p-12">
              <h4 className="text-3xl font-headline font-extrabold text-primary mb-4">{t("diasporaTitle")}</h4>
              <p className="text-on-surface-variant max-w-2xl mb-8 leading-relaxed">
                {t("diasporaBody")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/member/support"
                  className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-shadow flex items-center gap-2"
                >
                  <Icon name="chat_bubble" />
                  {t("diasporaCta")}
                </Link>
                <Link
                  href="/member/doctors"
                  className="px-8 py-4 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors text-center"
                >
                  {t("diasporaFind")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-20 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center w-full">
        <p className="font-body text-xs text-slate-500 mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Vita Sant&eacute; Club. Tous droits r&eacute;serv&eacute;s.
        </p>
        <div className="flex gap-8">
          <a className="text-slate-400 hover:text-primary transition-colors text-xs font-medium" href="mailto:support@vitasante.ht">
            support@vitasante.ht
          </a>
        </div>
      </footer>
    </>
  );
}
