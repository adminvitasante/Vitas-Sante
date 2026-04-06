import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { getAdminMembers } from "@/lib/server/queries";

export default async function AdminMembersPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const members = await getAdminMembers();

  return (
    <div className="min-h-screen px-8 py-8">
      <TopBar
        greeting="Member Management"
        subtitle="Oversee all registered users in the ecosystem"
        initials={session.user.name?.slice(0, 2).toUpperCase() || "AD"}
      />

      {/* Stats */}
      <section className="mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,27,63,0.04)] border-l-4 border-primary inline-block">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Total Members</p>
          <h3 className="text-3xl font-headline font-extrabold text-primary">{members.length.toLocaleString()}</h3>
        </div>
      </section>

      {/* Members Table */}
      {members.length > 0 ? (
        <section>
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Capabilities</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {members.map((user: any) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                            {user.name?.slice(0, 2).toUpperCase() || "??"}
                          </div>
                          <span className="text-sm font-bold text-on-surface">{user.name || "Unnamed"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm text-on-surface-variant">{user.email}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1.5">
                          {user.capabilities && user.capabilities.length > 0 ? (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            user.capabilities.map((cap: any, i: number) => (
                              <span
                                key={i}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  cap.status === "ACTIVE"
                                    ? "bg-secondary-container text-secondary"
                                    : "bg-surface-container-high text-on-surface-variant"
                                }`}
                              >
                                {cap.capability}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface-variant">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl p-12 text-center shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
          <Icon name="person_off" className="text-outline !text-4xl mb-3" />
          <p className="text-on-surface-variant font-medium">No members found.</p>
        </div>
      )}
    </div>
  );
}
