import type { ReactNode } from "react"

import {
  DashboardMobileNav,
  DashboardSidebar,
  type DashboardNavItem,
} from "@/components/dashboard/sidebar"

type Variant = "light" | "dark"

/**
 * Shared dashboard frame: a full-height role based sidebar, a mobile top bar
 * and the main content area. The sidebar owns the logo, navigation, promo card
 * and sign-out control so both dashboards share one responsive structure.
 */
function DashboardShell({
  items,
  user,
  title,
  role,
  variant = "light",
  promo,
  sidebarFooter,
  children,
}: {
  items: DashboardNavItem[]
  user: { name: string; email: string }
  title: string
  role: string
  variant?: Variant
  promo?: ReactNode
  sidebarFooter?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-1">
      <DashboardSidebar
        items={items}
        user={user}
        variant={variant}
        role={role}
        promo={promo}
        footer={sidebarFooter}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardMobileNav
          items={items}
          user={user}
          title={title}
          variant={variant}
          role={role}
          promo={promo}
          footer={sidebarFooter}
        />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  )
}

export { DashboardShell }
