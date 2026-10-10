import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    // Allow admin or local development
    if (session && session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const result = db.resetApplications();
    return NextResponse.json({
      success: true,
      message: "Applications successfully reset to 0. Next application will start at CS-2026-00001.",
      totalReports: 0,
      result,
    });
  } catch (err) {
    console.error("Failed to reset applications", err);
    return NextResponse.json({ error: "Failed to reset applications" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (session && session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const result = db.resetApplications();
    return NextResponse.json({
      success: true,
      message: "Applications successfully reset to 0.",
      totalReports: 0,
      result,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to reset applications" }, { status: 500 });
  }
}
