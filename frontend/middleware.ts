import { NextRequest, NextResponse } from "next/server";

// Protected routes that require authentication
const protectedRoutes: string[] = [
  "/dashboard",
  "/dashboard/browse",
  "/dashboard/create-review",
  "/dashboard/my-reviews",
  "/dashboard/profile",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (!isProtectedRoute) {
    // Allow non-protected routes
    return NextResponse.next();
  }

  // Check for authentication token in cookies or headers
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // Redirect to login if trying to access protected route without token
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
