import { NextResponse, type NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

/**
 * Optimistic redirect for signed-out visitors. The authoritative role
 * checks live in the server layouts (`requireCustomer` / `requireAdmin`),
 * because a cookie existing does not prove a valid session or role.
 */
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("next", request.nextUrl.pathname)

    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
