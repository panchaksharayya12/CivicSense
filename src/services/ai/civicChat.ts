import { CivicDomain } from "@/types";
import { CIVIC_DOMAINS, INDIAN_LANGUAGES } from "@/lib/constants";

interface ChatResponse {
  text: string;
  detectedLanguage: string;
  actionButton?: {
    label: string;
    href: string;
    domain?: CivicDomain;
    issue?: string;
  };
}

// System prompt for CivicSense AI Guide - Simple, friendly, and strictly star-free
const SYSTEM_PROMPT = `
You are CivicSense AI, a friendly, warm, and helpful municipal assistant for citizens.

IMPORTANT CONVERSATIONAL GUIDELINES:
1. Use simple, conversational, everyday words. Avoid complex words, technical terms, and bureaucratic jargon.
2. Keep your sentences short, friendly, and easy to understand for elderly citizens and anyone not comfortable with technology.
3. Guide the citizen step-by-step on how to report their civic problem on this website.
4. CRITICAL: NEVER use asterisks or star symbols (* or **). DO NOT use markdown bold with stars. Output clean, plain text without any stars.
5. If the user speaks in an Indian language (like Hindi, Kannada, Telugu, Tamil, Marathi, etc.), reply warmly in the same language or polite, simple English.
6. Always end with an encouraging sentence and tell them they can click the button below to report directly.
`;

export async function processCivicChat(
  message: string,
  history: { role: "user" | "model"; parts: string }[] = [],
  preferredLang?: string
): Promise<ChatResponse> {
  const query = message.trim();
  const lowerQuery = query.toLowerCase();

  // Try calling Gemini API if key is provided
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${SYSTEM_PROMPT}\n\nCitizen Question: "${query}"\nAnswer warmly and clearly. Remember: DO NOT USE ANY STARS OR ASTERISKS (* or **).`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 400,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        let candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (candidateText) {
          // Strictly strip all stars and asterisks
          candidateText = cleanStarsAndJargon(candidateText);
          const action = extractActionFromQuery(query);
          return {
            text: candidateText,
            detectedLanguage: detectLanguageFromText(query),
            actionButton: action,
          };
        }
      }
    } catch (err) {
      console.warn("External Gemini API call notice, using built-in friendly assistant engine:", err);
    }
  }

  // Built-in simple, communicable, star-free civic guidance engine
  return generateFriendlyCivicGuide(query, preferredLang);
}

function cleanStarsAndJargon(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/_{1,2}/g, "")
    .replace(/#{1,6}\s?/g, "")
    .replace(/`{1,3}/g, "")
    .trim();
}

function detectLanguageFromText(text: string): string {
  if (/[\u0C80-\u0CFF]/.test(text)) return "Kannada";
  if (/[\u0900-\u097F]/.test(text)) return "Hindi";
  if (/[\u0C00-\u0C7F]/.test(text)) return "Telugu";
  if (/[\u0B80-\u0BFF]/.test(text)) return "Tamil";
  if (/[\u0D00-\u0D7F]/.test(text)) return "Malayalam";
  if (/[\u0980-\u09FF]/.test(text)) return "Bengali";
  if (/[\u0A80-\u0AFF]/.test(text)) return "Gujarati";
  if (/[\u0A00-\u0A7F]/.test(text)) return "Punjabi";
  if (/[\u0600-\u06FF]/.test(text)) return "Urdu";

  const lower = text.toLowerCase();
  if (
    lower.includes("nanna") ||
    lower.includes("mane") ||
    lower.includes("hatra") ||
    lower.includes("neeru") ||
    lower.includes("alli") ||
    lower.includes("agide")
  ) {
    return "Kannada";
  }
  if (
    lower.includes("mera") ||
    lower.includes("paani") ||
    lower.includes("kachra") ||
    lower.includes("gaddha") ||
    lower.includes("sadak") ||
    lower.includes("hai")
  ) {
    return "Hindi";
  }
  if (
    lower.includes("naa") ||
    lower.includes("illu") ||
    lower.includes("daggar") ||
    lower.includes("cheyandi") ||
    lower.includes("undi")
  ) {
    return "Telugu";
  }

  return "English";
}

