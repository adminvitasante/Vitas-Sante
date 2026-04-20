import { redirect } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { getSessionWithCapability } from "@/lib/server/authz";
import { getSponsorOverview, getAvailableGrants } from "@/lib/server/sponsors";
import { ClaimSeatsPanel } from "./claim-seats-panel";
import Link from "next/link";

export default async function FundedMembersPage() {
  const me = await getSessionWithCapability("PAYER", "ADMIN");
  if (!me) redirect("/auth/signin");

  const [overview, availableGrants] = await Promise.all([
    getSponsorOverview(me.id),
    getAvailableGrants(me.id),
  ]);

  const initials = me.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const beneficiaries = overview.grants.flatMap((g) => {
    const links = (g.sponsor_grant_enrollments ?? []) as unknown as {
      id: string;
      enrollment_id: string;
      enrollment: {
        member_id_code: string | null;
        beneficiary_id: string;
        status: string;
        users: { name: string } | null;
      };
    }[];
    return links.map((link) => ({
      ...link,
      plan: g.plans,
      grantId: g.id,
    }));
  });

  const hasGrants = availableGrants.length > 0;
  const totalAvailableSeats = availableGrants.reduce(
    (s, g) => s + (g.seats_total - g.seats_claimed),
    0
  );

  return (
    <>
      <TopBar
        greeting="Funded Members"
        subtitle={`${beneficiaries.length} bénéficiaire(s) actif(s) · ${totalAvailableSeats} place(s) disponible(s)`}
        initials={initials}
      />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="Places financées" value={overview.stats.totalSeatsTotal} icon="event_seat" tone="primary" />
        <StatCard label="Places assignées" value={overview.stats.totalSeatsClaimed} icon="how_to_reg" tone="secondary" />
        <StatCard label="Places disponibles" value={totalAvailableSeats} icon="event_available" tone="tertiary" />
        <StatCard label="Contribution totale" value={`$${(overview.stats.totalContributedCents / 100).toLocaleString()}`} icon="payments" tone="primary" />
      </section>

      {hasGrants ? (
        <section className="mb-10">
          <ClaimSeatsPanel
            grants={availableGrants.map((g) => ({
              id: g.id,
              seatsRemaining: g.seats_total - g.seats_claimed,
              planName: (g.plans as unknown as { name_fr: string }).name_fr,
              planSlug: (g.plans as unknown as { slug: string }).slug,
            }))}
          />
        </section>
      ) : (
        <section className="mb-10 rounded-3xl bg-surface-container-lowest p-10 text-center shadow-sm">
          <Icon name="volunteer_activism" className="text-outline !text-4xl mb-3" />
          <p className="font-bold text-on-surface mb-2">Aucune place disponible à assigner</p>
          <p className="text-sm text-on-surface-variant mb-4">
            Financez des places pour commencer à parrainer des bénéficiaires.
          </p>
          <Link
            href="/sponsor/sponsor-new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-on-primary px-5 py-2.5 text-sm font-bold"
          >
            <Icon name="add" size="sm" />
            Financer des places
          </Link>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline text-xl font-bold text-on-surface">Bénéficiaires assignés</h3>
        </div>

        {beneficiaries.length === 0 ? (
          <div className="rounded-3xl bg-surface-container-lowest p-10 text-center shadow-sm">
            <Icon name="groups" className="text-outline !text-4xl mb-3" />
            <p className="text-on-surface-variant">
              Aucun bénéficiaire assigné. Utilisez le panneau ci-dessus pour en ajouter.
            </p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low">
                  <Th>Bénéficiaire</Th>
                  <Th>Code Membre</Th>
                  <Th>Forfait</Th>
                  <Th>Statut</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {beneficiaries.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4 font-bold text-on-surface">
                      {b.enrollment.users?.name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-on-surface-variant">
                      {b.enrollment.member_id_code ?? "En attente"}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface">
                      {(b.plan as unknown as { name_fr: string }).name_fr}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={b.enrollment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number | string;
  icon: string;
  tone: "primary" | "secondary" | "tertiary";
}) {
  const toneMap = {
    primary: { border: "border-primary", bg: "bg-primary-fixed", text: "text-primary" },
    secondary: { border: "border-secondary", bg: "bg-secondary-fixed", text: "text-secondary" },
    tertiary: { border: "border-tertiary", bg: "bg-tertiary-fixed", text: "text-tertiary" },
  }[tone];

  return (
    <div className={`bg-surface-container-lowest p-6 rounded-3xl shadow-sm border-l-4 ${toneMap.border}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">{label}</p>
        <span className={`h-8 w-8 rounded-lg flex items-center justify-center ${toneMap.bg} ${toneMap.text}`}>
          <Icon name={icon} size="sm" />
        </span>
      </div>
      <h3 className="text-2xl font-headline font-extrabold text-on-surface">{value}</h3>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-left">
      {children}
    </th>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-secondary-container text-on-secondary-container",
    UNDER_REVIEW: "bg-amber-100 text-amber-800",
    SUSPENDED: "bg-error-container text-on-error-container",
    EXPIRED: "bg-surface-container-high text-on-surface-variant",
  };
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
        map[status] ?? "bg-surface-container-high text-on-surface-variant"
      }`}
    >
      {status}
    </span>
  );
}
