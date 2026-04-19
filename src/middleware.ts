import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware — Admin Route Protection
 * =====================================
 * Protects /admin route by checking for an auth session cookie.
 * 
 * NOTE: Full Firebase Auth verification requires a server-side
 * Admin SDK (Firebase Admin). For now, this checks for the
 * presence of a session cookie set during login. The admin
 * page itself also performs a client-side role check.
 * 
 * When Firebase Auth is fully connected:
 * 1. After login, set a session cookie with the user's role
 * 2. This middleware reads that cookie and verifies the role
 * 3. Non-admin/manager users are redirected to "/"
 */

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes
    if (pathname.startsWith("/admin")) {
        const sessionCookie = request.cookies.get("ttc_session");

        if (!sessionCookie?.value) {
            // No session — redirect to login
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }

        try {
            // Parse session data (JSON encoded role info)
            const session = JSON.parse(decodeURIComponent(sessionCookie.value));

            // Check role
            if (session.role !== "admin" && session.role !== "manager" && session.role !== "super_manager") {
                // Insufficient permissions — redirect to home
                return NextResponse.redirect(new URL("/", request.url));
            }
        } catch {
            // Invalid session cookie — redirect to login
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
