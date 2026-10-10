"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Complaint, CivicDomain } from "@/types";
import { CIVIC_DOMAINS } from "@/lib/constants";
import {
  Search,
  Filter,
  ExternalLink,
  Flame,
  ArrowUpDown,
  RefreshCw,
  Loader2,
  FileSpreadsheet,
  Download,
  Users,
  FileText,
  Printer,
} from "lucide-react";
import { GovernmentReportGenerator } from "@/components/GovernmentReportGenerator";

export default function AdminAllComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedReportComplaint, setSelectedReportComplaint] = useState<Complaint | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [newComplaintBanner, setNewComplaintBanner] = useState<string | null>(null);

  const fetchComplaints = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setIsSyncing(true);
      }

      let url = "/api/complaints?all=true&";
      if (selectedDomain !== "all") url += `category=${selectedDomain}&`;
      if (selectedStatus !== "all") url += `status=${selectedStatus}&`;
      if (selectedSeverity !== "all") url += `severity=${selectedSeverity}&`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const incoming: Complaint[] = data.complaints || [];

        // Check if new complaints arrived
        setComplaints((prev) => {
          if (prev.length > 0 && incoming.length > prev.length) {
            const newest = incoming[0];
            setNewComplaintBanner(
              `🔔 New complaint received: ${newest?.application_id || "CS-2026-XXXX"} (${newest?.issue_type || "Civic Issue"}) just submitted by citizen!`
            );
            setTimeout(() => setNewComplaintBanner(null), 7000);
          }
          return incoming;
        });
      }
    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  // Initial load and filter change
  useEffect(() => {
    fetchComplaints(false);
  }, [selectedDomain, selectedStatus, selectedSeverity]);

  // Live Auto-Refresh Polling every 25 seconds & on window focus for high responsiveness
  useEffect(() => {
    const interval = setInterval(() => {
      fetchComplaints(true);
    }, 25000);

    const onFocus = () => {
      fetchComplaints(true);
    };

    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [selectedDomain, selectedStatus, selectedSeverity]);

  const filtered = complaints.filter(
    (c) =>
      c.application_id.toLowerCase().includes(search.toLowerCase()) ||
      c.issue_type.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase()) ||
      (c.user_name && c.user_name.toLowerCase().includes(search.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            In Progress
          </span>
        );
      case "verified":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Verified
          </span>
        );
      case "assigned":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Assigned
          </span>
        );
      case "resolved":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            Resolved
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              All Municipal Applications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review, verify, assign departments, and update grievance statuses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Auto-Sync Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Sync Active (25s)</span>
            </div>

            {/* Download Complaints Excel */}
            <a
              href="/api/admin/export?type=complaints"
              download
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-102 cursor-pointer"
              title="Download real-time complaints report as Excel CSV spreadsheet"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Excel Report</span>
              <span className="px-1.5 py-0.5 bg-emerald-800/80 rounded-md text-[10px] font-mono">
                {complaints.length}
              </span>
            </a>

            {/* Download Users Directory */}
            <a
              href="/api/admin/export?type=users"
              download
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="Download registered reporters and citizens directory as Excel CSV"
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>Download Users Directory</span>
            </a>

            {/* Refresh Now Button */}
            <button
              onClick={() => fetchComplaints(false)}
              disabled={isSyncing}
              className="px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
              title="Instantly fetch latest complaints from server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-blue-600" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Refresh Now"}</span>
            </button>
          </div>
        </div>

        {/* Real-Time Incoming Alert Banner */}
        {newComplaintBanner && (
          <div className="p-3.5 bg-blue-50 border-2 border-blue-400 rounded-2xl text-blue-900 text-xs font-bold flex items-center justify-between shadow-sm animate-pulse">
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>{newComplaintBanner}</span>
            </div>
            <button
              onClick={() => setNewComplaintBanner(null)}
              className="text-blue-700 hover:text-blue-900 text-xs underline font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by app #, citizen, issue or location..."
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Domains</option>
            {CIVIC_DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.shortName}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="verified">Verified</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Application No.</th>
                  <th className="px-6 py-3.5">Citizen</th>
                  <th className="px-6 py-3.5">Issue & Domain</th>
                  <th className="px-6 py-3.5">Severity</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Consolidated Incident</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((cmp) => (
                  <tr key={cmp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-blue-600">
                      <Link href={`/admin/complaints/${cmp.application_id}`} className="hover:underline">
                        {cmp.application_id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {cmp.user_name || "Citizen"}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{cmp.issue_type}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-1 max-w-xs mt-0.5">
                        "{cmp.description_normalized || cmp.description_original}"
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-slate-400 capitalize">
                          {cmp.category} {cmp.language && cmp.language !== "en" ? `• Spoken in ${cmp.language.toUpperCase()}` : ""}
                        </span>
                        {cmp.image_url && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                            📷 Photo
                          </span>
                        )}
                        {cmp.video_url && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                            🎥 Video
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          cmp.severity === "high" || cmp.severity === "critical"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : cmp.severity === "medium"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {cmp.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(cmp.status)}</td>
                    <td className="px-6 py-4">
                      {cmp.incident_id ? (
                        <Link
                          href={`/admin/incidents/${cmp.incident_id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                        >
                          <Flame className="w-3 h-3 text-indigo-600" />
                          <span>{cmp.incident_id}</span>
                        </Link>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Unlinked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReportComplaint(cmp)}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                          title="Generate official statutory Government Dossier for this issue"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-700" />
                          <span className="hidden sm:inline">Govt Report</span>
                        </button>

                        <Link
                          href={`/admin/complaints/${cmp.application_id}`}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Open & Manage</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                      No complaints found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Government Report Generator Modal from List Action */}
        {selectedReportComplaint && (
          <GovernmentReportGenerator
            complaint={selectedReportComplaint}
            isOpen={!!selectedReportComplaint}
            onClose={() => setSelectedReportComplaint(null)}
          />
        )}
      </main>
    </div>
  );
}
