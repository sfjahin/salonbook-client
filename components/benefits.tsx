const benefits = [
  {
    title: "Made personal",
    description: "Treatments tailored to your hair, skin and story.",
  },
  {
    title: "No extra effort",
    description: "Find your service and reserve your moment in minutes.",
  },
  {
    title: "Only the good stuff",
    description: "Skilled professionals and products we truly believe in.",
  },
]

function Benefits() {
  return (
    <section className="bg-sand">
      <div className="page-gutter grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10 lg:py-14">
        <h2 className="font-serif text-2xl leading-tight text-hero-foreground uppercase sm:text-[1.75rem] lg:max-w-[9ch]">
          Good hands.
          <br />
          Great feeling.
        </h2>
        {benefits.map((benefit) => (
          <div key={benefit.title}>
            <h3 className="text-xs font-semibold text-hero-foreground">
              {benefit.title}
            </h3>
            <p className="mt-2 max-w-56 text-xs leading-relaxed text-hero-muted">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export { Benefits }
