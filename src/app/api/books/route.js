import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request) {
  try {
    const db = await getDb();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 50;

    const [rows] = await db.query(`
      SELECT 
        b.id_book,
        b.isbn,
        b.book_cover,
        b.title,
        b.author,
        b.publisher,
        c.name AS category,
        b.description,
        b.language,
        b.original_year,
        b.total_pages,
        b.stock,
        r.rack_code AS rack_code,
        b.created_at
      FROM books b
      LEFT JOIN categories c ON c.id_category = b.category_id
      LEFT JOIN racks r ON r.id_rack = b.rack_id
      ORDER BY b.id_book DESC
      LIMIT ${limit};
    `);

    return NextResponse.json(rows);

  } catch (err) {
    console.error("BOOK API ERROR:", err);
    return new NextResponse("Error fetching books", { status: 500 });
  }
}
