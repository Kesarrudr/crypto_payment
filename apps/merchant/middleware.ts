import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!req.nextauth.token;

    // Redirect root path based on authentication
    if (pathname === "/") {
      return NextResponse.redirect(
        new URL(isAuthenticated ? "/dashboard" : "/signin", req.url),
      );
    }

    // ✅ Allow unauthenticated users to visit `/signup`
    if (!isAuthenticated && pathname === "/signup") {
      return NextResponse.next();
    }

    // Prevent logged-in users from visiting auth pages
    if (isAuthenticated && (pathname === "/signin" || pathname === "/signup")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // ✅ Redirect unknown routes to `/signin`
    if (
      !["/", "/dashboard", "/signin", "/signup"].some((route) =>
        pathname.startsWith(route),
      )
    ) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/signin",
    },
  },
);

export const config = {
  matcher: ["/", "/dashboard/:path*"],
  runtime: "experimental-edge",
};
