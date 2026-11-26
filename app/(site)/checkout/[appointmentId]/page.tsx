import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  CalendarDays,
  Clock,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react"

import { CheckoutForm } from "@/components/checkout/checkout-form"
import { StatusBadge } from "@/components/status-badge"
import { buttonVariants } from "@/components/ui/button"
import { requireCustomer } from "@/lib/auth-guard"
import { createServerToken, fetchMyAppointments } from "@/lib/catalog"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Checkout - SalonBook",
  description: "Review your appointment and complete payment securely.",
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value))
}

export default async function CheckoutPage(props: {
  params: Promise<{ appointmentId: string }>
}) {
  await requireCustomer()

  const { appointmentId } = await props.params
  const token = await createServerToken()
  const appointments = token ? await fetchMyAppointments(token) : []
  const appointment = appointments.find((row) => row.id === appointmentId)

  if (!appointment) notFound()

  const amount = Number(appointment.servicePrice)
  const tax = 0
  const total = amount + tax

  const payable =
    appointment.status === "confirmed" &&
    appointment.paymentStatus === "unpaid"

  return (
    <main className="page-gutter flex-1 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Secure checkout
          </p>
          <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Review and pay
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Your payment is processed by Stripe. SalonBook never sees or stores
            your card details.
          </p>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-2xl border bg-card p-5 text-card-foreground sm:p-7">
            <h2 className="font-serif text-2xl tracking-tight">
              Appointment summary
            </h2>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row">
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:size-28 sm:aspect-auto">
                {appointment.service?.image ? (
                  <Image
                    src={appointment.service.image}
                    alt={appointment.service.serviceName}
                    fill
                    sizes="(min-width: 640px) 112px, 100vw"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-xl leading-snug tracking-tight">
                      {appointment.service?.serviceName ?? "Salon service"}
                    </h3>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Tag className="size-3.5" aria-hidden="true" />
                      {appointment.service?.category ?? "Service"}
                    </p>
                  </div>
                  <StatusBadge status={appointment.status} />
                </div>

                <dl className="mt-4 grid gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <dt className="sr-only">Date</dt>
                    <dd>{formatDate(appointment.appointmentDate)}</dd>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-4 shrink-0" aria-hidden="true" />
                    <dt className="sr-only">Time</dt>
                    <dd>{appointment.timeSlot}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {appointment.message ? (
              <div className="mt-5 rounded-lg bg-muted/60 p-4 text-sm">
                <p className="text-[0.65rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  Your note to the salon
                </p>
                <p className="mt-1.5 leading-relaxed">{appointment.message}</p>
              </div>
            ) : null}

            <div className="mt-6 flex items-start gap-3 rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              <p>
                Payments are encrypted end-to-end and handled by Stripe. You
                will be returned here after paying.
              </p>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border bg-ink p-5 text-paper sm:p-7">
            <h2 className="font-serif text-2xl tracking-tight">
              Order summary
            </h2>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-paper/70">
                  {appointment.service?.serviceName ?? "Service"}
                </dt>
                <dd>${amount.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-paper/70">Taxes</dt>
                <dd>{tax > 0 ? `$${tax.toFixed(2)}` : "Included"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3 text-base font-medium">
                <dt>Total</dt>
                <dd className="font-serif text-2xl">${total.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              {payable ? (
                <CheckoutForm appointmentId={appointment.id} />
              ) : (
                <div className="space-y-4">
                  <p className="rounded-lg bg-paper/10 p-4 text-sm text-paper/80">
                    {appointment.paymentStatus === "paid"
                      ? "This appointment has already been paid for."
                      : appointment.status === "cancelled"
                        ? "This appointment was cancelled, so it cannot be paid."
                        : "This appointment is awaiting confirmation from the salon. You can pay once it is confirmed."}
                  </p>
                  <Link
                    href="/dashboard/appointments"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-11 w-full border-white/20 bg-transparent text-paper hover:bg-paper/10 hover:text-paper"
                    )}
                  >
                    Back to my appointments
                  </Link>
                </div>
              )}
            </div>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-[0.7rem] text-paper/50">
              <CreditCard className="size-3.5" aria-hidden="true" />
              Powered by Stripe
              <Sparkles className="size-3.5" aria-hidden="true" />
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}
