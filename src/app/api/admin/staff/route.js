import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const db = await getDb();
  const [rows] = await db.query(
    "SELECT id_user, username, email, role FROM users WHERE role = 'staff'"
  );

  return NextResponse.json({ data: rows });
}


export async function POST(req) {
  const db = await getDb();
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
