import { headers } from "next/headers"

import { UsersTable, type AdminUserRow } from "@/components/admin/users-table"
import { auth } from "@/lib/auth"

export const metadata = {
  title: "Users - SalonBook Admin",
  description: "Manage SalonBook customer and administrator accounts.",
}

const PAGE_SIZE = 100

export default async function AdminUsersPage() {
  const { users, total } = await auth.api.listUsers({
    headers: await headers(),
    query: {
      limit: PAGE_SIZE,
      offset: 0,
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  })

  return (
    <div className="page-gutter mx-auto w-full max-w-6xl py-12">
      <div>
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Administration
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
          Users
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {total} account{total === 1 ? "" : "s"} in SalonBook
          {total > PAGE_SIZE
            ? ` - showing the ${PAGE_SIZE} most recent`
            : ""}
          .
        </p>
      </div>

      <div className="mt-8">
        <UsersTable users={users as AdminUserRow[]} />
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Account actions such as banning, unbanning and role changes will be
        added with the admin design.
      </p>
    </div>
  )
}
