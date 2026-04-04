import { Sidebar } from "@/components/layout/sidebar";
import { sidebarConfigs } from "@/components/layout/sidebar-items";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar config={sidebarConfigs.doctor} basePath="/doctor" />
      <main className="md:ml-64 min-h-screen p-6 lg:p-10">{children}</main>
    </div>
  );
}
