import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const pathname = req.nextUrl.pathname;

    // ========== USER ==========
    // Jika user biasa coba buka dashboard → Forbidden
    if (role === "user" && pathname.startsWith("/dashboard")) {
      return new Response("Forbidden", { status: 403 });
    }

    // ========== STAFF ==========
    // Jika staff coba buka homepage → Forbidden
    if (role === "staff" && pathname === "/home") {
      return new Response("Forbidden: Staff cannot access home", { status: 403 });
    }

    return;
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",   // protect dashboard
    "/user/:path*",               // protect /home untuk role tertentu
  ],
};
