import Link from "next/link"
import {
  CalendarCheck,
  CalendarDays,
  CreditCard,
  Hourglass,
} from "lucide-react"

import { StatusBadge } from "@/components/status-badge"
import { StatCard } from "@/components/stat-card"
import { buttonVariants } from "@/components/ui/button"
import { createServerToken, fetchCustomerStats, fetchMyAppointments } from "@/lib/catalog"
import { getServerSession } from "@/lib/auth-guard"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "My dashboard - SalonBook",
  description: "Manage your SalonBook appointments and profile.",
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value))
}

export default async function CustomerDashboardPage() {
  const token = await createServerToken()
  const session = await getServerSession()
  const firstName = session?.user.name?.split(" ")[0] || "there"

  const [stats, appointments] = await Promise.all([
    token ? fetchCustomerStats(token) : null,
    token ? fetchMyAppointments(token) : Promise.resolve([]),
  ])

  const recent = appointments.slice(0, 4)

  return (
    <div>
      <div className="flex flex-col gap-4 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Customer dashboard
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Your requests, confirmations and payments all live here.
          </p>
        </div>

        <Link
          href="/services"
          className={cn(buttonVariants(), "h-11 shrink-0 px-5")}
        >
          Book a service
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Appointment requests"
          value={stats?.totalAppointments ?? 0}
          icon={CalendarDays}
        />
        <StatCard
          label="Pending"
          value={stats?.pendingAppointments ?? 0}
          icon={Hourglass}
        />
        <StatCard
          label="Confirmed"
          value={stats?.confirmedAppointments ?? 0}
          icon={CalendarCheck}
        />
        <StatCard
          label="Successful payments"
          value={stats?.successfulPayments ?? 0}
          icon={CreditCard}
          hint={
            stats && stats.totalSpent > 0
              ? `$${stats.totalSpent.toFixed(2)} spent`
              : "No payments yet"
          }
        />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl tracking-tight">
            Recent appointments
          </h2>
          <Link
            href="/dashboard/appointments"
            className="text-xs font-medium underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <p className="font-serif text-xl">No appointments yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              When you request an appointment it will show up here.
            </p>
            <Link
              href="/services"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-5 h-10 px-5"
              )}
            >
              Explore salon services
            </Link>
          </div>
        ) : (
          <ul className="divide-y rounded-xl border bg-card">
            {recent.map((appointment) => (
              <li
                key={appointment.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {appointment.service?.serviceName ?? "Service"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(appointment.appointmentDate)} at{" "}
                    {appointment.timeSlot}
                  </p>
                </div>

                <StatusBadge status={appointment.status} />
                <StatusBadge
                  status={appointment.paymentStatus}
                  kind="payment"
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
