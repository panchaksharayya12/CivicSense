"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  Loader2,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { AIChatMessage } from "@/types";

interface CivicSenseAIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

// Function to strictly remove all asterisks/stars and markdown symbols
function cleanStars(text: string): string {
  if (!text) return "";
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/_{1,2}/g, "")
    .replace(/#{1,6}\s?/g, "")
    .replace(/`{1,3}/g, "")
    .trim();
}

const QUICK_SUGGESTIONS = [
  { label: "🕳️ Broken Road / Pothole", prompt: "How do I report a pothole on our road?" },
  { label: "🗑️ Garbage Not Cleared", prompt: "Garbage bin is overflowing, how do I report it?" },
  { label: "💧 Water Leakage", prompt: "There is water leaking from a broken pipe near my home." },
  { label: "💡 Dark Streetlight", prompt: "The streetlight on our street is not working." },
  { label: "🔍 Track My Complaint", prompt: "How can I check the status of my report?" },
  { label: "🚨 Emergency Numbers", prompt: "What are the emergency numbers for fire and police?" },
];

export function CivicSenseAIChat({ isOpen, onClose }: CivicSenseAIChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      text: "Hello! I am your CivicSense City Assistant.\n\nI am here to help you report problems like broken roads, leaking water, dark streetlights, or overflowing garbage. You can type or speak in your own language (Telugu, Kannada, Hindi, English, and more).\n\nHow can I help you today?",
      timestamp: "Just now",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages]);

  // Voice input support for chat
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN";

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setInputQuery(text);
          sendMessage(text);
        }
        setIsListening(false);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Microphone recognition is not available in your browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Mic start failed", err);
      }
    }
  };

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isSending) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: cleanStars(query),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsSending(true);

    try {
      const res = await fetch("/api/ai/civic-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (res.ok) {
        const data = await res.json();
        // Clean out any stars or asterisks from the text completely!
        const cleanedText = cleanStars(data.text || "");
        const aiMsg: AIChatMessage = {
          id: `msg-${Date.now()}-ai`,
          sender: "ai",
          text: cleanedText,
          actionButton: data.actionButton,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          sender: "ai",
          text: "I am having trouble connecting right now, but you can click the button below to go straight to the problem reporting page.",
          actionButton: {
            label: "Open Report Form →",
            href: "/report",
          },
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleActionButton = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:items-end sm:justify-end p-2 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full sm:w-[430px] h-[600px] max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Chat Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                CivicSense AI Assistant
              </h2>
              <div className="flex items-center gap-1 text-[11px] text-blue-100 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Friendly Citizen Guide</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational banner: friendly and clear */}
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 text-[11px] text-blue-800 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Ask anything in plain words or click a quick topic below.</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-xs shadow-sm"
                    : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs"
                }`}
              >
                {/* Guaranteed Star-Free Clean Text */}
                <div className="whitespace-pre-wrap leading-relaxed font-normal">
                  {cleanStars(msg.text)}
                </div>

                {/* Direct Action Navigation Button inside AI response */}
                {msg.actionButton && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleActionButton(msg.actionButton!.href)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all hover:scale-102 active:scale-98"
                    >
                      <span>{msg.actionButton.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 max-w-[75%] shadow-2xs">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-xs text-slate-600 font-medium">
                CivicSense AI is preparing your answer...
              </span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips for One-Tap Help */}
        <div className="px-3 pt-2 pb-1.5 bg-slate-50/90 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => sendMessage(s.prompt)}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors border border-slate-200 shadow-2xs shrink-0"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2.5 rounded-xl transition-all ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse"
                  : "bg-slate-100 text-slate-600 hover:text-blue-600 hover:bg-slate-200"
              }`}
              title="Speak into Microphone"
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isListening ? "Listening to your voice..." : "Ask in any simple words or language..."}
              className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isSending}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
