import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req);
    const { id } = params;

    let complaint = db.getComplaintById(id);
    if (!complaint) {
      complaint = db.getComplaintByApplicationId(id);
    }

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found." },
        { status: 404 }
      );
    }

    // Role check: citizen can only view their own complaint, admin can view any
    if (session && session.role !== "admin" && complaint.user_id !== session.id) {
      return NextResponse.json(
        { error: "Access denied. You do not have permission to view this complaint." },
        { status: 403 }
      );
    }

    const timeline = db.getStatusHistory(complaint.id);

    return NextResponse.json({
      complaint,
      timeline,
    });
  } catch (err: any) {
    console.error("Get complaint detail error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve complaint details." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();
    const {
      status,
      note,
      assigned_department,
      assigned_officer,
      incident_id,
      progress_photo_url,
      progress_media_url,
      progress_media_type,
    } = body;

    let complaint = db.getComplaintById(id);
    if (!complaint) {
      complaint = db.getComplaintByApplicationId(id);
    }

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found." },
        { status: 404 }
      );
    }

    // Determine progress media URL and type (photo or video)
    const effectiveProgressMediaUrl = progress_media_url || progress_photo_url;
    let detectedType: "photo" | "video" = progress_media_type || "photo";
    if (effectiveProgressMediaUrl && !progress_media_type) {
      const isVideo =
        effectiveProgressMediaUrl.match(/\.(mp4|webm|mov|ogg|3gp)($|\?)/i) ||
        effectiveProgressMediaUrl.startsWith("data:video/");
      detectedType = isVideo ? "video" : "photo";
    }

    // Handle work progress media update (photo or video)
    if (effectiveProgressMediaUrl !== undefined) {
      db.updateComplaint(complaint.id, {
        progress_media_url: effectiveProgressMediaUrl,
        progress_media_type: detectedType,
        progress_photo_url: effectiveProgressMediaUrl, // Keep legacy field in sync
      });
    }

    // Handle department assignment
    if (assigned_department && assigned_officer) {
      db.assignDepartment(
        complaint.id,
        assigned_department,
        assigned_officer,
        session.name
      );
    }

    // Handle status change
    if (status && status !== complaint.status) {
      const mediaLabel = detectedType === "video" ? "video recording" : "photo evidence";
      const statusNote = effectiveProgressMediaUrl
        ? `${note || "Status updated"} (Work progress ${mediaLabel} attached by municipal operations).`
        : note;
      db.updateComplaintStatus(complaint.id, status, session.name, statusNote);
    } else if (effectiveProgressMediaUrl && !status) {
      // If media was attached without status change, record in history
      const mediaLabel = detectedType === "video" ? "video clip" : "photo";
      db.updateComplaintStatus(
        complaint.id,
        complaint.status,
        session.name,
        note || `Municipal field operations uploaded on-site work progress ${mediaLabel}.`
      );
    }

    // Handle incident linking
    if (incident_id && incident_id !== complaint.incident_id) {
      db.linkComplaintToIncident(
        incident_id,
        complaint.id,
        95,
        "Admin manual consolidation into incident " + incident_id
      );
    }

    const updated = db.getComplaintById(complaint.id);
    const timeline = db.getStatusHistory(complaint.id);

    return NextResponse.json({
      success: true,
      complaint: updated,
      timeline,
    });
  } catch (err: any) {
    console.error("Update complaint error:", err);
    return NextResponse.json(
      { error: "Failed to update complaint." },
      { status: 500 }
    );
  }
}
