import { Benefits } from "@/components/benefits"
import { CtaBanner } from "@/components/cta-banner"
import { FeaturedServices } from "@/components/featured-services"
import { Hero } from "@/components/hero"
import { Highlights } from "@/components/highlights"
import { ServiceCategories } from "@/components/service-categories"
import { Testimonial } from "@/components/testimonial"

export const dynamic = "force-dynamic"

export default function Page() {
  return (
    <main>
      <Hero />
      <Highlights />
      <FeaturedServices />
      <ServiceCategories />
      <Benefits />
      <Testimonial />
      <CtaBanner />
    </main>
  )
}
