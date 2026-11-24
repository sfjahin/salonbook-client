import { redirect } from "next/navigation"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignInForm } from "@/components/auth/sign-in-form"
import { getServerSession } from "@/lib/auth-guard"

export const metadata = {
  title: "Sign in — SalonBook",
  description: "Your next good day is one sign-in away.",
}

export default async function SignInPage() {
  const session = await getServerSession()

  if (session) {
    redirect(session.user.role === "admin" ? "/admin" : "/dashboard")
  }

  return (
    <AuthShell
      title="Welcome back."
      subtitle="Your next good day is one sign-in away."
    >
      <SignInForm />
    </AuthShell>
  )
}
