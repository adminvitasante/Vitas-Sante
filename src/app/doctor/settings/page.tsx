import { redirect } from "next/navigation";
import { RoleSettings } from "@/components/shared/role-settings";
import { getSessionUser } from "@/lib/server/authz";

export default async function DoctorSettingsPage() {
  const me = await getSessionUser();
  if (!me) redirect("/auth/signin");

  const initials = me.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return <RoleSettings roleLabel="Médecin" userName={me.name} userEmail={me.email} initials={initials} />;
}
