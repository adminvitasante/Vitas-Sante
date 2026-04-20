import { redirect } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { getSessionWithCapability } from "@/lib/server/authz";
import { supabase } from "@/lib/supabase";

export default async function AdminLogsPage({
  searchParams,
}: {
  searchParams?: { type?: string; limit?: string };
}) {
  const me = await getSessionWithCapability("ADMIN");
  if (!me) redirect("/auth/signin");

  const typeFilter = searchParams?.type || "";
  const limit = Math.min(Number(searchParams?.limit) || 100, 500);

  let query = supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (typeFilter) {
    query = query.like("event_type", `%${typeFilter}%`);
  }

  const { data: events } = await query;

  // Distinct event types for the filter dropdown.
  const { data: distinctTypes } = await supabase
    .from("events")
    .select("event_type")
    .limit(500);

  const uniqueTypes = Array.from(
    new Set((distinctTypes ?? []).map((e: { event_type: string }) => e.event_type))
  ).sort();

  const initials = me.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen px-8 py-8">
      <TopBar
        greeting="System Logs"
        subtitle="Append-only event stream for audit + debug"
        initials={initials}
      />

      <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm mb-6">
        <form className="flex flex-wrap items-end gap-4" method="get">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="type" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Event Type Filter
            </label>
            <select
              id="type"
              name="type"
              defaultValue={typeFilter}
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm"
            >
              <option value="">All event types</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="limit" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Limit
            </label>
            <select
              id="limit"
              name="limit"
              defaultValue={String(limit)}
              className="rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm"
            >
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="250">250</option>
              <option value="500">500</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-primary text-on-primary px-5 py-2.5 text-sm font-bold"
          >
            Apply
          </button>
        </form>
      </section>

      <section className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
        {!events || events.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="event_busy" className="text-outline !text-4xl mb-3" />
            <p className="text-on-surface-variant font-medium">No events match your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Type</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Aggregate</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Actor</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Processed</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Payload</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {events.map((e: {
                  id: string;
                  event_type: string;
                  aggregate_type: string;
                  aggregate_id: string;
                  actor_id: string | null;
                  processed_at: string | null;
                  payload: Record<string, unknown>;
                  created_at: string;
                }) => (
                  <tr key={e.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-on-surface">{e.event_type}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-on-surface-variant">
                      {e.aggregate_type}/{e.aggregate_id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-on-surface-variant">
                      {e.actor_id ? e.actor_id.slice(0, 8) : "system"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        e.processed_at
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {e.processed_at ? "✓" : "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-on-surface-variant max-w-xs truncate">
                      {JSON.stringify(e.payload)}
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">
                      {new Date(e.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="mt-4 text-xs text-on-surface-variant">
        Showing {events?.length ?? 0} most recent events. Events are append-only — they cannot be edited or deleted.
      </p>
    </div>
  );
}
