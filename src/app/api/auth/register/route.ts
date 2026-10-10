import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, role, preferred_language } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const newUser = db.createUser({
      name,
      email,
      phone,
      password,
      role: role === "admin" ? "admin" : "citizen",
      preferred_language: preferred_language || "en",
    });

    const response = NextResponse.json({
      success: true,
      user: newUser,
    });

    setSessionCookie(response, {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      preferred_language: newUser.preferred_language,
    });

    return response;
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Failed to register account." },
      { status: 500 }
    );
  }
}
