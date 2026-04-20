import { redirect } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { getAdminAffiliates } from "@/lib/server/queries";
import { getSessionWithCapability } from "@/lib/server/authz";
import { PromoteAffiliateForm, AffiliateRowActions } from "./affiliate-actions";
import type { AffiliateTier } from "@/types/database";

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function tierBadge(tier: string) {
  switch (tier) {
    case "DIAMOND":
      return "bg-slate-900 text-slate-100";
    case "ELITE":
      return "bg-amber-100 text-amber-800";
    case "STANDARD":
    default:
      return "bg-primary-fixed text-primary";
  }
}

export default async function AdminAffiliatesPage() {
  const me = await getSessionWithCapability("ADMIN");
  if (!me) redirect("/auth/signin");

  const affiliates = await getAdminAffiliates();

  const initials = me.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const totalEarned = affiliates.reduce(
    (sum: number, a: { total_earned_cents?: number }) => sum + (a.total_earned_cents ?? 0),
    0
  );
  const totalPending = affiliates.reduce(
    (sum: number, a: { pending_cents?: number }) => sum + (a.pending_cents ?? 0),
    0
  );

  return (
    <div className="min-h-screen px-8 py-8">
      <TopBar
        greeting="Affiliate Ecosystem"
        subtitle="Créer, suspendre, et ajuster les niveaux d'affiliation"
        initials={initials}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border-l-4 border-primary">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter mb-1">
            Total affiliés
          </p>
          <h3 className="text-3xl font-headline font-extrabold text-primary">{affiliates.length}</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border-l-4 border-secondary">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter mb-1">
            Commissions totales payées
          </p>
          <h3 className="text-3xl font-headline font-extrabold text-secondary">
            {formatCents(totalEarned)}
          </h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border-l-4 border-amber-400">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter mb-1">
            Commissions en attente
          </p>
          <h3 className="text-3xl font-headline font-extrabold text-amber-600">
            {formatCents(totalPending)}
          </h3>
        </div>
      </section>

      <PromoteAffiliateForm />

      {affiliates.length > 0 ? (
        <section>
          <h3 className="font-headline text-xl font-bold text-on-surface mb-6">
            Affiliés actifs
          </h3>
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    <Th>Nom</Th>
                    <Th>Email</Th>
                    <Th>Code</Th>
                    <Th>Niveau · Statut</Th>
                    <Th className="text-right">Gagné</Th>
                    <Th className="text-right">En attente</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {affiliates.map((affiliate: {
                    id: string;
                    partner_code: string;
                    tier: AffiliateTier;
                    status: "ACTIVE" | "SUSPENDED" | "REVOKED";
                    total_earned_cents: number;
                    pending_cents: number;
                    users: { name: string; email: string } | null;
                  }) => (
                    <tr
                      key={affiliate.id}
                      className={`hover:bg-surface-container-low transition-colors ${
                        affiliate.status !== "ACTIVE" ? "opacity-60" : ""
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                            {affiliate.users?.name?.slice(0, 2).toUpperCase() ?? "??"}
                          </div>
                          <span className="text-sm font-bold text-on-surface">
                            {affiliate.users?.name ?? "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface-variant">
                        {affiliate.users?.email ?? "—"}
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-mono text-xs text-on-surface tracking-wider bg-surface-container-low px-2 py-1 rounded">
                          {affiliate.partner_code}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <AffiliateRowActions
                          affiliateId={affiliate.id}
                          currentTier={affiliate.tier}
                          currentStatus={affiliate.status}
                        />
                        <div className="mt-1">
                          <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${tierBadge(affiliate.tier)}`}>
                            {affiliate.tier}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm font-bold text-primary">
                          {formatCents(affiliate.total_earned_cents ?? 0)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span
                          className={`text-sm font-bold ${
                            (affiliate.pending_cents ?? 0) > 0
                              ? "text-amber-600"
                              : "text-on-surface-variant"
                          }`}
                        >
                          {formatCents(affiliate.pending_cents ?? 0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl p-12 text-center shadow-sm">
          <Icon name="handshake" className="text-outline !text-4xl mb-3" />
          <p className="text-on-surface-variant font-medium">Aucun affilié pour le moment.</p>
          <p className="text-xs text-on-surface-variant mt-2">
            Utilisez le formulaire ci-dessus pour promouvoir un utilisateur existant.
          </p>
        </div>
      )}
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest text-left ${className}`}
    >
      {children}
    </th>
  );
}
