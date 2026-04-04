import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";

const agents = [
  { name: "Marie-Claire Dupont", conversion: "24%", ytd: "$32,840", tier: "Elite" },
  { name: "Pierre Jean", conversion: "18%", ytd: "$18,420", tier: "Standard" },
  { name: "Sophie Laurent", conversion: "31%", ytd: "$45,200", tier: "Diamond" },
  { name: "André Moreau", conversion: "12%", ytd: "$8,900", tier: "Standard" },
];

export default function AdminAffiliatesPage() {
  return (
    <>
      <TopBar greeting="Affiliate Oversight" subtitle="Manage the partner network" initials="AD" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Affiliates" value="86" icon="handshake" />
        <StatCard label="Commissions YTD" value="$284,500" icon="payments" />
        <StatCard label="Avg Conversion" value="22%" icon="trending_up" />
      </div>
      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <h3 className="font-headline font-bold text-xl text-primary mb-6">Agent Performance</h3>
        <div className="hidden md:grid grid-cols-4 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Agent</span><span>Conversion Rate</span><span>YTD Earnings</span><span>Tier</span>
        </div>
        <div className="space-y-2">
          {agents.map((a) => (
            <div key={a.name} className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center">
              <span className="font-bold text-primary text-sm">{a.name}</span>
              <span className="text-sm font-bold text-secondary">{a.conversion}</span>
              <span className="text-sm font-bold text-primary">{a.ytd}</span>
              <Badge variant={a.tier === "Diamond" ? "success" : a.tier === "Elite" ? "info" : "neutral"}>{a.tier}</Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
