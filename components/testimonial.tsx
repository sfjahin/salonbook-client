import { Star } from "lucide-react"

function Testimonial() {
  return (
    <section className="page-gutter py-16 lg:py-20">
      <div
        className="flex items-center gap-0.5 text-hero-foreground"
        aria-hidden="true"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="size-3.5 fill-current" />
        ))}
      </div>
      <blockquote className="mt-5 font-serif text-3xl leading-[1.25] tracking-tight text-foreground lg:text-4xl">
        &ldquo;I came in for a haircut.
        <br />I left feeling like myself again.&rdquo;
      </blockquote>
      <p className="mt-6 text-[0.7rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
        — Olivia M. <span className="text-muted-foreground/50">/</span> A
        SalonBook regular
      </p>
    </section>
  )
}

export { Testimonial }
