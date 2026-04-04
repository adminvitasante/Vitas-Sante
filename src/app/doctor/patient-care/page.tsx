import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";

const patients = [
  { name: "Marie-Ange Celestin", type: "Specialist", time: "9:00 AM", status: "Stable", initials: "MC" },
  { name: "Pierre Louis", type: "Generalist", time: "10:30 AM", status: "At Risk", initials: "PL" },
  { name: "Sophie Jean-Baptiste", type: "Televisit", time: "11:00 AM", status: "Recovered", initials: "SJ" },
  { name: "André Dupont", type: "Specialist", time: "2:00 PM", status: "Critical", initials: "AD" },
];

const statusColors: Record<string, "success" | "warning" | "error" | "neutral"> = {
  Stable: "success", "At Risk": "warning", Critical: "error", Recovered: "neutral",
};

export default function PatientCarePage() {
  return (
    <>
      <TopBar greeting="Patient Care" subtitle="Manage your daily appointments and patient queue" initials="JB" />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <StatCard label="Today's Patients" value="8" icon="people" />
        <StatCard label="Completed" value="4" icon="check_circle" trend="+2 from yesterday" trendUp />
        <StatCard label="Clinic Efficiency" value="94%" icon="speed" />
        <StatCard label="Total Visits" value="128" icon="history" />
      </div>
      <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-8 text-white mb-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Next Appointment</p>
            <h3 className="text-2xl font-extrabold font-headline">Marie-Ange Celestin</h3>
            <p className="text-primary-fixed-dim">Specialist Consultation · 9:00 AM</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black">15:32</p>
            <p className="text-xs text-white/60">minutes until</p>
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <h3 className="font-headline font-bold text-xl text-primary mb-6">Today&apos;s Queue</h3>
        <div className="space-y-3">
          {patients.map((p) => (
            <div key={p.name} className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">{p.initials}</div>
                <div><p className="font-bold text-on-surface">{p.name}</p><p className="text-sm text-on-surface-variant">{p.type}</p></div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-on-surface-variant">{p.time}</span>
                <Badge variant={statusColors[p.status]}>{p.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
