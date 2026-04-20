import { redirect } from "next/navigation";
import { RoleSupport } from "@/components/shared/role-support";
import { getSessionUser } from "@/lib/server/authz";

export default async function SponsorSupportPage() {
  const me = await getSessionUser();
  if (!me) redirect("/auth/signin");
  const initials = me.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return <RoleSupport roleLabel="Sponsor" initials={initials} />;
}
