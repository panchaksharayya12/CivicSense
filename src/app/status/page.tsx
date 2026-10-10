"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { CitizenSidebar } from "@/components/CitizenSidebar";
import { CivicSenseAIChat } from "@/components/CivicSenseAIChat";
import { useLanguage } from "@/lib/LanguageContext";
import { Search, ArrowRight, ShieldCheck, FileText, Loader2 } from "lucide-react";

function StatusLookupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [appId, setAppId] = useState("");
  const [aiChatOpen, setAiChatOpen] = useState(false);

  useEffect(() => {
    const idParam = searchParams.get("id");
    if (idParam) {
      router.push(`/status/${idParam}`);
    }
  }, [searchParams, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (appId.trim()) {
      router.push(`/status/${appId.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <CitizenSidebar onOpenAIChat={() => setAiChatOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-xl mx-auto py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-md">
              <Search className="w-8 h-8" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.heroTrackBtn || "Track Your Complaint Status"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Enter your unique Application Number to view live status, timeline progression, and field officer notes.
            </p>

            <form onSubmit={handleSearch} className="pt-4 max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  required
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="e.g. CS-2026-00147"
                  className="w-full text-sm bg-white border border-slate-300 rounded-2xl pl-4 pr-32 py-3.5 text-slate-900 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs uppercase"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>{t.notifTrackBtn || t.trackStatus || "Track"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Quick demo links */}
            <div className="pt-6 border-t border-slate-200 mt-6">
              <p className="text-xs text-slate-400 mb-2">Try sample application numbers:</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/status/CS-2026-00147")}
                  className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200"
                >
                  CS-2026-00147 (Pothole - In Progress)
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/status/CS-2026-00132")}
                  className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200"
                >
                  CS-2026-00132 (Water Leakage)
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/status/CS-2026-00118")}
                  className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200"
                >
                  CS-2026-00118 (Garbage Overflow)
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <CivicSenseAIChat isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}

export default function StatusLookupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <StatusLookupContent />
    </Suspense>
  );
}
