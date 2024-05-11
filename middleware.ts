import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { comparePassword } from "./app/api/user/util";

export async function middleware(request: NextRequest) {
  const notRequireAuth =
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname.startsWith("/api/webhook") ||
    request.nextUrl.pathname.startsWith("/api/sendEmail") ||
    request.nextUrl.pathname.startsWith("/api/user") ||
    request.nextUrl.pathname.startsWith("/api/company") ||
    request.nextUrl.pathname.startsWith("/api/influencer") ||
    request.nextUrl.pathname.startsWith("/api/chatting") ||
    request.nextUrl.pathname.startsWith("/api/apply");
  if (!notRequireAuth) {
    const requestHeaders = new Headers(request.headers);
    const AuthorizationHeader = requestHeaders.get("authorization");
    const headersList = headers();
    const token = headersList.get("authorization");
    // const userInfo = token.split(":");
    // const password = userInfo[0];
    // const email = userInfo[1];
    const isMatch = token;
    if (!isMatch) {
      return NextResponse.json({ type: "error" });
    }
  } else {
    const response = NextResponse.next();
    return response;
  }
}
export const config = {
  matcher: "/api/:path*",
};