function extractActionFromQuery(query: string) {
  const lower = query.toLowerCase();

  if (
    lower.includes("pothole") ||
    lower.includes("hole") ||
    lower.includes("gaddha") ||
    lower.includes("road") ||
    lower.includes("rasta") ||
    lower.includes("gundi") ||
    lower.includes("accident") ||
    lower.includes("traffic")
  ) {
    return {
      label: "Report a Pothole Now →",
      href: "/report?domain=traffic&issue=Pothole",
      domain: "traffic" as CivicDomain,
      issue: "Pothole",
    };
  }

  if (
    lower.includes("water") ||
    lower.includes("leak") ||
    lower.includes("neeru") ||
    lower.includes("paani") ||
    lower.includes("neellu") ||
    lower.includes("drain") ||
    lower.includes("pipe")
  ) {
    return {
      label: "Report Water Leakage Now →",
      href: "/report?domain=water&issue=Water Leakage",
      domain: "water" as CivicDomain,
      issue: "Water Leakage",
    };
  }

  if (
    lower.includes("garbage") ||
    lower.includes("waste") ||
    lower.includes("kachra") ||
    lower.includes("bin") ||
    lower.includes("dump") ||
    lower.includes("clean") ||
    lower.includes("chetta") ||
    lower.includes("kasavu")
  ) {
    return {
      label: "Report Garbage Issue Now →",
      href: "/report?domain=waste&issue=Overflowing Garbage Bin",
      domain: "waste" as CivicDomain,
      issue: "Overflowing Garbage Bin",
    };
  }

  if (
    lower.includes("light") ||
    lower.includes("lamp") ||
    lower.includes("dark") ||
    lower.includes("streetlight") ||
    lower.includes("pole")
  ) {
    return {
      label: "Report Broken Streetlight Now →",
      href: "/report?domain=streetlights&issue=Streetlight Not Working",
      domain: "streetlights" as CivicDomain,
      issue: "Streetlight Not Working",
    };
  }

  if (
    lower.includes("emergency") ||
    lower.includes("fire") ||
    lower.includes("flood") ||
    lower.includes("tree") ||
    lower.includes("hazard") ||
    lower.includes("danger")
  ) {
    return {
      label: "Report Emergency Hazard Now →",
      href: "/report?domain=emergency&issue=Flood / Waterlogging",
      domain: "emergency" as CivicDomain,
      issue: "Flood / Waterlogging",
    };
  }

  if (
    lower.includes("footpath") ||
    lower.includes("ramp") ||
    lower.includes("walk") ||
    lower.includes("wheelchair") ||
    lower.includes("accessible")
  ) {
    return {
      label: "Report Footpath Issue Now →",
      href: "/report?domain=accessibility&issue=Blocked Footpath",
      domain: "accessibility" as CivicDomain,
      issue: "Blocked Footpath",
    };
  }

  if (
    lower.includes("bus") ||
    lower.includes("transit") ||
    lower.includes("transport")
  ) {
    return {
      label: "Report Bus Issue Now →",
      href: "/report?domain=public_transport&issue=Bus Delay",
      domain: "public_transport" as CivicDomain,
      issue: "Bus Delay",
    };
  }

  return {
    label: "Open Problem Report Form →",
    href: "/report",
  };
}

