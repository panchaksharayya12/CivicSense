import { NextRequest, NextResponse } from "next/server";
import { translateToEnglish } from "@/services/ai/translationService";

export async function POST(req: NextRequest) {
  try {
    const { text, language } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required for translation." },
        { status: 400 }
      );
    }

    const result = await translateToEnglish(text, language);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    console.error("Translation API error:", err);
    return NextResponse.json(
      { error: "Translation request failed.", originalText: "", englishText: "" },
      { status: 500 }
    );
  }
}
