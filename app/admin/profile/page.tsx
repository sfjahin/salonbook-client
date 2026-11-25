import { ProfileForm } from "@/components/profile/profile-form"
import { requireAdmin } from "@/lib/auth-guard"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "My profile - SalonBook Admin",
  description: "Update your SalonBook administrator profile.",
}

export default async function AdminProfilePage() {
  const session = await requireAdmin()
  const user = session.user

  return (
    <div>
      <div className="border-b pb-8">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Administration
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
          My profile
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Your administrator account details.
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
              role: user.role ?? "admin",
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
