import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./utils/jwt";

const AUTH_PAGES = [
  "/auth/login",
  "/auth/signup",
  "/auth/account-setup",
  "/auth/forgot-password",
  "/auth/new-password",
];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  // Helper: check if path starts with any in list
  const matches = (patterns: string[]) =>
    patterns.some((p) => path === p || path.startsWith(p + "/"));

  let userRole: string | undefined;
  if (token) {
    try {
      const verified = await verifyJWT(token);
      userRole = verified?.role;
      console.count(userRole?.toUpperCase());
      // Block access to auth pages if logged in
      if (matches(AUTH_PAGES)) {
        return NextResponse.redirect(new URL("/profile", req.url));
      }
      // Admin-only protection
      if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
        if (userRole !== "admin") {
          return NextResponse.redirect(new URL("/profile", req.url));
        }
      }

      // Merchant-only protection
      if (path.startsWith("/merchant") || path.startsWith("/api/merchant")) {
        if (userRole !== "merchant" && userRole !== "admin") {
          return NextResponse.redirect(new URL("/profile", req.url));
        }
        // For merchants, check if their profile is verified
        if (userRole === "merchant") {
          const merchantVerified = verified?.merchantVerified;

          if (!merchantVerified) {
            return NextResponse.redirect(
              new URL("/check-merchant-verification", req.url)
            );
          }
        }
      }
      // All other authenticated routes: allow
      return NextResponse.next();
    } catch (e) {
      // Invalid/expired token, treat as unauthenticated
    }
  }

  // If not authenticated, block access to protected pages
  const isProtected =
    path.startsWith("/u") ||
    path.startsWith("/verify-email") ||
    path.startsWith("/profile") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/admin") ||
    path.startsWith("/merchant") ||
    path.startsWith("/api/admin") ||
    path.startsWith("/api/merchant");

  if (!token && isProtected) {
    const redirectUrl = new URL("/auth/login", req.url);
    redirectUrl.searchParams.set("from", path);
    return NextResponse.redirect(redirectUrl);
  }

  // Allow access to everything else
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
