"use client"

import { useEffect } from "react"
import Link from "next/link"
import { TriangleAlert } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Route level error boundary. Anything unexpected that bubbles up while a
 * page renders lands here instead of a blank screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[error]", error)
  }, [error])

  return (
    <main className="page-gutter flex flex-1 flex-col items-center justify-center py-24 text-center">
      <TriangleAlert className="size-8 text-destructive" aria-hidden="true" />

      <p className="mt-6 text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Something went wrong
      </p>

      <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
        This page hit a snag.
      </h1>

      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        {error.message || "Please try again in a moment."}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className={cn(buttonVariants(), "h-11 px-5")}
        >
          Try again
        </button>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5")}
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
