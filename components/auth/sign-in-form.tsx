"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2 } from "lucide-react"

import { GoogleButton } from "@/components/auth/google-button"
import { PasswordField } from "@/components/auth/password-field"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/lib/auth-client"
import { clearToken } from "@/lib/api"

function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    try {
      const { data, error } = await signIn.email({
        email,
        password,
        rememberMe,
      })

      if (error) {
        setError(
          error.message ?? "Invalid email or password. Please try again."
        )
        setPending(false)
        return
      }

      const isAdmin =
        (data?.user as { role?: string | null } | undefined)?.role === "admin"

      // A token cached from a previous session would belong to another user.
      clearToken()

      console.log("[sign-in] success:", {
        id: data?.user?.id,
        name: data?.user?.name,
        email: data?.user?.email,
        role: isAdmin ? "admin" : "user",
      })

      // Only honour same-origin destinations that match the user's role.
      const requested = new URLSearchParams(window.location.search).get("next")
      const safeRequested =
        requested?.startsWith("/") && !requested.startsWith("//")
          ? requested
          : null

      const target = isAdmin
        ? safeRequested?.startsWith("/admin")
          ? safeRequested
          : "/admin"
        : safeRequested?.startsWith("/dashboard")
          ? safeRequested
          : "/dashboard"

      router.push(target)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
      setPending(false)
    }
  }

  return (
    <div>
      <GoogleButton />

      <div className="my-7 flex items-center gap-4 text-xs text-hero-muted">
        <span className="h-px flex-1 bg-border" />
        or with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="email" className="text-xs font-medium">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="olivia.martin@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 h-11 rounded-md bg-background text-sm"
          />
        </div>

        <PasswordField
          id="password"
          autoComplete="current-password"
          placeholder="••••••••••"
          value={password}
          onChange={setPassword}
        />

        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={setRememberMe}
            />
            <Label
              htmlFor="remember-me"
              className="text-xs font-normal text-hero-muted"
            >
              Remember me
            </Label>
          </div>
          <Link
            href="#"
            className="text-xs font-medium underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error ? (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={pending}
          className="h-12 w-full gap-2 rounded-md bg-ink text-sm text-paper hover:bg-ink/90"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          Sign in
          {!pending ? (
            <ArrowRight className="size-4" aria-hidden="true" />
          ) : null}
        </Button>
      </form>

      <p className="mt-7 text-sm">
        New to SalonBook?{" "}
        <Link
          href="/sign-up"
          className="font-medium underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}

export { SignInForm }
