"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { SERVICE_CATEGORIES } from "@/lib/categories"
import type { Service } from "@/lib/types"

function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const isEditing = Boolean(service)

  const [serviceName, setName] = useState(service?.serviceName ?? "")
  const [category, setCategory] = useState(
    service?.category ?? SERVICE_CATEGORIES[0]
  )
  const [description, setDescription] = useState(service?.description ?? "")
  const [price, setPrice] = useState(service ? String(service.price) : "")
  const [duration, setDuration] = useState(
    service ? String(service.duration) : ""
  )
  const [image, setImage] = useState(service?.image ?? "")
  const [status, setStatus] = useState<Service["status"]>(
    service?.status ?? "active"
  )

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.")
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Images must be smaller than 8 MB.")
      return
    }

    setUploading(true)
    try {
      const form = new FormData()
      form.append("image", file)

      const data = await api.post<{ url: string }>("/api/upload", form)
      setImage(data.url)
      toast.success("Image uploaded.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "The upload failed."
      )
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (Number(price) <= 0) {
      toast.error("Price must be a positive number.")
      return
    }
    if (Number(duration) <= 0) {
      toast.error("Duration must be a positive number.")
      return
    }
    if (!image.trim()) {
      toast.error("Please upload a service image.")
      return
    }

    setSaving(true)

    try {
      const payload = {
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        duration: Number(duration),
        image: image.trim(),
        status,
      }

      if (isEditing && service) {
        await api.put(`/api/services/${service.id}`, payload)
        toast.success("Service updated.")
      } else {
        await api.post("/api/services", payload)
        toast.success("Service created.")
      }

      router.push("/admin/services")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save the service."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="service-name" className="text-xs font-medium">
              Service name
            </Label>
            <Input
              id="service-name"
              value={serviceName}
              onChange={(event) => setName(event.target.value)}
              placeholder="Signature haircut"
              required
              className="mt-2 h-11 rounded-md bg-background text-sm"
            />
          </div>

          <div>
            <Label htmlFor="service-category" className="text-xs font-medium">
              Service category
            </Label>
            <select
              id="service-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {SERVICE_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="service-status" className="text-xs font-medium">
              Service status
            </Label>
            <select
              id="service-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as Service["status"])
              }
              className="mt-2 flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <Label htmlFor="service-price" className="text-xs font-medium">
              Price (USD)
            </Label>
            <Input
              id="service-price"
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="45"
              required
              className="mt-2 h-11 rounded-md bg-background text-sm"
            />
          </div>

          <div>
            <Label htmlFor="service-duration" className="text-xs font-medium">
              Estimated duration (minutes)
            </Label>
            <Input
              id="service-duration"
              type="number"
              min="1"
              step="1"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              placeholder="45"
              required
              className="mt-2 h-11 rounded-md bg-background text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="service-description" className="text-xs font-medium">
              Description
            </Label>
            <textarea
              id="service-description"
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What does this service include?"
              required
              className="mt-2 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-serif text-xl tracking-tight">Service image</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Upload a photo that represents this treatment.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-5">
          <div className="relative aspect-[4/3] w-40 overflow-hidden rounded-lg bg-muted">
            {image ? (
              <Image
                src={image}
                alt={serviceName || "Service"}
                fill
                sizes="160px"
                className="object-cover"
              />
            ) : null}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void handleUpload(file)
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="h-10 gap-2 px-4"
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Upload className="size-4" aria-hidden="true" />
            )}
            {uploading ? "Uploading..." : "Upload image"}
          </Button>
        </div>

        <div className="mt-5">
          <Label htmlFor="service-image-url" className="text-xs font-medium">
            Or paste an image URL
          </Label>
          <Input
            id="service-image-url"
            type="url"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            placeholder="https://..."
            className="mt-2 h-11 rounded-md bg-background text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={saving || uploading}
          className="h-11 gap-2 px-6"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          {saving
            ? "Saving..."
            : isEditing
              ? "Update service"
              : "Create service"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-11 px-6"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export { ServiceForm }
