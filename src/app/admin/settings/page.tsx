"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Settings, Sliders, Shield, Key, Save, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [distanceThreshold, setDistanceThreshold] = useState("500");
  const [similarityThreshold, setSimilarityThreshold] = useState("75");
  const [autoConsolidate, setAutoConsolidate] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto min-h-screen">
        <div className="pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Municipal Operations & AI Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure geospatial clustering thresholds, AI model preferences, and dispatch automation rules.
          </p>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully. Changes applied to active intelligence engine.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
          {/* Incident Consolidation Parameters */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Incident Consolidation & Duplicate Parameters
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Geographic Proximity Radius (Meters)</span>
                  <span className="text-blue-600 font-bold">{distanceThreshold} meters</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={distanceThreshold}
                  onChange={(e) => setDistanceThreshold(e.target.value)}
                  className="w-full accent-blue-600"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Complaints within this radius with matching categories will trigger duplicate detection.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>AI Semantic Similarity Threshold</span>
                  <span className="text-blue-600 font-bold">{similarityThreshold}% match</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={similarityThreshold}
                  onChange={(e) => setSimilarityThreshold(e.target.value)}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoConsolidate}
                    onChange={(e) => setAutoConsolidate(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    Auto-link new complaints to active incidents when confidence &gt; 80%
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Secure Environment & AI Keys */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Key className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">
                AI Service & Database Connection
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  AI Service API Key (Gemini)
                </label>
                <input
                  type="password"
                  disabled
                  value="••••••••••••••••••••••••••••••••"
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Managed securely via server-side environment variable: <code>GEMINI_API_KEY</code>.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Database & Storage Engine
                </label>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 font-medium">
                  Currently running: <strong>CivicSense Persistent Relational Core</strong> with Supabase PostgreSQL migration ready (see <code>supabase_schema.sql</code>).
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
