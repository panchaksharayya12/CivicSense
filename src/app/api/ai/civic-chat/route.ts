import { NextRequest, NextResponse } from "next/server";
import { processCivicChat } from "@/services/ai/civicChat";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, preferredLang } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const response = await processCivicChat(message, history, preferredLang);
    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Civic Chat error:", err);
    return NextResponse.json(
      { error: "Failed to process chat query." },
      { status: 500 }
    );
  }
}
