import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Scissors,
  UserRound,
  Users,
} from "lucide-react"

import type { DashboardNavItem } from "@/components/dashboard/sidebar"

/** Role based navigation used by both dashboard shells. */
export const customerNav: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My appointments", href: "/dashboard/appointments", icon: CalendarDays },
  { label: "My profile", href: "/dashboard/profile", icon: UserRound },
]

export const adminNav: DashboardNavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Manage services", href: "/admin/services", icon: Scissors },
  {
    label: "Manage appointments",
    href: "/admin/appointments",
    icon: CalendarDays,
  },
  { label: "Manage users", href: "/admin/users", icon: Users },
  { label: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { label: "My profile", href: "/admin/profile", icon: UserRound },
]
