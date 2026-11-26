import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { requireAdmin } from "@/lib/auth-guard"
import { createServerToken, fetchAllTransactions } from "@/lib/catalog"
import type { Transaction } from "@/lib/types"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Transactions - SalonBook Admin",
  description: "Stripe payment transactions for SalonBook.",
}

const PAGE_SIZE = 8

const filters = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function shortSessionId(id: string) {
  return id.length > 18 ? `${id.slice(0, 10)}\u2026${id.slice(-4)}` : id
}

function buildHref(status: string, page: number) {
  const params = new URLSearchParams()
  if (status !== "all") params.set("status", status)
  if (page > 1) params.set("page", String(page))
  const suffix = params.toString()
  return suffix ? `/admin/transactions?${suffix}` : "/admin/transactions"
}

export default async function AdminTransactionsPage(props: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  await requireAdmin()

  const searchParams = await props.searchParams
  const status =
    typeof searchParams.status === "string" ? searchParams.status : "all"
  const pageParam = Number(searchParams.page)
  const requestedPage =
    Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1

  const token = await createServerToken()
  const allTransactions = token ? await fetchAllTransactions(token) : []

  const visible = allTransactions.filter(
    (row) => status === "all" || row.status === status
  )

  const paid = allTransactions.filter((row) => row.status === "paid")
  const total = paid.reduce((sum, row) => sum + Number(row.amount || 0), 0)

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const page = Math.min(requestedPage, pageCount)
  const start = (page - 1) * PAGE_SIZE
  const transactions = visible.slice(start, start + PAGE_SIZE)

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
          {allTransactions.length} record
          {allTransactions.length === 1 ? "" : "s"} &middot; ${total.toFixed(2)}{" "}
          collected successfully.
        </p>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = status === filter.value

          return (
            <Link
              key={filter.value}
              href={buildHref(filter.value, 1)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-full px-5 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-ink text-paper"
                  : "bg-sand text-hero-foreground hover:bg-sand/70"
              )}
            >
              {filter.label}
            </Link>
          )
        })}
      </div>

      <div className="mt-6">
        {transactions.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <p className="font-serif text-2xl tracking-tight">
              No transactions{status !== "all" ? ` marked ${status}` : " yet"}.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Payments verified by Stripe will appear here.
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
                        : "\u2014"}
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

      {visible.length > 0 ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Showing {start + 1}&ndash;{Math.min(start + PAGE_SIZE, visible.length)}{" "}
            of {visible.length}
          </p>

          {pageCount > 1 ? (
            <nav aria-label="Transactions pages" className="flex items-center gap-2">
              <Link
                href={buildHref(status, page - 1)}
                aria-disabled={page <= 1}
                className={cn(
                  "flex size-9 items-center justify-center rounded-md border text-sm transition-colors",
                  page <= 1
                    ? "pointer-events-none opacity-40"
                    : "hover:bg-muted"
                )}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                <span className="sr-only">Previous page</span>
              </Link>

              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (number) => (
                  <Link
                    key={number}
                    href={buildHref(status, number)}
                    aria-current={number === page ? "page" : undefined}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                      number === page
                        ? "bg-ink text-paper"
                        : "hover:bg-muted"
                    )}
                  >
                    {number}
                  </Link>
                )
              )}

              <Link
                href={buildHref(status, page + 1)}
                aria-disabled={page >= pageCount}
                className={cn(
                  "flex size-9 items-center justify-center rounded-md border text-sm transition-colors",
                  page >= pageCount
                    ? "pointer-events-none opacity-40"
                    : "hover:bg-muted"
                )}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
                <span className="sr-only">Next page</span>
              </Link>
            </nav>
          ) : null}
        </div>
      ) : null}

      <p className="mt-6 text-xs text-muted-foreground">
        Payment records are written by Stripe verification and cannot be edited
        here.
      </p>
    </div>
  )
}
