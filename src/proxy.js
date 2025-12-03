// proxy.js / middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname; // <<< gunakan ini

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

    //
    // ========== RULE APLIKASI ==========
    //

    // 1. User biasa tidak boleh masuk dashboard
    if (role === "user" && path.startsWith("/dashboard")) {
      console.log("USER trying to enter /dashboard → FORBIDDEN");
      return NextResponse.rewrite(new URL("/forbidden", req.url));
    }

    // 2. Staff tidak boleh kelola staff (admin only)
    if (path.startsWith("/dashboard/manage-staff")) {
      if (role !== "admin") {
        console.log("STAFF tried to access manage-staff → FORBIDDEN");
        return NextResponse.redirect(new URL("/forbidden", req.url));
      }
    }

    // 3. Staff hanya bisa READ users (admin full CRUD)
    // Kalau kamu punya beda route seperti:
    // POST / PUT / DELETE → /dashboard/manage-users/api/*
    // maka rule per-method kamu letakkan di API route juga.
    if (path.startsWith("/dashboard/manage-users")) {
      if (role === "staff") {
        console.log("STAFF accessing users → READ ONLY");
        // boleh lewat, tapi API akan menolak action non-GET
      }
    }

    // 4. Staff & admin allowed manage-books
    if (path.startsWith("/dashboard/manage-books")) {
      if (!["admin", "staff"].includes(role)) {
        console.log("Non-staff/admin tried to access manage-books → FORBIDDEN");
        return NextResponse.redirect(new URL("/forbidden", req.url));
      }
    }

    //
    // ========== END RULE ==========
    //

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
