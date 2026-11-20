import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"

function CtaBanner() {
  return (
    <section className="page-gutter pb-16 lg:pb-20">
      <div className="flex flex-col justify-between gap-6 rounded-lg bg-blush px-6 py-8 text-hero-foreground sm:flex-row sm:items-center sm:px-10 lg:px-12">
        <div>
          <h2 className="font-serif text-2xl tracking-tight sm:text-[1.75rem]">
            Your next good day starts here.
          </h2>
          <p className="mt-2 text-xs text-hero-muted">
            A little refresh. A whole lot of you.
          </p>
        </div>
        <Link
          href="/services"
          className={cn(
            buttonVariants(),
            "h-11 w-fit shrink-0 gap-2 px-5 text-sm"
          )}
        >
          Explore services
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

export { CtaBanner }
