import { NextResponse } from "next/server";

export function middleware(req) {
  return NextResponse.next(); // allow request to continue (no redirect)
}

export const config = {
  matcher: ["/dashboard/:path*"], // still applies to dashboard but doesn't block
};