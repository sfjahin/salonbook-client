/**
 * Small typed fetch wrapper around the SalonBook Express API.
 *
 * Every request carries a short-lived JWT obtained from /api/token, which is
 * minted from the current Better Auth session. A 401 refreshes the token once
 * before giving up, so an expired token never strands the user.
 */

/** Tokens live for 1 hour; refresh a little before they expire. */
const TOKEN_TTL_MS = 45 * 60 * 1000

type CachedToken = { value: string; storedAt: number }

/**
 * The token is cached in memory only. Persisting it in sessionStorage caused
 * a previously signed-in account's token to leak into a new session, so a
 * fresh token is always minted after a reload or sign-in.
 */
let memoryToken: CachedToken | null = null

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

function readStoredToken(): CachedToken | null {
  if (!memoryToken) return null

  if (Date.now() - memoryToken.storedAt > TOKEN_TTL_MS) {
    memoryToken = null
    return null
  }

  return memoryToken
}

function storeToken(value: string) {
  memoryToken = { value, storedAt: Date.now() }
}

export function clearToken() {
  memoryToken = null
}

async function fetchToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/token", { credentials: "include" })
    if (!response.ok) return null

    const data = (await response.json()) as { token?: string }
    if (!data.token) return null

    storeToken(data.token)
    return data.token
  } catch {
    return null
  }
}

async function getToken(): Promise<string | null> {
  return readStoredToken()?.value ?? (await fetchToken())
}

export type ApiOptions = RequestInit & { retry?: boolean }

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { retry = true, headers, ...rest } = options

  const requestHeaders = new Headers(headers)
  const token = await getToken()

  if (token) requestHeaders.set("Authorization", `Bearer ${token}`)

  const isForm = rest.body instanceof FormData
  if (rest.body && !isForm && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json")
  }

  let response: Response

  try {
    response = await fetch(`/api/backend${path}`, {
      ...rest,
      headers: requestHeaders,
      credentials: "include",
    })
  } catch {
    throw new ApiError("Could not reach the server. Check your connection.", 0)
  }

  if (response.status === 401 && retry) {
    clearToken()
    const refreshed = await fetchToken()

    if (refreshed) {
      return apiFetch<T>(path, { ...options, retry: false })
    }

    throw new ApiError("Your session expired. Please sign in again.", 401)
  }

  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  const payload = data as
    | { success?: boolean; message?: string; error?: string }
    | null

  if (!response.ok || payload?.success === false) {
    throw new ApiError(
      payload?.message ||
        payload?.error ||
        `Request failed with status ${response.status}.`,
      response.status
    )
  }

  return data as T
}

export const api = {
  get: <T = unknown>(path: string, options?: ApiOptions) =>
    apiFetch<T>(path, { ...options, method: "GET" }),

  post: <T = unknown>(path: string, body?: unknown, options?: ApiOptions) =>
    apiFetch<T>(path, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),

  put: <T = unknown>(path: string, body?: unknown, options?: ApiOptions) =>
    apiFetch<T>(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body ?? {}),
    }),

  patch: <T = unknown>(path: string, body?: unknown, options?: ApiOptions) =>
    apiFetch<T>(path, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body ?? {}),
    }),

  delete: <T = unknown>(path: string, options?: ApiOptions) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
}

