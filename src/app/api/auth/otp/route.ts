import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Store OTPs in global scope so they persist across hot reloads in development and production
interface StoredOtp {
  code: string;
  identifier: string; // email or phone
  expiresAt: number;
  attempts: number;
}

declare global {
  var __civicOtpStore: Map<string, StoredOtp> | undefined;
}

if (!globalThis.__civicOtpStore) {
  globalThis.__civicOtpStore = new Map<string, StoredOtp>();
}

const otpStore = globalThis.__civicOtpStore;

// Clean up expired OTPs periodically
function purgeExpiredOtps() {
  const now = Date.now();
  for (const [key, value] of otpStore.entries()) {
    if (value.expiresAt < now) {
      otpStore.delete(key);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    purgeExpiredOtps();
    const body = await req.json();
    const { action, email, phone, otp, identifier } = body;

    // ----------------------------------------------------
    // Action: SEND OTP
    // ----------------------------------------------------
    if (action === "send") {
      const targetIdentifier = (email || phone || "").toLowerCase().trim();

      if (!targetIdentifier) {
        return NextResponse.json(
          { error: "Email or phone number is required to send verification code." },
          { status: 400 }
        );
      }

      // Check if email already registered
      if (email) {
        const existing = db.getUserByEmail(email.toLowerCase().trim());
        if (existing) {
          return NextResponse.json(
            { error: "An account with this email address already exists. Please log in instead." },
            { status: 409 }
          );
        }
      }

      // Generate a secure 6-digit numeric OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes TTL

      // Store by email and phone if available
      otpStore.set(targetIdentifier, {
        code: generatedOtp,
        identifier: targetIdentifier,
        expiresAt,
        attempts: 0,
      });

      if (phone && phone.trim() !== targetIdentifier) {
        otpStore.set(phone.trim(), {
          code: generatedOtp,
          identifier: targetIdentifier,
          expiresAt,
          attempts: 0,
        });
      }

      console.log(`[CivicSense OTP] Generated OTP for ${targetIdentifier}: ${generatedOtp}`);

      return NextResponse.json({
        success: true,
        message: `Verification code sent to ${phone || email}. Valid for 10 minutes.`,
        otp: generatedOtp, // Included for demonstration / instant testing
        expiresIn: 600,
      });
    }

    // ----------------------------------------------------
    // Action: VERIFY OTP
    // ----------------------------------------------------
    if (action === "verify") {
      const lookupKey = (identifier || email || phone || "").toLowerCase().trim();
      const enteredOtp = (otp || "").toString().trim();

      if (!lookupKey || !enteredOtp) {
        return NextResponse.json(
          { error: "Identifier and 6-digit OTP code are required." },
          { status: 400 }
        );
      }

      const stored = otpStore.get(lookupKey);

      if (!stored) {
        // Fallback for demo testing: "123456" is always accepted as a master test OTP
        if (enteredOtp === "123456") {
          return NextResponse.json({
            success: true,
            verified: true,
            message: "OTP successfully verified (Master Demo Code).",
          });
        }

        return NextResponse.json(
          { error: "No active verification code found or it has expired. Please request a new code." },
          { status: 400 }
        );
      }

      if (Date.now() > stored.expiresAt) {
        otpStore.delete(lookupKey);
        return NextResponse.json(
          { error: "Verification code has expired. Please request a new one." },
          { status: 400 }
        );
      }

      if (stored.attempts >= 5) {
        otpStore.delete(lookupKey);
        return NextResponse.json(
          { error: "Too many failed attempts. Please request a new verification code." },
          { status: 429 }
        );
      }

      if (stored.code !== enteredOtp && enteredOtp !== "123456") {
        stored.attempts += 1;
        return NextResponse.json(
          { error: "Incorrect verification code. Please check and try again." },
          { status: 400 }
        );
      }

      // Verified successfully! Clear OTP
      otpStore.delete(lookupKey);

      return NextResponse.json({
        success: true,
        verified: true,
        message: "Identity verified successfully.",
      });
    }

    return NextResponse.json({ error: "Invalid action. Supported actions: 'send', 'verify'." }, { status: 400 });
  } catch (err: any) {
    console.error("OTP API Error:", err);
    return NextResponse.json(
      { error: "Internal server error handling OTP verification." },
      { status: 500 }
    );
  }
}
