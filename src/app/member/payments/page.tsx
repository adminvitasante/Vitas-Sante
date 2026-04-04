import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const transactions = [
  {
    id: "TXN-20241001",
    date: "Oct 1, 2024",
    description: "Monthly Premium — October 2024",
    amount: "$145.00",
    status: "Completed",
    variant: "success" as const,
  },
  {
    id: "TXN-20240901",
    date: "Sep 1, 2024",
    description: "Monthly Premium — September 2024",
    amount: "$145.00",
    status: "Completed",
    variant: "success" as const,
  },
  {
    id: "TXN-20240815",
    date: "Aug 15, 2024",
    description: "Lab Work — Blood Panel",
    amount: "$85.00",
    status: "Completed",
    variant: "success" as const,
  },
  {
    id: "TXN-20240801",
    date: "Aug 1, 2024",
    description: "Monthly Premium — August 2024",
    amount: "$145.00",
    status: "Completed",
    variant: "success" as const,
  },
  {
    id: "TXN-20240720",
    date: "Jul 20, 2024",
    description: "Specialist Consultation Co-pay",
    amount: "$35.00",
    status: "Pending",
    variant: "warning" as const,
  },
];

export default function PaymentsPage() {
  return (
    <>
      <TopBar
        greeting="Payments"
        subtitle="Billing history and upcoming charges."
        initials="JP"
      />

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Next Payment" value="$145.00" icon="event" trend="Due Oct 12" />
        <StatCard label="This Year" value="$1,842.50" icon="payments" trend="+12% vs last year" trendUp />
        <StatCard label="Plan" value="Premium Gold" icon="workspace_premium" />
      </section>

      {/* Payment Actions */}
      <section className="flex flex-wrap gap-3 mb-8">
        <Button variant="primary" size="md">
          <Icon name="credit_card" size="sm" className="mr-2" />
          Make a Payment
        </Button>
        <Button variant="secondary" size="md">
          <Icon name="account_balance" size="sm" className="mr-2" />
          Update Payment Method
        </Button>
        <Button variant="secondary" size="md">
          <Icon name="download" size="sm" className="mr-2" />
          Download Statements
        </Button>
      </section>

      {/* Transactions Table */}
      <section className="bg-surface-container-lowest rounded-2xl overflow-hidden">
        <div className="px-8 py-5 border-b border-outline-variant/20">
          <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
            Transaction History
          </h4>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-8 py-3 bg-surface-container-low/50 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <div className="col-span-2">ID</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-4">Description</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-outline-variant/10">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-8 py-5 hover:bg-surface-container-low/30 transition-colors items-center"
            >
              <div className="col-span-2">
                <span className="text-xs font-mono text-on-surface-variant md:text-sm">
                  {txn.id}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-on-surface-variant">{txn.date}</span>
              </div>
              <div className="col-span-4">
                <span className="text-sm font-medium text-on-surface font-headline">
                  {txn.description}
                </span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-sm font-bold text-primary">{txn.amount}</span>
              </div>
              <div className="col-span-2 text-right">
                <Badge variant={txn.variant} icon={txn.status === "Completed" ? "check_circle" : "schedule"}>
                  {txn.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer */}
        <div className="px-8 py-4 border-t border-outline-variant/20 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">
            Showing 5 of 24 transactions
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled>
              <Icon name="chevron_left" size="sm" />
            </Button>
            <Button variant="secondary" size="sm">
              <Icon name="chevron_right" size="sm" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
