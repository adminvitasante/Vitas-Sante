import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const recentReferrals = [
  { name: "Pierre Jean", date: "Oct 10", plan: "Premium", status: "Active", commission: "$45.00" },
  { name: "Claire Moreau", date: "Oct 8", plan: "Advantage", status: "Pending", commission: "$30.00" },
  { name: "André Dupont", date: "Oct 5", plan: "Essential", status: "Active", commission: "$20.00" },
];

export default function AffiliateDashboard() {
  return (
    <>
      <TopBar greeting="Affiliate Dashboard" subtitle="Track your referrals and earnings" initials="MD" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Referred" value="1,284" icon="people" trend="+42 this month" trendUp />
        <StatCard label="Commissions Due" value="$4,290.50" icon="payments" />
        <StatCard label="Lifetime Earned" value="$32,840" icon="account_balance" trend="+12.4%" trendUp />
      </div>
      <div className="bg-surface-container-lowest rounded-2xl p-8 mb-8">
        <h3 className="font-headline font-bold text-xl text-primary mb-4">Your Referral Link</h3>
        <div className="flex gap-3">
          <div className="flex-1 bg-surface-container-low rounded-xl px-4 py-3 font-mono text-sm text-on-surface-variant truncate">https://vitasante.ht/join?ref=VITA-MARIE</div>
          <Button size="sm"><Icon name="content_copy" size="sm" className="mr-2" />Copy</Button>
          <Button variant="ghost" size="sm"><Icon name="qr_code" size="sm" /></Button>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <h3 className="font-headline font-bold text-xl text-primary mb-6">Recent Referrals</h3>
        <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Member</span><span>Date Joined</span><span>Plan</span><span>Status</span><span>Commission</span>
        </div>
        <div className="space-y-2">
          {recentReferrals.map((r) => (
            <div key={r.name} className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center">
              <span className="font-bold text-primary text-sm">{r.name}</span>
              <span className="text-sm text-on-surface-variant">{r.date}</span>
              <Badge variant="info">{r.plan}</Badge>
              <Badge variant={r.status === "Active" ? "success" : "warning"}>{r.status}</Badge>
              <span className="font-bold text-secondary text-sm">{r.commission}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
