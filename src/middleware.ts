import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { decrypt } from "./lib/session";

export default async function middleware(req: NextRequest) {
  const protectedRoutes = ["/", "/market"];
  const currPath = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(currPath);

  if (isProtectedRoute) {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (session && currPath === "/") {
      return NextResponse.redirect(new URL("/market", req.nextUrl));
    }

    if (!session && currPath !== "/") {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    "/market/:path",
  ],
};
