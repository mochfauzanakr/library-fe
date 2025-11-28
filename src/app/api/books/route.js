import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { BOOK_FIELDS } from "@/lib/sql/bookFields";


export async function GET(request) {
  try {
    const db = await getDb();

    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit")) || 50;


    const [rows] = await db.query(`
  SELECT ${BOOK_FIELDS}
  FROM books b
  LEFT JOIN categories c ON c.id_category = b.category_id
  LEFT JOIN racks r ON r.id_rack = b.rack_id
  ORDER BY b.id_book ASC
      LIMIT ?`, [limit]);

    return NextResponse.json({
      "success": true,
      "count": rows.length,
      "data": rows
    });

  } catch (err) {
    console.error("BOOK API ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch books", error: err.message },
      { status: 500 }
    );
  }
}
