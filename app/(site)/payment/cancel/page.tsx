import Link from "next/link"
import { ArrowRight, XCircle } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Payment cancelled - SalonBook",
  description: "Your SalonBook payment was not completed.",
}

export default function PaymentCancelPage() {
  return (
    <main className="page-gutter flex flex-1 flex-col items-center justify-center py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <XCircle className="size-7" aria-hidden="true" />
      </span>

      <p className="mt-6 text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Payment cancelled
      </p>

      <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
        No payment was taken.
      </h1>

      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        You have been returned from Stripe without paying. Your appointment is
        still confirmed and you can try again whenever you are ready.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/dashboard/appointments"
          className={cn(buttonVariants(), "h-11 gap-2 px-5")}
        >
          Back to my appointments
          <ArrowRight className="size-4" aria-hidden="true" />
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
