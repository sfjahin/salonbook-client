import Link from "next/link"
import { ArrowRight, BadgeCheck, Clock, CreditCard } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  createServerToken,
  verifyCheckoutSession,
} from "@/lib/catalog"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Payment status - SalonBook",
  description: "The status of your SalonBook payment.",
}

type Verification = {
  status: "paid" | "pending" | "failed"
  message?: string
}

async function verify(sessionId?: string): Promise<Verification> {
  if (!sessionId) {
    return { status: "pending", message: "No checkout session was provided." }
  }

  const token = await createServerToken()
  if (!token) {
    return {
      status: "pending",
      message:
        "Sign in to confirm this payment. If you were charged, it will appear in your dashboard shortly.",
    }
  }

  try {
    const result = await verifyCheckoutSession(token, sessionId)

    if (result.status === "paid") {
      return { status: "paid" }
    }

    return {
      status: "pending",
      message:
        "Stripe has not marked this payment as complete yet. If you were charged, it will appear in your dashboard within a few moments.",
    }
  } catch (error) {
    return {
      status: "pending",
      message:
        error instanceof Error
          ? error.message
          : "We could not verify this payment yet.",
    }
  }
}

export default async function PaymentSuccessPage(props: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await props.searchParams
  const result = await verify(session_id)
  const paid = result.status === "paid"

  return (
    <main className="page-gutter flex flex-1 flex-col items-center justify-center py-24 text-center">
      <span
        className={cn(
          "flex size-14 items-center justify-center rounded-full",
          paid
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        )}
      >
        {paid ? (
          <BadgeCheck className="size-7" aria-hidden="true" />
        ) : (
          <Clock className="size-7" aria-hidden="true" />
        )}
      </span>

      <p className="mt-6 text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
        {paid ? "Payment successful" : "Payment processing"}
      </p>

      <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
        {paid
          ? "Thank you. Your appointment is all set."
          : "We are confirming your payment."}
      </h1>

      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        {paid
          ? "We have received your payment. Your appointment now shows as paid in your dashboard."
          : result.message}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/dashboard/appointments"
          className={cn(buttonVariants(), "h-11 gap-2 px-5")}
        >
          {paid ? "View my appointments" : "Check my appointments"}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="/services"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 gap-2 px-5")}
        >
          <CreditCard className="size-4" aria-hidden="true" />
          Browse services
        </Link>
      </div>
    </main>
  )
}
