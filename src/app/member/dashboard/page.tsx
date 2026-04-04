import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { MemberCardVisual } from "@/components/shared/member-card-visual";

const recentActivity = [
  {
    id: 1,
    icon: "video_call",
    title: "Televisit with Dr. Marie Laurent",
    description: "General checkup completed",
    time: "2 hours ago",
    variant: "info" as const,
  },
  {
    id: 2,
    icon: "science",
    title: "Lab Work Results Available",
    description: "Blood panel — all values normal",
    time: "Yesterday",
    variant: "success" as const,
  },
  {
    id: 3,
    icon: "payments",
    title: "Premium Payment Processed",
    description: "$145.00 charged to Visa ****4291",
    time: "Oct 1, 2024",
    variant: "neutral" as const,
  },
  {
    id: 4,
    icon: "local_pharmacy",
    title: "Pharmacy Prescription Filled",
    description: "Lisinopril 10mg — 30-day supply",
    time: "Sep 28, 2024",
    variant: "warning" as const,
  },
];

export default function MemberDashboardPage() {
  return (
    <>
      <TopBar
        greeting="Bonjour, Jean-Pierre"
        subtitle="Here's your health overview for today."
        initials="JP"
      />

      {/* Hero Member Card */}
      <section className="clinical-gradient rounded-3xl p-8 lg:p-10 text-white mb-8 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <Badge variant="warning" icon="workspace_premium" className="mb-4">
            Premium Member
          </Badge>
          <h3 className="text-3xl font-black tracking-tight font-headline mb-1">
            Jean-Pierre Valcourt
          </h3>
          <p className="text-white/70 font-mono text-sm tracking-widest mb-6">
            VSC-88291-HT
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
              <Icon name="qr_code_2" size="sm" className="mr-2" />
              Show QR
            </Button>
            <Button variant="ghost" size="sm" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
              <Icon name="download" size="sm" className="mr-2" />
              Download Card
            </Button>
          </div>
        </div>
        <MemberCardVisual memberNumber="VSC-88291-HT" expiry="12/2026" />
      </section>

      {/* Visit Credits Panel */}
      <section className="bg-surface-container-lowest rounded-2xl p-8 mb-8">
        <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6">
          Visit Credits This Period
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-on-surface-variant">Total Visits</span>
              <span className="text-sm font-bold text-primary">09 / 10</span>
            </div>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full clinical-gradient rounded-full" style={{ width: "90%" }} />
            </div>
          </div>
          {/* Televisits */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-on-surface-variant">Televisits</span>
              <span className="text-sm font-bold text-primary">06 / 10</span>
            </div>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: "60%" }} />
            </div>
          </div>
          {/* In-Clinic */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-on-surface-variant">In-Clinic</span>
              <span className="text-sm font-bold text-primary">03 / 05</span>
            </div>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-tertiary rounded-full" style={{ width: "60%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Plan" value="Premium" icon="workspace_premium" />
        <StatCard label="Next Payment" value="$145.00" icon="payments" />
        <StatCard label="Dependents" value="2" icon="groups" />
        <StatCard label="Member Since" value="Jan 2024" icon="calendar_month" />
      </section>

      {/* Recent Activity + Upcoming */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
              Recent Activity
            </h4>
            <button className="text-primary text-sm font-bold font-headline hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
                  <Icon name={item.icon} size="sm" className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface font-headline">{item.title}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{item.description}</p>
                </div>
                <span className="text-xs text-on-surface-variant whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Panel */}
        <div className="space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6">
            <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">
              Next Appointment
            </h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 clinical-gradient rounded-xl flex items-center justify-center text-white">
                <Icon name="event" size="sm" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface font-headline">Oct 15, 2024</p>
                <p className="text-xs text-on-surface-variant">Dr. Laurent — Follow-up</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-4">
              <Icon name="edit_calendar" size="sm" className="mr-2" />
              Reschedule
            </Button>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6">
            <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">
              Payment Due
            </h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-tertiary-fixed rounded-xl flex items-center justify-center">
                <Icon name="payments" size="sm" className="text-on-tertiary-fixed-variant" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface font-headline">Oct 12, 2024</p>
                <p className="text-xs text-on-surface-variant">$145.00 — Auto-pay enabled</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-4">
              <Icon name="receipt_long" size="sm" className="mr-2" />
              View Invoice
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
