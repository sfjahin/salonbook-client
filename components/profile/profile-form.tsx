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
import { authClient } from "@/lib/auth-client"

type ProfileUser = {
  name: string
  email: string
  image?: string | null
  phone?: string | null
  role: string
}

function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone ?? "")
  const [image, setImage] = useState(user.image ?? "")
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

    if (!name.trim()) {
      toast.error("Please enter your name.")
      return
    }

    setSaving(true)
    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        phone: phone.trim(),
        image: image.trim(),
      })

      if (error) {
        throw new Error(error.message ?? "Could not update your profile.")
      }

      toast.success("Your profile has been updated.")
      router.refresh()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update your profile."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <section className="rounded-xl border bg-card p-6">
        <h2 className="font-serif text-xl tracking-tight">Profile image</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          A clear photo helps the salon recognise you.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-5">
          <div className="relative size-20 overflow-hidden rounded-full bg-muted">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
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
        </div>

        <div className="mt-5">
          <Label htmlFor="profile-image-url" className="text-xs font-medium">
            Or paste an image URL
          </Label>
          <Input
            id="profile-image-url"
            type="url"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            placeholder="https://..."
            className="mt-2 h-11 rounded-md bg-background text-sm"
          />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="font-serif text-xl tracking-tight">Account details</h2>

        <div className="mt-5 space-y-5">
          <div>
            <Label htmlFor="profile-name" className="text-xs font-medium">
              Full name
            </Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-2 h-11 rounded-md bg-background text-sm"
            />
          </div>

          <div>
            <Label htmlFor="profile-email" className="text-xs font-medium">
              Email address
            </Label>
            <Input
              id="profile-email"
              value={user.email}
              readOnly
              disabled
              className="mt-2 h-11 rounded-md bg-background text-sm"
            />
            <p className="mt-1.5 text-[0.7rem] text-muted-foreground">
              Your email cannot be changed here.
            </p>
          </div>

          <div>
            <Label htmlFor="profile-phone" className="text-xs font-medium">
              Phone number
            </Label>
            <Input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+1 (718) 555-0128"
              className="mt-2 h-11 rounded-md bg-background text-sm"
            />
          </div>

          <div className="rounded-lg bg-muted/60 p-4 text-xs text-muted-foreground">
            Your role and account status are managed by the salon and cannot be
            changed from this page.
          </div>
        </div>

        <Button
          type="submit"
          disabled={saving || uploading}
          className="mt-6 h-11 gap-2 px-6"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </section>
    </form>
  )
}

export { ProfileForm }
