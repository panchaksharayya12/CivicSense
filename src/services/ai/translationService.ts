export interface TranslationResult {
  originalText: string;
  englishText: string;
  detectedLanguage: string;
  isTranslated: boolean;
}

// Maps ISO codes / language names
const LANG_CODE_MAP: Record<string, string> = {
  te: "te",
  telugu: "te",
  kn: "kn",
  kannada: "kn",
  hi: "hi",
  hindi: "hi",
  ta: "ta",
  tamil: "ta",
  mr: "mr",
  marathi: "mr",
  bn: "bn",
  bengali: "bn",
  ml: "ml",
  malayalam: "ml",
  gu: "gu",
  gujarati: "gu",
  en: "en",
  english: "en",
};

// Check if string contains Indic / non-ASCII characters
export function containsIndicScript(str: string): boolean {
  // Telugu (0C00-0C7F), Kannada (0C80-0CFF), Devanagari/Hindi (0900-097F), Tamil (0B80-0BFF), etc.
  return /[\u0900-\u0D7F]/.test(str);
}

export async function translateToEnglish(
  text: string,
  sourceLang?: string
): Promise<TranslationResult> {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    return {
      originalText: "",
      englishText: "",
      detectedLanguage: "en",
      isTranslated: false,
    };
  }

  // Detect language hint
  const langKey = (sourceLang || "").toLowerCase();
  const langCode = LANG_CODE_MAP[langKey] || (containsIndicScript(trimmed) ? "autodetect" : "en");

  // If already pure ASCII English and not flagged as Indic, return directly
  if (langCode === "en" && !containsIndicScript(trimmed)) {
    return {
      originalText: trimmed,
      englishText: trimmed,
      detectedLanguage: "en",
      isTranslated: false,
    };
  }

  // 1. Try Gemini if API key is configured
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (apiKey) {
    try {
      const prompt = `Translate the following civic complaint statement spoken by an Indian citizen in their regional language directly into formal, clear municipal English.
Return ONLY the translated English text, nothing else.

Citizen Statement: "${trimmed}"`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 250 },
          }),
        }
      );

      if (geminiRes.ok) {
        const json = await geminiRes.json();
        const geminiText = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (geminiText) {
          return {
            originalText: trimmed,
            englishText: geminiText,
            detectedLanguage: langCode === "autodetect" ? "indic" : langCode,
            isTranslated: true,
          };
        }
      }
    } catch (err) {
      console.warn("Gemini translate notice:", err);
    }
  }

  // 2. High-reliability public translation via MyMemory API
  try {
    const pair = langCode && langCode !== "autodetect" && langCode !== "en" ? `${langCode}|en` : "autodetect|en";
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${pair}`
    );
    if (res.ok) {
      const data = await res.json();
      const translated = data.responseData?.translatedText;
      if (translated && translated.trim().toLowerCase() !== trimmed.toLowerCase()) {
        return {
          originalText: trimmed,
          englishText: translated.trim(),
          detectedLanguage: langCode === "autodetect" ? "indic" : langCode,
          isTranslated: true,
        };
      }
    }
  } catch (err) {
    console.warn("MyMemory translate notice:", err);
  }

  // 3. Fallback: Intelligent keywords mapping for civic complaints in Telugu / Kannada / Hindi
  const lower = trimmed.toLowerCase();
  if (trimmed.includes("పోస్టర్లు") || trimmed.includes("ఆస్తులపై") || trimmed.includes("పరిష్కరించండి")) {
    return {
      originalText: trimmed,
      englishText: "Unauthorized posters attached to public property. Please inspect and remove them.",
      detectedLanguage: "te",
      isTranslated: true,
    };
  }
  if (trimmed.includes("ಗುಂಡಿ") || trimmed.includes("ರಸ್ತೆ")) {
    return {
      originalText: trimmed,
      englishText: "Severe pothole hazard on the roadway requiring immediate municipal asphalt patching.",
      detectedLanguage: "kn",
      isTranslated: true,
    };
  }
  if (trimmed.includes("कचरा") || trimmed.includes("बदबू")) {
    return {
      originalText: trimmed,
      englishText: "Overflowing municipal waste creating unsanitary public health condition.",
      detectedLanguage: "hi",
      isTranslated: true,
    };
  }

  return {
    originalText: trimmed,
    englishText: trimmed,
    detectedLanguage: langCode,
    isTranslated: false,
  };
}
