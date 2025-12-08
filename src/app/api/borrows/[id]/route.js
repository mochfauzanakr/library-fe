// api/borrows/[id]/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDb } from "@/lib/db";

function toMySQLDate(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace("T", " ");
}

async function ensureBorrowStatusHasRejected(db) {
  const [rows] = await db.query(
    `
    SELECT COLUMN_TYPE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'borrowings' AND COLUMN_NAME = 'status'
    `
  );

  const columnType = rows?.[0]?.COLUMN_TYPE || "";
  if (columnType.includes("'rejected'")) return;

  // Extend enum to include rejected
  await db.query(
    `
    ALTER TABLE borrowings
    MODIFY status ENUM('pending','approved','return','late','rejected') NOT NULL DEFAULT 'pending'
    `
  );
}

export async function PATCH(req, context) {
  const db = await getDb();
  await ensureBorrowStatusHasRejected(db);
  const params = context?.params ? await context.params : await context;
  const id = params?.id;

  const session = await getServerSession(authOptions);
  const actorId = session?.user?.id;
  const actorRole = session?.user?.role;

  if (!actorId || !actorRole || (actorRole !== "admin" && actorRole !== "staff")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, fine_notes } = body || {};

  const [[borrow]] = await db.query(
    `
    SELECT book_id, return_date, status, actual_return, fine_status
    FROM borrowings
    WHERE id_borrows = ?
    `,
    [id]
  );

  if (!borrow) {
    return NextResponse.json({ error: "Borrow not found" }, { status: 404 });
  }

  const bookId = borrow.book_id;
  const now = new Date();
  const nowMySQL = toMySQLDate(now);

  if (action === "reject") {
    if (borrow.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending requests can be rejected" },
        { status: 400 }
      );
    }

    await db.query(
      `
      UPDATE borrowings
      SET status = 'rejected',
          admin_id = ?,
          fine_amount = 0,
          fine_status = 'none',
          actual_return = NULL
      WHERE id_borrows = ?
      `,
      [actorId, id]
    );
  }

  if (action === "approve") {
    await db.query(
      "UPDATE books SET stock = stock - 1 WHERE id_book = ?",
      [bookId]
    );
    await db.query(
      "UPDATE borrowings SET status = 'approved', admin_id = ? WHERE id_borrows = ?",
      [actorId, id]
    );
  }

  if (action === "return") {
    const isLate = borrow.return_date && now > new Date(borrow.return_date);
    const daysLate = isLate
      ? Math.max(
          0,
          Math.ceil(
            (now - new Date(borrow.return_date)) / (1000 * 60 * 60 * 24)
          )
        )
      : 0;
    const fine = isLate ? daysLate * 1000 : 0;
    const fineStatus =
      borrow.fine_status === "paid"
        ? "paid"
        : isLate
          ? "unpaid"
          : "none";
    const status = isLate ? "late" : "return";

    await db.query(
      "UPDATE books SET stock = stock + 1 WHERE id_book = ?",
      [bookId]
    );
    await db.query(
      `
      UPDATE borrowings
      SET status = ?, actual_return = ?, fine_amount = ?, fine_status = ?
      WHERE id_borrows = ?
      `,
      [status, nowMySQL, fine, fineStatus, id]
    );
  }

  if (action === "late") {
    const baseReturn = borrow.actual_return
      ? new Date(borrow.actual_return)
      : now;
    const due = borrow.return_date ? new Date(borrow.return_date) : now;
    const daysLate = Math.max(
      0,
      Math.ceil((baseReturn - due) / (1000 * 60 * 60 * 24))
    );
    const fine = daysLate * 1000;

    // increment stock if not already returned
    await db.query(
      "UPDATE books SET stock = stock + 1 WHERE id_book = ?",
      [bookId]
    );
    await db.query(
      `
      UPDATE borrowings
      SET status = 'late',
          actual_return = ?,
          fine_amount = ?,
          fine_status = 'unpaid',
          admin_id = ?
      WHERE id_borrows = ?
      `,
      [toMySQLDate(baseReturn), fine, actorId, id]
    );
  }

  if (action === "pay_fine") {
    await db.query(
      `
      UPDATE borrowings
      SET fine_status = 'paid',
          fine_notes = ?,
          admin_id = ?
      WHERE id_borrows = ?
      `,
      [fine_notes || null, actorId, id]
    );
  }

  return NextResponse.json({ success: true });
}
