import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDb } from "@/lib/db";

function normalizeId(context) {
  if (context?.params) return context.params.id;
  return context?.id || context?.params?.id || undefined;
}

async function requireSession() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || !role) {
    return { authorized: false, role: null };
  }
  return { authorized: true, role };
}

export async function GET(request, context) {
  try {
    const { authorized, role } = await requireSession();
    if (!authorized || (role !== "admin" && role !== "staff")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const params = context?.params ? await context.params : await context;
    const id = normalizeId(params);

    const [rows] = await db.query(
      `
      SELECT id_user, username, email, role, created_at
      FROM users
      WHERE id_user = ?
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

export async function PUT(request, context) {
  try {
    const { authorized, role } = await requireSession();
    if (!authorized || role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getDb();
    const params = context?.params ? await context.params : await context;
    const id = normalizeId(params);
    const body = await request.json();
    const { username, email, role } = body;

    const [result] = await db.query(
      `
      UPDATE users
      SET username = ?, email = ?, role = ?
      WHERE id_user = ?
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

export async function DELETE(request, context) {
  try {
    const { authorized, role } = await requireSession();
    if (!authorized || role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getDb();
    const params = context?.params ? await context.params : await context;
    const id = normalizeId(params);

    const [result] = await db.query(
      `
      DELETE FROM users
      WHERE id_user = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    console.error("DELETE /api/admin/users/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
