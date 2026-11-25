import { requireAdmin } from "@/lib/auth-guard"
import { createServerToken, fetchAllTransactions } from "@/lib/catalog"
import type { Transaction } from "@/lib/types"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Transactions - SalonBook Admin",
  description: "Stripe payment transactions for SalonBook.",
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function shortSessionId(id: string) {
  return id.length > 18 ? `${id.slice(0, 10)}…${id.slice(-4)}` : id
}

export default async function AdminTransactionsPage() {
  await requireAdmin()

  const token = await createServerToken()
  const transactions = token ? await fetchAllTransactions(token) : []

  const paid = transactions.filter((row) => row.status === "paid")
  const total = paid.reduce((sum, row) => sum + Number(row.amount || 0), 0)

  return (
    <div>
      <div className="border-b pb-8">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Administration
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
          Transactions
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          {transactions.length} record
          {transactions.length === 1 ? "" : "s"} · ${total.toFixed(2)} collected
          successfully.
        </p>
      </div>

      <div className="mt-8">
        {transactions.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <p className="font-serif text-2xl tracking-tight">
              No transactions yet.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Payments recorded by the Stripe webhook will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full min-w-[60rem] text-left text-sm">
              <thead className="border-b bg-muted/50 text-[0.7rem] tracking-[0.08em] text-muted-foreground uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Customer
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Service
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Appointment
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Amount
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Reference
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.map((row: Transaction) => (
                  <tr key={row.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium">
                        {row.customer?.name ?? "Customer"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.customer?.email}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {row.appointment?.service?.serviceName ?? "Service"}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {row.appointment
                        ? `${row.appointment.appointmentDate} at ${row.appointment.timeSlot}`
                        : "—"}
                    </td>
                    <td className="px-5 py-4 font-medium">
                      {Number(row.amount).toFixed(2)}{" "}
                      <span className="text-xs uppercase text-muted-foreground">
                        {row.currency}
                      </span>
                    </td>
                    <td
                      className="px-5 py-4 font-mono text-xs text-muted-foreground"
                      title={row.stripeSessionId}
                    >
                      {shortSessionId(row.stripeSessionId)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={
                          row.status === "paid"
                            ? "inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[0.7rem] font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                            : "inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-[0.7rem] font-medium text-red-700 dark:bg-red-950 dark:text-red-300"
                        }
                      >
                        {row.status === "paid" ? "Paid" : "Failed"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {formatDate(row.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Payment records are written by the verified Stripe webhook and cannot
        be edited here.
      </p>
    </div>
  )
}
