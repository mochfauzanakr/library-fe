import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { BOOK_FIELDS } from "@/lib/sql/bookFields";

export async function GET(request) {
  try {
    const db = await getDb();
    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 20;
    const search = url.searchParams.get("q") || "";

    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const params = [];

    if (search) {
      where += " AND (b.title LIKE ? OR b.author LIKE ? OR b.isbn LIKE ?)";
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    // TOTAL FIX
    const [countRows] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM books b
      ${where}
      `,
      params
    );

    const total = countRows?.[0]?.total || 0;

    // MAIN DATA FIX
    const [rows] = await db.query(
      `
      SELECT ${BOOK_FIELDS}
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id_category
      LEFT JOIN racks r ON b.rack_id = r.id_rack
      ${where}
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const safeRows = Array.isArray(rows) ? rows.filter(Boolean) : [];

    return NextResponse.json({
      data: safeRows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (err) {
    console.error("GET /api/admin/books error:", err);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const db = await getDb();
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
      total_pages,
      stock,
      rack_id,
    } = body;

    if (!title || !author) {
      return NextResponse.json(
        { error: "Title and author are required" },
        { status: 400 }
      );
    }

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
    const parsedYear = normalizeOptionalNumber(original_year);
    const parsedPages = normalizeOptionalNumber(total_pages);
    const parsedRackId = normalizeOptionalNumber(rack_id);
    const parsedStock = normalizeNumberWithDefault(stock, 0);
    const parsedYearColumn = parsedYear;

    if (
      [parsedCategoryId, parsedYear, parsedPages, parsedRackId, parsedStock].some(
        (value) => Number.isNaN(value)
      )
    ) {
      return NextResponse.json(
        { error: "Numeric fields must contain valid numbers" },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `
      INSERT INTO books (
        isbn,
        book_cover,
        title,
        author,
        publisher,
        category_id,
        description,
        language,
        original_year,
        \`year\`,
        total_pages,
        stock,
        rack_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        parsedYear,
        parsedYearColumn,
        parsedPages,
        parsedStock,
        parsedRackId,
      ]
    );

    return NextResponse.json(
      { message: "Book created", id: result.insertId },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/admin/books error:", err);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}
