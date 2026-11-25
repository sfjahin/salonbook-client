import Link from "next/link"
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  Hourglass,
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

export default async function AdminOverviewPage() {
  await requireAdmin()

  const token = await createServerToken()

  const [stats, appointments, users] = await Promise.all([
    token ? fetchAdminStats(token) : null,
    token ? fetchAllAppointments(token) : Promise.resolve([]),
    token ? fetchUsers(token) : Promise.resolve([]),
  ])

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

      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        />
        <StatCard
          label="Pending appointments"
          value={stats?.pendingAppointments ?? 0}
          icon={Hourglass}
        />
        <StatCard
          label="Confirmed appointments"
          value={stats?.confirmedAppointments ?? 0}
          icon={CalendarCheck}
        />
        <StatCard
          label="Successful payments"
          value={stats?.successfulPayments ?? 0}
          icon={CreditCard}
          hint={
            stats && stats.totalRevenue > 0
              ? `$${stats.totalRevenue.toFixed(2)} collected`
              : "No payments yet"
          }
        />
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
