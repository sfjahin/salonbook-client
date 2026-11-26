import Link from "next/link"
import { ArrowUpRight, Plus } from "lucide-react"

import { SignOutButton } from "@/components/sign-out-button"
import { DashboardShell } from "@/components/dashboard/shell"
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
      role="Admin"
      variant="dark"
      promo={
        <div className="rounded-xl bg-paper/10 p-4 text-paper">
          <p className="text-[0.6rem] font-medium tracking-[0.16em] text-paper/55 uppercase">
            Quick action
          </p>
          <p className="mt-2 font-serif text-lg leading-snug tracking-tight">
            Add a new treatment
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href="/admin/services/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-paper px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-paper/90"
            >
              <Plus className="size-3.5" aria-hidden="true" />
              New service
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[0.7rem] text-paper/60 underline-offset-4 hover:text-paper hover:underline"
            >
              View the site
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      }
      sidebarFooter={
        <SignOutButton className="w-full justify-start px-3 text-paper/70 hover:bg-paper/10 hover:text-paper" />
      }
    >
      {children}
    </DashboardShell>
  )
}
