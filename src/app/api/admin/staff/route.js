import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
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

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  await ensureSoftDeleteColumns(db);
  const [rows] = await db.query(
    "SELECT id_user, username, email, role FROM users WHERE role = 'staff' AND is_deleted = 0"
  );

  return NextResponse.json({ data: rows });
}


export async function POST(req) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  await ensureSoftDeleteColumns(db);
  const { username, email, password } = await req.json();

  const hashed = await bcrypt.hash(password, 10);

  try {
    await db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'staff')",
      [username, email, hashed]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
