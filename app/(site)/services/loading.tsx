import { ServiceCardSkeleton } from "@/components/service-card"

export default function ServicesLoading() {
  return (
    <main className="bg-hero text-hero-foreground">
      <section className="page-gutter pt-14 pb-16 lg:pt-20 lg:pb-20">
        <div className="h-3 w-40 animate-pulse rounded bg-sand" />
        <div className="mt-5 h-12 max-w-2xl animate-pulse rounded bg-sand" />
        <div className="mt-5 h-4 max-w-md animate-pulse rounded bg-sand" />

        <div className="mt-10 h-16 animate-pulse rounded-xl bg-sand" />

        <div className="mt-6 flex gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-7 w-24 animate-pulse rounded-full bg-sand"
            />
          ))}
        </div>

        <div
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          aria-hidden="true"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <ServiceCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </main>
  )
}
