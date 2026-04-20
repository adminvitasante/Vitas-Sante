import { auth } from "@/lib/auth";
import { getMemberPayments } from "@/lib/server/queries";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
export default async function PaymentsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let invoices: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let visits: any[] = [];

  if (userId) {
    const data = await getMemberPayments(userId);
    invoices = data.invoices || [];
    visits = data.visits || [];
  }

  const memberName = session?.user?.name || "Member";
  const firstName = memberName.split(" ")[0];
  const initials = memberName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Calculate stats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalInvoicesCents = invoices.reduce((sum: number, inv: any) => sum + (inv.total_cents || 0), 0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalCopaysCents = visits.reduce((sum: number, v: any) => sum + (v.copay_amount_cents || 0), 0);
  const totalSpent = ((totalInvoicesCents + totalCopaysCents) / 100).toFixed(2);
  const hasData = invoices.length > 0 || visits.length > 0;

  return (
    <>
      <TopBar
        greeting={`${firstName}'s Payments`}
        subtitle="Billing history and upcoming charges."
        initials={initials}
      />

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm text-center">
          <div className="h-12 w-12 mx-auto rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-3">
            <Icon name="receipt_long" />
          </div>
          <p className="text-2xl font-black text-on-surface">{invoices.length}</p>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">Invoices</p>
        </div>
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm text-center">
          <div className="h-12 w-12 mx-auto rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary mb-3">
            <Icon name="payments" />
          </div>
          <p className="text-2xl font-black text-on-surface">${totalSpent}</p>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">Total Spent</p>
        </div>
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm text-center">
          <div className="h-12 w-12 mx-auto rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary mb-3">
            <Icon name="local_hospital" />
          </div>
          <p className="text-2xl font-black text-on-surface">{visits.length}</p>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">Visit Co-pays</p>
        </div>
      </section>

      {/* Payment Actions */}
      <section className="flex flex-wrap gap-3 mb-8">
        <a
          href="mailto:support@vitasante.ht?subject=Mise%20%C3%A0%20jour%20moyen%20de%20paiement"
          className="inline-flex items-center px-5 py-3 bg-surface-container-low text-on-surface rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors"
        >
          <Icon name="account_balance" size="sm" className="mr-2" />
          Mettre à jour le moyen de paiement
        </a>
      </section>

      {!hasData ? (
        <section className="bg-surface-container-lowest rounded-3xl p-12 text-center">
          <Icon name="receipt_long" className="text-5xl text-on-surface-variant opacity-40 mb-4" />
          <h3 className="font-headline font-bold text-lg text-on-surface mb-2">No Payment History</h3>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
            You have no invoices or visit co-pays recorded yet.
          </p>
        </section>
      ) : (
        <>
          {/* Invoices Table */}
          {invoices.length > 0 && (
            <section className="bg-surface-container-lowest rounded-2xl overflow-hidden mb-8">
              <div className="px-8 py-5 border-b border-outline-variant/20">
                <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
                  Invoices
                </h4>
              </div>

              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 px-8 py-3 bg-surface-container-low/50 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                <div className="col-span-3">Invoice</div>
                <div className="col-span-3">Date</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-2 text-right">Status</div>
                <div className="col-span-2 text-right">Currency</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-outline-variant/10">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {invoices.map((inv: any) => {
                  const amountStr = `$${((inv.total_cents || 0) / 100).toFixed(2)}`;
                  const dateStr = inv.created_at
                    ? new Date(inv.created_at).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })
                    : "—";
                  const isPaid = inv.status === "PAID";

                  return (
                    <div
                      key={inv.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-8 py-5 hover:bg-surface-container-low/30 transition-colors items-center"
                    >
                      <div className="col-span-3">
                        <span className="text-xs font-mono text-on-surface-variant md:text-sm">
                          {inv.id?.slice(0, 13) || "—"}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-sm text-on-surface-variant">{dateStr}</span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-sm font-bold text-primary">{amountStr}</span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${isPaid ? "bg-tertiary-fixed text-on-tertiary-container" : "bg-secondary-fixed text-on-secondary-container"}`}>
                          <Icon name={isPaid ? "check_circle" : "schedule"} size="sm" />
                          {inv.status}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-sm text-on-surface-variant">{inv.currency || "USD"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Visit Co-pays */}
          {visits.length > 0 && (
            <section className="bg-surface-container-lowest rounded-2xl overflow-hidden">
              <div className="px-8 py-5 border-b border-outline-variant/20">
                <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
                  Visit Co-pays
                </h4>
              </div>

              <div className="divide-y divide-outline-variant/10">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {visits.map((visit: any) => {
                  const copay = ((visit.copay_amount_cents || 0) / 100).toFixed(2);
                  const dateStr = visit.visited_at
                    ? new Date(visit.visited_at).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })
                    : "—";

                  return (
                    <div
                      key={visit.id}
                      className="flex items-center justify-between px-8 py-5 hover:bg-surface-container-low/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                          <Icon
                            name={visit.visit_type === "TELEVISIT" ? "videocam" : visit.visit_type === "SPECIALIST" ? "medical_services" : "stethoscope"}
                            size="sm"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface capitalize">
                            {visit.visit_type?.toLowerCase().replace("_", " ")}
                          </p>
                          <p className="text-xs text-on-surface-variant">{dateStr}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold uppercase text-tertiary">{visit.status}</span>
                        <span className="text-sm font-bold text-primary">${copay}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
