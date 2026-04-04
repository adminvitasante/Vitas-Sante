import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";

export default function DoctorProfilePage() {
  return (
    <>
      <TopBar greeting="Doctor Profile" subtitle="Your professional credentials and settings" initials="JB" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-2xl p-8">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-3xl">JB</div>
              <div>
                <h2 className="font-headline font-extrabold text-3xl text-primary">Dr. Jean-Baptiste Valcourt</h2>
                <p className="text-on-surface-variant text-lg">Interventional Cardiology</p>
                <div className="flex gap-3 mt-3">
                  <Badge variant="success" icon="verified">Board Verified</Badge>
                  <Badge variant="info">Active Provider</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div><p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">License ID</p><p className="font-bold text-primary font-mono">HT-8829-MED-2024</p></div>
              <div><p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Clinic</p><p className="font-bold text-primary">Centre de Santé</p></div>
              <div><p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Location</p><p className="font-bold text-primary">Pétion-Ville, Haiti</p></div>
              <div><p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Languages</p><p className="font-bold text-primary">FR / EN</p></div>
            </div>
          </div>
        </section>
        <section className="lg:col-span-4 space-y-6">
          <StatCard label="Total Consultations" value="128" icon="clinical_notes" />
          <StatCard label="Note Completion" value="98%" icon="edit_note" />
          <StatCard label="Patient Satisfaction" value="96%" icon="thumb_up" trend="+2% this month" trendUp />
        </section>
      </div>
    </>
  );
}
