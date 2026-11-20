import { Check } from "lucide-react"

const highlights = [
  "Expert, caring professionals",
  "Easy online booking",
  "A space to feel yourself",
]

function Highlights() {
  return (
    <section aria-label="Why SalonBook">
      <div className="page-gutter grid gap-3 py-4 sm:grid-cols-3">
        {highlights.map((highlight) => (
          <p
            key={highlight}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Check
              className="size-3.5 shrink-0 text-hero-foreground"
              aria-hidden="true"
            />
            {highlight}
          </p>
        ))}
      </div>
    </section>
  )
}

export { Highlights }
