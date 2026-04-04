import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

const reports = [
  {
    title: "Q3 2024 Impact Report",
    period: "July - September 2024",
    badge: "Latest",
    badgeVariant: "success" as const,
    summary:
      "1,284 lives covered with a 94.2% health outcome score. Cardiac health improved 14% year-over-year.",
  },
  {
    title: "Q2 2024 Impact Report",
    period: "April - June 2024",
    badge: "Archived",
    badgeVariant: "neutral" as const,
    summary:
      "1,198 lives covered with a 92.8% health outcome score. Pediatric care visits up 22%.",
  },
  {
    title: "Q1 2024 Impact Report",
    period: "January - March 2024",
    badge: "Archived",
    badgeVariant: "neutral" as const,
    summary:
      "1,105 lives covered with a 91.5% health outcome score. New mental wellness program launched.",
  },
  {
    title: "Annual Report 2023",
    period: "January - December 2023",
    badge: "Annual",
    badgeVariant: "info" as const,
    summary:
      "Full-year retrospective covering 4,200+ beneficiary interactions with comprehensive outcome analysis.",
  },
];

export default function ImpactReportsPage() {
  return (
    <div>
      <TopBar
        greeting="Impact Reports"
        subtitle="Track the outcomes of your sponsorship"
        initials="SP"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Lives Impacted" value="1,284" icon="favorite" />
        <StatCard label="Total Visits" value="8,432" icon="stethoscope" />
        <StatCard
          label="Health Score"
          value="94.2%"
          icon="monitoring"
          trend="Above target"
          trendUp
        />
        <StatCard label="Cost per Life" value="$350" icon="savings" />
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.title}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-on-surface font-headline tracking-tight">
                    {report.title}
                  </h3>
                  <Badge variant={report.badgeVariant}>{report.badge}</Badge>
                </div>
                <p className="text-xs text-on-surface-variant">
                  {report.period}
                </p>
              </div>
              <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center shrink-0">
                <Icon
                  name="description"
                  size="sm"
                  className="text-primary"
                  filled
                />
              </div>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              {report.summary}
            </p>
            <Button variant="ghost" size="sm">
              <span className="flex items-center gap-2">
                <Icon name="download" size="sm" />
                Download PDF
              </span>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
