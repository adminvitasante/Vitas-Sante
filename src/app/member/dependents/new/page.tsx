import { redirect } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { getSessionWithCapability } from "@/lib/server/authz";
import { getPlans } from "@/lib/server/queries";
import { AddBeneficiaryForm } from "./add-beneficiary-form";

export default async function AddBeneficiaryPage() {
  const me = await getSessionWithCapability("PAYER", "ADMIN");
  if (!me) redirect("/auth/signin");

  const plansResult = await getPlans();
  const plans = plansResult.success ? plansResult.plans ?? [] : [];

  const initials = me.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <TopBar
        greeting="Ajouter un bénéficiaire"
        subtitle="Inscrire un proche au réseau Vita Santé"
        initials={initials}
      />
      <div className="max-w-2xl">
        <AddBeneficiaryForm plans={plans} />
      </div>
    </>
  );
}
