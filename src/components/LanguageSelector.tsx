"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/lib/LanguageContext";
import { Globe, Check, ChevronDown } from "lucide-react";

interface LanguageSelectorProps {
  variant?: "navbar" | "form" | "badge";
}

export function LanguageSelector({ variant = "navbar" }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (variant === "form") {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>Preferred Application Language / ಭಾಷೆ / भाषा</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SUPPORTED_LANGUAGES.map((l) => {
            const isSelected = l.code === language;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-2xs font-bold"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="text-left">
                  <span className="block">{l.nativeName}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{l.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 border border-slate-200/80 transition-all bg-white"
        title="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span className="hidden sm:inline">{currentLang.nativeName}</span>
        <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Choose Language
          </div>
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLanguage(l.code);
                setOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                l.code === language ? "text-blue-600 font-bold bg-blue-50/60" : "text-slate-700"
              }`}
            >
              <div>
                <span className="font-semibold">{l.nativeName}</span>
                <span className="text-[10px] text-slate-400 ml-1.5">({l.name})</span>
              </div>
              {l.code === language && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
