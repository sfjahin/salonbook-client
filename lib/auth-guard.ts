import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

/**
 * Reads the current Better Auth session on the server.
 */
export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() })
}

/**
 * Guards customer-only pages.
 *
 * - signed out        -> /sign-in
 * - administrator     -> /admin (admins do not use the customer area)
 */
export async function requireCustomer() {
  const session = await getServerSession()

  if (!session) {
    redirect("/sign-in?next=/dashboard")
  }

  if (session.user.role === "admin") {
    redirect("/admin")
  }

  return session
}

/**
 * Guards every administrator page.
 *
 * The role check happens on the server, so changing the URL manually
 * cannot grant access to another role's dashboard.
 *
 * - signed out        -> /sign-in
 * - regular customer  -> /dashboard
 */
export async function requireAdmin() {
  const session = await getServerSession()

  if (!session) {
    redirect("/sign-in?next=/admin")
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard")
  }

  return session
}
