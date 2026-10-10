import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const incident = db.getIncidentById(id);

    if (!incident) {
      return NextResponse.json(
        { error: "Incident not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ incident });
  } catch (err: any) {
    console.error("Get incident detail error:", err);
    return NextResponse.json(
      { error: "Failed to fetch incident details." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, assigned_officer, department, grouping_reason } = body;

    const incident = db.getIncidentById(id);
    if (!incident) {
      return NextResponse.json(
        { error: "Incident not found." },
        { status: 404 }
      );
    }

    const inc = (db as any).data.incidents.find(
      (i: any) => i.id === id || i.incident_id === id
    );
    if (inc) {
      if (status) inc.status = status;
      if (assigned_officer) inc.assigned_officer = assigned_officer;
      if (department) inc.department = department;
      if (grouping_reason) inc.grouping_reason = grouping_reason;
      inc.updated_at = new Date().toISOString();
      (db as any).commit();
    }

    return NextResponse.json({
      success: true,
      incident: db.getIncidentById(id),
    });
  } catch (err: any) {
    console.error("Update incident error:", err);
    return NextResponse.json(
      { error: "Failed to update incident." },
      { status: 500 }
    );
  }
}
