// api/borrows/[id]/route.js

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PATCH(req, { params }) {
  const db = await getDb();
  const id = params.id;

  const { action } = await req.json();

  const [[borrow]] = await db.query(
    "SELECT book_id FROM borrowings WHERE id_borrows = ?",
    [id]
  );

  if (!borrow) {
    return NextResponse.json({ error: "Borrow not found" }, { status: 404 });
  }

  const bookId = borrow.book_id;

  if (action === "approve") {
    await db.query(
      "UPDATE books SET stock = stock - 1 WHERE id_book = ?",
      [bookId]
    );
    await db.query(
      "UPDATE borrowings SET status = 'approved' WHERE id_borrows = ?",
      [id]
    );
  }

  if (action === "reject") {
    await db.query(
      "UPDATE borrowings SET status = 'rejected' WHERE id_borrows = ?",
      [id]
    );
  }

  if (action === "return") {
    await db.query(
      "UPDATE books SET stock = stock + 1 WHERE id_book = ?",
      [bookId]
    );
    await db.query(
      "UPDATE borrowings SET status = 'returned' WHERE id_borrows = ?",
      [id]
    );
  }

  return NextResponse.json({ success: true });
}
