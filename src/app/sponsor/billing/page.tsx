import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const invoices = [
  {
    id: "INV-2024-0847",
    date: "Sep 15, 2024",
    amount: "\u20ac12,240.00",
    status: "Paid",
    statusVariant: "success" as const,
  },
  {
    id: "INV-2024-0623",
    date: "Aug 15, 2024",
    amount: "\u20ac12,240.00",
    status: "Paid",
    statusVariant: "success" as const,
  },
  {
    id: "INV-2024-0512",
    date: "Jul 15, 2024",
    amount: "\u20ac11,890.00",
    status: "Paid",
    statusVariant: "success" as const,
  },
  {
    id: "INV-2024-0401",
    date: "Jun 15, 2024",
    amount: "\u20ac11,890.00",
    status: "Pending",
    statusVariant: "warning" as const,
  },
];

export default function BillingPage() {
  return (
    <div>
      <TopBar
        greeting="Billing & Payments"
        subtitle="Manage your sponsorship finances"
        initials="SP"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Lifetime Investment"
          value="\u20ac842,500"
          icon="account_balance"
          trend="+12.4% YoY"
          trendUp
        />
        <StatCard
          label="Next Payment"
          value="\u20ac12,240"
          icon="event"
        />
        <StatCard
          label="Active Members"
          value="1,248"
          icon="group"
          trend="+38 this quarter"
          trendUp
        />
      </div>

      {/* Invoice Table */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-on-surface font-headline tracking-tight">
            Invoice History
          </h3>
          <Button variant="secondary" size="sm">
            Export All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-4">
                  Invoice ID
                </th>
                <th className="text-left text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-4">
                  Date
                </th>
                <th className="text-left text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-4">
                  Amount
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
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-outline-variant last:border-0"
                >
                  <td className="py-4 font-bold text-sm text-on-surface">
                    {inv.id}
                  </td>
                  <td className="py-4 text-sm text-on-surface-variant">
                    {inv.date}
                  </td>
                  <td className="py-4 text-sm font-bold text-on-surface">
                    {inv.amount}
                  </td>
                  <td className="py-4">
                    <Badge variant={inv.statusVariant}>{inv.status}</Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="secondary" size="sm">
                      Download
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
