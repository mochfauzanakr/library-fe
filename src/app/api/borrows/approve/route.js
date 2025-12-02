import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req) {
  const db = await getDb();
  const { borrow_id } = await req.json();

  if (!borrow_id) {
    return NextResponse.json({ error: "Missing borrow_id" }, { status: 400 });
  }

  try {
    // ambil data pinjaman
    const [[borrow]] = await db.query(
      "SELECT book_id FROM borrowings WHERE id_borrows = ?",
      [borrow_id]
    );

    const bookId = borrow.book_id;

    // turunkan stok
    await db.query(
      "UPDATE books SET stock = stock - 1 WHERE id_book = ?",
      [bookId]
    );

    // ubah status
    await db.query(
      "UPDATE borrowings SET status = 'approved' WHERE id_borrows = ?",
      [borrow_id]
    );

    return NextResponse.json({ message: "Approved" }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
