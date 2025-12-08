import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDb } from "@/lib/db";

async function ensureSoftDeleteColumns(db) {
  try {
    await db.query("ALTER TABLE users ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0");
  } catch (err) {
    if (err?.code !== "ER_DUP_FIELDNAME") throw err;
  }
  try {
    await db.query("ALTER TABLE users ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL");
  } catch (err) {
    if (err?.code !== "ER_DUP_FIELDNAME") throw err;
  }
}

async function requireSession() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || !role) {
    return { authorized: false, role: null };
  }
  return { authorized: true, role };
}

export async function GET(request, { params }) {
  try {
    const { authorized, role } = await requireSession();
    if (!authorized || (role !== "admin" && role !== "staff")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    await ensureSoftDeleteColumns(db);
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }

    const [rows] = await db.query(
      `
      SELECT id_user, username, email, role, created_at
      FROM users
      WHERE id_user = ? AND is_deleted = 0
      `,
      [id]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: rows[0] });
  } catch (err) {
    console.error("GET /api/admin/users/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { authorized, role: sessionRole } = await requireSession();
    if (!authorized || sessionRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getDb();
    await ensureSoftDeleteColumns(db);
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }
    const body = await request.json();
    const { username, email, role } = body;

    const [result] = await db.query(
      `
      UPDATE users
      SET username = ?, email = ?, role = ?
      WHERE id_user = ? AND is_deleted = 0
      `,
      [username, email, role, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated" });
  } catch (err) {
    console.error("PUT /api/admin/users/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { authorized, role } = await requireSession();
    if (!authorized || role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getDb();
    await ensureSoftDeleteColumns(db);
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }

    const [result] = await db.query(
      `
      UPDATE users
      SET is_deleted = 1, deleted_at = NOW()
      WHERE id_user = ? AND is_deleted = 0
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User soft-deleted" });
  } catch (err) {
    console.error("DELETE /api/admin/users/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
