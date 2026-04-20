import { redirect } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { getAdminMembers } from "@/lib/server/queries";
import { getSessionWithCapability } from "@/lib/server/authz";
import { getPendingEnrollments } from "@/lib/server/admin-actions";
import { EnrollmentsReview } from "./enrollments-review";
import { MemberRowActions } from "./member-row-actions";
import type { CapabilityType } from "@/types/database";

export default async function AdminMembersPage() {
  const me = await getSessionWithCapability("ADMIN");
  if (!me) redirect("/auth/signin");

  const [members, pendingEnrollments] = await Promise.all([
    getAdminMembers(),
    getPendingEnrollments(),
  ]);

  const initials = me.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen px-8 py-8">
      <TopBar
        greeting="Member Management"
        subtitle="Approve enrollments and oversee all users"
        initials={initials}
      />

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border-l-4 border-primary">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter mb-1">
            Membres totaux
          </p>
          <h3 className="text-3xl font-headline font-extrabold text-primary">
            {members.length.toLocaleString()}
          </h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border-l-4 border-amber-400">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter mb-1">
            Adhésions en attente
          </p>
          <h3 className="text-3xl font-headline font-extrabold text-amber-600">
            {pendingEnrollments.length}
          </h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border-l-4 border-secondary">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter mb-1">
            Diaspora
          </p>
          <h3 className="text-3xl font-headline font-extrabold text-secondary">
            {
              members.filter(
                (m: { is_diaspora?: boolean }) => m.is_diaspora === true
              ).length
            }
          </h3>
        </div>
      </section>

      {/* Approvals at the top — most critical admin workflow */}
      <EnrollmentsReview
        enrollments={
          pendingEnrollments as unknown as Parameters<typeof EnrollmentsReview>[0]["enrollments"]
        }
      />

      {/* Full registry */}
      <section>
        <h3 className="font-headline text-xl font-bold text-on-surface mb-6">
          Registre complet
        </h3>
        {members.length > 0 ? (
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    <Th>Nom</Th>
                    <Th>Email</Th>
                    <Th>Capacités</Th>
                    <Th>Inscrit le</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {members.map((user: {
                    id: string;
                    name: string;
                    email: string;
                    is_diaspora: boolean;
                    created_at: string;
                    capabilities: { capability: string; status: string }[] | null;
                  }) => (
                    <tr key={user.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                            {user.name?.slice(0, 2).toUpperCase() || "??"}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-on-surface">
                              {user.name || "Unnamed"}
                            </span>
                            {user.is_diaspora && (
                              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-primary-fixed text-primary font-bold">
                                DIASPORA
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface-variant">{user.email}</td>
                      <td className="px-6 py-5">
                        <MemberRowActions
                          userId={user.id}
                          capabilities={
                            (user.capabilities ?? []).map((c) => ({
                              capability: c.capability as CapabilityType,
                              status: c.status as "ACTIVE" | "SUSPENDED" | "REVOKED",
                            }))
                          }
                          isSelf={user.id === me.id}
                        />
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface-variant">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-3xl p-12 text-center shadow-sm">
            <Icon name="person_off" className="text-outline !text-4xl mb-3" />
            <p className="text-on-surface-variant font-medium">Aucun membre.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest text-left">
      {children}
    </th>
  );
}
