import { auth } from "@/lib/auth";
import { getAffiliateDashboard } from "@/lib/server/queries";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { redirect } from "next/navigation";

export default async function MarketingPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const { affiliate } = await getAffiliateDashboard(userId);

  const initials = session.user.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AF";

  if (!affiliate) {
    return (
      <>
        <TopBar greeting="Affiliate" subtitle="Marketing" initials="--" />
        <div className="flex flex-col items-center justify-center py-32">
          <Icon name="person_off" className="!text-6xl text-outline mb-4" />
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">No Affiliate Account</h2>
          <p className="text-on-surface-variant max-w-md text-center">You do not have an affiliate account yet. Please contact support or apply to become a partner.</p>
        </div>
      </>
    );
  }

  const referralLink = `vitasante.club/ref/${affiliate.partner_code}`;

  return (
    <>
      <TopBar
        greeting={session.user.name ?? "Partner"}
        subtitle="Marketing Materials"
        initials={initials}
      />

      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-4">Marketing Materials</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl">Access curated brand assets designed for professional outreach. Enhance your authority and grow your referral network.</p>
      </header>

      {/* Referral Link Generator */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="bg-surface-container-lowest rounded-3xl p-8 relative overflow-hidden border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="flex-1">
              <h2 className="text-xl font-headline font-bold text-primary mb-2">Your Unique Referral Link</h2>
              <p className="text-sm text-on-surface-variant">Share this personalized URL to track your referrals and commissions accurately.</p>
            </div>
            <div className="flex-1 w-full flex items-center gap-2">
              <div className="flex-1 bg-surface-container-low px-6 py-4 rounded-xl font-mono text-sm text-primary border-b-2 border-primary">
                {referralLink}
              </div>
              <button className="bg-primary text-white p-4 rounded-xl hover:bg-primary-container transition-colors">
                <Icon name="content_copy" className="block" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Code Card */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="bg-primary text-white rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full blur-3xl opacity-50 -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <p className="text-xs font-bold text-primary-fixed-dim uppercase tracking-widest mb-2">Your Partner Code</p>
              <p className="text-4xl font-headline font-extrabold text-white mb-2">{affiliate.partner_code}</p>
              <p className="text-sm text-primary-fixed opacity-80">Share this code directly with potential members who can enter it during signup.</p>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                <Icon name="badge" className="text-primary-fixed" />
                <div>
                  <p className="text-xs font-bold text-primary-fixed uppercase tracking-widest">Tier</p>
                  <p className="text-lg font-headline font-bold">{affiliate.tier ?? "Standard"}</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                <Icon name="verified" className="text-primary-fixed" />
                <div>
                  <p className="text-xs font-bold text-primary-fixed uppercase tracking-widest">Status</p>
                  <p className="text-lg font-headline font-bold">{affiliate.status ?? "Active"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Tips */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-headline font-bold text-on-surface">Marketing Tips</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/5 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center mb-6">
              <Icon name="share" className="text-primary" />
            </div>
            <h4 className="font-headline font-bold text-on-surface mb-3">Share on Social Media</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">Post your referral link on LinkedIn, Instagram, and WhatsApp. Personal stories about health coverage resonate with your audience.</p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/5 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center mb-6">
              <Icon name="mail" className="text-secondary" />
            </div>
            <h4 className="font-headline font-bold text-on-surface mb-3">Email Outreach</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">Send personalized emails to your professional network. Include your partner code and explain the benefits of comprehensive health coverage.</p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/5 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center mb-6">
              <Icon name="handshake" className="text-tertiary" />
            </div>
            <h4 className="font-headline font-bold text-on-surface mb-3">In-Person Referrals</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">Share your partner code during consultations and meetings. Direct conversations build trust and lead to higher conversion rates.</p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/5 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center mb-6">
              <Icon name="groups" className="text-primary" />
            </div>
            <h4 className="font-headline font-bold text-on-surface mb-3">Community Events</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">Host or attend health fairs and community events. These gatherings are ideal for introducing people to comprehensive health plans.</p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/5 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center mb-6">
              <Icon name="qr_code_2" className="text-secondary" />
            </div>
            <h4 className="font-headline font-bold text-on-surface mb-3">Use QR Codes</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">Generate a QR code for your referral link and place it on business cards, flyers, or clinic displays for easy scanning.</p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/5 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center mb-6">
              <Icon name="trending_up" className="text-tertiary" />
            </div>
            <h4 className="font-headline font-bold text-on-surface mb-3">Track & Optimize</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">Monitor your referral dashboard regularly. Identify which channels bring the most conversions and double down on those strategies.</p>
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="bg-surface-container-low rounded-3xl p-8">
          <h3 className="text-xl font-headline font-bold text-on-surface mb-6">Quick Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <Icon name="link" className="text-primary mt-1" />
              <div>
                <p className="font-bold text-on-surface text-sm mb-1">Referral Link</p>
                <p className="text-sm text-primary font-mono">{referralLink}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Icon name="tag" className="text-primary mt-1" />
              <div>
                <p className="font-bold text-on-surface text-sm mb-1">Partner Code</p>
                <p className="text-sm text-primary font-mono">{affiliate.partner_code}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Icon name="workspace_premium" className="text-primary mt-1" />
              <div>
                <p className="font-bold text-on-surface text-sm mb-1">Your Tier</p>
                <p className="text-sm text-on-surface-variant">{affiliate.tier ?? "Standard"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Icon name="check_circle" className="text-primary mt-1" />
              <div>
                <p className="font-bold text-on-surface text-sm mb-1">Account Status</p>
                <p className="text-sm text-on-surface-variant">{affiliate.status ?? "Active"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Quote */}
      <section className="max-w-6xl mx-auto mt-20 p-12 bg-primary rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full blur-3xl opacity-50 -mr-32 -mt-32" />
        <div className="relative z-10 text-center">
          <p className="text-3xl font-headline font-bold text-white mb-6">&ldquo;Your network is your greatest asset. Every referral strengthens the community of care.&rdquo;</p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-white/30" />
            <span className="text-primary-fixed text-sm font-bold tracking-widest uppercase">Vita Sant&eacute; Club</span>
            <div className="w-12 h-px bg-white/30" />
          </div>
        </div>
      </section>
    </>
  );
}
