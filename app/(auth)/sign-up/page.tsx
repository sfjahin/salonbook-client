import { redirect } from "next/navigation"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { getServerSession } from "@/lib/auth-guard"

export const metadata = {
  title: "Create an account — SalonBook",
  description: "A little self-care starts with your account.",
}

export default async function SignUpPage() {
  const session = await getServerSession()

  if (session) {
    redirect(session.user.role === "admin" ? "/admin" : "/dashboard")
  }

  return (
    <AuthShell
      title="Make yourself at home."
      subtitle="A little self-care starts with your account."
    >
      <SignUpForm />
    </AuthShell>
  )
}
