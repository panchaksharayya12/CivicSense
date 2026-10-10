import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    if (typeof (db as any).reloadFromDisk === "function") {
      (db as any).reloadFromDisk();
    }
    const incidents = db.getIncidents();
    return NextResponse.json({ incidents });
  } catch (err: any) {
    console.error("Get incidents error:", err);
    return NextResponse.json(
      { error: "Failed to fetch incidents." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    // Allow admin access or local testing; block explicit citizens
    if (session && session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      category,
      issue_type,
      latitude,
      longitude,
      address,
      severity,
      department,
      assigned_officer,
      grouping_reason,
      report_count,
      linkedComplaintIds,
    } = body;

    const count = (linkedComplaintIds && Array.isArray(linkedComplaintIds) && linkedComplaintIds.length > 0)
      ? linkedComplaintIds.length
      : (report_count || 1);

    const newIncident = db.createIncident({
      title: title || `${issue_type || "Civic"} Incident at ${address || "Bengaluru"}`,
      category: category || "traffic",
      issue_type: issue_type || "General Hazard",
      latitude: Number(latitude) || 12.9716,
      longitude: Number(longitude) || 77.5946,
      address: address || "Bengaluru",
      severity: severity || "medium",
      department: department || "Smart City Operations Center",
      assigned_officer: assigned_officer || "Pending Dispatch",
      status: "open",
      ai_confidence: 96,
      grouping_reason:
        grouping_reason || "Consolidated by Municipal Operations Officer to coordinate repair teams.",
      report_count: count,
      first_reported_at: new Date().toISOString(),
      latest_reported_at: new Date().toISOString(),
    });

    // Link any selected citizen complaints
    if (linkedComplaintIds && Array.isArray(linkedComplaintIds)) {
      for (const compId of linkedComplaintIds) {
        db.linkComplaintToIncident(
          newIncident.incident_id,
          compId,
          96,
          grouping_reason || "Consolidated into work order"
        );
      }
    }

    return NextResponse.json({
      success: true,
      incident: newIncident,
    });
  } catch (err: any) {
    console.error("Create incident error:", err);
    return NextResponse.json(
      { error: "Failed to create incident." },
      { status: 500 }
    );
  }
}
