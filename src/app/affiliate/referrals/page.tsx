import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const referrals = [
  { name: "Pierre Jean", date: "Oct 10, 2024", plan: "Premium", status: "Active", commission: "$45.00" },
  { name: "Claire Moreau", date: "Oct 8, 2024", plan: "Advantage", status: "Pending Review", commission: "$30.00" },
  { name: "André Dupont", date: "Oct 5, 2024", plan: "Essential", status: "Active", commission: "$20.00" },
  { name: "Sophie Laurent", date: "Sep 28, 2024", plan: "Premium", status: "Active", commission: "$45.00" },
  { name: "Marc Antoine", date: "Sep 20, 2024", plan: "Advantage", status: "Expired", commission: "$0.00" },
];

const sv: Record<string, "success" | "warning" | "error"> = { Active: "success", "Pending Review": "warning", Expired: "error" };

export default function ReferralsPage() {
  return (
    <>
      <TopBar greeting="Referral Tracking" subtitle="Monitor your professional network" initials="MD" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <StatCard label="Network Velocity" value="+14%" icon="trending_up" trend="Growing" trendUp />
        <StatCard label="Unclaimed Revenue" value="$1,840.22" icon="warning" trend="From pending referrals" />
      </div>
      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-xl text-primary">124 Professional Referrals</h3>
          <div className="flex gap-2">
            {["Active", "Pending Review", "Expired"].map((f) => (
              <button key={f} className="px-3 py-1.5 rounded-full text-xs font-bold bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors">{f}</button>
            ))}
          </div>
        </div>
        <div className="mb-6"><Input id="search" placeholder="Search by name, plan, or status..." /></div>
        <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Referral Name</span><span>Date Joined</span><span>Plan</span><span>Status</span><span>Commission</span>
        </div>
        <div className="space-y-2">
          {referrals.map((r) => (
            <div key={r.name} className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center">
              <span className="font-bold text-primary text-sm">{r.name}</span>
              <span className="text-sm text-on-surface-variant">{r.date}</span>
              <Badge variant="info">{r.plan}</Badge>
              <Badge variant={sv[r.status]}>{r.status}</Badge>
              <span className="font-bold text-secondary text-sm">{r.commission}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
