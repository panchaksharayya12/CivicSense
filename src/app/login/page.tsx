"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CivicLogo } from "@/components/CivicLogo";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { INITIAL_DEPARTMENTS } from "@/lib/constants";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  FileCheck2,
  TrendingUp,
  Sparkles,
  Loader2,
  Building2,
  CheckCircle2,
  Globe,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<"citizen" | "admin">("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(INITIAL_DEPARTMENTS[0].name);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await login(email.trim(), password);
      if (res.success && res.user) {
        if (res.user.role === "admin") {
          // Save officer selected department
          if (typeof window !== "undefined") {
            localStorage.setItem("civicsense_officer_dept", selectedDepartment);
          }
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setErrorMsg(res.error || "Invalid credentials.");
      }
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: "citizen" | "admin", dept?: string) => {
    setLoading(true);
    setErrorMsg(null);
    if (dept && typeof window !== "undefined") {
      localStorage.setItem("civicsense_officer_dept", dept);
    }
    const success = await demoLogin(role);
    setLoading(false);
    if (success) {
      router.push(role === "admin" ? "/admin" : "/dashboard");
    } else {
      setErrorMsg("Failed to log in with demo account.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Form Panel */}
      <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div className="flex items-center justify-between">
          <CivicLogo size="md" />
          <LanguageSelector variant="navbar" />
        </div>

        <div className="max-w-md w-full mx-auto my-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.navLogin || "Welcome Back"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Select your role and language to access CivicSense
            </p>
          </div>

          {/* Portal Tabs: Citizen vs Municipal Officer */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => {
                setActiveTab("citizen");
                setEmail("rashmi@civicsense.in");
                setPassword("citizen123");
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "citizen"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Citizen Portal
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("admin");
                setEmail("admin@civicsense.in");
                setPassword("admin123");
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "admin"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Officer Command</span>
            </button>
          </div>

          {/* Preferred Language Selection in Form */}
          <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <LanguageSelector variant="form" />
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Department Suggestion for Officers */}
            {activeTab === "admin" && (
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Officer Department Suggestion *</span>
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full text-xs font-semibold bg-white border border-blue-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                >
                  {INITIAL_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name} ({dept.officer_count} Officers)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-blue-700">
                  Select your assigned municipal division for tailored operational queue routing.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {activeTab === "admin" ? "Officer Email / Official ID" : "Email or Phone Number"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activeTab === "admin" ? "admin@civicsense.in" : "rashmi@civicsense.in or phone"
                  }
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a
                  href="#demo"
                  onClick={(e) => {
                    e.preventDefault();
                    if (activeTab === "admin") {
                      setPassword("admin123");
                      setEmail("admin@civicsense.in");
                    } else {
                      setPassword("citizen123");
                      setEmail("rashmi@civicsense.in");
                    }
                  }}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Auto-fill demo credentials
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>
                  {activeTab === "admin" ? "Login to Command Center" : t.navLogin || "Login"}
                </span>
              )}
            </button>
          </form>

          {/* Quick Demo Access Box */}
          <div className="mt-6">
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-left">
              <div className="flex items-center gap-1.5 text-blue-800 font-bold text-xs mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>One-Click Instant Evaluation Login</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("citizen")}
                  className="py-2 px-2.5 bg-white text-blue-700 font-bold text-xs rounded-xl border border-blue-200 hover:bg-blue-100/50 shadow-2xs transition-all text-center"
                >
                  Citizen (Rashmi)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("admin", selectedDepartment)}
                  className="py-2 px-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-2xs transition-all text-center"
                >
                  Admin Command
                </button>
              </div>
            </div>

            <p className="text-xs text-center text-slate-600 mt-4">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-blue-600 hover:underline"
              >
                {t.navRegister || "Register"}
              </Link>
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 text-center">
          CivicSense Smart City Platform • Powered by AI Incident Intelligence
        </div>
      </div>

      {/* Right Brand / Illustration Panel */}
      <div className="hidden lg:col-span-6 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 flex justify-end">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold border border-white/20">
            Citizen & Municipal Command
          </span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-cyan-300" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            “From Citizen Voice to City Action.”
          </h2>

          <p className="text-blue-100 text-sm leading-relaxed">
            Empowering citizens across 6 Indian languages with automated AI grievance routing, GIS location intelligence, and consolidated municipal action.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="p-3.5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
              <p className="text-xl font-extrabold text-cyan-300">6+</p>
              <p className="text-xs text-blue-200">Indian Languages</p>
            </div>
            <div className="p-3.5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
              <p className="text-xl font-extrabold text-emerald-300">100%</p>
              <p className="text-xs text-blue-200">Real-Time Sync</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-blue-200">
          Secure Municipal Grievance Architecture • Next.js 14
        </div>
      </div>
    </div>
  );
}
