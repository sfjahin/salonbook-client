"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Loader2, Pencil, Power, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { Service } from "@/lib/types"
import { cn } from "@/lib/utils"

function ServiceRowActions({ service }: { service: Service }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const isActive = service.status === "active"

  async function toggleStatus() {
    setBusy(true)
    try {
      await api.patch(`/api/services/${service.id}/status`, {
        status: isActive ? "inactive" : "active",
      })
      toast.success(
        isActive ? "Service deactivated." : "Service activated."
      )
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update the service."
      )
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    setBusy(true)
    try {
      await api.delete(`/api/services/${service.id}`)
      toast.success("Service deleted.")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete the service."
      )
      setConfirming(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Link
        href={`/admin/services/${service.id}/edit`}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-9 gap-1.5 px-3 text-xs"
        )}
      >
        <Pencil className="size-3.5" aria-hidden="true" />
        Edit
      </Link>

      <Button
        type="button"
        variant="outline"
        onClick={toggleStatus}
        disabled={busy}
        className="h-9 gap-1.5 px-3 text-xs"
      >
        {busy ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Power className="size-3.5" aria-hidden="true" />
        )}
        {isActive ? "Deactivate" : "Activate"}
      </Button>

      {confirming ? (
        <>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={busy}
            className="h-9 gap-1.5 px-3 text-xs"
          >
            {busy ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : null}
            Confirm delete
          </Button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-9 px-3 text-xs text-muted-foreground"
            )}
          >
            Keep
          </button>
        </>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setConfirming(true)}
          className="h-9 gap-1.5 px-3 text-xs text-destructive hover:text-destructive"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          Delete
        </Button>
      )}
    </div>
  )
}

function ServicesTable({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="font-serif text-2xl tracking-tight">
          No services have been added yet.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Create your first service to make it bookable online.
        </p>
        <Link
          href="/admin/services/new"
          className={cn(buttonVariants(), "mt-5 h-10 px-5")}
        >
          Add a service
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[56rem] text-left text-sm">
        <thead className="border-b bg-muted/50 text-[0.7rem] tracking-[0.08em] text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">
              Service
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Category
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Price
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Duration
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-5 py-3 text-right font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {services.map((service) => (
            <tr key={service.id}>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={service.image}
                      alt={service.serviceName}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {service.serviceName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {service.description.slice(0, 60)}
                      {service.description.length > 60 ? "..." : ""}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-muted-foreground">
                {service.category}
              </td>
              <td className="px-5 py-4">
                ${Number(service.price).toFixed(2)}
              </td>
              <td className="px-5 py-4 text-muted-foreground">
                {service.duration} min
              </td>
              <td className="px-5 py-4">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-medium",
                    service.status === "active"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {service.status === "active" ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-5 py-4">
                <ServiceRowActions service={service} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { ServicesTable }
