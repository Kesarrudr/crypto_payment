import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!req.nextauth.token; // Check if user is logged in

    // 🚀 Redirect unauthenticated users from "/" to "/signin"
    if (pathname === "/") {
      return NextResponse.redirect(
        new URL(isAuthenticated ? "/dashboard" : "/signin", req.url),
      );
    }

    // 🚀 Redirect logged-in users away from /signin or /signup
    if (isAuthenticated && (pathname === "/signin" || pathname === "/signup")) {
      console.log("Redirecting to /dashboard...");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next(); // Proceed with request
  },
  {
    pages: {
      signIn: "/signin",
    },
  },
);

export const config = {
  matcher: ["/", "/dashboard/:path*", "/signin", "/signup"], // Ensure middleware runs on all necessary routes
  runtime: "experimental-edge",
};
