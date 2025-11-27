import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { registerSchema } from "@/lib/validation/auth";
import { formatZodErrors } from "@/lib/validation/utils/zodErrorFormatter";

export async function POST(req) {
  try {
    const body = await req.json();

    // ⭐ Validate with Zod
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: formatZodErrors(parsed.error.errors) },
        { status: 400 }
      );
    }

    const { username, email, password } = parsed.data;

    const db = await getDb();

    // ⭐ Check duplicate email
    const [exists] = await db.query(
      "SELECT id_user FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (exists.length > 0) {
      return NextResponse.json(
        { errors: { email: "Email sudah terdaftar" } },
        { status: 409 }
      );
    }

    // ⭐ Hash password
    const hashed = await bcrypt.hash(password, 10);

    // ⭐ Save user (role = user default)
    await db.query(
      "INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())",
      [username, email, hashed, "user"]
    );

    return NextResponse.json(
      { success: true, message: "Register berhasil" },
      { status: 201 }
    );
  } catch (err) {
    console.error("REGISTER API ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
