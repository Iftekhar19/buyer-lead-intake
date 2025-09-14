// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("demo_token")?.value;
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/login";

  if (!token && !isLoginPage) {
    // Not logged in → force to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isLoginPage) {
    // Already logged in → prevent visiting login
    return NextResponse.redirect(new URL("/buyers?page=1", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
    "/login",
    "/buyers/new",
    "/buyers/details/:path*",
    "/buyers/edit/:path*",
    "/buyers"
  ],
};
