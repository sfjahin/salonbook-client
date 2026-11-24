import Link from "next/link"
import { Search } from "lucide-react"

import { ServiceCard } from "@/components/service-card"
import { buttonVariants } from "@/components/ui/button"
import { fetchCategories, fetchServices } from "@/lib/catalog"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Browse services — SalonBook",
  description: "Explore treatments made for your kind of beautiful.",
}

const sortOptions = [
  { label: "Recommended", value: "newest" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
]

function buildHref(base: Record<string, string | undefined>) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(base)) {
    if (value && value !== "all") params.set(key, value)
  }

  const query = params.toString()
  return query ? `/services?${query}` : "/services"
}

export default async function ServicesPage(props: PageProps<"/services">) {
  const params = await props.searchParams

  const activeCategory =
    typeof params.category === "string" ? params.category : "all"
  const query = typeof params.q === "string" ? params.q : ""
  const sort = typeof params.sort === "string" ? params.sort : "newest"

  const [services, categories] = await Promise.all([
    fetchServices({
      q: query || undefined,
      category: activeCategory,
      sort,
    }),
    fetchCategories(),
  ])

  return (
    <main className="bg-hero text-hero-foreground">
      <section className="page-gutter pt-14 pb-16 lg:pt-20 lg:pb-20">
        <p className="text-[0.7rem] font-medium tracking-[0.2em] text-hero-muted uppercase">
          Find your feel-good
        </p>

        <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
          A little care. A big difference.
        </h1>

        <p className="mt-5 text-sm text-hero-muted">
          Explore treatments made for your kind of beautiful.
        </p>

        <form
          action="/services"
          role="search"
          className="mt-10 rounded-xl bg-sand/60 p-2.5 sm:p-3 lg:mt-14"
        >
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <label htmlFor="service-search" className="sr-only">
              Search services
            </label>
            <input
              id="service-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search hair, skin, nails and more..."
              className="h-11 w-full min-w-0 rounded-md border-0 bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              className={cn(buttonVariants(), "h-11 shrink-0 gap-2 px-8")}
            >
              <Search className="size-4" aria-hidden="true" />
              Search
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={buildHref({ q: query })}
            aria-current={activeCategory === "all" ? "page" : undefined}
            className={cn(
              "rounded-full px-5 py-1.5 text-xs font-medium transition-colors",
              activeCategory === "all"
                ? "bg-ink text-paper"
                : "bg-sand text-hero-foreground hover:bg-sand/70"
            )}
          >
            All services
          </Link>

          {categories.map((category) => {
            const isActive = activeCategory === category.value

            return (
              <Link
                key={category.value}
                href={buildHref({ q: query, category: category.value })}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-5 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-ink text-paper"
                    : "bg-sand text-hero-foreground hover:bg-sand/70"
                )}
              >
                {category.label}
              </Link>
            )
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-hero-muted">
            {services.length} service{services.length === 1 ? "" : "s"}
            {query ? ` matching “${query}”` : ""}
          </p>

          <form
            action="/services"
            className="flex items-center gap-2 rounded-md bg-sand/60 px-3 py-1.5"
          >
            {query ? <input type="hidden" name="q" value={query} /> : null}
            {activeCategory !== "all" ? (
              <input
                type="hidden"
                name="category"
                value={activeCategory}
              />
            ) : null}

            <label htmlFor="service-sort" className="sr-only">
              Sort services
            </label>
            <select
              id="service-sort"
              name="sort"
              defaultValue={sort}
              className="bg-transparent text-xs text-hero-foreground outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="text-xs font-medium underline-offset-4 hover:underline"
            >
              Apply
            </button>
          </form>
        </div>

        {services.length === 0 ? (
          <div className="mt-12 rounded-xl border border-dashed border-hero-foreground/20 p-12 text-center">
            <p className="font-serif text-2xl tracking-tight">
              No services found.
            </p>
            <p className="mt-3 text-sm text-hero-muted">
              Try a different search term or clear the filters.
            </p>
            <Link
              href="/services"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-6 h-10 px-5"
              )}
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {services.length > 0 ? (
          <p className="mt-12 text-xs text-hero-muted">
            You&apos;ve found your feel-good favourites.
          </p>
        ) : null}
      </section>
    </main>
  )
}
