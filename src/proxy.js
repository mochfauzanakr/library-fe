// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    console.log("PROXY ACTIVE:", path);
    console.log("TOKEN:", token);

    if (!token) {
      console.log("NO TOKEN → redirect to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role;
    const res = NextResponse.next();

    // kirim role ke layout via header
    res.headers.set("x-user-role", role);

    // RULE AKSES (sesuai requirement lu)
    // user biasa tidak boleh masuk dashboard
    if (role === "user" && path.startsWith("/dashboard")) {
      console.log("USER trying to enter /dashboard → FORBIDDEN");
      return NextResponse.rewrite(new URL("/forbidden", req.url));
    }

    // (kalau mau: batasi staff ke area tertentu, bisa tambahin di sini)

    console.log("ACCESS ALLOWED");
    return res;
  },
  {
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/user",
    "/user/:path*",
  ],
};
