import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();

    const [rows] = await db.query(
      `
      SELECT 
        b.id_borrows,
        b.user_id,
        b.book_id,
        bk.title,
        bk.author,
        bk.book_cover,
        bk.total_pages,
        bk.publisher,
        bk.language,
        r.rack_code,
        b.borrow_date,
        b.return_date,
        b.actual_return,
        b.status
      FROM borrowings b
      JOIN books bk ON bk.id_book = b.book_id
      LEFT JOIN racks r ON r.id_rack = bk.rack_id
      WHERE b.id_borrows = ?
      LIMIT 1
    `,
      [id]
    );

    if (!rows.length) {
      return new NextResponse("Borrowing not found", { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("DETAIL BORROW ERROR:", err);
    return new NextResponse("Error fetching borrow detail", { status: 500 });
  }
}
