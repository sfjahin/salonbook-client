import { AdminHeader } from "@/components/admin/admin-header"
import { requireAdmin } from "@/lib/auth-guard"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Server-side gate: no session or a non-admin role is redirected away.
  const session = await requireAdmin()

  return (
    <div className="flex min-h-svh flex-col bg-muted/20">
      <AdminHeader name={session.user.name} email={session.user.email} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
