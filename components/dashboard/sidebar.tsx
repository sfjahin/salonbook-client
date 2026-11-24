"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { Menu } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export type DashboardNavItem = {
  label: string
  href: string
  icon: LucideIcon
}

type Variant = "light" | "dark"

function NavLink({
  item,
  active,
  variant,
  onClick,
}: {
  item: DashboardNavItem
  active: boolean
  variant: Variant
  onClick?: () => void
}) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        variant === "light" &&
          (active
            ? "bg-ink text-paper"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"),
        variant === "dark" &&
          (active
            ? "bg-paper text-ink"
            : "text-paper/70 hover:bg-paper/10 hover:text-paper")
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {item.label}
    </Link>
  )
}

/** Desktop sidebar for both dashboards. */
function DashboardSidebar({
  items,
  user,
  variant = "light",
  footer,
}: {
  items: DashboardNavItem[]
  user: { name: string; email: string }
  variant?: Variant
  footer?: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "sticky top-16 hidden h-[calc(100svh-4rem)] w-64 shrink-0 flex-col border-r lg:flex",
        variant === "light" ? "bg-background" : "border-white/10 bg-ink"
      )}
    >
      <nav
        aria-label="Dashboard"
        className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
      >
        {items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            variant={variant}
            active={
              item.href === pathname ||
              (item.href !== (variant === "dark" ? "/admin" : "/dashboard") &&
                pathname.startsWith(item.href))
            }
          />
        ))}
      </nav>

      <div
        className={cn(
          "border-t p-4",
          variant === "light" ? "border-border" : "border-white/10"
        )}
      >
        <p
          className={cn(
            "truncate text-sm font-medium",
            variant === "light" ? "text-foreground" : "text-paper"
          )}
        >
          {user.name}
        </p>
        <p
          className={cn(
            "truncate text-xs",
            variant === "light"
              ? "text-muted-foreground"
              : "text-paper/60"
          )}
        >
          {user.email}
        </p>
        {footer ? <div className="mt-3">{footer}</div> : null}
      </div>
    </aside>
  )
}

/** Collapsible navigation for phones and tablets. */
function DashboardMobileNav({
  items,
  title,
  variant = "light",
  footer,
}: {
  items: DashboardNavItem[]
  title: string
  variant?: Variant
  footer?: React.ReactNode
}) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b px-4 py-3 lg:hidden",
        variant === "dark" && "border-white/10 bg-ink text-paper"
      )}
    >
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "size-9",
                variant === "dark" &&
                  "text-paper hover:bg-paper/10 hover:text-paper"
              )}
              aria-label="Open dashboard menu"
            />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>

        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader
            className={cn(
              "border-b",
              variant === "dark" && "border-white/10 bg-ink text-paper"
            )}
          >
            <SheetTitle className="font-serif text-lg tracking-tight">
              {title}
            </SheetTitle>
          </SheetHeader>

          <nav
            aria-label="Dashboard"
            className="flex flex-col gap-1 p-3"
            onClick={() => setOpen(false)}
          >
            {items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                variant="light"
                active={
                  item.href === pathname ||
                  (item.href !== (variant === "dark" ? "/admin" : "/dashboard") &&
                    pathname.startsWith(item.href))
                }
                onClick={() => setOpen(false)}
              />
            ))}
          </nav>

          {footer ? (
            <div className="border-t p-4 text-sm">{footer}</div>
          ) : null}
        </SheetContent>
      </Sheet>

      <div className="min-w-0">
        <p className="truncate font-serif text-lg tracking-tight">{title}</p>
      </div>
    </div>
  )
}

export { DashboardMobileNav, DashboardSidebar }
