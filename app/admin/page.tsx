import Link from "next/link"
import { headers } from "next/headers"
import {
  ArrowRight,
  CalendarDays,
  ShieldCheck,
  UserX,
  Users,
} from "lucide-react"

import { UsersTable, type AdminUserRow } from "@/components/admin/users-table"
import { buttonVariants } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Admin overview - SalonBook",
  description: "SalonBook administration overview.",
}

export default async function AdminOverviewPage() {
  const { users, total } = await auth.api.listUsers({
    headers: await headers(),
    query: {
      limit: 1000,
      offset: 0,
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  })

  const adminCount = users.filter((user) => user.role === "admin").length
  const bannedCount = users.filter((user) => user.banned).length
  const customerCount = total - adminCount
  const recentUsers = users.slice(0, 5) as AdminUserRow[]

  const stats = [
    {
      label: "Total users",
      value: total,
      icon: Users,
    },
    {
      label: "Customers",
      value: customerCount,
      icon: CalendarDays,
    },
    {
      label: "Administrators",
      value: adminCount,
      icon: ShieldCheck,
    },
    {
      label: "Banned accounts",
      value: bannedCount,
      icon: UserX,
    },
  ] as const

  return (
    <div className="page-gutter mx-auto w-full max-w-6xl py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Administration
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
            Overview
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A quick view of the people using SalonBook.
          </p>
        </div>

        <Link
          href="/admin/users"
          className={cn(buttonVariants({ variant: "outline" }), "h-10 px-4")}
        >
          Manage users
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-xl border bg-card p-5 text-card-foreground"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
                {stat.label}
              </p>
              <stat.icon
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <p className="mt-4 font-serif text-4xl leading-none">
              {stat.value}
            </p>
          </article>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl tracking-tight">
            Recent sign-ups
          </h2>
          <Link
            href="/admin/users"
            className="text-xs font-medium underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        <UsersTable
          users={recentUsers}
          emptyMessage="No sign-ups have been recorded yet."
        />
      </section>
    </div>
  )
}
