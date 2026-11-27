import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Service } from "@/lib/types"

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price)
}

/**
 * Cards show the opening sentence as a tagline; the full copy lives on the
 * service details page.
 */
export function serviceTagline(description: string) {
  const trimmed = description.trim()
  const sentence = trimmed.match(/^.*?[.!?](?=\s|$)/)
  return (sentence?.[0] ?? trimmed).trim()
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={service.image}
          alt={service.serviceName}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {service.status === "inactive" ? (
          <span className="absolute top-3 right-3 rounded-full bg-ink px-2.5 py-1 text-[0.65rem] font-medium text-paper">
            Inactive
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[0.65rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {service.category}
        </p>

        <h3 className="mt-2 font-serif text-xl leading-snug tracking-tight sm:text-2xl">
          {service.serviceName}
        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {serviceTagline(service.description)}
        </p>

        <div className="mt-5 flex items-baseline justify-between gap-3">
          <p className="font-serif text-xl">{formatPrice(service.price)}</p>
          <p className="text-xs text-muted-foreground">
            {service.duration} min
          </p>
        </div>

        <Link
          href={`/services/${service.id}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-4 h-10 w-full gap-2"
          )}
        >
          View details
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="aspect-[16/10] animate-pulse bg-muted" />
      <div className="space-y-3 p-6">
        <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
        <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  )
}

export { ServiceCard, ServiceCardSkeleton }
