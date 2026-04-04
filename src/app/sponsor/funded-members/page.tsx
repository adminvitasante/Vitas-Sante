import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const members = [
  {
    name: "Marie-Claire Duval",
    id: "VSC-2024-0847",
    plan: "Premium",
    planVariant: "success" as const,
    coverage: "Jan 2024 - Dec 2024",
    status: "Active",
    statusVariant: "success" as const,
  },
  {
    name: "Jean-Baptiste Mercier",
    id: "VSC-2024-0623",
    plan: "Advantage",
    planVariant: "info" as const,
    coverage: "Mar 2024 - Feb 2025",
    status: "Active",
    statusVariant: "success" as const,
  },
  {
    name: "Sophia Beaumont",
    id: "VSC-2024-0912",
    plan: "Essential",
    planVariant: "neutral" as const,
    coverage: "Jun 2024 - May 2025",
    status: "Pending Renewal",
    statusVariant: "warning" as const,
  },
  {
    name: "Pierre-Louis Charles",
    id: "VSC-2024-0384",
    plan: "Premium",
    planVariant: "success" as const,
    coverage: "Sep 2023 - Aug 2024",
    status: "Active",
    statusVariant: "success" as const,
  },
];

export default function FundedMembersPage() {
  return (
    <div>
      <TopBar
        greeting="Funded Members"
        subtitle="Manage your sponsored beneficiaries"
        initials="SP"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Members" value="124" icon="group" />
        <StatCard label="Total Funded" value="$42.8k" icon="account_balance" />
        <StatCard
          label="Adherence Rate"
          value="98.2%"
          icon="verified"
          trend="Above target"
          trendUp
        />
      </div>

      {/* Search & Action */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1 w-full">
            <Input
              label="Search Members"
              placeholder="Search by name, ID, or plan..."
              id="member-search"
            />
          </div>
          <Button variant="primary">Sponsor New Member</Button>
        </div>
      </Card>

      {/* Members Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-4">
                  Member
                </th>
                <th className="text-left text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-4">
                  Plan
                </th>
                <th className="text-left text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-4 hidden md:table-cell">
                  Coverage Period
                </th>
                <th className="text-left text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-4">
                  Status
                </th>
                <th className="text-right text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-outline-variant last:border-0"
                >
                  <td className="py-4">
                    <p className="font-bold text-on-surface">{member.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {member.id}
                    </p>
                  </td>
                  <td className="py-4">
                    <Badge variant={member.planVariant}>{member.plan}</Badge>
                  </td>
                  <td className="py-4 text-sm text-on-surface-variant hidden md:table-cell">
                    {member.coverage}
                  </td>
                  <td className="py-4">
                    <Badge variant={member.statusVariant}>{member.status}</Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="secondary" size="sm">
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
