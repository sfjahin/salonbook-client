import { BadgeCheck, Shield, ShieldOff } from "lucide-react"

export type AdminUserRow = {
  id: string
  name: string
  email: string
  role?: string | null
  banned?: boolean | null
  emailVerified?: boolean | null
  createdAt: Date | string
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value))
}

function UsersTable({
  users,
  emptyMessage = "No users found yet.",
}: {
  users: AdminUserRow[]
  emptyMessage?: string
}) {
  if (users.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <thead className="border-b bg-muted/50 text-xs tracking-[0.08em] text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">
              User
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Role
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Verified
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => {
            const isAdmin = user.role === "admin"
            const isBanned = Boolean(user.banned)

            return (
              <tr key={user.id}>
                <td className="px-5 py-4">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={
                      isAdmin
                        ? "inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[0.7rem] font-medium text-paper"
                        : "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[0.7rem] font-medium text-muted-foreground"
                    }
                  >
                    {isAdmin ? (
                      <Shield className="size-3" aria-hidden="true" />
                    ) : null}
                    {isAdmin ? "Admin" : "Customer"}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center gap-1.5">
                      <BadgeCheck
                        className="size-4 text-emerald-600"
                        aria-hidden="true"
                      />
                      Yes
                    </span>
                  ) : (
                    "No"
                  )}
                </td>
                <td className="px-5 py-4">
                  {isBanned ? (
                    <span className="inline-flex items-center gap-1.5 text-destructive">
                      <ShieldOff className="size-3.5" aria-hidden="true" />
                      Banned
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Active</span>
                  )}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export { UsersTable }
