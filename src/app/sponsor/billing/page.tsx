import { auth } from "@/lib/auth";
import { getPayerDashboard } from "@/lib/server/queries";
import { redirect } from "next/navigation";
import { Icon } from "@/components/ui/icon";

export default async function BillingPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const { invoices } = await getPayerDashboard(userId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return { bg: "bg-secondary-container", text: "text-on-secondary-container" };
      case "PENDING":
      case "ISSUED":
        return { bg: "bg-error-container", text: "text-on-error-container" };
      case "OVERDUE":
        return { bg: "bg-error", text: "text-white" };
      case "VOID":
      case "CANCELLED":
        return { bg: "bg-surface-container-high", text: "text-outline" };
      default:
        return { bg: "bg-surface-container-high", text: "text-on-surface" };
    }
  };

  return (
    <>
      {/* Editorial Header Section */}
      <section className="mb-12">
        <h1 className="font-headline font-extrabold text-primary text-5xl tracking-tight mb-2">Billing &amp; Invoices</h1>
        <p className="text-on-surface-variant font-body max-w-2xl leading-relaxed">
          Review your sponsorship invoices and payment history. Our ledger ensures complete transparency for every funded life.
        </p>
      </section>

      {/* Invoice Table */}
      {!invoices || invoices.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-16 text-center">
          <Icon name="receipt_long" className="text-6xl text-outline mb-4" />
          <h3 className="text-xl font-bold text-on-surface mb-2">No Invoices Yet</h3>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Invoices will appear here once your sponsorship subscriptions generate billing activity.
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
            <h2 className="text-2xl font-headline font-bold text-primary">Invoice History</h2>
            <span className="text-sm text-outline">{invoices.length} invoice{invoices.length !== 1 ? "s" : ""}</span>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant/10">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Invoice #</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Due Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Paid At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {invoices.map((invoice: any) => {
                const colors = statusColor(invoice.status);
                const amount = invoice.total_cents != null ? `$${(invoice.total_cents / 100).toFixed(2)}` : "N/A";
                const dueDate = invoice.due_date
                  ? new Date(invoice.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "N/A";
                const paidAt = invoice.paid_at
                  ? new Date(invoice.paid_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "\u2014";

                return (
                  <tr key={invoice.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 font-mono text-sm font-medium text-primary">
                      {invoice.invoice_number || invoice.id?.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 ${colors.bg} ${colors.text} text-[10px] font-bold rounded-full uppercase`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface">{amount}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{dueDate}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{paidAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Documentation Section */}
      <section className="mt-20 pt-10 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h5 className="font-headline font-bold text-primary mb-3">Fiscal Compliance</h5>
            <p className="text-sm text-slate-500 leading-relaxed">All invoices are compliant with healthcare funding regulations and include detailed breakdowns for your records.</p>
          </div>
          <div>
            <h5 className="font-headline font-bold text-primary mb-3">Auditing Tools</h5>
            <p className="text-sm text-slate-500 leading-relaxed">Access per-member spending reports in the Impact Reports section for quarterly audits.</p>
          </div>
          <div>
            <h5 className="font-headline font-bold text-primary mb-3">Institutional Support</h5>
            <p className="text-sm text-slate-500 leading-relaxed">Need a customized billing structure? Contact your dedicated Vita Sant&eacute; account manager.</p>
          </div>
        </div>
      </section>
    </>
  );
}