function generateFriendlyCivicGuide(query: string, preferredLang?: string): ChatResponse {
  const lower = query.toLowerCase();
  const lang = detectLanguageFromText(query);

  // Telugu response
  if (
    lang === "Telugu" ||
    lower.includes("daggar") ||
    lower.includes("cheyandi") ||
    lower.includes("undi") ||
    lower.includes("samasyalu")
  ) {
    return {
      text: `నమస్కారం! మీ ప్రాంతంలోని సమస్యను పరిష్కరించడంలో నేను మీకు సహాయం చేస్తాను.

మీరు చాలా సులభంగా 3 అడుగుల్లో సమస్యను నివేదించవచ్చు:
1. క్రింద ఉన్న బటన్ పై క్లిక్ చేయండి.
2. మైక్రోఫోన్ బటన్ నొక్కి మీ సమస్యను తెలుగులో మాట్లాడండి లేదా టైప్ చేయండి.
3. మీ లొకేషన్ సరిచూసుకుని సమర్పించండి (Submit).

మా మున్సిపల్ అధికారులు త్వరగా పరిశీలించి చర్య తీసుకుంటారు. క్రింద ఉన్న బటన్ క్లిక్ చేసి వెంటనే ప్రారంభించండి!`,
      detectedLanguage: "Telugu",
      actionButton: extractActionFromQuery(query),
    };
  }

  // Kannada response
  if (
    lang === "Kannada" ||
    lower.includes("neeru") ||
    lower.includes("mane") ||
    lower.includes("hatra") ||
    lower.includes("agide")
  ) {
    return {
      text: `ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಪ್ರದೇಶದ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಲು ನಾನು ನಿಮಗೆ ಸುಲಭವಾಗಿ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತೇನೆ.

ವರದಿ ಮಾಡಲು 3 ಸರಳ ಹಂತಗಳು:
1. ಕೆಳಗಿನ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.
2. ಮೈಕ್ ಬಟನ್ ಒತ್ತಿ ನಿಮ್ಮ ಧ್ವನಿಯ ಮೂಲಕ ಕನ್ನಡದಲ್ಲೇ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.
3. ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪರಿಶೀಲಿಸಿ ಸಬ್ಮಿಟ್ (Submit) ಮಾಡಿ.

ನಮ್ಮ ಪಾಲಿಕೆ ಅಧಿಕಾರಿಗಳು ತಕ್ಷಣ ಕ್ರಮ ಕೈಗೊಳ್ಳುತ್ತಾರೆ. ಈಗಲೇ ವರದಿ ಮಾಡಲು ಕೆಳಗಿನ ಬಟನ್ ಬಳಸಿ!`,
      detectedLanguage: "Kannada",
      actionButton: extractActionFromQuery(query),
    };
  }

  // Hindi response
  if (
    lang === "Hindi" ||
    lower.includes("gaddha") ||
    lower.includes("kachra") ||
    lower.includes("sadak") ||
    lower.includes("paani") ||
    lower.includes("karo")
  ) {
    return {
      text: `नमस्ते! आपकी समस्या को हल कराने में मैं आपकी पूरी मदद करूँगा।

शिकायत दर्ज करना बहुत ही आसान है:
1. नीचे दिए गए बटन पर क्लिक करें।
2. माइक बटन दबाकर बोलें या लिखकर अपनी समस्या बताएं।
3. लोकेशन चेक करके सबमिट (Submit) कर दें।

नगर निगम के संबंधित अधिकारी तुरंत इस पर काम शुरू करेंगे। नीचे दिए गए बटन पर क्लिक करके अभी रिपोर्ट करें!`,
      detectedLanguage: "Hindi",
      actionButton: extractActionFromQuery(query),
    };
  }

  // Pothole / Road query
  if (
    lower.includes("pothole") ||
    lower.includes("road") ||
    lower.includes("hole") ||
    lower.includes("crater") ||
    lower.includes("asphalt") ||
    lower.includes("tar")
  ) {
    return {
      text: `Don't worry, we can get this road problem fixed quickly!

Here is how you can report it in seconds:
1. Click the button below to open the report form.
2. Describe where the pothole or damaged road is. You can even use the microphone to speak naturally!
3. The map will automatically find your location, or you can drag the red pin to the exact spot.
4. Click Submit.

Our road maintenance team will receive the repair order immediately!`,
      detectedLanguage: "English",
      actionButton: {
        label: "Report a Pothole Now →",
        href: "/report?domain=traffic&issue=Pothole",
        domain: "traffic",
        issue: "Pothole",
      },
    };
  }

  // Water Leakage query
  if (
    lower.includes("water") ||
    lower.includes("leak") ||
    lower.includes("pipe") ||
    lower.includes("drainage") ||
    lower.includes("supply")
  ) {
    return {
      text: `Clean water is precious, and we want to stop any leak as soon as possible!

To report water leakage or pipeline damage:
1. Click the button below to open the form.
2. Tell us what is happening, like a broken pipe or overflowing drain.
3. Confirm your location on the map.
4. If you have a photo, you can add it, or simply submit without a photo.

Our water board technicians will be notified right away to fix it!`,
      detectedLanguage: "English",
      actionButton: {
        label: "Report Water Leakage Now →",
        href: "/report?domain=water&issue=Water Leakage",
        domain: "water",
        issue: "Water Leakage",
      },
    };
  }

  // Garbage / Waste query
  if (
    lower.includes("garbage") ||
    lower.includes("waste") ||
    lower.includes("bin") ||
    lower.includes("trash") ||
    lower.includes("dump") ||
    lower.includes("cleaning") ||
    lower.includes("smell")
  ) {
    return {
      text: `We will help you get your neighborhood clean and fresh again!

Follow these 3 easy steps:
1. Click the button below to report the garbage issue.
2. Let us know if the bin is overflowing or if there is illegal dumping on the street.
3. Check your location and press Submit.

The municipal sanitation crew will schedule pickup and cleanup!`,
      detectedLanguage: "English",
      actionButton: {
        label: "Report Garbage Issue Now →",
        href: "/report?domain=waste&issue=Overflowing Garbage Bin",
        domain: "waste",
        issue: "Overflowing Garbage Bin",
      },
    };
  }

  // Streetlights query
  if (
    lower.includes("streetlight") ||
    lower.includes("light") ||
    lower.includes("dark") ||
    lower.includes("lamp") ||
    lower.includes("bulb")
  ) {
    return {
      text: `Dark streets can be unsafe, so let us help you get the streetlights turned back on!

To report a broken streetlight:
1. Click the button below.
2. Mention the street name or pole number if you can see it.
3. Mark the location on the map and click Submit.

Our electrical engineering team will dispatch a repair vehicle to fix the light!`,
      detectedLanguage: "English",
      actionButton: {
        label: "Report Broken Streetlight Now →",
        href: "/report?domain=streetlights&issue=Streetlight Not Working",
        domain: "streetlights",
        issue: "Streetlight Not Working",
      },
    };
  }

  // Emergency query
  if (
    lower.includes("emergency") ||
    lower.includes("flood") ||
    lower.includes("fire") ||
    lower.includes("tree") ||
    lower.includes("accident") ||
    lower.includes("urgent") ||
    lower.includes("danger")
  ) {
    return {
      text: `Please stay safe!

If there is an immediate threat to life, severe fire, or medical crisis, please call emergency services directly:
• Police & General Emergency: Call 112
• Fire & Rescue: Call 101
• Ambulance & Medical: Call 108

For fallen trees, blocked storm drains, or flooded roads:
Click the button below to alert our city disaster response team right away!`,
      detectedLanguage: "English",
      actionButton: {
        label: "Report Emergency Hazard Now →",
        href: "/report?domain=emergency&issue=Flood / Waterlogging",
        domain: "emergency",
        issue: "Flood / Waterlogging",
      },
    };
  }

  // Status Tracking query
  if (
    lower.includes("status") ||
    lower.includes("track") ||
    lower.includes("check") ||
    lower.includes("application") ||
    lower.includes("progress")
  ) {
    return {
      text: `You can track your report live at any time!

1. Open the Status page from the menu or dashboard.
2. Enter your Application Number (like CS-2026-00001).
3. You will see a clear step-by-step progress bar showing when the issue is verified, assigned to an officer, in progress, and resolved!`,
      detectedLanguage: "English",
      actionButton: {
        label: "Check Complaint Status Now →",
        href: "/status",
      },
    };
  }

  // General warm friendly assistant default response
  return {
    text: `Hi! I am your CivicSense City Assistant.

I am here to help you solve civic problems in our city. Tell me what issue you are seeing, such as:
• Broken roads or potholes
• Overflowing garbage bins
• Leaking water pipes
• Non-working streetlights
• Fallen trees or flooded areas
• Blocked footpaths or bus issues

You can type or speak in your own language. What can I help you report today?`,
    detectedLanguage: "English",
    actionButton: {
      label: "Report a Civic Problem Now →",
      href: "/report",
    },
  };
}
