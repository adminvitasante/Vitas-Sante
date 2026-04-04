import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";

const payouts = [
  { id: "#PAY-001", date: "Oct 1, 2024", amount: "$1,250.00", status: "Paid" },
  { id: "#PAY-002", date: "Sep 1, 2024", amount: "$980.00", status: "Paid" },
  { id: "#PAY-003", date: "Aug 1, 2024", amount: "$1,100.00", status: "Paid" },
];

export default function CommissionsPage() {
  return (
    <>
      <TopBar greeting="Commissions & Payments" subtitle="Track your earnings and payouts" initials="MD" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Earned" value="$42,850" icon="account_balance" />
        <StatCard label="Pending Validation" value="$3,120.45" icon="hourglass_top" />
        <StatCard label="Next Payout" value="Oct 15" icon="calendar_month" />
      </div>
      <div className="bg-surface-container-lowest rounded-2xl p-8 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-headline font-bold text-xl text-primary">Tier Progress</h3>
          <Badge variant="info">Elite Partner</Badge>
        </div>
        <p className="text-sm text-on-surface-variant mb-4">$2,400 away from Diamond Tier</p>
        <div className="h-3 bg-surface-container rounded-full overflow-hidden">
          <div className="h-full clinical-gradient rounded-full" style={{ width: "75%" }} />
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <h3 className="font-headline font-bold text-xl text-primary mb-6">Payout History</h3>
        <div className="hidden md:grid grid-cols-4 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Payout ID</span><span>Date</span><span>Amount</span><span>Status</span>
        </div>
        <div className="space-y-2">
          {payouts.map((p) => (
            <div key={p.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center">
              <span className="font-mono text-sm font-bold text-primary">{p.id}</span>
              <span className="text-sm text-on-surface-variant">{p.date}</span>
              <span className="font-bold text-secondary text-sm">{p.amount}</span>
              <Badge variant="success">{p.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
