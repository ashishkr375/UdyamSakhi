import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/my-business-plan/:path*",
    "/funding-navigator/:path*",
    "/legal-tax-hub/:path*",
    "/market-access/:path*",
    "/skilling-center/:path*",
    "/my-profile/:path*",
  ],
}; 