import { auth } from "@/lib/auth";
import { getDependents } from "@/lib/server/queries";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

export default async function DependentsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dependents: any[] = [];

  if (userId) {
    dependents = await getDependents(userId);
  }

  const memberName = session?.user?.name || "Member";
  const firstName = memberName.split(" ")[0];
  const initials = memberName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Calculate summary stats
  const totalDependents = dependents.length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalCreditsRemaining = dependents.reduce((sum: number, dep: any) => {
    const ca = dep.credit_accounts?.[0];
    return sum + (ca?.visits_remaining ?? 0);
  }, 0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalCreditsTotal = dependents.reduce((sum: number, dep: any) => {
    const ca = dep.credit_accounts?.[0];
    return sum + (ca?.visits_total ?? 0);
  }, 0);
  const totalCreditsUsed = totalCreditsTotal - totalCreditsRemaining;
  const overallUsagePct = totalCreditsTotal > 0 ? Math.round((totalCreditsUsed / totalCreditsTotal) * 100) : 0;

  return (
    <>
      <TopBar
        greeting={`${firstName}'s Dependents`}
        subtitle="Manage your family members and their benefits."
        initials={initials}
      />

      <div className="mb-6 flex justify-end">
        <Link
          href="/member/dependents/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-on-primary px-5 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity"
        >
          <Icon name="person_add" size="sm" />
          Ajouter un bénéficiaire
        </Link>
      </div>

      {/* Summary Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm text-center">
          <div className="h-12 w-12 mx-auto rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-3">
            <Icon name="groups" />
          </div>
          <p className="text-2xl font-black text-on-surface">{totalDependents}</p>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">Dependents</p>
        </div>
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm text-center">
          <div className="h-12 w-12 mx-auto rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary mb-3">
            <Icon name="account_balance_wallet" />
          </div>
          <p className="text-2xl font-black text-on-surface">{totalCreditsRemaining} / {totalCreditsTotal}</p>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">Visit Credits Left</p>
        </div>
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm text-center">
          <div className="h-12 w-12 mx-auto rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary mb-3">
            <Icon name="donut_large" />
          </div>
          <p className="text-2xl font-black text-on-surface">{overallUsagePct}%</p>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">Credits Used</p>
        </div>
      </section>

      {/* Dependent Cards */}
      <section className="space-y-6 mb-8">
        {dependents.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-3xl p-12 text-center">
            <Icon name="group_off" className="text-5xl text-on-surface-variant opacity-40 mb-4" />
            <h3 className="font-headline font-bold text-lg text-on-surface mb-2">No Dependents Yet</h3>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">
              You have no beneficiaries enrolled under your subscriptions. Add a family member to get started.
            </p>
          </div>
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dependents.map((dep: any) => {
            const ca = dep.credit_accounts?.[0];
            const creditsUsed = (ca?.visits_total ?? 0) - (ca?.visits_remaining ?? 0);
            const creditsTotal = ca?.visits_total ?? 0;
            const usagePct = creditsTotal > 0 ? Math.round((creditsUsed / creditsTotal) * 100) : 0;
            const depName = dep.users?.name || "Unknown";
            const depInitials = depName
              .split(" ")
              .map((w: string) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const planLabel = dep.plans?.name_en || "No Plan";

            return (
              <div
                key={dep.id}
                className="bg-surface-container-lowest rounded-2xl p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Avatar + Info */}
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-16 h-16 rounded-2xl clinical-gradient flex items-center justify-center text-white font-black text-xl font-headline">
                      {depInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-black text-primary tracking-tight font-headline">
                          {depName}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-container rounded-full text-xs font-bold">
                          <Icon name="check_circle" size="sm" />
                          {dep.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <Icon name="local_hospital" size="sm" />
                          {planLabel}
                        </span>
                        {dep.users?.email && (
                          <span className="flex items-center gap-1">
                            <Icon name="email" size="sm" />
                            {dep.users.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/member/dependents/${dep.users?.id}/card`}
                      className="inline-flex items-center px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                    >
                      <Icon name="badge" size="sm" className="mr-1" />
                      Voir la carte
                    </Link>
                  </div>
                </div>

                {/* Credit Usage */}
                <div className="mt-6 p-5 bg-surface-container-low/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-on-surface-variant">
                      Visit Credits Used
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {creditsUsed} / {creditsTotal} visits
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full clinical-gradient rounded-full transition-all"
                      style={{ width: `${usagePct}%` }}
                    />
                  </div>
                  <p className="text-xs text-on-surface-variant mt-2">
                    {usagePct}% of annual visit credits used — {planLabel}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Add Dependent */}
      <section>
        <Link
          href="/member/dependents/new"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg transition-shadow"
        >
          <Icon name="person_add" size="sm" className="mr-2" />
          Add New Dependent
        </Link>
      </section>
    </>
  );
}
