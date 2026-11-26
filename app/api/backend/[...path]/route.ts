import { NextResponse, type NextRequest } from "next/server"

export const dynamic = "force-dynamic"

/**
 * Same-origin proxy to the Express API.
 *
 * Browser code calls `/api/backend/...` instead of the Express origin, so the
 * app works from localhost, 127.0.0.1 and LAN addresses without any CORS
 * negotiation. The bearer token and request body are forwarded unchanged.
 */
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
  /\/+$/,
  ""
)

async function forward(request: NextRequest, path: string[]) {
  const target = `${API_URL}/${path.join("/")}${request.nextUrl.search}`

  const headers = new Headers()
  const authorization = request.headers.get("authorization")
  const contentType = request.headers.get("content-type")

  if (authorization) headers.set("Authorization", authorization)
  if (contentType) headers.set("Content-Type", contentType)

  const method = request.method
  let body: ArrayBuffer | undefined

  if (method !== "GET" && method !== "HEAD") {
    body = await request.arrayBuffer()
    // Strip a content-length mismatch introduced by re-reading the stream.
    headers.delete("content-length")
  }

  let upstream: Response

  try {
    upstream = await fetch(target, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the API server." },
      { status: 502 }
    )
  }

  const responseHeaders = new Headers()
  const upstreamType = upstream.headers.get("content-type")
  if (upstreamType) responseHeaders.set("Content-Type", upstreamType)

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  })
}

type Context = { params: Promise<{ path: string[] }> }

async function handler(request: NextRequest, context: Context) {
  const { path } = await context.params
  return forward(request, path)
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
}
