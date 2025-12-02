import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { BOOK_FIELDS } from "@/lib/sql/bookFields";

export async function GET(request) {
  try {
    const db = await getDb();

    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit")) || 50;
    const categoryId = url.searchParams.get("category_id");
    const random = url.searchParams.get("random"); // ← HANYA TAMBAHAN INI

    let query = `
      SELECT ${BOOK_FIELDS}
      FROM books b
      LEFT JOIN categories c ON c.id_category = b.category_id
      LEFT JOIN racks r ON r.id_rack = b.rack_id
    `;
    
    let params = [];

    // FILTER CATEGORY
    if (categoryId) {
      query += ` WHERE b.category_id = ? `;
      params.push(categoryId);
    }

    // TO RANDOMIZE FETCH BOOK THAT'S ALL
    if (random === "true") {
      query += ` ORDER BY RAND() `;
    } else {
      query += ` ORDER BY b.id_book ASC `;
    }

    query += ` LIMIT ? `;
    params.push(limit);

    const [rows] = await db.query(query, params);

    return NextResponse.json({
      success: true,
      count: rows.length,
      data: rows,
    });

  } catch (err) {
    console.error("BOOK API ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch books", error: err.message },
      { status: 500 }
    );
  }
}
