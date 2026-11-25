import type { DashboardNavItem } from "@/components/dashboard/sidebar"

/** Role based navigation used by both dashboard shells. */
export const customerNav: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "overview" },
  {
    label: "My appointments",
    href: "/dashboard/appointments",
    icon: "appointments",
  },
  { label: "My profile", href: "/dashboard/profile", icon: "profile" },
]

export const adminNav: DashboardNavItem[] = [
  { label: "Overview", href: "/admin", icon: "overview" },
  { label: "Manage services", href: "/admin/services", icon: "services" },
  {
    label: "Manage appointments",
    href: "/admin/appointments",
    icon: "appointments",
  },
  { label: "Manage users", href: "/admin/users", icon: "users" },
  { label: "Transactions", href: "/admin/transactions", icon: "transactions" },
  { label: "My profile", href: "/admin/profile", icon: "profile" },
]
