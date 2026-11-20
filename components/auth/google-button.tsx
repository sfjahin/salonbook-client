"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { GoogleIcon } from "@/components/auth/google-icon"
import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth-client"

function GoogleButton() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setPending(true)
    setError(null)

    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: "/",
      })

      if (error) {
        setError(error.message ?? "Could not continue with Google.")
        setPending(false)
      }
    } catch {
      setError("Could not continue with Google. Please try again.")
      setPending(false)
    }
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={pending}
        className="h-11 w-full gap-3 rounded-md bg-background text-[0.8rem] font-medium"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </Button>
      {error ? (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export { GoogleButton }
