import Link from "next/link"
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  Scissors,
  Users,
} from "lucide-react"

import { UsersTable, type AdminUserRow } from "@/components/admin/users-table"
import { requireAdmin } from "@/lib/auth-guard"
import { StatCard } from "@/components/stat-card"
import { StatusBadge } from "@/components/status-badge"
import { buttonVariants } from "@/components/ui/button"
import {
  createServerToken,
  fetchAdminStats,
  fetchAllAppointments,
  fetchUsers,
} from "@/lib/catalog"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Admin overview - SalonBook",
  description: "SalonBook administration overview.",
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(value)
  )
}

function dateKey(value: string) {
  return value.slice(0, 10)
}

function buildWeek() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`

    return {
      key,
      label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
      isToday: index === 6,
    }
  })
}

export default async function AdminOverviewPage() {
  await requireAdmin()

  const token = await createServerToken()

  const [stats, appointments, users] = await Promise.all([
    token ? fetchAdminStats(token) : null,
    token ? fetchAllAppointments(token) : Promise.resolve([]),
    token ? fetchUsers(token) : Promise.resolve([]),
  ])

  const week = buildWeek()
  const weekCounts = week.map((day) => ({
    ...day,
    count: appointments.filter(
      (appointment) => dateKey(appointment.appointmentDate) === day.key
    ).length,
  }))
  const weekMax = Math.max(1, ...weekCounts.map((day) => day.count))

  const todayKey = week[week.length - 1]?.key ?? ""
  const comingUp = appointments
    .filter(
      (appointment) =>
        appointment.status !== "cancelled" &&
        dateKey(appointment.appointmentDate) >= todayKey
    )
    .sort((a, b) =>
      `${a.appointmentDate}${a.timeSlot}`.localeCompare(
        `${b.appointmentDate}${b.timeSlot}`
      )
    )
    .slice(0, 4)

  const recentAppointments = appointments.slice(0, 5)
  const recentUsers = (users as AdminUserRow[]).slice(0, 5)

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Administration
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
            Overview
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A quick view of the people, services and bookings at SalonBook.
          </p>
        </div>

        <Link
          href="/admin/services/new"
          className={cn(buttonVariants(), "h-10 shrink-0 px-4")}
        >
          Add a service
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Registered customers"
          value={stats?.totalCustomers ?? 0}
          icon={Users}
        />
        <StatCard
          label="Active services"
          value={stats?.totalActiveServices ?? 0}
          icon={Scissors}
          hint={`${stats?.totalServices ?? 0} services in total`}
        />
        <StatCard
          label="Appointment requests"
          value={stats?.totalAppointments ?? 0}
          icon={CalendarDays}
          hint={`${stats?.pendingAppointments ?? 0} pending review`}
        />
        <StatCard
          label="Revenue collected"
          value={`$${(stats?.totalRevenue ?? 0).toFixed(2)}`}
          icon={CreditCard}
          hint={`${stats?.successfulPayments ?? 0} successful payments`}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-xl border bg-card p-5 text-card-foreground">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl tracking-tight">
                Bookings this week
              </h2>
              <p className="text-xs text-muted-foreground">
                Appointments scheduled over the last seven days.
              </p>
            </div>
            <CalendarCheck className="size-5 text-muted-foreground" aria-hidden="true" />
          </div>

          <div className="mt-6 flex h-40 items-end gap-2 sm:gap-3">
            {weekCounts.map((day) => (
              <div key={day.key} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[0.7rem] font-medium text-muted-foreground">
                  {day.count}
                </span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={cn(
                      "w-full rounded-t-md transition-all",
                      day.isToday ? "bg-ink" : "bg-sand"
                    )}
                    style={{
                      height: `${Math.max(6, (day.count / weekMax) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-[0.65rem] tracking-[0.08em] text-muted-foreground uppercase">
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5 text-card-foreground">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl tracking-tight">Coming up</h2>
            <Link
              href="/admin/appointments"
              className="text-xs font-medium underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>

          {comingUp.length === 0 ? (
            <p className="mt-5 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Nothing scheduled yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {comingUp.map((appointment) => (
                <li
                  key={appointment.id}
                  className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                >
                  <span className="flex size-10 shrink-0 flex-col items-center justify-center rounded-md bg-background text-center leading-none">
                    <span className="text-[0.6rem] uppercase text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                      }).format(new Date(appointment.appointmentDate))}
                    </span>
                    <span className="font-serif text-sm">
                      {new Date(appointment.appointmentDate).getDate()}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {appointment.service?.serviceName ?? "Service"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {appointment.customer?.name ?? "Customer"} &middot;{" "}
                      {appointment.timeSlot}
                    </p>
                  </div>
                  <StatusBadge status={appointment.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl tracking-tight">
            Latest appointment requests
          </h2>
          <Link
            href="/admin/appointments"
            className="text-xs font-medium underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No appointment requests yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="border-b bg-muted/50 text-[0.7rem] tracking-[0.08em] text-muted-foreground uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Customer
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Service
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium">
                        {appointment.customer?.name ?? "Customer"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.customer?.email}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {appointment.service?.serviceName ?? "Service"}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {formatDate(appointment.appointmentDate)} at{" "}
                      {appointment.timeSlot}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={appointment.status} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        status={appointment.paymentStatus}
                        kind="payment"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl tracking-tight">Recent sign-ups</h2>
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
