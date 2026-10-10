"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CivicLogo } from "@/components/CivicLogo";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { INDIAN_LANGUAGES } from "@/lib/constants";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { setLanguage } = useLanguage();

  // Registration Form State
  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [preferredLang, setPreferredLang] = useState("en");
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(60);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
    }
    return () => clearTimeout(timer);
  }, [isCounting, countdown]);

  // Step 1: Send OTP and advance to Step 2
  const handleInitiateOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          email: email.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to send verification code. Please check your email.");
        setLoading(false);
        return;
      }

      // Received OTP code
      if (data.otp) {
        setDemoOtp(data.otp);
      }
      setStep("otp");
      setCountdown(60);
      setIsCounting(true);
      setSuccessMsg(`A 6-digit verification OTP has been sent to ${phone || email}.`);
      
      // Auto-focus first OTP input after DOM renders
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setErrorMsg("Network error occurred while sending verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (isCounting) return;
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          email: email.trim(),
          phone: phone.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.otp) setDemoOtp(data.otp);
        setCountdown(60);
        setIsCounting(true);
        setSuccessMsg("A new verification code has been generated and sent.");
      } else {
        setErrorMsg(data.error || "Failed to resend code.");
      }
    } catch {
      setErrorMsg("Could not resend OTP. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/\D/g, "");
    const newDigits = [...otpDigits];

    if (cleanVal.length > 1) {
      // Pasted multiple digits
      const pasted = cleanVal.slice(0, 6).split("");
      pasted.forEach((ch, idx) => {
        if (idx < 6) newDigits[idx] = ch;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-advance
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    pastedData.split("").forEach((char, idx) => {
      newDigits[idx] = char;
    });
    setOtpDigits(newDigits);

    const targetIndex = Math.min(pastedData.length, 5);
    inputRefs.current[targetIndex]?.focus();
  };

  const handleAutoFillDemoOtp = () => {
    const code = demoOtp || "123456";
    const digits = code.split("").slice(0, 6);
    setOtpDigits(digits);
    inputRefs.current[5]?.focus();
  };

  // Step 2: Verify OTP and Register Account
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      // 1. Verify OTP with backend
      const otpRes = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          identifier: email.trim() || phone.trim(),
          otp: fullOtp,
        }),
      });

      const otpData = await otpRes.json();
      if (!otpRes.ok || !otpData.verified) {
        setErrorMsg(otpData.error || "Incorrect or expired verification code. Please try again.");
        setLoading(false);
        return;
      }

      // 2. OTP is verified! Complete account creation and auto-login
      const registerRes = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
        role: "citizen",
        preferred_language: preferredLang,
      });

      if (registerRes.success) {
        setSuccessMsg("Account successfully verified! Redirecting to your citizen dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        setErrorMsg(registerRes.error || "Failed to register account.");
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMsg("Network error occurred during verification.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <CivicLogo size="lg" className="justify-center mb-4" />
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {step === "details" ? "Create Citizen Account" : "Verify Your Identity"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {step === "details"
            ? "Join thousands of proactive citizens improving their municipal neighborhoods."
            : `Enter the 6-digit OTP code sent to verify your account.`}
        </p>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === "details"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-emerald-500 text-white"
              }`}
            >
              {step === "otp" ? "✓" : "1"}
            </span>
            <span
              className={`text-xs font-semibold ${
                step === "details" ? "text-blue-700" : "text-emerald-700"
              }`}
            >
              Account Details
            </span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === "otp"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              2
            </span>
            <span
              className={`text-xs font-semibold ${
                step === "otp" ? "text-blue-700" : "text-slate-400"
              }`}
            >
              OTP Verification
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-slate-200/80">
          {/* Notifications */}
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================= STEP 1: USER DETAILS ================= */}
          {step === "details" && (
            <form onSubmit={handleInitiateOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rashmi Gowda"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Address (Used for Login & OTP)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Mobile Number (For SMS OTP & Updates)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Civic Language
                </label>
                <select
                  value={preferredLang}
                  onChange={(e) => {
                    setPreferredLang(e.target.value);
                    if (["en", "kn", "hi", "te", "ta", "mr"].includes(e.target.value)) {
                      setLanguage(e.target.value as any);
                    }
                  }}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  {INDIAN_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name} ({lang.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending OTP Verification...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Send OTP & Continue</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 2: OTP VERIFICATION ================= */}
          {step === "otp" && (
            <form onSubmit={handleVerifyAndRegister} className="space-y-5">
              {/* Recipient summary banner */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Verification code sent to:</span>
                  <span className="font-bold text-slate-800">{phone || email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep("details");
                    setErrorMsg(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Edit
                </button>
              </div>

              {/* Demo Mode Instant Helper */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Demo OTP:{" "}
                    <strong className="font-mono text-sm tracking-widest bg-white/80 px-2 py-0.5 rounded border border-amber-300">
                      {demoOtp || "123456"}
                    </strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillDemoOtp}
                  className="px-2.5 py-1 text-xs font-bold text-amber-700 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  ⚡ Auto-fill Code
                </button>
              </div>

              {/* 6 Digit Input Group */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 text-center">
                  Enter 6-Digit One-Time Password
                </label>
                <div className="flex justify-between gap-1.5 sm:gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={idx === 0 ? handlePaste : undefined}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otpDigits.join("").length !== 6}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Activate Account</span>
                  </>
                )}
              </button>

              {/* Resend Actions */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Didn't receive code?</span>
                {isCounting ? (
                  <span className="text-slate-400 font-medium">Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Resend Code
                  </button>
                )}
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-blue-600 hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
