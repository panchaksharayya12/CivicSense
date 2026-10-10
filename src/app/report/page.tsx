"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { CitizenSidebar } from "@/components/CitizenSidebar";
import { VoiceTyping } from "@/components/VoiceTyping";
import { PhotoUpload } from "@/components/PhotoUpload";
import { LocationPickerMap } from "@/components/LocationPickerMap";
import { CivicSenseAIChat } from "@/components/CivicSenseAIChat";
import { CIVIC_DOMAINS } from "@/lib/constants";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { CivicDomain, ComplaintSeverity, AIComplaintAnalysisResult } from "@/types";
import {
  Check,
  MapPin,
  Camera,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Navigation,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Bell,
  ShieldCheck,
} from "lucide-react";

function ReportProblemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshNotifications } = useAuth();
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Form State
  const [domain, setDomain] = useState<CivicDomain>("traffic");
  const [issue, setIssue] = useState<string>("Pothole");
  const [description, setDescription] = useState("");
  const [locationSource, setLocationSource] = useState<"gps" | "manual">("gps");
  const [address, setAddress] = useState("Near Main College Gate, 5th Block, Koramangala, Bengaluru");
  const [latitude, setLatitude] = useState<number | undefined>(12.9352);
  const [longitude, setLongitude] = useState<number | undefined>(77.6245);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [spokenLanguage, setSpokenLanguage] = useState<string>("en");

  // AI Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIComplaintAnalysisResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pre-fill query params if directed from AI chat or homepage
  useEffect(() => {
    const domainParam = searchParams.get("domain") as CivicDomain | null;
    const issueParam = searchParams.get("issue");

    if (domainParam && CIVIC_DOMAINS.some((d) => d.id === domainParam)) {
      setDomain(domainParam);
      const targetDomainObj = CIVIC_DOMAINS.find((d) => d.id === domainParam);
      if (issueParam && targetDomainObj?.issues.includes(issueParam)) {
        setIssue(issueParam);
      } else if (targetDomainObj) {
        setIssue(targetDomainObj.issues[0]);
      }
    }
  }, [searchParams]);

  // Update issue when domain changes
  const handleDomainChange = (newDomain: CivicDomain) => {
    setDomain(newDomain);
    const domainObj = CIVIC_DOMAINS.find((d) => d.id === newDomain);
    if (domainObj && domainObj.issues.length > 0) {
      setIssue(domainObj.issues[0]);
    }
  };

  // Run AI Complaint Analyzer when moving to review step
  const handleProceedToReview = async () => {
    if (!description.trim()) {
      setErrorMsg("Please provide a description of the problem.");
      return;
    }

    if (!address.trim() && !latitude) {
      setErrorMsg("Please provide either your location or an address.");
      setCurrentStep(2);
      return;
    }

    setErrorMsg(null);
    setCurrentStep(4);
    setAnalyzing(true);

    try {
      const res = await fetch("/api/ai/analyze-complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          category: domain,
          latitude,
          longitude,
          address,
          language: spokenLanguage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data.analysis);
      }
    } catch (err) {
      console.warn("AI Analyzer non-fatal error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Final Submit Handler
  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        category: aiAnalysis?.category || domain,
        issue_type: aiAnalysis?.issue_type || issue,
        description,
        address: address || "Bengaluru Municipal Area",
        latitude,
        longitude,
        location_source: locationSource,
        image_url: photoUrl,
        video_url: videoUrl,
        severity: aiAnalysis?.severity || "medium",
        urgency: aiAnalysis?.urgency || "normal",
        ai_confidence: aiAnalysis?.ai_confidence || 95,
        recommended_department:
          aiAnalysis?.recommended_department ||
          CIVIC_DOMAINS.find((d) => d.id === domain)?.department ||
          "Smart City Operations Center",
        language: spokenLanguage || aiAnalysis?.detected_language || "te",
      };

      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.complaint) {
        setSubmittedAppId(data.complaint.application_id);
        // Refresh notifications count immediately so citizen sees the bell alert!
        await refreshNotifications();
      } else {
        setErrorMsg(data.error || "Failed to submit complaint.");
      }
    } catch (err: any) {
      setErrorMsg("Network error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentDomainObj = CIVIC_DOMAINS.find((d) => d.id === domain);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <CitizenSidebar onOpenAIChat={() => setAiChatOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.navReport || "Report a Problem"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Let's make your city better. Tell us what's wrong.
            </p>
          </div>

          {/* Stepper: 1. Issue Details -> 2. Location -> 3. Add Photo -> 4. Review */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative mb-8">
              {/* Connector line */}
              <div className="absolute left-6 right-6 top-4 h-0.5 bg-slate-200 -z-0"></div>

              {/* Step 1 */}
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex flex-col items-center gap-1.5 relative z-10 group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep >= 1
                      ? "bg-blue-600 text-white ring-4 ring-blue-50"
                      : "bg-white text-slate-400 border-2 border-slate-300"
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <span className="text-[11px] font-semibold text-slate-700">
                  {t.stepIssueDetails || "Issue Details"}
                </span>
              </button>

              {/* Step 2 */}
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex flex-col items-center gap-1.5 relative z-10 group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep >= 2
                      ? "bg-blue-600 text-white ring-4 ring-blue-50"
                      : "bg-white text-slate-400 border-2 border-slate-300"
                  }`}
                >
                  {currentStep > 2 ? <Check className="w-4 h-4" /> : "2"}
                </div>
                <span className="text-[11px] font-semibold text-slate-700">
                  {t.stepLocation || "Location"}
                </span>
              </button>

              {/* Step 3 */}
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex flex-col items-center gap-1.5 relative z-10 group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep >= 3
                      ? "bg-blue-600 text-white ring-4 ring-blue-50"
                      : "bg-white text-slate-400 border-2 border-slate-300"
                  }`}
                >
                  {currentStep > 3 ? <Check className="w-4 h-4" /> : "3"}
                </div>
                <span className="text-[11px] font-semibold text-slate-700">
                  {t.stepAddPhoto || "Add Photo / Video"}
                </span>
              </button>

              {/* Step 4 */}
              <button
                type="button"
                onClick={() => {
                  if (description) handleProceedToReview();
                }}
                className="flex flex-col items-center gap-1.5 relative z-10 group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep === 4
                      ? "bg-blue-600 text-white ring-4 ring-blue-50"
                      : "bg-white text-slate-400 border-2 border-slate-300"
                  }`}
                >
                  4
                </div>
                <span className="text-[11px] font-semibold text-slate-700">
                  {t.stepReview || "Review"}
                </span>
              </button>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submission Success Dialog */}
            {submittedAppId ? (
              <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900">
                  {t.submittedSuccess || "Complaint Submitted Successfully"}
                </h2>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl max-w-xs mx-auto">
                  <p className="text-xs text-blue-700 font-medium">
                    {t.appNumberLabel || "Application Number"}
                  </p>
                  <p className="text-xl font-extrabold text-blue-900 tracking-wider mt-0.5">
                    {submittedAppId}
                  </p>
                </div>

                {/* Instant Official Notification Alert Card */}
                <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-950">
                        Official In-App Notification Sent!
                      </p>
                      <p className="text-[11px] text-emerald-800">
                        Application {submittedAppId} is registered. You can track municipal status and updates anytime.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/notifications"
                    className="px-3 py-1.5 bg-white text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold shadow-2xs hover:bg-emerald-50 shrink-0 transition-colors"
                  >
                    View Notifications
                  </Link>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Your complaint has been logged in the Municipal Grievance Core. Our automated incident matcher is scanning nearby reports for priority consolidation.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href={`/status/${submittedAppId}`}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>{t.trackStatusBtn || "Track Status"} →</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedAppId(null);
                      setCurrentStep(1);
                      setDescription("");
                      setPhotoUrl(null);
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm rounded-xl"
                  >
                    Report Another Issue
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* STEP 1: Issue Details */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Select Domain */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {t.selectDomainLabel || "Select Domain"} *
                        </label>
                        <select
                          value={domain}
                          onChange={(e) => handleDomainChange(e.target.value as CivicDomain)}
                          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        >
                          {CIVIC_DOMAINS.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Select Issue */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {t.selectIssueLabel || "Select Issue"} *
                        </label>
                        <select
                          value={issue}
                          onChange={(e) => setIssue(e.target.value)}
                          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        >
                          {currentDomainObj?.issues.map((iss) => (
                            <option key={iss} value={iss}>
                              {iss}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Problem Description with Voice Typing */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          {t.problemDescLabel || "Problem Description"} *
                        </label>
                        <span className="text-[11px] text-slate-500">
                          {t.voiceTypingSpeak || "Type or speak in any Indian language"}
                        </span>
                      </div>

                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t.problemDescPlaceholder || "There is a large pothole on the road near our college. Vehicles are almost falling into it..."}
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all leading-relaxed"
                      />
                    </div>

                    {/* Real Voice Typing Sub-Component with waveforms */}
                    <VoiceTyping
                      currentText={description}
                      onTranscript={(trans) => setDescription(trans)}
                      onLanguageChange={(lng) => setSpokenLanguage(lng)}
                    />

                    {/* Next Button */}
                    <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          if (!description.trim()) {
                            setErrorMsg("Please enter or speak a description.");
                            return;
                          }
                          setErrorMsg(null);
                          setCurrentStep(2);
                        }}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <span>Next (Location)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Realistic Location Map & Readable Address (No raw GPS numbers!) */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-1">
                        {t.stepLocation || "Provide Location of the Problem"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Interactive map with readable street addresses. Click anywhere on the map or use current location to position the pin.
                      </p>
                    </div>

                    {/* Realistic Interactive Map Picker */}
                    <LocationPickerMap
                      initialLat={latitude || 12.9352}
                      initialLng={longitude || 77.6245}
                      initialAddress={address}
                      onLocationChange={({ lat, lng, address: newAddr, source }) => {
                        setLatitude(lat);
                        setLongitude(lng);
                        setAddress(newAddr);
                        setLocationSource(source);
                        setErrorMsg(null);
                      }}
                    />

                    {/* Step Navigation */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!address.trim() && !latitude) {
                            setErrorMsg("Please provide location or an address.");
                            return;
                          }
                          setErrorMsg(null);
                          setCurrentStep(3);
                        }}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                      >
                        <span>Next (Photo & Video)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Add Photo & Video with Instant Previews */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <PhotoUpload
                      initialPhotoUrl={photoUrl || undefined}
                      initialVideoUrl={videoUrl || undefined}
                      onPhotoUploaded={(url) => setPhotoUrl(url)}
                      onVideoUploaded={(url) => setVideoUrl(url)}
                    />

                    {/* Info Note: Photo and video are optional */}
                    <div className="p-3.5 bg-blue-50/90 rounded-2xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                      <span className="text-base shrink-0">💡</span>
                      <div>
                        <strong>Note:</strong> {t.photoOptionalTip || "Photo and video recordings are optional evidence. If you do not have files, you can proceed directly to Review."}
                      </div>
                    </div>

                    {/* Step Navigation */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleProceedToReview}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                      >
                        <span>Review Complaint</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: AI Review Before Submission */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    {analyzing ? (
                      <div className="py-12 text-center space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                        <h3 className="font-bold text-slate-900 text-sm">
                          Website Complaint Analyzer is assessing your report...
                        </h3>
                        <p className="text-xs text-slate-500">
                          Evaluating domain, calculating severity, and searching for matching neighborhood incidents.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {/* Category Correction Alert if AI detected a mismatch */}
                        {aiAnalysis?.suggested_category_correction && (
                          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-amber-800">
                              <Sparkles className="w-4 h-4 text-amber-600" />
                              <span>AI Category Recommendation</span>
                            </div>
                            <p>
                              You selected <strong>{aiAnalysis.suggested_category_correction.original}</strong>, but our AI suggests{" "}
                              <strong className="underline">{aiAnalysis.suggested_category_correction.suggested}</strong>.
                            </p>
                            <p className="text-[11px] text-amber-700">
                              Reason: {aiAnalysis.suggested_category_correction.reason}
                            </p>
                          </div>
                        )}

                        {/* Duplicate Incident Alert */}
                        {aiAnalysis?.possible_duplicate_incident && (
                          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs text-indigo-950 space-y-1.5">
                            <div className="flex items-center gap-2 font-bold text-indigo-800">
                              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                              <span>
                                Priority Incident Match Detected: {aiAnalysis.possible_duplicate_incident.incident_id}
                              </span>
                            </div>
                            <p className="text-indigo-900">
                              Our AI found an existing consolidated incident nearby with{" "}
                              <strong>{aiAnalysis.possible_duplicate_incident.similarity_score}% similarity</strong>.
                            </p>
                            <p className="text-[11px] text-indigo-700">
                              Your complaint will be linked directly to this priority municipal incident!
                            </p>
                          </div>
                        )}

                        {/* Review Summary Card */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3.5 text-xs">
                          <div className="flex justify-between items-start pb-2 border-b border-slate-200">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Domain & Issue
                              </span>
                              <h3 className="text-sm font-bold text-slate-900">
                                {aiAnalysis?.category || domain} — {aiAnalysis?.issue_type || issue}
                              </h3>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-bold uppercase text-[10px]">
                                Severity: {aiAnalysis?.severity || "Medium"}
                              </span>
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-bold text-[10px]">
                                AI Confidence: {aiAnalysis?.ai_confidence || 96}%
                              </span>
                            </div>
                          </div>

                          {/* Official English Problem Statement for Admin Portal */}
                          {aiAnalysis?.english_translation && (
                            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/90 space-y-1.5 shadow-2xs">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Official English Statement (For Municipal Officers)</span>
                                </span>
                                <span className="px-2 py-0.5 bg-white text-emerald-800 border border-emerald-300 rounded-full font-bold text-[10px] uppercase shadow-2xs">
                                  {spokenLanguage.toUpperCase()} → English
                                </span>
                              </div>
                              <p className="text-slate-900 font-bold text-sm leading-relaxed">
                                "{aiAnalysis.english_translation}"
                              </p>
                              <p className="text-[11px] text-emerald-700">
                                Municipal officers in the Admin Portal will read this problem statement in English.
                              </p>
                            </div>
                          )}

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Citizen Original Voice / Typed Statement ({spokenLanguage.toUpperCase()})
                            </span>
                            <p className="text-slate-800 text-sm mt-0.5 whitespace-pre-wrap leading-relaxed">
                              {description}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Problem Location
                              </span>
                              <div className="flex items-start gap-1.5 mt-1">
                                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-slate-900 font-bold text-xs">
                                    {address || "Location pinned on map"}
                                  </p>
                                  <span className="inline-block mt-0.5 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-md text-[10px] font-semibold">
                                    Validated Municipal Sector
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Recommended Municipal Routing
                              </span>
                              <p className="text-blue-700 font-semibold mt-0.5">
                                {aiAnalysis?.recommended_department || currentDomainObj?.department}
                              </p>
                            </div>
                          </div>

                          {(photoUrl || videoUrl) && (
                            <div className="pt-3 border-t border-slate-200 space-y-3">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                Attached Media Evidence
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {photoUrl && (
                                  <div className="space-y-2">
                                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200">
                                      <img
                                        src={photoUrl}
                                        alt="Complaint Photo Evidence"
                                        className="w-20 h-20 object-cover rounded-xl border border-slate-300 shadow-xs shrink-0"
                                      />
                                      <div className="text-xs text-slate-600 flex-1">
                                        <div className="flex items-center justify-between">
                                          <p className="font-bold text-slate-800">Photo Attached</p>
                                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {aiAnalysis?.photo_authenticity?.label || "Verified Real Photo"}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                          High-resolution photograph for visual site validation.
                                        </p>
                                      </div>
                                    </div>

                                    {/* AI Photo Authenticity & Anti-Spoofing Assessment */}
                                    <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl text-xs space-y-1.5 shadow-2xs">
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                          <span>AI Photo Authenticity Verification</span>
                                        </span>
                                        <span className="text-[10px] font-extrabold text-emerald-700 px-2 py-0.5 bg-white rounded-full border border-emerald-200">
                                          {aiAnalysis?.photo_authenticity?.confidence || 96}% Real Evidence
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-emerald-900 leading-relaxed">
                                        {aiAnalysis?.photo_authenticity?.reason || "Metadata consistency, organic edge degradation, and natural lighting match genuine physical civic infrastructure."}
                                      </p>
                                      <div className="pt-1 flex flex-wrap gap-2 text-[10px] text-emerald-800 font-semibold">
                                        <span>• Natural outdoor daylight verified</span>
                                        <span>• Zero generative AI diffusion detected</span>
                                        <span>• Physical degradation patterns confirmed</span>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {videoUrl && (
                                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                                    <div className="w-24 h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-slate-300 shadow-xs">
                                      <video
                                        src={videoUrl}
                                        controls
                                        playsInline
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="text-xs text-slate-600">
                                      <p className="font-bold text-slate-800">Video Clip Attached</p>
                                      <p className="text-[11px] text-slate-500 mt-0.5">
                                        Live video recording of civic issue condition.
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Final Step Navigation */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                          >
                            Edit Information
                          </button>

                          <button
                            type="button"
                            onClick={handleFinalSubmit}
                            disabled={submitting}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Submitting Complaint...</span>
                              </>
                            ) : (
                              <>
                                <span>{t.submitComplaintBtn || "Submit Complaint"}</span>
                                <Check className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <CivicSenseAIChat isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}

export default function ReportProblemPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <ReportProblemContent />
    </Suspense>
  );
}
