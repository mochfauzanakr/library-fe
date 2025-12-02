import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const db = await getDb();

  const [rows] = await db.query(`
    SELECT 
      b.id_borrows,
      b.book_id,
      bk.title,
      bk.book_cover AS book_cover,
      b.borrow_date,
      b.return_date,
      b.actual_return,
      b.status
    FROM borrowings b
    JOIN books bk ON bk.id_book = b.book_id
    WHERE b.user_id = ?
    ORDER BY b.borrow_date DESC
  `, [userId]);

  console.log("🔥 ROW FROM SQL:", rows); // ← DI SINI TEMPATNYA

  return NextResponse.json({ data: rows }, { status: 200 });
}
