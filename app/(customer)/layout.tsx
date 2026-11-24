import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { SignOutButton } from "@/components/sign-out-button"
import { DashboardShell } from "@/components/dashboard/shell"
import { customerNav } from "@/lib/dashboard-nav"
import { requireCustomer } from "@/lib/auth-guard"

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await requireCustomer()

  return (
    <DashboardShell
      items={customerNav}
      user={{ name: session.user.name, email: session.user.email }}
      title="My dashboard"
      header={<SiteHeader />}
      footer={<SiteFooter />}
      sidebarFooter={
        <SignOutButton className="w-full justify-start px-3 text-muted-foreground hover:text-foreground" />
      }
    >
      {children}
    </DashboardShell>
  )
}
