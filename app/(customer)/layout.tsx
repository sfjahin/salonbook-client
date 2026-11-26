import Link from "next/link"
import { ArrowUpRight, Sparkles } from "lucide-react"

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
      role="Customer"
      promo={
        <div className="rounded-xl bg-sand p-4 text-hero-foreground">
          <Sparkles className="size-5" aria-hidden="true" />
          <p className="mt-3 font-serif text-lg leading-snug tracking-tight">
            Need a little time for you?
          </p>
          <p className="mt-1 text-xs text-hero-foreground/70">
            Browse treatments and request your next visit.
          </p>
          <Link
            href="/services"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium underline-offset-4 hover:underline"
          >
            Book a service
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      }
      sidebarFooter={
        <SignOutButton className="w-full justify-start px-3 text-muted-foreground hover:text-foreground" />
      }
    >
      {children}
    </DashboardShell>
  )
}
