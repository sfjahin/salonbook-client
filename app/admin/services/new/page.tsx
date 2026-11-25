import { ServiceForm } from "@/components/admin/service-form"
import { requireAdmin } from "@/lib/auth-guard"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Add service - SalonBook Admin",
  description: "Create a new SalonBook service.",
}

export default async function NewServicePage() {
  await requireAdmin()

  return (
    <div>
      <div className="border-b pb-8">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Administration
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
          Add a service
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          New services start as active and appear on the public browse page
          straight away.
        </p>
      </div>

      <div className="mt-8">
        <ServiceForm />
      </div>
    </div>
  )
}
