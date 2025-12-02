import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const db = await getDb();
    const body = await req.json();
    console.log("BODY FROM CLIENT:", body);
    const { book_id, user_id } = body;

    if (!book_id || !user_id)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await db.query(
      "INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)",
      [user_id, book_id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id)
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });

    const [rows] = await db.query(
      `SELECT w.id_wishlist, b.*
       FROM wishlist w
       JOIN books b ON b.id_book = w.book_id
       WHERE w.user_id = ?`,
      [user_id]
    );

    return NextResponse.json({ data: rows });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
