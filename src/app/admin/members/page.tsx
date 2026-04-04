import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";

const members = [
  { name: "Jean-Pierre Valcourt", nif: "NIF-8829001", plan: "Premium", city: "Port-au-Prince", status: "Verified" },
  { name: "Marie-Ange Celestin", nif: "NIF-8829002", plan: "Advantage", city: "Pétion-Ville", status: "Verified" },
  { name: "Pierre Louis", nif: "NIF-8829003", plan: "Essential", city: "Cap-Haïtien", status: "Pending" },
  { name: "Sophie Jean-Baptiste", nif: "NIF-8829004", plan: "Premium", city: "Jacmel", status: "Verified" },
  { name: "André Dupont", nif: "NIF-8829005", plan: "Advantage", city: "Delmas", status: "Pending" },
];

export default function AdminMembersPage() {
  return (
    <>
      <TopBar greeting="Member Management" subtitle="Oversee the entire member roster" initials="AD" />
      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-xl text-primary">Member Directory</h3>
          <Button size="sm"><Icon name="add" size="sm" className="mr-2" />New Member</Button>
        </div>
        <div className="mb-6"><Input id="search" placeholder="Search by name, NIF, or plan..." /></div>
        <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Identity</span><span>NIF</span><span>Plan</span><span>City</span><span>Status</span>
        </div>
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.nif} className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center">
              <span className="font-bold text-primary text-sm">{m.name}</span>
              <span className="font-mono text-sm text-on-surface-variant">{m.nif}</span>
              <Badge variant="info">{m.plan}</Badge>
              <span className="text-sm text-on-surface-variant">{m.city}</span>
              <Badge variant={m.status === "Verified" ? "success" : "warning"}>{m.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
