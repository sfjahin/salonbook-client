"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CalendarDays, Loader2, Tag } from "lucide-react"
import { toast } from "sonner"

import { StatusBadge } from "@/components/status-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { Appointment } from "@/lib/types"
import { cn } from "@/lib/utils"

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value))
}

function formatCreated(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [open, setOpen] = useState(false)

  const canCancel =
    appointment.status === "pending" && appointment.paymentStatus !== "paid"
  const canPay =
    appointment.status === "confirmed" && appointment.paymentStatus === "unpaid"

  async function handleCancel() {
    setBusy(true)
    try {
      await api.patch(`/api/appointments/${appointment.id}/cancel`)
      toast.success("Your appointment has been cancelled.")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not cancel the request."
      )
      setConfirming(false)
    } finally {
      setBusy(false)
    }
  }

  function handlePay() {
    router.push(`/checkout/${appointment.id}`)
  }

  return (
    <article className="rounded-xl border bg-card p-5 text-card-foreground">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-20">
          {appointment.service?.image ? (
            <Image
              src={appointment.service.image}
              alt={appointment.service.serviceName}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div>
              <h2 className="font-serif text-xl leading-snug tracking-tight">
                {appointment.service?.serviceName ?? "Service"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {appointment.service?.category}
              </p>
            </div>

            <p className="font-serif text-lg">
              ${Number(appointment.servicePrice).toFixed(2)}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {formatDate(appointment.appointmentDate)} at{" "}
              {appointment.timeSlot}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="size-3.5" aria-hidden="true" />
              Requested {formatCreated(appointment.createdAt)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={appointment.status} />
            <StatusBadge status={appointment.paymentStatus} kind="payment" />
          </div>

          {appointment.message ? (
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="mt-3 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {open ? "Hide details" : "View appointment details"}
            </button>
          ) : null}

          {open ? (
            <div className="mt-3 rounded-lg bg-muted/60 p-4 text-sm">
              <p className="text-[0.65rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                Your message
              </p>
              <p className="mt-1.5 leading-relaxed">{appointment.message}</p>
            </div>
          ) : null}
        </div>
      </div>

      {canCancel || canPay ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
          {canPay ? (
            <Button
              type="button"
              onClick={handlePay}
              className="h-10 gap-2 px-4"
            >
              Pay now
            </Button>
          ) : null}

          {canCancel ? (
            confirming ? (
              <>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={busy}
                  className="h-10 px-4"
                >
                  {busy ? (
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : null}
                  Yes, cancel it
                </Button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-10 px-4 text-muted-foreground"
                  )}
                >
                  Keep it
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-10 px-4 text-destructive hover:text-destructive"
                )}
              >
                Cancel appointment
              </button>
            )
          ) : null}

          {!canPay && appointment.paymentStatus === "paid" ? (
            <p className="text-xs text-muted-foreground">
              This appointment has been paid for.
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

function AppointmentList({ appointments }: { appointments: Appointment[] }) {
  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="font-serif text-2xl tracking-tight">
          No appointment requests yet.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Pick a service and request a time that suits you.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentRow key={appointment.id} appointment={appointment} />
      ))}
    </div>
  )
}

export { AppointmentList }
