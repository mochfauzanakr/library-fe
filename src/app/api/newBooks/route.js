import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit")) || 20;
    try {
    const db = await getDb();
    const [rows] = await db.query(`
      SELECT 
        b.id_book,
        b.book_cover,
        b.title,
        c.name AS category
      FROM books b
      LEFT JOIN categories c 
        ON c.id_category = b.category_id
      ORDER BY b.created_at DESC
      LIMIT ${limit};
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("BOOK API ERROR:", err);
    return new NextResponse("Error fetching books", { status: 500 });
  }
}
