import { AdminHeader } from "@/components/admin/admin-header"
import { DashboardShell } from "@/components/dashboard/shell"
import { SignOutButton } from "@/components/sign-out-button"
import { adminNav } from "@/lib/dashboard-nav"
import { requireAdmin } from "@/lib/auth-guard"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Server-side gate: no session or a non-admin role is redirected away.
  const session = await requireAdmin()

  return (
    <DashboardShell
      items={adminNav}
      user={{ name: session.user.name, email: session.user.email }}
      title="Administration"
      variant="dark"
      header={
        <AdminHeader name={session.user.name} email={session.user.email} />
      }
      sidebarFooter={
        <SignOutButton className="w-full justify-start px-3 text-paper/70 hover:bg-paper/10 hover:text-paper" />
      }
    >
      {children}
    </DashboardShell>
  )
}
