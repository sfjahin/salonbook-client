import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { ServiceCard } from "@/components/service-card"
import { buttonVariants } from "@/components/ui/button"
import { fetchServices } from "@/lib/catalog"
import { cn } from "@/lib/utils"

/**
 * Dynamic home section: up to six active services pulled from the database.
 */
async function FeaturedServices() {
  const services = await fetchServices({ featured: true })

  return (
    <section className="page-gutter py-14 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
            On the menu
          </p>
          <h2 className="mt-4 font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
            Services our guests come back for.
          </h2>
        </div>

        <Link
          href="/services"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 gap-2 px-4"
          )}
        >
          Explore salon services
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No services are available yet. Check back soon.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </section>
  )
}

export { FeaturedServices }
