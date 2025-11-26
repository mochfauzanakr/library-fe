import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/db";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const db = await getDb();
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    const token = jwt.sign(
      {
        id: user.id_user,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "Login success",
      user: {
        id: user.id_user,
        username: user.username,
        role: user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error(err);
    return new NextResponse("Login error", { status: 500 });
  }
}
