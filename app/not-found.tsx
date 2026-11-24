import Link from "next/link"
import { SearchX } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <main className="page-gutter flex flex-1 flex-col items-center justify-center py-24 text-center">
      <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />

      <p className="mt-6 text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
        404
      </p>

      <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
        We could not find that page.
      </h1>

      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        The link may be broken, or the service you were looking for may no
        longer exist.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={cn(buttonVariants(), "h-11 px-5")}>
          Back to home
        </Link>
        <Link
          href="/services"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5")}
        >
          Browse services
        </Link>
      </div>
    </main>
  )
}
