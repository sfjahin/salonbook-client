import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { ServiceForm } from "@/components/admin/service-form"
import { requireAdmin } from "@/lib/auth-guard"
import { fetchService } from "@/lib/catalog"

export const dynamic = "force-dynamic"

export async function generateMetadata(
  props: PageProps<"/admin/services/[id]/edit">
): Promise<Metadata> {
  const { id } = await props.params

  try {
    const service = await fetchService(id)
    return { title: `Edit ${service.serviceName} — SalonBook Admin` }
  } catch {
    return { title: "Edit service — SalonBook Admin" }
  }
}

export default async function EditServicePage(
  props: PageProps<"/admin/services/[id]/edit">
) {
  await requireAdmin()

  const { id } = await props.params

  let service
  try {
    service = await fetchService(id)
  } catch (error) {
    const status = (error as { status?: number }).status
    if (status === 400 || status === 404) notFound()
    throw error
  }

  return (
    <div>
      <Link
        href="/admin/services"
        className="flex w-fit items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to services
      </Link>

      <div className="mt-6 border-b pb-8">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Administration
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
          Update service
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Changes are visible on the public browse page immediately.
        </p>
      </div>

      <div className="mt-8">
        <ServiceForm service={service} />
      </div>
    </div>
  )
}
