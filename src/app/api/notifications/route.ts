import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ notifications: [] });
    }

    const notifications = db.getNotifications(session.id);
    return NextResponse.json({ notifications });
  } catch (err: any) {
    console.error("Get notifications error:", err);
    return NextResponse.json(
      { error: "Failed to get notifications." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, markAll } = body;

    if (markAll) {
      db.markAllNotificationsAsRead(session.id);
      return NextResponse.json({ success: true, message: "All marked as read" });
    }

    if (id) {
      db.markNotificationAsRead(id, session.id);
      return NextResponse.json({ success: true, message: "Notification marked as read" });
    }

    return NextResponse.json(
      { error: "Notification id or markAll parameter required." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Update notifications error:", err);
    return NextResponse.json(
      { error: "Failed to update notifications." },
      { status: 500 }
    );
  }
}
