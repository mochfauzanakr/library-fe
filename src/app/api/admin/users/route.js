import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
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

// GET /api/admin/users
export async function GET(request) {
  try {
    const { authorized, role } = await requireSession();
    if (!authorized || (role !== "admin" && role !== "staff")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    await ensureSoftDeleteColumns(db);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 20;
    const search = url.searchParams.get("q") || "";
    const offset = (page - 1) * limit;

    let where = "WHERE u.is_deleted = 0";
    const params = [];

    if (search) {
      where += " AND (u.username LIKE ? OR u.email LIKE ?)";
      const s = `%${search}%`;
      params.push(s, s);
    }

    const [countRows] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM users u
      ${where}
      `,
      params
    );

    const total = countRows?.[0]?.total || 0;

    const [rows] = await db.query(
      `
      SELECT
        u.id_user,
        u.username,
        u.email,
        u.role,
        u.created_at
      FROM users u
      ${where}
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    return NextResponse.json({
      data: rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users (admin only)
export async function POST(request) {
  try {
    const { authorized, role: sessionRole } = await requireSession();
    if (!authorized || sessionRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getDb();
    const body = await request.json();
    const {
      username,
      email,
      password,
      role: newUserRole = "user",
    } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "username, email, and password are required" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
      `,
      [username, email, hashed, newUserRole]
    );

    return NextResponse.json(
      { message: "User created", id: result.insertId },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/admin/users error:", err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
