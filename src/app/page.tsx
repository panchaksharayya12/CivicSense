"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { SmartCityIllustration } from "@/components/SmartCityIllustration";
import { CIVIC_DOMAINS } from "@/lib/constants";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Trash2,
  Car,
  Droplets,
  Lightbulb,
  AlertTriangle,
  Accessibility,
  Bus,
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  Layers,
  Flame,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [trackAppId, setTrackAppId] = useState("");

  const iconMap: Record<string, any> = {
    Trash2,
    Car,
    Droplets,
    Lightbulb,
    AlertTriangle,
    Accessibility,
    Bus,
    Cpu,
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackAppId.trim()) {
      router.push(`/status?id=${encodeURIComponent(trackAppId.trim())}`);
    } else {
      router.push("/status");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>Next-Gen Smart City Grievance & Incident Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                {t.heroTitle1 || "From Citizen Voice"} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  {t.heroTitle2 || "to City Action."}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                {t.heroSubtitle ||
                  "Report civic issues, track progress, and help build a cleaner, safer, smarter city — together. Powered by location intelligence and AI incident consolidation."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/report"
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <span>{t.heroReportBtn || "Report a Problem"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/status"
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-300 shadow-xs transition-all hover:border-slate-400"
                >
                  {t.heroTrackBtn || "Track Your Complaint"}
                </Link>
              </div>

              {/* Quick Status Lookup Input */}
              <form onSubmit={handleTrack} className="pt-2 max-w-md">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={trackAppId}
                    onChange={(e) => setTrackAppId(e.target.value)}
                    placeholder={t.heroLookupPlaceholder || "Enter Application No (e.g. CS-2026-00001)..."}
                    className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl pl-3.5 pr-24 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    {t.heroTrackNow || "Track Now"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right City Skyline Card Banner matching screenshot */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-1 group">
                <div className="relative rounded-[22px] overflow-hidden bg-slate-900 aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src="/images/smart_city_cinematic.jpg"
                    alt="CivicSense High-Tech Smart City & Municipal Command Center"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none"></div>

                  {/* Overlaid Smart City Banner Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 shadow-2xl">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                            Smart City AI Infrastructure
                          </span>
                        </div>
                        <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                          Smarter Cities, Happier Citizens
                        </h2>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                          Civic intelligence connecting citizen voice directly to municipal action.
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shadow-md shrink-0">
                        AI
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Major Civic Domains Grid matching screenshot */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Municipal Services
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Select a Domain to Report
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Our AI automatically detects the category from your description or voice, or you can pick directly:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {CIVIC_DOMAINS.map((domain) => {
              const Icon = iconMap[domain.iconName] || Cpu;
              return (
                <Link
                  key={domain.id}
                  href={`/report?domain=${domain.id}`}
                  className="flex flex-col items-center p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all group text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-3 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 line-clamp-2">
                    {domain.shortName}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Innovation & Project Overview Banner matching screenshot (bottom right panel) */}
      <section id="about" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The CivicSense Innovation Story</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                How CivicSense Solves City-Scale Grievances
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Instead of treating 47 duplicate calls as 47 separate tasks, our location-aware AI consolidates them into 1 coordinated municipal action.
              </p>
            </div>

            {/* Stepper Diagram matching Screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center max-w-5xl mx-auto text-center">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold mb-2 shadow-md">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Citizen Voice</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Text or voice typing in 13 Indian languages
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-100 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-bold mb-2 shadow-md">
                  <Cpu className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">AI Understanding</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  NLP domain extraction & severity rating
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold mb-2 shadow-md">
                  <Car className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Location-Aware</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  GIS clustering & geospatial proximity
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col items-center ring-2 ring-purple-400">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold mb-2 shadow-md">
                  <Layers className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-purple-900 text-sm">Smart Consolidation</h4>
                <p className="text-[11px] text-purple-700 font-semibold mt-1">
                  Groups duplicate neighborhood reports into unified municipal work orders
                </p>
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-2 shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Municipal Action</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Coordinated dispatch & live citizen updates
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Larger impact. Stronger communities. Smarter cities.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">CivicSense</span>
            <span>—</span>
            <span>From Citizen Voice to City Action.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/help" className="hover:text-white">Emergency Helplines</Link>
            <Link href="/report" className="hover:text-white">Report Issue</Link>
            <Link href="/login" className="hover:text-white">Admin Command</Link>
          </div>
          <div>© 2026 CivicSense Municipal Intelligence Core. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
