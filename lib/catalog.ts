import type {
  AdminStats,
  AdminUser,
  Appointment,
  CustomerStats,
  Service,
  ServiceCategory,
  Transaction,
} from "@/lib/types"

/**
 * Server-side access to the Express API.
 *
 * These helpers are only called from React Server Components, so the API URL
 * stays on the server and no CORS preflight is involved.
 */

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
  /\/+$/,
  ""
)

export class CatalogError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "CatalogError"
    this.status = status
  }
}

type RequestOptions = {
  token?: string
  cache?: RequestCache
}

async function request<T>(
  path: string,
  { token, cache = "no-store" }: RequestOptions = {}
): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_URL}${path}`, {
      cache,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  } catch {
    throw new CatalogError("Could not reach the server.", 503)
  }

  const data = (await response.json().catch(() => null)) as
    | { success?: boolean; message?: string }
    | null

  if (!response.ok || data?.success === false) {
    throw new CatalogError(
      data?.message || `Request failed with status ${response.status}.`,
      response.status
    )
  }

  return data as T
}

type ServiceQuery = {
  q?: string
  category?: string
  sort?: string
  featured?: boolean
  all?: boolean
}

export async function fetchServices(query: ServiceQuery = {}) {
  const params = new URLSearchParams()

  if (query.q) params.set("q", query.q)
  if (query.category && query.category !== "all") {
    params.set("category", query.category)
  }
  if (query.sort) params.set("sort", query.sort)
  if (query.featured) params.set("featured", "true")
  if (query.all) params.set("all", "true")

  const suffix = params.size > 0 ? `?${params.toString()}` : ""

  try {
    const data = await request<{ services: Service[] }>(`/api/services${suffix}`)
    return data.services
  } catch {
    return []
  }
}

export async function fetchService(id: string, token?: string) {
  return request<{ service: Service }>(`/api/services/${id}`, { token }).then(
    (data) => data.service
  )
}

export async function fetchCategories(): Promise<ServiceCategory[]> {
  try {
    const data = await request<{ categories: ServiceCategory[] }>(
      "/api/services/categories"
    )
    return data.categories
  } catch {
    return []
  }
}

export async function fetchMyAppointments(token: string) {
  const data = await request<{ appointments: Appointment[] }>(
    "/api/appointments/mine",
    { token }
  )
  return data.appointments
}

export async function fetchAllAppointments(token: string, status?: string) {
  const suffix = status ? `?status=${encodeURIComponent(status)}` : ""
  const data = await request<{ appointments: Appointment[] }>(
    `/api/appointments${suffix}`,
    { token }
  )
  return data.appointments
}

export async function fetchMyTransactions(token: string) {
  const data = await request<{ transactions: Transaction[] }>(
    "/api/transactions/mine",
    { token }
  )
  return data.transactions
}

export async function fetchAllTransactions(token: string) {
  const data = await request<{ transactions: Transaction[] }>(
    "/api/transactions",
    { token }
  )
  return data.transactions
}

export async function fetchUsers(token: string) {
  const data = await request<{ users: AdminUser[] }>("/api/users", { token })
  return data.users
}

export async function fetchAdminStats(token: string) {
  const data = await request<{ stats: AdminStats }>("/api/stats/admin", {
    token,
  })
  return data.stats
}

export async function fetchCustomerStats(token: string) {
  const data = await request<{ stats: CustomerStats }>("/api/stats/customer", {
    token,
  })
  return data.stats
}

/**
 * Server components call the API with the same bearer token the browser
 * uses, so protected data stays protected.
 */
export async function createServerToken() {
  const secret = process.env.JWT_SECRET
  if (!secret) return null

  const { SignJWT } = await import("jose")

  try {
    const { auth } = await import("@/lib/auth")
    const { headers } = await import("next/headers")
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) return null

    return await new SignJWT({
      role: session.user.role,
      email: session.user.email,
      name: session.user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(session.user.id)
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN ?? "1h")
      .sign(new TextEncoder().encode(secret))
  } catch {
    return null
  }
}

export { API_URL }
