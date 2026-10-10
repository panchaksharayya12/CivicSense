import { NextRequest, NextResponse } from "next/server";
import { analyzeComplaint } from "@/services/ai/complaintAnalyzer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, issue_type, description, address, latitude, longitude, imageUrl, language } = body;

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: "Description is required for complaint analysis." },
        { status: 400 }
      );
    }

    const result = await analyzeComplaint({
      category,
      issue_type,
      description,
      address,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      imageUrl,
      language,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Complaint Analysis error:", err);
    return NextResponse.json(
      { error: "Failed to analyze complaint." },
      { status: 500 }
    );
  }
}
