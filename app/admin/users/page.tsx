import Link from "next/link"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

import { UsersTable, type AdminUserRow } from "@/components/admin/users-table"
import { buttonVariants } from "@/components/ui/button"
import { requireAdmin } from "@/lib/auth-guard"
import { createServerToken, fetchUsers } from "@/lib/catalog"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Manage users - SalonBook Admin",
  description: "Manage SalonBook customer and administrator accounts.",
}

const PAGE_SIZE = 8

function buildHref(query: string, page: number) {
  const params = new URLSearchParams()
  if (query) params.set("q", query)
  if (page > 1) params.set("page", String(page))
  const suffix = params.toString()
  return suffix ? `/admin/users?${suffix}` : "/admin/users"
}

export default async function AdminUsersPage(
  props: PageProps<"/admin/users">
) {
  await requireAdmin()

  const searchParams = await props.searchParams
  const query =
    typeof searchParams.q === "string" ? searchParams.q.trim() : ""
  const pageParam = Number(searchParams.page)
  const requestedPage =
    Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1

  const token = await createServerToken()
  const users = token ? await fetchUsers(token) : []

  const lowered = query.toLowerCase()
  const visible = lowered
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(lowered) ||
          user.email.toLowerCase().includes(lowered)
      )
    : users

  const customerCount = users.filter((user) => user.role === "user").length
  const blockedCount = users.filter((user) => user.blocked).length

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const page = Math.min(requestedPage, pageCount)
  const start = (page - 1) * PAGE_SIZE
  const rows = visible.slice(start, start + PAGE_SIZE)

  return (
    <div>
      <div className="border-b pb-8">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Administration
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
          Manage users
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          {users.length} account{users.length === 1 ? "" : "s"} &middot;{" "}
          {customerCount} customer{customerCount === 1 ? "" : "s"} &middot;{" "}
          {blockedCount} blocked
        </p>
      </div>

      <form
        action="/admin/users"
        role="search"
        className="mt-8 flex flex-col gap-2.5 rounded-xl bg-muted/60 p-2.5 sm:flex-row"
      >
        <label htmlFor="admin-user-search" className="sr-only">
          Search users
        </label>
        <input
          id="admin-user-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search by name or email..."
          className="h-11 w-full min-w-0 rounded-md border-0 bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          className={cn(buttonVariants(), "h-11 shrink-0 gap-2 px-6")}
        >
          <Search className="size-4" aria-hidden="true" />
          Search
        </button>
      </form>

      <div className="mt-6">
        <UsersTable
          users={rows as AdminUserRow[]}
          emptyMessage={
            query
              ? "No accounts match that search."
              : "No accounts have been registered yet."
          }
        />
      </div>

      {visible.length > PAGE_SIZE ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Showing {start + 1}&ndash;{Math.min(start + PAGE_SIZE, visible.length)}{" "}
            of {visible.length}
          </p>

          <nav aria-label="User pages" className="flex items-center gap-2">
            <Link
              href={buildHref(query, page - 1)}
              aria-disabled={page <= 1}
              className={cn(
                "flex size-9 items-center justify-center rounded-md border text-sm transition-colors",
                page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-muted"
              )}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              <span className="sr-only">Previous page</span>
            </Link>

            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (number) => (
                <Link
                  key={number}
                  href={buildHref(query, number)}
                  aria-current={number === page ? "page" : undefined}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                    number === page ? "bg-ink text-paper" : "hover:bg-muted"
                  )}
                >
                  {number}
                </Link>
              )
            )}

            <Link
              href={buildHref(query, page + 1)}
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
        </div>
      ) : null}

      <p className="mt-6 text-xs text-muted-foreground">
        Blocked customers cannot sign in or use any protected feature.{" "}
        <Link
          href="/admin/transactions"
          className="font-medium underline-offset-4 hover:underline"
        >
          View transactions
        </Link>
      </p>
    </div>
  )
}
