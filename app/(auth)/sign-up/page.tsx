import { AuthShell } from "@/components/auth/auth-shell"
import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata = {
  title: "Create an account — SalonBook",
  description: "A little self-care starts with your account.",
}

export default function SignUpPage() {
  return (
    <AuthShell
      title="Make yourself at home."
      subtitle="A little self-care starts with your account."
    >
      <SignUpForm />
    </AuthShell>
  )
}
