import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (typeof (db as any).reloadFromDisk === "function") {
      (db as any).reloadFromDisk();
    }

    const metrics = db.getAdminMetrics();
    const complaints = db.getComplaints();
    const incidents = db.getIncidents();

    // Domain breakdown
    const domainCounts: Record<string, number> = {};
    complaints.forEach((c) => {
      domainCounts[c.category] = (domainCounts[c.category] || 0) + 1;
    });

    return NextResponse.json({
      metrics,
      domainCounts,
      recentIncidents: incidents.slice(0, 5),
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to retrieve metrics" }, { status: 500 });
  }
}
