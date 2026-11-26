"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Menu,
  Scissors,
  UserRound,
  Users,
} from "lucide-react"

import logo from "@/app/images/SalonBook.png"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

/**
 * Icons are referenced by a stable string key instead of passing component
 * functions from a server layout into this client component. React cannot
 * serialise functions across that boundary.
 */
const navIcons = {
  overview: LayoutDashboard,
  appointments: CalendarDays,
  profile: UserRound,
  services: Scissors,
  users: Users,
  transactions: CreditCard,
} as const

export type DashboardNavIcon = keyof typeof navIcons

export type DashboardNavItem = {
  label: string
  href: string
  icon: DashboardNavIcon
}

type Variant = "light" | "dark"

function isActive(pathname: string, item: DashboardNavItem, variant: Variant) {
  const root = variant === "dark" ? "/admin" : "/dashboard"
  return item.href === pathname || (item.href !== root && pathname.startsWith(item.href))
}

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
  const Icon = navIcons[item.icon]

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        variant === "light" &&
          (active
            ? "bg-ink text-paper shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"),
        variant === "dark" &&
          (active
            ? "bg-paper text-ink shadow-sm"
            : "text-paper/65 hover:bg-paper/10 hover:text-paper")
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{item.label}</span>
    </Link>
  )
}

function Brand({ variant, role }: { variant: Variant; role: string }) {
  return (
    <Link
      href={variant === "dark" ? "/admin" : "/dashboard"}
      className="flex items-center gap-2 px-1"
    >
      <Image
        src={logo}
        alt="SalonBook"
        className={cn(
          "h-6 w-auto",
          variant === "dark" ? "brightness-0 invert" : "dark:invert"
        )}
        preload
      />
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-[0.55rem] font-medium tracking-[0.14em] uppercase",
          variant === "dark"
            ? "bg-paper/15 text-paper"
            : "bg-sand text-hero-foreground"
        )}
      >
        {role}
      </span>
    </Link>
  )
}

function SidebarBody({
  items,
  user,
  variant,
  role,
  promo,
  footer,
  onNavigate,
}: {
  items: DashboardNavItem[]
  user: { name: string; email: string }
  variant: Variant
  role: string
  promo?: React.ReactNode
  footer?: React.ReactNode
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b px-4",
          variant === "dark" ? "border-white/10" : "border-border"
        )}
      >
        <Brand variant={variant} role={role} />
      </div>

      <nav
        aria-label="Dashboard"
        className="flex flex-1 flex-col gap-1 overflow-y-auto p-3"
      >
        {items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            variant={variant}
            active={isActive(pathname, item, variant)}
            onClick={onNavigate}
          />
        ))}

        {promo ? <div className="mt-auto pt-3">{promo}</div> : null}
      </nav>

      <div
        className={cn(
          "shrink-0 border-t p-4",
          variant === "dark" ? "border-white/10" : "border-border"
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium uppercase",
              variant === "dark"
                ? "bg-paper/15 text-paper"
                : "bg-muted text-foreground"
            )}
          >
            {user.name.slice(0, 1) || "U"}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "truncate text-sm font-medium",
                variant === "dark" ? "text-paper" : "text-foreground"
              )}
            >
              {user.name}
            </p>
            <p
              className={cn(
                "truncate text-xs",
                variant === "dark" ? "text-paper/55" : "text-muted-foreground"
              )}
            >
              {user.email}
            </p>
          </div>
        </div>
        {footer ? <div className="mt-3">{footer}</div> : null}
      </div>
    </div>
  )
}

/** Desktop sidebar for both dashboards. */
function DashboardSidebar({
  items,
  user,
  variant = "light",
  role,
  promo,
  footer,
}: {
  items: DashboardNavItem[]
  user: { name: string; email: string }
  variant?: Variant
  role: string
  promo?: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r lg:flex",
        variant === "light" ? "bg-background" : "border-white/10 bg-ink"
      )}
    >
      <SidebarBody
        items={items}
        user={user}
        variant={variant}
        role={role}
        promo={promo}
        footer={footer}
      />
    </aside>
  )
}

/** Collapsible navigation for phones and tablets. */
function DashboardMobileNav({
  items,
  user,
  title,
  variant = "light",
  role,
  promo,
  footer,
}: {
  items: DashboardNavItem[]
  user: { name: string; email: string }
  title: string
  variant?: Variant
  role: string
  promo?: React.ReactNode
  footer?: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center gap-3 border-b px-4 lg:hidden",
        variant === "dark"
          ? "border-white/10 bg-ink text-paper"
          : "bg-background/90 text-foreground backdrop-blur"
      )}
    >
      <Brand variant={variant} role={role} />

      <div className="ml-auto flex items-center gap-2">
        <p
          className={cn(
            "hidden text-sm sm:block",
            variant === "dark" ? "text-paper/70" : "text-muted-foreground"
          )}
        >
          {title}
        </p>

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
            <SheetHeader className="sr-only">
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>

            <SidebarBody
              items={items}
              user={user}
              variant="light"
              role={role}
              promo={promo}
              footer={footer}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export { DashboardMobileNav, DashboardSidebar }
