import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;   // JWT dari NextAuth
    const path = req.nextUrl.pathname;

    console.log(" PROXY ACTIVE:", path);
    console.log(" TOKEN:", token);

    
    if (!token) {
      console.log(" NO TOKEN → redirect to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role;

  

    // USER mencoba akses dashboard → FORBIDDEN
    if (role === "user" && path.startsWith("/dashboard")) {
      console.log(" USER trying to enter DASHBOARD → FORBIDDEN");
      return NextResponse.rewrite(new URL("/forbidden", req.url));
    }

    // STAFF mencoba akses user area → FORBIDDEN
    if (role === "staff" && path.startsWith("/user")) {
      console.log(" STAFF trying to enter USER area → FORBIDDEN");
      return NextResponse.rewrite(new URL("/forbidden", req.url));
    }

    // Admin bebas akses semua halaman
    // (Tidak perlu aturan tambahan)

    console.log("ACCESS ALLOWED");
    return NextResponse.next();
  },

  // jika belum login, NextAuth otomatis redirect
  {
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*", // area admin & staff
    "/user/:path*",      // area user biasa
  ],
};
