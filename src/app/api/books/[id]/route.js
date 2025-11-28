import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { BOOK_FIELDS } from "@/lib/sql/bookFields";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();

    const [bookRows] = await db.query(`
        SELECT ${BOOK_FIELDS}
        FROM books b
        LEFT JOIN categories c ON c.id_category = b.category_id
        LEFT JOIN racks r ON r.id_rack = b.rack_id
      WHERE b.id_book = ?
      LIMIT 1
    `, [id]);

    if (bookRows.length === 0) {
      return new NextResponse("Book not found", { status: 404 });
    }

    const book = bookRows[0];

    const [related] = await db.query(`
      SELECT 
        id_book,
        title,
        book_cover,
        author
      FROM books
      WHERE category_id = (
        SELECT category_id FROM books WHERE id_book = ?
      )
      AND id_book != ?
      ORDER BY created_at DESC
      LIMIT 6
    `, [id, id]);

    return NextResponse.json({
      success: true,
      data:book,
      related: related,
    });

  } catch (err) {
    console.error("DETAIL BOOK ERROR:", err);
    return new NextResponse("Error fetching book detail", { status: 500 });
  }
}
