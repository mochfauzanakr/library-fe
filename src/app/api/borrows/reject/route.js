import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req) {
  const db = await getDb();
  const { borrow_id } = await req.json();

  if (!borrow_id) {
    return NextResponse.json({ error: "Missing borrow_id" }, { status: 400 });
  }

  try {
    await db.query(
      "UPDATE borrowings SET status = 'rejected' WHERE id_borrows = ?",
      [borrow_id]
    );

    return NextResponse.json({ message: "Rejected" }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
