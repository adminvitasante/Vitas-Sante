import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const doctors = [
  { name: "Dr. Jean-Baptiste Valcourt", specialty: "Cardiology", license: "HT-8829-MED-2024", location: "Pétion-Ville", verified: true },
  { name: "Dr. Sophie Laurent", specialty: "Pediatrics", license: "HT-9012-MED-2023", location: "Port-au-Prince", verified: true },
  { name: "Dr. Marc Antoine", specialty: "General Practice", license: "HT-7654-MED-2024", location: "Cap-Haïtien", verified: false },
  { name: "Dr. Claire Moreau", specialty: "Dermatology", license: "HT-5432-MED-2023", location: "Jacmel", verified: true },
];

export default function AdminDoctorsPage() {
  return (
    <>
      <TopBar greeting="Doctor Registry" subtitle="Manage the medical provider network" initials="AD" />
      <div className="flex justify-end mb-8">
        <Button size="sm"><Icon name="add" size="sm" className="mr-2" />Register Doctor</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((d) => (
          <div key={d.license} className="bg-surface-container-lowest rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">DR</div>
                <div>
                  <h4 className="font-headline font-bold text-lg text-primary">{d.name}</h4>
                  <p className="text-sm text-on-surface-variant">{d.specialty}</p>
                </div>
              </div>
              <Badge variant={d.verified ? "success" : "warning"}>{d.verified ? "Verified" : "Pending"}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-on-surface-variant uppercase tracking-widest">License</p><p className="font-mono font-bold text-primary">{d.license}</p></div>
              <div><p className="text-xs text-on-surface-variant uppercase tracking-widest">Location</p><p className="font-bold text-primary">{d.location}</p></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
