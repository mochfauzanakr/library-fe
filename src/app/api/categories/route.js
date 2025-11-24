import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    const [rows] = await db.query(
      "SELECT id_category, name, description FROM categories ORDER BY name ASC"
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Kategori Error:", err);
    return new NextResponse("Server Error", { status: 500 });
  }
}
