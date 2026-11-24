import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"

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

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={service.image}
          alt={service.serviceName}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-hero-foreground">
          {service.category}
        </span>
        {service.status === "inactive" ? (
          <span className="absolute top-3 right-3 rounded-full bg-ink px-2.5 py-1 text-[0.65rem] font-medium text-paper">
            Inactive
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-xl leading-snug tracking-tight">
            {service.serviceName}
          </h3>
          <p className="shrink-0 font-serif text-lg">
            {formatPrice(service.price)}
          </p>
        </div>

        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" aria-hidden="true" />
          {service.duration} minutes
        </p>

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <Link
          href={`/services/${service.id}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-5 h-10 w-full gap-2"
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
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  )
}

export { ServiceCard, ServiceCardSkeleton }
