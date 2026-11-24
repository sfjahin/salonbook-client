import type { ReactNode } from "react"

import {
  DashboardMobileNav,
  DashboardSidebar,
  type DashboardNavItem,
} from "@/components/dashboard/sidebar"

type Variant = "light" | "dark"

/**
 * Shared dashboard frame: existing site header, a role based sidebar, the
 * main content area and the site footer. Collapses into a sheet on mobile.
 */
function DashboardShell({
  items,
  user,
  title,
  variant = "light",
  header,
  footer,
  sidebarFooter,
  children,
}: {
  items: DashboardNavItem[]
  user: { name: string; email: string }
  title: string
  variant?: Variant
  header: ReactNode
  footer?: ReactNode
  sidebarFooter?: ReactNode
  children: ReactNode
}) {
  return (
    <>
      {header}

      <div className="flex flex-1">
        <DashboardSidebar
          items={items}
          user={user}
          variant={variant}
          footer={sidebarFooter}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardMobileNav
            items={items}
            title={title}
            variant={variant}
            footer={sidebarFooter}
          />

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            {children}
          </main>
        </div>
      </div>

      {footer}
    </>
  )
}

export { DashboardShell }
