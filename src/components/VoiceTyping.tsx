"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { INDIAN_LANGUAGES } from "@/lib/constants";

interface VoiceTypingProps {
  onTranscript: (text: string) => void;
  currentText: string;
  onLanguageChange?: (lang: string) => void;
}

export function VoiceTyping({ onTranscript, currentText, onLanguageChange }: VoiceTypingProps) {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN");
  const [translatedEnglish, setTranslatedEnglish] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API availability
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        let finalTrans = "";
        let interim = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (finalTrans) {
          const updated = currentText ? `${currentText} ${finalTrans}`.trim() : finalTrans;
          onTranscript(updated);
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setErrorMsg(
            "Microphone permission was denied. Please allow microphone access in your browser or type manually."
          );
        } else if (event.error === "no-speech") {
          // Normal timeout if user was silent
        } else {
          setErrorMsg(`Voice recognition notice: ${event.error}. You can continue typing.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.error("SpeechRecognition initialization failed:", e);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [selectedLanguage, currentText, onTranscript]);

  const toggleListening = () => {
    setErrorMsg(null);
    if (!isSupported) {
      setErrorMsg("Voice typing is not supported in this browser. Please type your complaint.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = selectedLanguage;
          recognitionRef.current.start();
        }
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  // Live AI translation to English for user preview
  useEffect(() => {
    if (!currentText || currentText.trim().length < 3) {
      setTranslatedEnglish("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsTranslating(true);
      try {
        const langCode = selectedLanguage.split("-")[0];
        const res = await fetch("/api/ai/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: currentText, language: langCode }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.englishText && data.isTranslated) {
            setTranslatedEnglish(data.englishText);
          } else {
            setTranslatedEnglish("");
          }
        }
      } catch (err) {
        console.warn("Live translation notice:", err);
      } finally {
        setIsTranslating(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentText, selectedLanguage]);

  const handleLangChange = (val: string) => {
    setSelectedLanguage(val);
    const code = val.split("-")[0];
    if (onLanguageChange) onLanguageChange(code);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Language selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLangChange(e.target.value)}
            disabled={isListening}
            className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          >
            {INDIAN_LANGUAGES.map((lang) => (
              <option key={lang.speechCode} value={lang.speechCode}>
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
        </div>

        {/* Audio Waveform & Active Listening Indicator */}
        <div className="flex items-center gap-3">
          {isListening && (
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-100/70 rounded-full border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              {/* Sound wave bars */}
              <div className="flex items-center gap-0.5 h-4 px-1">
                <span className="w-1 bg-blue-600 rounded-full animate-[bounce_0.8s_infinite]"></span>
                <span className="w-1 bg-blue-600 rounded-full animate-[bounce_1.1s_infinite]"></span>
                <span className="w-1 bg-blue-600 rounded-full animate-[bounce_0.7s_infinite]"></span>
                <span className="w-1 bg-blue-600 rounded-full animate-[bounce_1.3s_infinite]"></span>
                <span className="w-1 bg-blue-600 rounded-full animate-[bounce_0.9s_infinite]"></span>
              </div>
              <span className="text-xs font-medium text-blue-700">Listening...</span>
            </div>
          )}

          {/* Toggle Mic Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
              isListening
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5" />
                <span>Stop Listening</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Speak (Voice Typing)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interim text preview during speech */}
      {interimTranscript && (
        <div className="mt-3 p-2 bg-white rounded-lg border border-blue-200 text-xs text-slate-700 italic flex items-center gap-2 animate-pulse">
          <Volume2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>"{interimTranscript}"</span>
        </div>
      )}

      {/* Error or Fallback Message */}
      {errorMsg && (
        <div className="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{errorMsg}</p>
          </div>
          <button
            type="button"
            onClick={toggleListening}
            className="text-[11px] font-semibold text-blue-700 underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* Real-time Voice to English Translation Preview */}
      {translatedEnglish && (
        <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                AI Voice-to-English Conversion
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                Transferred to Admin in English
              </span>
            </div>
            <p className="mt-1 font-semibold text-slate-800 text-xs">
              "{translatedEnglish}"
            </p>
          </div>
        </div>
      )}

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>You can speak naturally in any Indian language or mixed words (e.g. Telugu, Kannada + English).</span>
        <span>Always editable</span>
      </div>
    </div>
  );
}
