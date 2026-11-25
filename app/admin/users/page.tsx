import Link from "next/link"
import { Search } from "lucide-react"

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

export default async function AdminUsersPage(
  props: PageProps<"/admin/users">
) {
  await requireAdmin()

  const searchParams = await props.searchParams
  const query =
    typeof searchParams.q === "string" ? searchParams.q.trim().toLowerCase() : ""

  const token = await createServerToken()
  const users = token ? await fetchUsers(token) : []

  const visible = query
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      )
    : users

  const customerCount = users.filter((user) => user.role === "user").length
  const blockedCount = users.filter((user) => user.blocked).length

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
          {users.length} account{users.length === 1 ? "" : "s"} ·{" "}
          {customerCount} customer{customerCount === 1 ? "" : "s"} ·{" "}
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
          users={visible as AdminUserRow[]}
          emptyMessage={
            query
              ? "No accounts match that search."
              : "No accounts have been registered yet."
          }
        />
      </div>

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
