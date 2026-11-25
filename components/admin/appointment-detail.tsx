"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, X } from "lucide-react"
import { toast } from "sonner"

import { StatusBadge } from "@/components/status-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { Appointment } from "@/lib/types"
import { cn } from "@/lib/utils"

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(value)
  )
}

function AppointmentActions({ appointment }: { appointment: Appointment }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [confirmingCancel, setConfirmingCancel] = useState(false)

  const isPending = appointment.status === "pending"
  const canCancel = appointment.status === "pending" || appointment.status === "confirmed"

  async function updateStatus(status: "confirmed" | "cancelled") {
    setBusy(true)
    try {
      await api.patch(`/api/appointments/${appointment.id}/status`, { status })
      toast.success(
        status === "confirmed"
          ? "Appointment confirmed."
          : "Appointment cancelled."
      )
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update the appointment."
      )
      setConfirmingCancel(false)
    } finally {
      setBusy(false)
    }
  }

  if (!isPending && !canCancel) {
    return <p className="text-xs text-muted-foreground">No actions</p>
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {isPending ? (
        <Button
          type="button"
          onClick={() => updateStatus("confirmed")}
          disabled={busy}
          className="h-9 gap-1.5 bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-700"
        >
          {busy ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Check className="size-3.5" aria-hidden="true" />
          )}
          Confirm
        </Button>
      ) : null}

      {canCancel ? (
        confirmingCancel ? (
          <>
            <Button
              type="button"
              variant="destructive"
              onClick={() => updateStatus("cancelled")}
              disabled={busy}
              className="h-9 gap-1.5 px-3 text-xs"
            >
              {busy ? (
                <Loader2
                  className="size-3.5 animate-spin"
                  aria-hidden="true"
                />
              ) : null}
              Yes, cancel
            </Button>
            <button
              type="button"
              onClick={() => setConfirmingCancel(false)}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 px-3 text-xs text-muted-foreground"
              )}
            >
              Keep
            </button>
          </>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setConfirmingCancel(true)}
            disabled={busy}
            className="h-9 gap-1.5 px-3 text-xs text-destructive hover:text-destructive"
          >
            <X className="size-3.5" aria-hidden="true" />
            Cancel
          </Button>
        )
      ) : null}
    </div>
  )
}

function AppointmentDetail({ appointment }: { appointment: Appointment }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Customer
          </p>
          <p className="mt-1 text-sm font-medium">
            {appointment.customer?.name ?? "Customer"}
          </p>
          <p className="text-xs text-muted-foreground">
            {appointment.customer?.email}
          </p>
          {appointment.customer?.phone ? (
            <p className="text-xs text-muted-foreground">
              {appointment.customer.phone}
            </p>
          ) : null}
        </div>

        <div className="min-w-0">
          <p className="text-[0.65rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Service
          </p>
          <p className="mt-1 text-sm font-medium">
            {appointment.service?.serviceName ?? "Service"}
          </p>
          <p className="text-xs text-muted-foreground">
            {appointment.service?.category} ·{" "}
            {appointment.service?.duration} min
          </p>
          <p className="text-xs text-muted-foreground">
            ${Number(appointment.servicePrice).toFixed(2)}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[0.65rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Appointment
          </p>
          <p className="mt-1 text-sm font-medium">
            {formatDate(appointment.appointmentDate)}
          </p>
          <p className="text-xs text-muted-foreground">{appointment.timeSlot}</p>
          <p className="text-xs text-muted-foreground">
            Requested {formatDate(appointment.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status={appointment.status} />
          <StatusBadge status={appointment.paymentStatus} kind="payment" />
        </div>
      </div>

      {appointment.message ? (
        <div className="mt-4 rounded-lg bg-muted/60 p-4">
          <p className="text-[0.65rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Customer message
          </p>
          <p className="mt-1.5 text-sm leading-relaxed">
            {appointment.message}
          </p>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <p className="text-xs text-muted-foreground">
          {appointment.status === "pending"
            ? "Waiting for the salon to confirm."
            : appointment.status === "confirmed"
              ? "Confirmed and ready for payment."
              : "This request was cancelled."}
        </p>
        <AppointmentActions appointment={appointment} />
      </div>
    </div>
  )
}

export { AppointmentDetail }
