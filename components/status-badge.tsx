import { cn } from "@/lib/utils"
import type { AppointmentStatus, PaymentStatus } from "@/lib/types"

const appointmentStyles: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  confirmed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
}

const paymentStyles: Record<PaymentStatus, string> = {
  unpaid: "bg-muted text-muted-foreground",
  paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
}

const labels: Record<AppointmentStatus | PaymentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  unpaid: "Unpaid",
  paid: "Paid",
}

function StatusBadge({
  status,
  kind = "appointment",
  className,
}: {
  status: AppointmentStatus | PaymentStatus
  kind?: "appointment" | "payment"
  className?: string
}) {
  const styles =
    kind === "appointment"
      ? appointmentStyles[status as AppointmentStatus]
      : paymentStyles[status as PaymentStatus]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-medium",
        styles,
        className
      )}
    >
      {labels[status]}
    </span>
  )
}

export { StatusBadge }
