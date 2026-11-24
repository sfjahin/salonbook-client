import { NextResponse } from "next/server"
import { SignJWT } from "jose"

import { getServerSession } from "@/lib/auth-guard"

export const dynamic = "force-dynamic"

/**
 * Exchanges a Better Auth session for a short-lived JWT that the Express
 * API verifies. The secret never leaves the server.
 */
export async function GET() {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      return NextResponse.json(
        { error: "The API token is not configured." },
        { status: 500 }
      )
    }

    const token = await new SignJWT({
      role: session.user.role,
      email: session.user.email,
      name: session.user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(session.user.id)
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN ?? "1h")
      .sign(new TextEncoder().encode(secret))

    return NextResponse.json({ token })
  } catch (error) {
    console.error("[token] failed to issue API token:", error)
    return NextResponse.json(
      { error: "Could not create an API token." },
      { status: 500 }
    )
  }
}
