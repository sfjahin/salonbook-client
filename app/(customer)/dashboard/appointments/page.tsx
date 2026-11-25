import Link from "next/link"

import { AppointmentList } from "@/components/appointments/appointment-list"
import { requireCustomer } from "@/lib/auth-guard"
import { createServerToken, fetchMyAppointments } from "@/lib/catalog"
import type { AppointmentStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "My appointments - SalonBook",
  description: "View and manage your SalonBook appointment requests.",
}

const filters: Array<{ label: string; value: string }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
]

export default async function MyAppointmentsPage(
  props: PageProps<"/dashboard/appointments">
) {
  await requireCustomer()

  const searchParams = await props.searchParams
  const active =
    typeof searchParams.status === "string" ? searchParams.status : "all"

  const token = await createServerToken()
  const appointments = token ? await fetchMyAppointments(token) : []

  const visible = appointments.filter(
    (appointment) =>
      active === "all" ||
      (appointment.status as AppointmentStatus) === active
  )

  return (
    <div>
      <div className="border-b pb-8">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Customer dashboard
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
          My appointments
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Cancel a pending request or pay for an appointment the salon has
          confirmed.
        </p>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = active === filter.value

          return (
            <Link
              key={filter.value}
              href={
                filter.value === "all"
                  ? "/dashboard/appointments"
                  : `/dashboard/appointments?status=${filter.value}`
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

      <p className="mt-5 text-xs text-muted-foreground">
        {visible.length} appointment{visible.length === 1 ? "" : "s"}
        {active !== "all" ? ` with status “${active}”` : ""}
      </p>

      <div className="mt-5">
        <AppointmentList appointments={visible} />
      </div>
    </div>
  )
}
