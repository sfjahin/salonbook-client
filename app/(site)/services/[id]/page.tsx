import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, LogIn, Tag } from "lucide-react"

import { BookingForm } from "@/components/booking/booking-form"
import { formatPrice, serviceTagline } from "@/components/service-card"
import { buttonVariants } from "@/components/ui/button"
import { fetchService } from "@/lib/catalog"
import { getServerSession } from "@/lib/auth-guard"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export async function generateMetadata(
  props: PageProps<"/services/[id]">
): Promise<Metadata> {
  const { id } = await props.params

  try {
    const service = await fetchService(id)
    return {
      title: `${service.serviceName} — SalonBook`,
      description: service.description.slice(0, 150),
    }
  } catch {
    return { title: "Service — SalonBook" }
  }
}

export default async function ServiceDetailsPage(
  props: PageProps<"/services/[id]">
) {
  const { id } = await props.params
  const session = await getServerSession()

  let service
  try {
    service = await fetchService(id)
  } catch (error) {
    const status = (error as { status?: number }).status
    if (status === 400 || status === 404) notFound()
    throw error
  }

  const isAdmin = session?.user.role === "admin"
  const isBookable = service.status === "active" && !isAdmin
  const tagline = serviceTagline(service.description)
  const fullDescription = service.description.slice(tagline.length).trim()

  return (
    <main className="bg-hero text-hero-foreground">
      <section className="page-gutter py-10 lg:py-14">
        <Link
          href="/services"
          className="flex w-fit items-center gap-1.5 text-xs text-hero-muted transition-colors hover:text-hero-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to all services
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div className="space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand sm:aspect-[16/10]">
              <Image
                src={service.image}
                alt={service.serviceName}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
                priority
              />
            </div>

            <div>
              <span className="inline-flex items-center rounded-full bg-sand px-3 py-1 text-[0.7rem] font-medium text-hero-foreground">
                {service.category}
              </span>

              <h1 className="mt-4 font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl">
                {service.serviceName}
              </h1>

              <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-hero-foreground sm:text-xl">
                {tagline}
              </p>

              {fullDescription ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-hero-muted sm:text-base">
                  {fullDescription}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-hero-foreground">
                <span className="flex items-center gap-2">
                  <Tag className="size-4 text-hero-muted" aria-hidden="true" />
                  {formatPrice(service.price)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="size-4 text-hero-muted" aria-hidden="true" />
                  {service.duration} minutes
                </span>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-hero-foreground/10 bg-background p-6 text-foreground sm:p-8">
              <p className="text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                Book this service
              </p>
              <h2 className="mt-3 font-serif text-2xl tracking-tight">
                Request an appointment
              </h2>

              <div className="mt-6">
                {isAdmin ? (
                  <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                    You are signed in as an administrator. Booking is available
                    to customers only.
                  </p>
                ) : service.status !== "active" ? (
                  <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                    This service is currently unavailable for booking.
                  </p>
                ) : !session ? (
                  <div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Sign in to request this appointment. New here? Creating an
                      account takes less than a minute.
                    </p>
                    <Link
                      href={`/sign-in?next=${encodeURIComponent(`/services/${service.id}`)}`}
                      className={cn(
                        buttonVariants(),
                        "mt-5 h-11 w-full gap-2"
                      )}
                    >
                      <LogIn className="size-4" aria-hidden="true" />
                      Sign in to book
                    </Link>
                  </div>
                ) : (
                  <BookingForm serviceId={service.id} />
                )}
              </div>

              {isBookable ? (
                <p className="mt-5 text-[0.7rem] leading-relaxed text-muted-foreground">
                  Requests are reviewed by the salon. You will see the status
                  update in your dashboard.
                </p>
              ) : null}
            </div>

            {session && !isAdmin ? (
              <div className="mt-5 rounded-xl border border-hero-foreground/10 bg-sand/60 p-6">
                <p className="font-serif text-lg">Already booked with us?</p>
                <p className="mt-2 text-xs text-hero-muted">
                  Track, pay or cancel your requests from your dashboard.
                </p>
                <Link
                  href="/dashboard/appointments"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "mt-4 h-10 px-4"
                  )}
                >
                  My appointments
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  )
}
