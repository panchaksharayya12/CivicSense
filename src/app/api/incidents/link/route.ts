import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { incident_id, complaint_id, reason, similarity_score } = body;

    if (!incident_id || !complaint_id) {
      return NextResponse.json(
        { error: "Both incident_id and complaint_id are required." },
        { status: 400 }
      );
    }

    const success = db.linkComplaintToIncident(
      incident_id,
      complaint_id,
      similarity_score || 95,
      reason || "Consolidated by Admin Officer"
    );

    if (!success) {
      return NextResponse.json(
        { error: "Failed to link complaint to incident. Check IDs." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Complaint ${complaint_id} successfully linked to Incident ${incident_id}`,
    });
  } catch (err: any) {
    console.error("Link complaint error:", err);
    return NextResponse.json(
      { error: "Failed to link complaint." },
      { status: 500 }
    );
  }
}
