import Link from "next/link"
import { Plus, Search } from "lucide-react"

import { ServicesTable } from "@/components/admin/services-table"
import { buttonVariants } from "@/components/ui/button"
import { requireAdmin } from "@/lib/auth-guard"
import { fetchServices } from "@/lib/catalog"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Manage services - SalonBook Admin",
  description: "Add, update and deactivate SalonBook services.",
}

const filters = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

export default async function AdminServicesPage(
  props: PageProps<"/admin/services">
) {
  await requireAdmin()

  const searchParams = await props.searchParams

  const query = typeof searchParams.q === "string" ? searchParams.q : ""
  const status =
    typeof searchParams.status === "string" ? searchParams.status : "all"

  const allServices = await fetchServices({ all: true, q: query || undefined })

  const services = allServices.filter(
    (service) => status === "all" || service.status === status
  )

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Administration
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
            Manage services
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {services.length} service{services.length === 1 ? "" : "s"} shown
          </p>
        </div>

        <Link
          href="/admin/services/new"
          className={cn(buttonVariants(), "h-10 shrink-0 gap-2 px-4")}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add service
        </Link>
      </div>

      <form
        action="/admin/services"
        role="search"
        className="mt-8 flex flex-col gap-2.5 rounded-xl bg-muted/60 p-2.5 sm:flex-row"
      >
        <label htmlFor="admin-service-search" className="sr-only">
          Search services
        </label>
        <input
          id="admin-service-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search services by name..."
          className="h-11 w-full min-w-0 rounded-md border-0 bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          className={cn(buttonVariants(), "h-11 shrink-0 gap-2 px-6")}
        >
          <Search className="size-4" aria-hidden="true" />
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = status === filter.value

          return (
            <Link
              key={filter.value}
              href={
                filter.value === "all"
                  ? "/admin/services"
                  : `/admin/services?status=${filter.value}${
                      query ? `&q=${encodeURIComponent(query)}` : ""
                    }`
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

      <div className="mt-6">
        <ServicesTable services={services} />
      </div>
    </div>
  )
}
