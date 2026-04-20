import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Role-based route protection with real JWT verification at the edge.
// Uses getToken() which handles JWE decryption using NEXTAUTH_SECRET.
// Server components still re-verify via requireCapability() for defense-in-depth.

const roleRules: { prefix: string; allowedRoles: string[] }[] = [
  { prefix: "/admin", allowedRoles: ["ADMIN"] },
  { prefix: "/doctor", allowedRoles: ["DOCTOR", "ADMIN"] },
  { prefix: "/affiliate", allowedRoles: ["AFFILIATE", "ADMIN"] },
  { prefix: "/sponsor", allowedRoles: ["PAYER", "ADMIN"] },
  { prefix: "/member", allowedRoles: ["BENEFICIARY", "PAYER", "ADMIN"] },
];

const dashboardForRole: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  DOCTOR: "/doctor/patient-care",
  AFFILIATE: "/affiliate/dashboard",
  PAYER: "/member/dashboard",
  BENEFICIARY: "/member/dashboard",
};

// Exact-segment match: /doctor matches /doctor and /doctor/* but NOT /doctor-apply.
function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const rule = roleRules.find((r) => matchesPrefix(pathname, r.prefix));
  if (!rule) return NextResponse.next();

  // getToken handles both JWE (encrypted, default in v5) and JWS tokens.
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // NextAuth v5 uses "authjs" cookie name by default.
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token) {
    const url = new URL("/auth/signin", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const role = typeof token.role === "string" ? token.role : null;

  if (!role || !rule.allowedRoles.includes(role)) {
    // Authenticated but wrong role. Bounce to their own dashboard or signin.
    const target = role ? dashboardForRole[role] : "/auth/signin";
    return NextResponse.redirect(new URL(target ?? "/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
