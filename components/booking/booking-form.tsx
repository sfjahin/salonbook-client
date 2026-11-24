"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { TIME_SLOTS, todayIso } from "@/lib/slots"

function BookingForm({ serviceId }: { serviceId: string }) {
  const router = useRouter()
  const [appointmentDate, setDate] = useState(todayIso())
  const [timeSlot, setSlot] = useState<string>("")
  const [message, setMessage] = useState("")
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!timeSlot) {
      toast.error("Please choose an available time slot.")
      return
    }

    setPending(true)

    try {
      await api.post("/api/appointments", {
        serviceId,
        appointmentDate,
        timeSlot,
        message,
      })

      toast.success("Your appointment request has been sent.")
      setMessage("")
      router.push("/dashboard/appointments")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We could not send your request."
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="appointment-date" className="text-xs font-medium">
          Appointment date
        </Label>
        <Input
          id="appointment-date"
          type="date"
          min={todayIso()}
          value={appointmentDate}
          onChange={(event) => setDate(event.target.value)}
          required
          className="mt-2 h-11 rounded-md bg-background text-sm"
        />
      </div>

      <div>
        <Label htmlFor="appointment-slot" className="text-xs font-medium">
          Available time slot
        </Label>
        <select
          id="appointment-slot"
          value={timeSlot}
          onChange={(event) => setSlot(event.target.value)}
          required
          className="mt-2 flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Select a time</option>
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="appointment-message" className="text-xs font-medium">
          Additional message{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <textarea
          id="appointment-message"
          rows={3}
          value={message}
          maxLength={500}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Anything we should know before your visit?"
          className="mt-2 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full gap-2 rounded-md bg-ink text-sm text-paper hover:bg-ink/90"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        {pending ? "Sending request..." : "Request appointment"}
      </Button>
    </form>
  )
}

export { BookingForm }
