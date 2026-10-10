import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, getSessionFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  clearSessionCookie(response);
  return response;
}
