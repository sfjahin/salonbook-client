"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BadgeCheck, Loader2, Shield, ShieldOff } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { AdminUser } from "@/lib/types"

export type AdminUserRow = AdminUser

function formatDate(value: string | null) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value))
}

function BlockButton({ user }: { user: AdminUserRow }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function toggle() {
    setBusy(true)
    try {
      await api.patch(`/api/users/${user.id}/block`, {
        blocked: !user.blocked,
      })
      toast.success(
        user.blocked
          ? `${user.name} has been unblocked.`
          : `${user.name} has been blocked.`
      )
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update this user."
      )
    } finally {
      setBusy(false)
    }
  }

  if (user.role === "admin") {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggle}
      disabled={busy}
      className="h-9 gap-1.5 px-3 text-xs"
    >
      {busy ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
      ) : user.blocked ? (
        <Shield className="size-3.5" aria-hidden="true" />
      ) : (
        <ShieldOff className="size-3.5 text-destructive" aria-hidden="true" />
      )}
      {busy ? "Working..." : user.blocked ? "Unblock" : "Block"}
    </Button>
  )
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
      <table className="w-full min-w-[52rem] text-left text-sm">
        <thead className="border-b bg-muted/50 text-[0.7rem] tracking-[0.08em] text-muted-foreground uppercase">
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
            <th scope="col" className="px-5 py-3 text-right font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => {
            const isAdmin = user.role === "admin"
            const isBlocked = user.blocked

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
                  {isBlocked ? (
                    <span className="inline-flex items-center gap-1.5 text-destructive">
                      <ShieldOff className="size-3.5" aria-hidden="true" />
                      Blocked
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Active</span>
                  )}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end">
                    <BlockButton user={user} />
                  </div>
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
