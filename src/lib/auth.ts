import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { User, UserRole } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "civicsense-production-secret-key-smart-city-2026";
const COOKIE_NAME = "civicsense_session";

export interface SessionPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  preferred_language: string;
}

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest): SessionPayload | null {
  const cookie = req.cookies.get(COOKIE_NAME);
  if (cookie?.value) {
    const session = verifyToken(cookie.value);
    if (session) return session;
  }

  // Also check Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  return null;
}

export function setSessionCookie(response: NextResponse, payload: SessionPayload): string {
  const token = signToken(payload);
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: false, // Set to false so localhost works seamlessly over HTTP
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return token;
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export { COOKIE_NAME };
