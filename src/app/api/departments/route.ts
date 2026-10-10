import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET() {
  const departments = db.getDepartments();
  return NextResponse.json({ departments });
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updates } = body;
    const updated = db.updateDepartment(id, updates);
    return NextResponse.json({ success: true, department: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update department" }, { status: 500 });
  }
}
