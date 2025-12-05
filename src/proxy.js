// proxy.js / middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const method = req.method;
    const isApi = path.startsWith("/api/");

    console.log("PROXY ACTIVE:", path);
    console.log("TOKEN:", token);

    if (!token) {
      console.log("NO TOKEN -> redirect to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role;
    const res = NextResponse.next();

    const deny = (msg) => {
      console.log(msg);
      if (isApi) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/forbidden", req.url));
    };

    // kirim role ke layout via header
    res.headers.set("x-user-role", role);

    //
    // ========== RULE APLIKASI ==========
    //

    // 1. User biasa tidak boleh masuk dashboard
    if (role === "user" && path.startsWith("/dashboard")) {
      return deny("USER trying to enter /dashboard FORBIDDEN");
    }

    // 1b. Staff tidak boleh masuk area /user (khusus end-user)
    if (role === "staff" && path.startsWith("/user")) {
      return deny("STAFF trying to enter /user area FORBIDDEN");
    }

    // 2. Staff tidak boleh kelola staff (admin only) termasuk API
    if (
      path.startsWith("/dashboard/manage-staff") ||
      path.startsWith("/api/admin/staff")
    ) {
      if (role !== "admin") {
        return deny("Non-admin tried to access staff management FORBIDDEN");
      }
    }

    // 3. Staff hanya bisa READ users (admin full CRUD)
    if (path.startsWith("/dashboard/manage-users") && role === "staff") {
      console.log("STAFF accessing manage-users READ ONLY");
    }
    if (path.startsWith("/api/admin/users") && role === "staff" && method !== "GET") {
      return deny("STAFF trying to write manage-users API FORBIDDEN");
    }

    // 4. Staff & admin allowed manage-books (pages & APIs)
    if (path.startsWith("/dashboard/manage-books")) {
      if (!["admin", "staff"].includes(role)) {
        return deny("Non-staff/admin tried to access manage-books FORBIDDEN");
      }
    }
    if (path.startsWith("/api/admin/books") && !["admin", "staff"].includes(role)) {
      return deny("Non-staff/admin tried to access manage-books API FORBIDDEN");
    }

    // 5. Borrow management placeholder: staff/admin allowed
    if (path.startsWith("/dashboard/borrow")) {
      if (!["admin", "staff"].includes(role)) {
        return deny("Non-staff/admin tried to access borrow management FORBIDDEN");
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
  matcher: ["/dashboard", "/dashboard/:path*", "/user", "/user/:path*"],
};
