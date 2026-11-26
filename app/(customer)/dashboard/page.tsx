import Link from "next/link"
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  Hourglass,
  Sparkles,
} from "lucide-react"

import { StatusBadge } from "@/components/status-badge"
import { StatCard } from "@/components/stat-card"
import { buttonVariants } from "@/components/ui/button"
import { createServerToken, fetchCustomerStats, fetchMyAppointments } from "@/lib/catalog"
import { requireCustomer } from "@/lib/auth-guard"
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

function todayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`
}

export default async function CustomerDashboardPage() {
  const session = await requireCustomer()
  const token = await createServerToken()
  const firstName = session.user.name?.split(" ")[0] || "there"

  const [stats, appointments] = await Promise.all([
    token ? fetchCustomerStats(token) : null,
    token ? fetchMyAppointments(token) : Promise.resolve([]),
  ])

  const today = todayKey()
  const nextAppointment = appointments
    .filter(
      (appointment) =>
        appointment.status !== "cancelled" &&
        appointment.appointmentDate.slice(0, 10) >= today
    )
    .sort((a, b) =>
      `${a.appointmentDate}${a.timeSlot}`.localeCompare(
        `${b.appointmentDate}${b.timeSlot}`
      )
    )[0]

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
          className={cn(buttonVariants(), "h-11 shrink-0 gap-2 px-5")}
        >
          Book a service
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {nextAppointment ? (
        <section className="mt-8 overflow-hidden rounded-2xl bg-ink text-paper">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-[0.65rem] font-medium tracking-[0.18em] text-paper/60 uppercase">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Your next appointment
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight">
                {nextAppointment.service?.serviceName ?? "Salon service"}
              </h2>
              <p className="mt-2 text-sm text-paper/70">
                {formatDate(nextAppointment.appointmentDate)} at{" "}
                {nextAppointment.timeSlot}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge status={nextAppointment.status} />
                <StatusBadge
                  status={nextAppointment.paymentStatus}
                  kind="payment"
                />
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
              <p className="font-serif text-3xl">
                ${Number(nextAppointment.servicePrice).toFixed(2)}
              </p>
              {nextAppointment.status === "confirmed" &&
              nextAppointment.paymentStatus === "unpaid" ? (
                <Link
                  href={`/checkout/${nextAppointment.id}`}
                  className={cn(
                    buttonVariants(),
                    "h-10 gap-2 bg-paper px-5 text-ink hover:bg-paper/90"
                  )}
                >
                  Pay now
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              ) : (
                <Link
                  href="/dashboard/appointments"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-10 border-white/20 bg-transparent px-5 text-paper hover:bg-paper/10 hover:text-paper"
                  )}
                >
                  View details
                </Link>
              )}
            </div>
          </div>
        </section>
      ) : null}

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
