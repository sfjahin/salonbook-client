import { Benefits } from "@/components/benefits"
import { CtaBanner } from "@/components/cta-banner"
import { Hero } from "@/components/hero"
import { Highlights } from "@/components/highlights"
import { ServiceCategories } from "@/components/service-categories"
import { Testimonial } from "@/components/testimonial"

export default function Page() {
  return (
    <main>
      <Hero />
      <Highlights />
      <ServiceCategories />
      <Benefits />
      <Testimonial />
      <CtaBanner />
    </main>
  )
}
