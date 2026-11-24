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
import { signUp } from "@/lib/auth-client"

function SignUpForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (password.length < 8 || !/\d/.test(password)) {
      setError("Use at least 8 characters, including a number.")
      return
    }

    if (!acceptedTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.")
      return
    }

    setPending(true)

    try {
      const { data, error } = await signUp.email({
        name,
        email,
        password,
        phone,
      })

      if (error) {
        setError(
          error.message ?? "We couldn't create your account. Please try again."
        )
        setPending(false)
        return
      }

      console.log("[sign-up] success:", {
        id: data?.user?.id,
        name: data?.user?.name,
        email: data?.user?.email,
        phone: (data?.user as { phone?: string } | undefined)?.phone,
      })

      router.push("/dashboard")
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
          <Label htmlFor="full-name" className="text-xs font-medium">
            Full name
          </Label>
          <Input
            id="full-name"
            name="name"
            autoComplete="name"
            placeholder="Olivia Martin"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="mt-2 h-11 rounded-md bg-background text-sm"
          />
        </div>

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

        <div>
          <Label htmlFor="phone" className="text-xs font-medium">
            Phone number
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 (718) 555-0128"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-2 h-11 rounded-md bg-background text-sm"
          />
        </div>

        <PasswordField
          id="password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          helper="Use 8+ characters, including a number."
          value={password}
          onChange={setPassword}
        />

        <div className="flex items-start gap-2 pt-1">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={setAcceptedTerms}
            className="mt-0.5"
          />
          <Label
            htmlFor="terms"
            className="text-[0.7rem] leading-relaxed font-normal text-hero-muted"
          >
            I agree to the{" "}
            <Link href="#" className="underline underline-offset-2">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </Label>
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
          Create account
          {!pending ? (
            <ArrowRight className="size-4" aria-hidden="true" />
          ) : null}
        </Button>
      </form>

      <p className="mt-7 text-sm">
        Already part of SalonBook?{" "}
        <Link
          href="/sign-in"
          className="font-medium underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export { SignUpForm }
