import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDb } from "@/lib/db";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || role !== "admin") return { authorized: false };
  return { authorized: true };
}

async function ensureSoftDeleteColumns(db) {
  try {
    await db.query(
      "ALTER TABLE users ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0"
    );
  } catch (err) {
    if (err?.code !== "ER_DUP_FIELDNAME") throw err;
  }
  try {
    await db.query(
      "ALTER TABLE users ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL"
    );
  } catch (err) {
    if (err?.code !== "ER_DUP_FIELDNAME") throw err;
  }
}

export async function PUT(req, { params }) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  await ensureSoftDeleteColumns(db);
  const urlId = new URL(req.url).pathname.split("/").pop();
  const id = params?.id ?? urlId;

  if (!id) {
    return NextResponse.json({ error: "ID missing" }, { status: 400 });
  }

  try {
    const { username, email } = await req.json();

    await db.query(
      "UPDATE users SET username = ?, email = ? WHERE id_user = ?",
      [username, email, id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/admin/staff/:id failed", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  await ensureSoftDeleteColumns(db);
  const urlId = new URL(req.url).pathname.split("/").pop();
  const id = params?.id ?? urlId;

  if (!id) {
    return NextResponse.json({ error: "ID missing" }, { status: 400 });
  }

  try {
    console.log("DELETE /api/admin/staff/:id", { params, urlId, id });
    const [result] = await db.query(
      `
      UPDATE users
      SET is_deleted = 1, deleted_at = NOW()
      WHERE id_user = ? AND is_deleted = 0 AND role = 'staff'
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, softDeleted: true });
  } catch (err) {
    console.error("DELETE /api/admin/staff/:id failed", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
