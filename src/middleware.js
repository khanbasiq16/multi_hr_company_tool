import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  if (!token) {
    if (pathname.startsWith("/superadmin/sign-in") || pathname === "/") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
   
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const { role  , slug} = payload;


    if (pathname === "/" || pathname.startsWith("/superadmin/sign-in")) {
      if (role === "superAdmin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else if (role === "employee") {
        return NextResponse.redirect(new URL(`/employee/${slug}`, req.url));
      }
    }

       if (pathname.startsWith("/admin") && role !== "superAdmin") {
      const referer = req.headers.get("referer");
      return NextResponse.redirect(referer ? referer : new URL(`/employee/${slug}`, req.url));
    }

    if (pathname.startsWith("/employee") && role !== "employee") {
      const referer = req.headers.get("referer");
      return NextResponse.redirect(referer ? referer : new URL("/admin", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// ✅ Protect specific routes
export const config = {
  matcher: ["/", "/superadmin/sign-in", "/admin/:path*", "/employee/:path*"],
};


