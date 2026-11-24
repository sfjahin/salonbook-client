import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"

import { cn } from "cn"

import heroImage from "@/app/images/Sunlit salon.png"
import { buttonVariants } from "@/components/ui/button"

function Hero() {
  return (
    <section className="bg-hero text-hero-foreground">
      <div className="grid lg:grid-cols-[45fr_55fr]">
        <div className="page-gutter flex flex-col justify-center py-16 lg:py-20">
          <p className="text-[0.7rem] font-medium tracking-[0.2em] text-hero-muted uppercase">
            Beauty, on your terms
          </p>

          <h1 className="mt-7 font-serif text-5xl leading-[1.05] font-normal tracking-tight sm:text-6xl lg:text-[3.5rem] xl:text-7xl">
            A little time.
            <br />
            All for you.
          </h1>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-hero-muted">
            Expert hands. Thoughtful treatments.
            <br />A feel-good moment that fits your day.
          </p>

          <Link
            href="/services"
            className={cn(
              buttonVariants(),
              "mt-9 h-12 w-fit gap-2 rounded-lg px-6 text-sm"
            )}
          >
            Explore salon services
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-3.5 fill-current" />
              ))}
            </div>
            <p className="text-sm text-hero-muted">
              4.9 / 5 from 280+ happy guests
            </p>
          </div>
        </div>

        <div className="relative min-h-88 sm:min-h-112 lg:min-h-136">
          <Image
            src={heroImage}
            alt="Sunlit salon interior with arched windows, warm plaster walls and cognac styling chairs"
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
            preload
          />

          <div className="absolute right-4 bottom-4 max-w-68 rounded-lg bg-background/95 px-5 py-4 shadow-sm ring-1 ring-foreground/5 sm:right-6 sm:bottom-6 lg:right-8 lg:bottom-8">
            <p className="font-serif text-lg leading-snug">
              A calmer kind of salon.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Thoughtfully curated. Always personal.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
