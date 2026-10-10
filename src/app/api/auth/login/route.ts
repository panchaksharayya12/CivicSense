import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const userWithHash = db.getUserByEmail(email);
    if (!userWithHash) {
      return NextResponse.json(
        { error: "Invalid credentials. Please check your email and password." },
        { status: 401 }
      );
    }

    const isValid = bcrypt.compareSync(password, userWithHash.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials. Please check your email and password." },
        { status: 401 }
      );
    }

    const { password_hash, ...safeUser } = userWithHash;

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      token: "",
    });

    const token = setSessionCookie(response, {
      id: safeUser.id,
      name: safeUser.name,
      email: safeUser.email,
      role: safeUser.role,
      preferred_language: safeUser.preferred_language,
    });

    return NextResponse.json({
      success: true,
      user: safeUser,
      token,
    }, {
      headers: response.headers
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Failed to authenticate." },
      { status: 500 }
    );
  }
}
