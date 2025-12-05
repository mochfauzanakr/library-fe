import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDb } from "@/lib/db";

async function requireSession() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || !role) return { authorized: false };
  if (role !== "admin" && role !== "staff") return { authorized: false };
  return { authorized: true };
}

export async function GET(request) {
  try {
    const auth = await requireSession();
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 20;
    const status = url.searchParams.get("status") || "";
    const offset = (page - 1) * limit;

    // Auto-mark overdue items and keep fines growing until returned (actual_return IS NULL)
    await db.query(
      `
      UPDATE borrowings
      SET
        status = 'late',
        fine_status = 'unpaid',
        fine_amount = CEIL(GREATEST(TIMESTAMPDIFF(SECOND, return_date, NOW()),0) / 86400) * 1000
      WHERE
        return_date IS NOT NULL
        AND return_date < NOW()
        AND actual_return IS NULL
        AND (status = 'approved' OR status = 'late')
      `
    );

    let where = "WHERE 1=1";
    const params = [];

    if (status) {
      where += " AND b.status = ?";
      params.push(status);
    }

    const [countRows] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM borrowings b
      ${where}
      `,
      params
    );

    const total = countRows?.[0]?.total || 0;

    const [rows] = await db.query(
      `
      SELECT
        b.id_borrows,
        b.user_id,
        u.username,
        b.book_id,
        bk.title AS book_title,
        b.borrow_date,
        b.return_date,
        b.actual_return,
        b.fine_amount,
        b.fine_status,
        b.status
      FROM borrowings b
      LEFT JOIN users u ON u.id_user = b.user_id
      LEFT JOIN books bk ON bk.id_book = b.book_id
      ${where}
      ORDER BY b.borrow_date DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    return NextResponse.json({
      data: rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("GET /api/admin/borrows error:", err);
    return NextResponse.json(
      { error: "Failed to fetch borrows" },
      { status: 500 }
    );
  }
}
