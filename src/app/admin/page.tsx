"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useAuth } from "@/lib/AuthContext";
import {
  Inbox,
  Clock,
  CheckCircle2,
  Flame,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronRight,
  Users,
  Shield,
  Layers,
  FileSpreadsheet,
} from "lucide-react";
import { Incident } from "@/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [metrics, setMetrics] = useState<any>({
    totalReports: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    activeIncidents: 0,
    highPriority: 0,
  });
  const [domainCounts, setDomainCounts] = useState<Record<string, number>>({});
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [officerDept, setOfficerDept] = useState<string>("Road Maintenance & Traffic Department");
  const [loading, setLoading] = useState(true);
  const [adminGreeting, setAdminGreeting] = useState("Good Morning");
  const [adminTime, setAdminTime] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDept = localStorage.getItem("civicsense_officer_dept");
      if (savedDept) setOfficerDept(savedDept);
    }

    const updateAdminClock = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 4 && hour < 12) {
        setAdminGreeting("Good Morning");
      } else if (hour >= 12 && hour < 17) {
        setAdminGreeting("Good Afternoon");
      } else if (hour >= 17 && hour < 21) {
        setAdminGreeting("Good Evening");
      } else {
        setAdminGreeting("Good Evening");
      }
      setAdminTime(now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }));
    };

    updateAdminClock();
    const interval = setInterval(updateAdminClock, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
      return;
    }

    if (user && user.role === "admin") {
      fetchAdminMetrics(false);
    }
  }, [user, isLoading]);

  const fetchAdminMetrics = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch("/api/admin/metrics");
      if (res.ok) {
        const data = await res.json();
        if (data.metrics) setMetrics(data.metrics);
        if (data.domainCounts) setDomainCounts(data.domainCounts);
        if (data.recentIncidents) setRecentIncidents(data.recentIncidents);
      }
    } catch (err) {
      console.error("Failed to load admin metrics", err);
    } finally {
      setLoading(false);
    }
  };

  // Live Auto-Refresh Polling every 25 seconds & on window focus for responsiveness
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const interval = setInterval(() => {
      fetchAdminMetrics(true);
    }, 25000);

    const onFocus = () => {
      fetchAdminMetrics(true);
    };

    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto min-h-screen">
        {/* Header matching screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                City Operations Dashboard
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {adminGreeting}, Officer • Municipal Command & Civic Intelligence Hub
              </p>
              {adminTime && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {adminTime}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Assigned: {officerDept}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/api/admin/export?type=complaints"
              download
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              title="Download real-time complaints report as Excel CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download Excel</span>
            </a>

            <Link
              href="/admin/map"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Live City Map</span>
            </Link>

            <Link
              href="/admin/incidents"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Consolidated Incidents</span>
            </Link>
          </div>
        </div>

        {/* 6 Top KPI Metrics matching screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Total Reports */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Reports</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-slate-900">
                {metrics.totalReports.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> 12%
              </span>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 block">Pending</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-amber-600">
                {metrics.pending.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                <ArrowDownRight className="w-3 h-3" /> 5%
              </span>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 block">In Progress</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-blue-600">
                {metrics.inProgress.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-blue-600 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> 8%
              </span>
            </div>
          </div>

          {/* Resolved */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 block">Resolved</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-emerald-600">
                {metrics.resolved.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> 15%
              </span>
            </div>
          </div>

          {/* Active Incidents */}
          <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-xs bg-gradient-to-br from-white to-indigo-50/30">
            <span className="text-[11px] font-bold text-indigo-700 block">Active Incidents</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-indigo-900">
                {metrics.activeIncidents}
              </span>
              <span className="text-[11px] font-bold text-indigo-600 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> 3
              </span>
            </div>
          </div>

          {/* High Priority */}
          <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs bg-gradient-to-br from-white to-rose-50/30">
            <span className="text-[11px] font-bold text-rose-700 block">High Priority</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-rose-600">
                {metrics.highPriority}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                <ArrowDownRight className="w-3 h-3" /> 2%
              </span>
            </div>
          </div>
        </div>

        {/* 3 Visual Charts matching screenshot panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Complaints by Domain (Donut chart visual) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Complaints by Domain
            </h3>

            <div className="flex items-center justify-around py-4">
              {/* Donut representation */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3.8"
                  />
                  {/* Waste Segment */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3.8"
                    strokeDasharray="30, 100"
                  />
                  {/* Traffic Segment */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#0EA5E9"
                    strokeWidth="3.8"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-30"
                  />
                  {/* Water Segment */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3.8"
                    strokeDasharray="18, 100"
                    strokeDashoffset="-55"
                  />
                  {/* Emergency Segment */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3.8"
                    strokeDasharray="12, 100"
                    strokeDashoffset="-73"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-extrabold text-slate-900 block leading-tight">
                    1,248
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Total
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span>Waste: 30%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  <span>Traffic & Roads: 25%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Water Supply: 18%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Emergency: 12%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <span>Other: 15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2: Complaints Over Time (Line trend graph visual) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Complaints Over Time (Apr 20 - Apr 26)
            </h3>

            {/* Line Trend Vector Graphic */}
            <div className="h-40 relative flex items-end pt-4 pb-2 px-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="80" x2="300" y2="80" stroke="#F1F5F9" strokeWidth="1" />

                {/* Line Path */}
                <path
                  d="M 10 75 L 60 82 L 120 45 L 180 52 L 240 30 L 290 38"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="10" cy="75" r="4" fill="#2563EB" stroke="#fff" strokeWidth="2" />
                <circle cx="60" cy="82" r="4" fill="#2563EB" stroke="#fff" strokeWidth="2" />
                <circle cx="120" cy="45" r="4" fill="#2563EB" stroke="#fff" strokeWidth="2" />
                <circle cx="180" cy="52" r="4" fill="#2563EB" stroke="#fff" strokeWidth="2" />
                <circle cx="240" cy="30" r="4" fill="#2563EB" stroke="#fff" strokeWidth="2" />
                <circle cx="290" cy="38" r="4" fill="#2563EB" stroke="#fff" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-2">
              <span>Apr 20</span>
              <span>Apr 21</span>
              <span>Apr 22</span>
              <span>Apr 23</span>
              <span>Apr 24</span>
              <span>Apr 26</span>
            </div>
          </div>

          {/* Chart 3: Status Distribution (Donut breakdown) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Status Distribution
            </h3>

            <div className="flex items-center justify-around py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Resolved: 52% */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeDasharray="52, 100"
                  />
                  {/* In Progress: 23% */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    strokeDasharray="23, 100"
                    strokeDashoffset="-52"
                  />
                  {/* Submitted / Verified: 25% */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="4"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-75"
                  />
                </svg>
                <div className="text-center">
                  <span className="text-lg font-bold text-slate-900">100%</span>
                  <span className="text-[9px] text-slate-400 block font-semibold uppercase">
                    Workflow
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Resolved: 52%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>In Progress: 23%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Pending / Verified: 25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Priority AI Insights & Consolidated Incidents Feed */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                High-Priority Consolidated Incidents (Duplicate Intelligence)
              </h2>
            </div>
            <Link
              href="/admin/incidents"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All 48 Incidents</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentIncidents.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30 hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-indigo-900 bg-indigo-100/70 px-2.5 py-0.5 rounded-lg">
                      {inc.incident_id}
                    </span>
                    <span className="text-[10px] font-bold text-rose-600 uppercase bg-rose-50 px-2 py-0.5 rounded-md">
                      {inc.severity}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {inc.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {inc.grouping_reason}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
                    <Users className="w-3.5 h-3.5" />
                    <span>{inc.report_count} Linked Reports</span>
                  </div>

                  <Link
                    href={`/admin/incidents/${inc.incident_id}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 text-[11px]"
                  >
                    <span>Manage</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
