import { ProfileForm } from "@/components/profile/profile-form"
import { getServerSession } from "@/lib/auth-guard"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "My profile - SalonBook",
  description: "Update your SalonBook profile information.",
}

export default async function CustomerProfilePage() {
  const session = await getServerSession()

  const user = session?.user

  return (
    <div>
      <div className="border-b pb-8">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Customer dashboard
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
          My profile
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Keep your contact details up to date so the salon can reach you.
        </p>
      </div>

      <div className="mt-8">
        {user ? (
          <ProfileForm
            user={{
              name: user.name ?? "",
              email: user.email ?? "",
              image: (user as { image?: string | null }).image ?? null,
              phone: (user as { phone?: string | null }).phone ?? null,
              role: user.role ?? "user",
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
