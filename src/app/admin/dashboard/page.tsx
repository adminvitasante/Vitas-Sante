import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

const approvals = [
  {
    title: "Dr. Fabienne Clervil - License Verification",
    subtitle: "Submitted 2 hours ago",
    icon: "medical_information",
  },
  {
    title: "Premium Plan Upgrade - Marie Dessalines",
    subtitle: "Submitted 4 hours ago",
    icon: "upgrade",
  },
  {
    title: "New Sponsor Application - Foundation Lumiere",
    subtitle: "Submitted 1 day ago",
    icon: "handshake",
  },
];

const activity = [
  {
    event: "New member registration: Pierre Jean-Louis",
    category: "Member",
    categoryVariant: "info" as const,
    time: "12 min ago",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    event: "Payment received: INV-2024-0912",
    category: "Billing",
    categoryVariant: "success" as const,
    time: "45 min ago",
    status: "Processed",
    statusVariant: "success" as const,
  },
  {
    event: "Doctor profile updated: Dr. Mercier",
    category: "Doctor",
    categoryVariant: "neutral" as const,
    time: "2 hours ago",
    status: "Verified",
    statusVariant: "success" as const,
  },
  {
    event: "Affiliate payout initiated: Batch #847",
    category: "Affiliate",
    categoryVariant: "warning" as const,
    time: "3 hours ago",
    status: "Pending",
    statusVariant: "warning" as const,
  },
];

const planDistribution = [
  { name: "Essential", pct: 30, color: "bg-outline" },
  { name: "Advantage", pct: 45, color: "bg-primary" },
  { name: "Premium", pct: 25, color: "bg-secondary" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <TopBar
        greeting="Mission Control"
        subtitle="System-wide overview and operations"
        initials="AD"
      />

      {/* Primary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Members"
          value="15,284"
          icon="group"
          trend="+284 this month"
          trendUp
        />
        <StatCard
          label="Active Doctors"
          value="48"
          icon="stethoscope"
          trend="+3 new"
          trendUp
        />
        <StatCard
          label="Revenue MTD"
          value="$284,500"
          icon="payments"
          trend="+18.2%"
          trendUp
        />
        <StatCard
          label="System Integrity"
          value="98.4%"
          icon="shield"
          trend="All systems nominal"
          trendUp
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pending Approvals */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-bold text-on-surface font-headline tracking-tight mb-6">
            Pending Approvals
          </h3>
          <div className="space-y-4">
            {approvals.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low"
              >
                <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center shrink-0">
                  <Icon name={item.icon} size="sm" className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {item.subtitle}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="primary" size="sm">
                      Approve
                    </Button>
                    <Button variant="secondary" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-bold text-on-surface font-headline tracking-tight mb-6">
            Recent Activity
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="text-left text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-4">
                    Event
                  </th>
                  <th className="text-left text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-4">
                    Category
                  </th>
                  <th className="text-left text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-4 hidden md:table-cell">
                    Time
                  </th>
                  <th className="text-right text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {activity.map((row) => (
                  <tr
                    key={row.event}
                    className="border-b border-outline-variant last:border-0"
                  >
                    <td className="py-4 text-sm font-medium text-on-surface max-w-xs truncate">
                      {row.event}
                    </td>
                    <td className="py-4">
                      <Badge variant={row.categoryVariant}>
                        {row.category}
                      </Badge>
                    </td>
                    <td className="py-4 text-xs text-on-surface-variant hidden md:table-cell">
                      {row.time}
                    </td>
                    <td className="py-4 text-right">
                      <Badge variant={row.statusVariant}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Plan Distribution */}
      <Card>
        <h3 className="text-lg font-bold text-on-surface font-headline tracking-tight mb-6">
          Plan Distribution
        </h3>
        <div className="space-y-4">
          {planDistribution.map((plan) => (
            <div key={plan.name} className="flex items-center gap-4">
              <span className="text-sm font-bold text-on-surface w-24">
                {plan.name}
              </span>
              <div className="flex-1 h-3 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${plan.color}`}
                  style={{ width: `${plan.pct}%` }}
                />
              </div>
              <span className="text-sm font-bold text-primary w-12 text-right">
                {plan.pct}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
