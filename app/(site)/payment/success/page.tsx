import Link from "next/link"
import { ArrowRight, BadgeCheck } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Payment successful - SalonBook",
  description: "Your SalonBook payment was received.",
}

export default function PaymentSuccessPage() {
  return (
    <main className="page-gutter flex flex-1 flex-col items-center justify-center py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        <BadgeCheck className="size-7" aria-hidden="true" />
      </span>

      <p className="mt-6 text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Payment successful
      </p>

      <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
        Thank you. Your appointment is all set.
      </h1>

      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        We have received your payment. Your appointment status and transaction
        record will update in your dashboard within a few moments.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/dashboard/appointments"
          className={cn(buttonVariants(), "h-11 gap-2 px-5")}
        >
          View my appointments
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
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
