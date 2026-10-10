"use client";

import React, { useState } from "react";
import { CivicSenseAIChat } from "./CivicSenseAIChat";
import { Bot, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

export function ClientAppShell({ children }: { children: React.ReactNode }) {
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const pathname = usePathname();

  // Don't clutter admin command dashboard with citizen floating assistant unless toggled
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <div className="relative min-h-screen flex flex-col">
      {children}

      {/* Persistent Floating CivicSense AI Assistant Button */}
      {!isAdminRoute && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={() => setAiChatOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white rounded-full shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all group font-semibold text-sm border-2 border-white/40"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-white transition-transform group-hover:rotate-12" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-blue-700 animate-pulse"></span>
            </div>
            <span className="hidden sm:inline">Ask CivicSense AI</span>
            <span className="sm:hidden">AI Guide</span>
          </button>
        </div>
      )}

      {/* Floating Chat Modal */}
      <CivicSenseAIChat isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}
