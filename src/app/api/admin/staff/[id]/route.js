import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PUT(req, { params }) {
  const db = await getDb();
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
  const db = await getDb();
  const urlId = new URL(req.url).pathname.split("/").pop();
  const id = params?.id ?? urlId;

  if (!id) {
    return NextResponse.json({ error: "ID missing" }, { status: 400 });
  }

  try {
    console.log("DELETE /api/admin/staff/:id", { params, urlId, id });
    await db.query("DELETE FROM users WHERE id_user = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/staff/:id failed", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
