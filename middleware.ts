import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({ req, res })

    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if the request is for an admin route
    const isAdminRoute =
      req.nextUrl.pathname.startsWith("/admin") &&
      !req.nextUrl.pathname.startsWith("/admin/login") &&
      !req.nextUrl.pathname.startsWith("/admin/setup-admin")

    const isLoginPage = req.nextUrl.pathname === "/admin/login"

    // If accessing admin routes without a session, redirect to login
    if (isAdminRoute && !session) {
      const redirectUrl = new URL("/admin/login", req.url)
      redirectUrl.searchParams.set("from", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If accessing login page with a valid session, redirect to dashboard
    if (isLoginPage && session) {
      const redirectUrl = new URL("/admin/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if session is about to expire
    if (isAdminRoute && session) {
      const expiresAt = session.expires_at
      const now = Math.floor(Date.now() / 1000)

      // If session is about to expire in the next 5 minutes, refresh it
      if (expiresAt && expiresAt - now < 300) {
        await supabase.auth.refreshSession()
      }
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    // Return the original response if there's an error
    return res
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}

