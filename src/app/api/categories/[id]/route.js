import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();

    const [categoriesRows] = await db.query(`
      SELECT name, description
      FROM categories
      WHERE id_category = ?
      LIMIT 1
    `, [id]);

    if (categoriesRows.length === 0) {
      return new NextResponse("category not found", { status: 404 });
    }

    const categories = categoriesRows[0];


    return NextResponse.json({
      success: true,
      data: categories,
    });


  } catch (err) {
    console.error("DETAIL CATEGORIES ERROR:", err);
    return new NextResponse("Error fetching category detail", { status: 500 });
  }
}
