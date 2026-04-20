import { redirect } from "next/navigation";
import { RoleSettings } from "@/components/shared/role-settings";
import { getSessionWithCapability } from "@/lib/server/authz";

export default async function AdminSettingsPage() {
  const me = await getSessionWithCapability("ADMIN");
  if (!me) redirect("/auth/signin");
  const initials = me.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return <RoleSettings roleLabel="Admin" userName={me.name} userEmail={me.email} initials={initials} />;
}
