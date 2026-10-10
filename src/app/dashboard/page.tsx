"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { CitizenSidebar } from "@/components/CitizenSidebar";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Complaint } from "@/types";
import {
  FileText,
  Clock,
  CheckCircle2,
  PlusCircle,
  FolderKanban,
  Activity,
  Bell,
  ArrowRight,
  Search,
  ExternalLink,
  Sparkles,
  Zap,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { CivicSenseAIChat } from "@/components/CivicSenseAIChat";

export default function CitizenDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Dynamic time-based greeting state (auto-adjusts to morning, afternoon, evening, night)
  const [timePeriod, setTimePeriod] = useState<"morning" | "afternoon" | "evening" | "night">("morning");
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    const updateTimeGreeting = () => {
      const now = new Date();
      const hour = now.getHours();

      if (hour >= 4 && hour < 12) {
        setTimePeriod("morning");
      } else if (hour >= 12 && hour < 17) {
        setTimePeriod("afternoon");
      } else if (hour >= 17 && hour < 21) {
        setTimePeriod("evening");
      } else {
        setTimePeriod("night");
      }

      setFormattedTime(
        now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
      );
    };

    updateTimeGreeting();
    const interval = setInterval(updateTimeGreeting, 10000);
    return () => clearInterval(interval);
  }, []);

  const getGreetingText = () => {
    switch (timePeriod) {
      case "morning":
        return t.greetingGoodMorning || "Good Morning";
      case "afternoon":
        return t.greetingGoodAfternoon || "Good Afternoon";
      case "evening":
        return t.greetingGoodEvening || "Good Evening";
      case "night":
        return t.greetingGoodNight || t.greetingGoodEvening || "Good Evening";
      default:
        return t.greetingGoodMorning || "Good Morning";
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    // Role protection: redirect municipal admins to the Operations Command Center
    if (user && user.role === "admin") {
      router.push("/admin");
      return;
    }

    if (user) {
      fetchComplaints();
    }
  }, [user, isLoading]);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error("Failed to load complaints:", err);
    } finally {
      setLoadingComplaints(false);
    }
  };

  const activeCount = complaints.filter(
    (c) => c.status !== "resolved" && c.status !== "rejected"
  ).length;
  const inProgressCount = complaints.filter(
    (c) => c.status === "in_progress" || c.status === "assigned"
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;

  const firstName = user?.name ? user.name.split(" ")[0] : "Citizen";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            {t.statusInProgress}
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {t.statusVerified}
          </span>
        );
      case "assigned":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {t.statusAssigned}
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            {t.statusResolved}
          </span>
        );
      case "submitted":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {t.statusSubmitted}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <CitizenSidebar onOpenAIChat={() => setAiChatOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Cinematic Smart City Welcome Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 group">
            {/* Background cinematic image with high-tech gradient overlays */}
            <div className="absolute inset-0">
              <img
                src="/images/smart_city_cinematic.jpg"
                alt="CivicSense Smart City Command Grid"
                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-blue-950/40"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent"></div>
            </div>

            {/* Content overlaid on cinematic smart city */}
            <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 z-10">
              <div className="space-y-3 max-w-xl">
                {/* Live Status Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-xs flex-wrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-emerald-300 font-bold uppercase tracking-wider text-[10px]">
                    Municipal Grid Active
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-slate-200 text-[11px]">Real-Time Civic AI Dispatch</span>
                  {formattedTime && (
                    <>
                      <span className="text-white/40">•</span>
                      <span className="text-amber-300 text-[11px] font-mono flex items-center gap-1 font-medium bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-500/30">
                        <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                        {formattedTime}
                      </span>
                    </>
                  )}
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm flex items-center gap-2 flex-wrap">
                    <span>
                      {getGreetingText()}, {firstName}!
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {t.dashboardSubheader || "Together we build a cleaner, safer and responsive smart city. Every report is AI-analyzed and routed directly to municipal field officers."}
                  </p>
                </div>

                {/* Cinematic Smart City Telemetry HUD Bar */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  {/* Live AI Matching Engine Pill */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 backdrop-blur-md border border-cyan-500/30 shadow-lg shadow-cyan-950/40">
                    <div className="relative flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 relative"></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-cyan-200 font-semibold text-[11px]">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>AI Spatial Consolidation: Active</span>
                    </div>
                  </div>

                  {/* Indic Multilingual NLP Pill */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 backdrop-blur-md border border-emerald-500/30 shadow-lg shadow-emerald-950/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <div className="flex items-center gap-1.5 text-emerald-200 font-semibold text-[11px]">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>13 Indian Languages Live Voice Engine</span>
                    </div>
                  </div>

                  {/* Coordinated Municipal Dispatch Pill */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 backdrop-blur-md border border-indigo-500/30 shadow-lg shadow-indigo-950/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    <div className="flex items-center gap-1.5 text-indigo-200 font-semibold text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      <span>24/7 Municipal Action Core</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glassmorphism City Intelligence Stats Card */}
              <div className="w-full lg:w-auto grid grid-cols-2 gap-3 shrink-0">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">AI Precision</span>
                  </div>
                  <p className="text-xl font-extrabold text-white">98.4%</p>
                  <p className="text-[10px] text-slate-300">Automated Routing</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Avg Dispatch</span>
                  </div>
                  <p className="text-xl font-extrabold text-white">&lt; 4 hrs</p>
                  <p className="text-[10px] text-slate-300">Fast Field Action</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Active Applications */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {t.statActiveApps || "Active Applications"}
                </p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">
                  {activeCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {t.statInProgress || "In Progress"}
                </p>
                <p className="text-3xl font-extrabold text-amber-600 mt-1">
                  {inProgressCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Resolved */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {t.statResolved || "Resolved"}
                </p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">
                  {resolvedCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-800">
              {t.quickActionsTitle || "Quick Actions"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/report"
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  {t.sidebarReport}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {t.quickReportDesc}
                </p>
              </Link>

              <Link
                href="/applications"
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  {t.sidebarMyApps}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {t.quickAppsDesc}
                </p>
              </Link>

              <Link
                href="/status"
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  {t.sidebarStatus}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {t.quickStatusDesc}
                </p>
              </Link>

              <Link
                href="/notifications"
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  {t.sidebarNotifications}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {t.quickNotifDesc}
                </p>
              </Link>
            </div>
          </div>

          {/* Recent Applications Table matching screenshot */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                {t.recentAppsTitle || "Recent Applications"}
              </h2>
              <Link
                href="/applications"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>{t.viewAll || "View All"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-6 py-3.5">{t.tableColAppNo || "Application No."}</th>
                    <th className="px-6 py-3.5">{t.tableColIssue || "Issue"}</th>
                    <th className="px-6 py-3.5">{t.tableColStatus || "Status"}</th>
                    <th className="px-6 py-3.5">{t.tableColDate || "Date"}</th>
                    <th className="px-6 py-3.5 text-right">{t.tableColAction || "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {complaints.slice(0, 5).map((cmp) => (
                    <tr key={cmp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-blue-600">
                        <Link href={`/status/${cmp.application_id}`} className="hover:underline">
                          {cmp.application_id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {cmp.issue_type}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(cmp.status)}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(cmp.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/status/${cmp.application_id}`}
                          className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <span>{t.notifTrackBtn || t.trackStatus || "Track"}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {complaints.length === 0 && !loadingComplaints && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        {t.noAppsYet || "No applications submitted yet. Click 'Report a Problem' to begin!"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <CivicSenseAIChat isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}
