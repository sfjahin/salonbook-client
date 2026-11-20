import Link from "next/link"
import { ArrowDown } from "lucide-react"

import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"

export const metadata = {
  title: "Browse services — SalonBook",
  description: "Explore treatments made for your kind of beautiful.",
}

const categories = [
  { label: "All services", value: "all" },
  { label: "Hair", value: "hair" },
  { label: "Skin", value: "skin" },
  { label: "Nails", value: "nails" },
  { label: "Wellness", value: "wellness" },
  { label: "Beauty", value: "beauty" },
]

export default async function ServicesPage(props: PageProps<"/services">) {
  const params = await props.searchParams
  const activeCategory =
    typeof params.category === "string" ? params.category : "all"
  const query = typeof params.q === "string" ? params.q : ""

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
              className={cn(buttonVariants(), "h-11 shrink-0 px-8")}
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = activeCategory === category.value

            return (
              <Link
                key={category.value}
                href={
                  category.value === "all"
                    ? "/services"
                    : `/services?category=${category.value}`
                }
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

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 text-xs text-hero-muted">
          <p>6 services</p>
          <button
            type="button"
            className="flex items-center gap-1.5 transition-colors hover:text-hero-foreground"
          >
            Sort: Recommended
            <ArrowDown className="size-3.5" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-12 text-xs text-hero-muted">
          You&apos;ve found your feel-good favourites.
        </p>
      </section>
    </main>
  )
}
