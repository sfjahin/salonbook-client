import { AuthShell } from "@/components/auth/auth-shell"
import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata = {
  title: "Sign in — SalonBook",
  description: "Your next good day is one sign-in away.",
}

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back."
      subtitle="Your next good day is one sign-in away."
    >
      <SignInForm />
    </AuthShell>
  )
}
