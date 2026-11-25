import Link from "next/link"

import { AppointmentDetail } from "@/components/admin/appointment-detail"
import { requireAdmin } from "@/lib/auth-guard"
import { createServerToken, fetchAllAppointments } from "@/lib/catalog"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Manage appointments - SalonBook Admin",
  description: "Review and manage SalonBook appointment requests.",
}

const filters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
]

export default async function AdminAppointmentsPage(
  props: PageProps<"/admin/appointments">
) {
  await requireAdmin()

  const searchParams = await props.searchParams
  const status =
    typeof searchParams.status === "string" ? searchParams.status : "all"

  const token = await createServerToken()
  const appointments = token
    ? await fetchAllAppointments(
        token,
        status !== "all" ? status : undefined
      )
    : []

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "pending"
  ).length

  return (
    <div>
      <div className="border-b pb-8">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Administration
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
          Manage appointments
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          {appointments.length} request{appointments.length === 1 ? "" : "s"}
          {status !== "all" ? ` with status “${status}”` : ""}.
          {pendingCount > 0 ? ` ${pendingCount} waiting for review.` : ""}
        </p>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = status === filter.value

          return (
            <Link
              key={filter.value}
              href={
                filter.value === "all"
                  ? "/admin/appointments"
                  : `/admin/appointments?status=${filter.value}`
              }
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-full px-5 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-ink text-paper"
                  : "bg-sand text-hero-foreground hover:bg-sand/70"
              )}
            >
              {filter.label}
            </Link>
          )
        })}
      </div>

      <div className="mt-6 space-y-4">
        {appointments.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <p className="font-serif text-2xl tracking-tight">
              No appointment requests.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              New customer requests will appear here.
            </p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <AppointmentDetail key={appointment.id} appointment={appointment} />
          ))
        )}
      </div>
    </div>
  )
}
