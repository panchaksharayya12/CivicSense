"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CitizenSidebar } from "@/components/CitizenSidebar";
import { CivicSenseAIChat } from "@/components/CivicSenseAIChat";
import { Helpline, CivicDomain } from "@/types";
import { CIVIC_DOMAINS } from "@/lib/constants";
import {
  PhoneCall,
  AlertTriangle,
  ShieldAlert,
  Flame,
  Droplets,
  Car,
  Lightbulb,
  Building,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export default function HelpEmergencyPage() {
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  useEffect(() => {
    fetchHelplines();
  }, [selectedCategory]);

  const fetchHelplines = async () => {
    try {
      setLoading(true);
      const url =
        selectedCategory === "all"
          ? "/api/helplines"
          : `/api/helplines?category=${selectedCategory}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setHelplines(data.helplines || []);
      }
    } catch (err) {
      console.error("Failed to load helplines", err);
    } finally {
      setLoading(false);
    }
  };

  const emergencyHelplines = helplines.filter((h) => h.is_emergency);
  const civicHelplines = helplines.filter((h) => !h.is_emergency);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <CitizenSidebar onOpenAIChat={() => setAiChatOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Help & Emergency Assistance
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Verified municipal control rooms and 24x7 emergency response services.
            </p>
          </div>

          {/* Urgent Emergency Alert Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-lg shadow-rose-600/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <ShieldAlert className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold">Immediate Life Threat or Severe Emergency?</h2>
                <p className="text-xs text-rose-100 mt-0.5">
                  Dial <strong>112 (National Emergency)</strong> or <strong>101 (Fire & Rescue)</strong> directly.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="tel:112"
                className="px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-700 font-extrabold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 112 Now</span>
              </a>
              <a
                href="tel:101"
                className="px-4 py-2.5 bg-rose-800 hover:bg-rose-900 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Call 101</span>
              </a>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Helplines
            </button>
            <button
              onClick={() => setSelectedCategory("emergency")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === "emergency"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Emergency & Rescue
            </button>
            <button
              onClick={() => setSelectedCategory("traffic")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === "traffic"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Traffic & Roads
            </button>
            <button
              onClick={() => setSelectedCategory("water")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === "water"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Water Supply (BWSSB)
            </button>
            <button
              onClick={() => setSelectedCategory("streetlights")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === "streetlights"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Electricity (BESCOM)
            </button>
          </div>

          {/* Emergency Services Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Primary Emergency Numbers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {emergencyHelplines.map((hl) => (
                <div
                  key={hl.id}
                  className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs hover:border-rose-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                        Emergency
                      </span>
                      <PhoneCall className="w-4 h-4 text-rose-500" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{hl.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {hl.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xl font-extrabold text-slate-900 tracking-wider">
                      {hl.number}
                    </span>
                    <a
                      href={`tel:${hl.number}`}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Civic Services Grid */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Municipal Utility & Department Helplines</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {civicHelplines.map((hl) => (
                <div
                  key={hl.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {hl.category}
                      </span>
                      <Building className="w-4 h-4 text-slate-400" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{hl.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {hl.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-700 tracking-wider">
                      {hl.number}
                    </span>
                    <a
                      href={`tel:${hl.number}`}
                      className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Call Desk
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <CivicSenseAIChat isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}
