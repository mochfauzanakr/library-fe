import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 20;

    const db = await getDb();
    const [rows] = await db.query(
      `
        SELECT 
          b.id_book,
          b.book_cover,
          b.title,
          b.author,
          c.name AS category,
          b.created_at AS added_at
        FROM books b
        LEFT JOIN categories c 
          ON c.id_category = b.category_id
        ORDER BY b.created_at DESC
        LIMIT ?
      `,
      [limit]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });

  } catch (err) {
    console.error("NEW BOOK API ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch new arrival", error: err.message },
      { status: 500 }
    );
  }
}
