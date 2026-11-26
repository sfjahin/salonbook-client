"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Lock } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

function CheckoutForm({ appointmentId }: { appointmentId: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function handlePay() {
    setBusy(true)

    try {
      const data = await api.post<{ url: string }>("/api/payments/checkout", {
        appointmentId,
      })

      if (!data.url) throw new Error("Stripe did not return a checkout URL.")

      window.location.href = data.url
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not start payment."
      )
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        onClick={handlePay}
        disabled={busy}
        className="h-12 w-full gap-2 text-sm"
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Lock className="size-4" aria-hidden="true" />
        )}
        {busy ? "Redirecting to Stripe..." : "Continue to secure payment"}
      </Button>

      <button
        type="button"
        onClick={() => router.push("/dashboard/appointments")}
        disabled={busy}
        className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to my appointments
      </button>
    </div>
  )
}

export { CheckoutForm }
