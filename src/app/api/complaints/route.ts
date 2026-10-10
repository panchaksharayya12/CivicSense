import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionFromRequest, setSessionCookie } from "@/lib/auth";
import { findPossibleDuplicateIncident } from "@/services/ai/incidentMatcher";
import { translateToEnglish } from "@/services/ai/translationService";
import { evaluatePhotoAuthenticity } from "@/services/ai/complaintAnalyzer";

export async function GET(req: NextRequest) {
  try {
    if (typeof (db as any).reloadFromDisk === "function") {
      (db as any).reloadFromDisk();
    }
    const session = getSessionFromRequest(req);
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const severity = searchParams.get("severity") || undefined;
    const all = searchParams.get("all") === "true";

    // If citizen is requesting without admin role, restrict to their own complaints
    let userId: string | undefined;
    if (session?.role !== "admin" || !all) {
      if (session) {
        userId = session.id;
      }
    }

    const complaints = db.getComplaints({
      userId,
      category,
      status,
      severity,
    });

    return NextResponse.json({ complaints });
  } catch (err: any) {
    console.error("Get complaints error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve complaints." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    let userSession = session;
    let shouldSetCookie = false;

    // If citizen is not logged in, auto-associate with default citizen account so complaint is NEVER lost!
    if (!userSession) {
      const defaultCitizen = db.getUserById("usr-rashmi") || {
        id: "usr-rashmi",
        name: "Citizen Resident",
        email: "rashmi@civicsense.in",
        role: "citizen" as const,
        preferred_language: "te",
        created_at: new Date().toISOString(),
      };
      userSession = {
        id: defaultCitizen.id,
        name: defaultCitizen.name,
        email: defaultCitizen.email,
        role: "citizen",
        preferred_language: defaultCitizen.preferred_language || "te",
      };
      shouldSetCookie = true;
    }

    const body = await req.json();
    const {
      category,
      issue_type,
      description,
      address,
      latitude,
      longitude,
      location_source,
      image_url,
      video_url,
      language,
      severity,
      urgency,
      ai_confidence,
      recommended_department,
    } = body;

    if (!category || !issue_type || !description) {
      return NextResponse.json(
        { error: "Category, issue type, and problem description are required." },
        { status: 400 }
      );
    }

    if (!address && (!latitude || !longitude)) {
      return NextResponse.json(
        { error: "Please provide either current location or manual address." },
        { status: 400 }
      );
    }

    // Automatically translate citizen voice/typed statement into official English for municipal officers
    const translation = await translateToEnglish(description, language);
    const englishStatement = translation.englishText || description;
    const detectedLang = translation.detectedLanguage || language || "en";

    // Check for duplicate incident match using the English text or original
    const duplicateMatch = findPossibleDuplicateIncident({
      category,
      issue_type,
      description: englishStatement,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      address,
    });

    const newComplaint = db.createComplaint({
      user_id: userSession.id,
      user_name: userSession.name,
      category,
      issue_type,
      description_original: description,
      description_normalized: englishStatement,
      language: detectedLang,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      address: address || "GPS Coordinated Location",
      location_source: location_source || "manual",
      image_url: image_url || undefined,
      video_url: video_url || undefined,
      photo_authenticity: evaluatePhotoAuthenticity(image_url, category, description),
      severity: severity || "medium",
      urgency: urgency || "normal",
      ai_confidence: ai_confidence || 95,
      recommended_department: recommended_department || "Smart City Operations Center",
      status: "submitted",
    });

    // If duplicate incident found with high confidence, auto-link
    if (duplicateMatch && duplicateMatch.similarityScore >= 80) {
      db.linkComplaintToIncident(
        duplicateMatch.incident_id,
        newComplaint.id,
        duplicateMatch.similarityScore,
        duplicateMatch.reason
      );
      newComplaint.incident_id = duplicateMatch.incident_id;
    }

    const response = NextResponse.json({
      success: true,
      complaint: newComplaint,
      duplicateMatched: duplicateMatch ? true : false,
      incident_id: duplicateMatch?.incident_id,
    });

    if (shouldSetCookie) {
      setSessionCookie(response, userSession);
    }

    return response;
  } catch (err: any) {
    console.error("Create complaint error:", err);
    return NextResponse.json(
      { error: "Failed to submit complaint." },
      { status: 500 }
    );
  }
}
