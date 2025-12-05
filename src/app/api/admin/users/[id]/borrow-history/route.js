import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDb } from "@/lib/db";

function normalizeId(context) {
  if (context?.params) return context.params.id;
  return context?.id || context?.params?.id || undefined;
}

async function requireSession() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || !role) {
    return { authorized: false, role: null };
  }
  return { authorized: true, role };
}

export async function GET(request, context) {
  try {
    const { authorized, role } = await requireSession();
    if (!authorized || (role !== "admin" && role !== "staff")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const params = context?.params ? await context.params : await context;
    const userId = normalizeId(params);

    const [rows] = await db.query(
      `
      SELECT
        b.id_borrows,
        b.borrow_date,
        b.return_date,
        b.actual_return,
        b.status,
        bk.title
      FROM borrowings b
      LEFT JOIN books bk ON bk.id_book = b.book_id
      WHERE b.user_id = ?
      ORDER BY b.borrow_date DESC
      `,
      [userId]
    );

    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error("GET /api/admin/users/[id]/borrow-history error:", err);
    return NextResponse.json(
      { error: "Failed to fetch borrow history" },
      { status: 500 }
    );
  }
}
