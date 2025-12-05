import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { BOOK_FIELDS } from "@/lib/sql/bookFields";

export async function GET(request, context) {
  try {
    const db = await getDb();
    const params = context?.params ? await context.params : await context;
    const id = params?.id;

    const [rows] = await db.query(
      `
      SELECT ${BOOK_FIELDS}
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id_category
      LEFT JOIN racks r ON b.rack_id = r.id_rack
      WHERE b.id_book = ?
      `,
      [id]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ data: rows[0] });
  } catch (err) {
    console.error("GET /api/admin/books/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const db = await getDb();
    const params = context?.params ? await context.params : await context;
    const id = params?.id;
    const body = await request.json();

    const {
      isbn,
      book_cover,
      title,
      author,
      publisher,
      category_id,
      description,
      language,
      original_year,
      year,
      total_pages,
      stock,
      rack_id,
    } = body;

    const [result] = await db.query(
      `
      UPDATE books
      SET
        isbn = ?,
        book_cover = ?,
        title = ?,
        author = ?,
        publisher = ?,
        category_id = ?,
        description = ?,
        language = ?,
        original_year = ?,
        \`year\` = ?,
        total_pages = ?,
        stock = ?,
        rack_id = ?
      WHERE id_book = ?
      `,
      [
        isbn || null,
        book_cover || null,
        title,
        author,
        publisher || null,
        category_id || null,
        description || null,
        language || null,
        original_year || null,
        year || original_year || null,
        total_pages || null,
        stock ?? 0,
        rack_id || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book updated" });
  } catch (err) {
    console.error("PUT /api/admin/books/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const db = await getDb();
    const params = context?.params ? await context.params : await context;
    const id = params?.id;

    const [result] = await db.query(
      `
      DELETE FROM books
      WHERE id_book = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book deleted" });
  } catch (err) {
    console.error("DELETE /api/admin/books/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
