import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Convert ISO → MySQL DATETIME
function toMySQLDate(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace("T", " ");
}

export async function POST(req) {
  const db = await getDb();
  const body = await req.json().catch(() => null);

  console.log("📩 RAW BODY:", body);

  if (!body) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { user_id, book_id, return_date } = body;

  console.log("user_id:", user_id);
  console.log("book_id:", book_id);
  console.log("return_date:", return_date);

  if (!user_id || !book_id || !return_date) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // cek buku
    const [bookRows] = await db.query(
      "SELECT stock FROM books WHERE id_book = ?",
      [book_id]
    );

    if (bookRows.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = bookRows[0];

    if (book.stock <= 0) {
      return NextResponse.json({ error: "Book out of stock" }, { status: 400 });
    }

    // cek pinjaman aktif
    const [activeRows] = await db.query(
      `
      SELECT id_borrows FROM borrowings
      WHERE user_id = ?
      AND book_id = ?
      AND status IN ('pending', 'approved', 'late')
      `,
      [user_id, book_id]
    );

    if (activeRows.length > 0) {
      return NextResponse.json(
        { error: "You already borrowed this book." },
        { status: 400 }
      );
    }

    // Convert return_date to MySQL DATETIME
    const mysqlReturn = toMySQLDate(return_date);
    const mysqlNow = toMySQLDate(new Date());

    console.log("📅 MYSQL NOW:", mysqlNow);
    console.log("📅 MYSQL RETURN:", mysqlReturn);

    // Insert borrowing
    await db.query(
      `
      INSERT INTO borrowings 
      (user_id, book_id, borrow_date, return_date, status)
      VALUES (?, ?, ?, ?, 'pending')
      `,
      [user_id, book_id, mysqlNow, mysqlReturn]
    );

    return NextResponse.json(
      { message: "Book borrowed successfully" },
      { status: 201 }
    );

  } catch (err) {
    console.error("BORROW ERROR:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
