import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const helplines = db.getHelplines(category);
  return NextResponse.json({ helplines });
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const helpline = db.createHelpline(body);
    return NextResponse.json({ success: true, helpline });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create helpline" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updates } = body;
    const updated = db.updateHelpline(id, updates);
    return NextResponse.json({ success: true, helpline: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update helpline" }, { status: 500 });
  }
}
