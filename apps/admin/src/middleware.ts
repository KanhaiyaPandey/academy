import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

// Pages employees are allowed to visit
const EMPLOYEE_ALLOWED_PREFIXES = [
  "/dashboard/students",
  "/dashboard/fees",
  "/dashboard/leaves",
];
const EMPLOYEE_EXACT_ALLOWED = ["/dashboard"];

// Decode base64url payload without HMAC — edge-safe, used only for routing.
// API routes perform the full cryptographic check.
function decodeSessionRole(token: string): "admin" | "employee" | null {
  try {
    const dot = token.lastIndexOf(".");
    if (dot === -1) return null;
    const b64url = token.slice(0, dot);
    const base64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const payload = JSON.parse(json);
    if (payload.exp < Date.now()) return null;
    return payload.role === "admin" || payload.role === "employee" ? payload.role : null;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookie = req.cookies.get(SESSION_COOKIE);
  const role = cookie?.value ? decodeSessionRole(cookie.value) : null;
  const isLoggedIn = role !== null;

  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isLoggedIn && role === "employee" && pathname.startsWith("/dashboard")) {
    const allowed =
      EMPLOYEE_EXACT_ALLOWED.includes(pathname) ||
      EMPLOYEE_ALLOWED_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
      );
    if (!allowed) {
      return NextResponse.redirect(new URL("/dashboard/students", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/"],
};
