import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";

const visits = [
  { date: "Oct 12, 2024", patient: "Marie-Ange Celestin", type: "Specialist", note: "Post-operative follow-up", status: "Completed" },
  { date: "Oct 11, 2024", patient: "Pierre Louis", type: "Generalist", note: "Routine check-up", status: "Completed" },
  { date: "Oct 10, 2024", patient: "Sophie Jean-Baptiste", type: "Televisit", note: "Prescription renewal", status: "Completed" },
  { date: "Oct 9, 2024", patient: "André Dupont", type: "Specialist", note: "Cardiac assessment", status: "Completed" },
  { date: "Oct 8, 2024", patient: "Claire Moreau", type: "Generalist", note: "Vaccination follow-up", status: "Completed" },
];

export default function VisitHistoryPage() {
  return (
    <>
      <TopBar greeting="Visit History" subtitle="Review past encounters and clinical records" initials="JB" />
      <div className="bg-surface-container-lowest rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-xl text-primary">Encounter Records</h3>
          <div className="flex gap-2"><Badge variant="info">128 Total</Badge><Badge variant="success">98% Notes Complete</Badge></div>
        </div>
        <div className="flex gap-3 mb-6">
          {["All", "Specialist", "Generalist", "Televisit"].map((filter) => (
            <button key={filter} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${filter === "All" ? "bg-primary text-white" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"}`}>{filter}</button>
          ))}
        </div>
        <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <span>Date</span><span>Patient</span><span>Service Type</span><span>Notes</span><span>Status</span>
        </div>
        <div className="space-y-2">
          {visits.map((v, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-low transition-colors items-center">
              <span className="text-sm text-on-surface-variant">{v.date}</span>
              <span className="text-sm font-bold text-primary">{v.patient}</span>
              <Badge variant="info">{v.type}</Badge>
              <span className="text-sm text-on-surface-variant truncate">{v.note}</span>
              <Badge variant="success">{v.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
