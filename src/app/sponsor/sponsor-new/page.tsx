import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Icon } from "@/components/ui/icon";

export default async function SponsorNewPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const userName = session?.user?.name || "Sponsor";

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-outline mb-4">
            <span>Sponsor Portal</span>
            <Icon name="chevron_right" className="text-sm" />
            <span className="text-primary font-semibold">Sponsor New Members</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-2">Sponsor New Members</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg">
            Welcome, <span className="font-semibold text-on-surface">{userName}</span>. Expand your community health impact by sponsoring new beneficiaries through Vita Sant&eacute;.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Info Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gradient-to-br from-primary to-primary-container rounded-xl p-8 text-white relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <Icon name="volunteer_activism" className="text-[120px]" />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">How It Works</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <p className="text-sm text-primary-fixed/90">Contact our team with the number of members you want to sponsor.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <p className="text-sm text-primary-fixed/90">We will set up the appropriate plan and enrollment for each beneficiary.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <p className="text-sm text-primary-fixed/90">Members receive their digital Vita Sant&eacute; ID and can start accessing care immediately.</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-tertiary">
            <div className="flex items-center gap-3 mb-3 text-tertiary">
              <Icon name="verified_user" />
              <span className="font-bold text-sm">Secure Enrollment</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Data is encrypted using industry standards. Members will receive their digital Vita Sant&eacute; ID within 24 hours of enrollment.
            </p>
          </div>
        </div>

        {/* Right: CTA Content */}
        <div className="lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_rgba(0,27,63,0.06)] p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <Icon name="group_add" filled />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Ready to Sponsor?</h2>
                <p className="text-sm text-outline">Our team will help you set up sponsorships for your beneficiaries.</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <p className="text-on-surface-variant leading-relaxed">
                To sponsor new members, please reach out to our institutional support team. We offer flexible plans for organizations of all sizes, including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 rounded-lg flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-on-surface">Individual Sponsorships</p>
                    <p className="text-xs text-on-surface-variant">Sponsor specific individuals in your community.</p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-on-surface">Bulk Enrollment</p>
                    <p className="text-xs text-on-surface-variant">Groups of 10+ qualify for streamlined onboarding.</p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-on-surface">Custom Plans</p>
                    <p className="text-xs text-on-surface-variant">Tailor coverage levels to your organization&apos;s needs.</p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-on-surface">Dedicated Support</p>
                    <p className="text-xs text-on-surface-variant">Your own account manager for ongoing assistance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-surface-container flex flex-col sm:flex-row justify-between items-center gap-4">
              <a href="/sponsor/overview" className="text-outline font-bold px-8 py-4 hover:text-on-surface transition-colors flex items-center gap-2">
                <Icon name="arrow_back" />
                Back to Overview
              </a>
              <a
                href="mailto:sponsors@vitasante.com?subject=New%20Sponsorship%20Inquiry"
                className="bg-gradient-to-br from-primary to-primary-container text-white font-bold px-12 py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Icon name="mail" />
                Contact Our Team
              </a>
            </div>
          </div>

          {/* Bento Info Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-container text-on-primary-container p-8 rounded-xl flex flex-col justify-between min-h-[200px]">
              <Icon name="inventory_2" className="text-4xl" />
              <div>
                <h4 className="font-bold text-xl mb-1">Flexible Tiers</h4>
                <p className="text-sm opacity-80 leading-relaxed">Upgrade or downgrade member plans at any monthly renewal cycle.</p>
              </div>
            </div>
            <div className="bg-secondary-container text-on-secondary-container p-8 rounded-xl flex flex-col justify-between min-h-[200px]">
              <Icon name="group_add" className="text-4xl" />
              <div>
                <h4 className="font-bold text-xl mb-1">Institutional Perks</h4>
                <p className="text-sm opacity-80 leading-relaxed">Groups of 50+ qualify for our Custom Wellness Program integrations.</p>
              </div>
            </div>
            <div className="bg-tertiary-container text-on-tertiary-container p-8 rounded-xl flex flex-col justify-between min-h-[200px]">
              <Icon name="speed" className="text-4xl" />
              <div>
                <h4 className="font-bold text-xl mb-1">Instant Coverage</h4>
                <p className="text-sm opacity-80 leading-relaxed">Emergency tele-consultations are active immediately upon payment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
