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

    const normalizeOptionalNumber = (value) => {
      if (value === "" || value === undefined || value === null) return null;
      const num = Number(value);
      return Number.isNaN(num) ? NaN : num;
    };

    const normalizeNumberWithDefault = (value, fallback = 0) => {
      if (value === "" || value === undefined || value === null) return fallback;
      const num = Number(value);
      return Number.isNaN(num) ? NaN : num;
    };

    const parsedCategoryId = normalizeOptionalNumber(category_id);
    const parsedOriginalYear = normalizeOptionalNumber(original_year);
    const parsedYear = normalizeOptionalNumber(year ?? original_year);
    const parsedPages = normalizeOptionalNumber(total_pages);
    const parsedRackId = normalizeOptionalNumber(rack_id);
    const parsedStock = normalizeNumberWithDefault(stock, 0);

    const parsedNumbers = [
      parsedCategoryId,
      parsedOriginalYear,
      parsedYear,
      parsedPages,
      parsedRackId,
      parsedStock,
    ];

    if (parsedNumbers.some((v) => Number.isNaN(v))) {
      return NextResponse.json(
        { error: "Numeric fields must contain valid numbers" },
        { status: 400 }
      );
    }

    const isNegative = (n) => typeof n === "number" && n < 0;
    if (
      isNegative(parsedOriginalYear) ||
      isNegative(parsedYear) ||
      isNegative(parsedPages) ||
      isNegative(parsedStock)
    ) {
      return NextResponse.json(
        { error: "Year, pages, and stock must be zero or positive" },
        { status: 400 }
      );
    }

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
        parsedCategoryId,
        description || null,
        language || null,
        parsedOriginalYear,
        parsedYear,
        parsedPages,
        parsedStock,
        parsedRackId,
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
