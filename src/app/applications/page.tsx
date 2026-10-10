"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { CitizenSidebar } from "@/components/CitizenSidebar";
import { CivicSenseAIChat } from "@/components/CivicSenseAIChat";
import { Complaint, CivicDomain } from "@/types";
import { CIVIC_DOMAINS } from "@/lib/constants";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Search,
  Filter,
  ExternalLink,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function MyApplicationsPage() {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [aiChatOpen, setAiChatOpen] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, [selectedDomain, selectedStatus]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let url = "/api/complaints?";
      if (selectedDomain !== "all") url += `category=${selectedDomain}&`;
      if (selectedStatus !== "all") url += `status=${selectedStatus}&`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error("Failed to load complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints.filter(
    (c) =>
      c.application_id.toLowerCase().includes(search.toLowerCase()) ||
      c.issue_type.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );

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
        <CitizenSidebar onOpenAIChat={() => setAiChatOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {t.myApplicationsTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {t.myApplicationsSubtitle}
              </p>
            </div>

            <Link
              href="/report"
              className="self-start sm:self-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.sidebarReport}</span>
            </Link>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t.allDomains}</option>
                {CIVIC_DOMAINS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.shortName}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t.allStatuses}</option>
                <option value="submitted">{t.statusSubmitted}</option>
                <option value="verified">{t.statusVerified}</option>
                <option value="assigned">{t.statusAssigned}</option>
                <option value="in_progress">{t.statusInProgress}</option>
                <option value="resolved">{t.statusResolved}</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-6 py-3.5">{t.tableColAppNo}</th>
                    <th className="px-6 py-3.5">{t.tableColIssue}</th>
                    <th className="px-6 py-3.5">{t.tableColLocation}</th>
                    <th className="px-6 py-3.5">{t.tableColStatus}</th>
                    <th className="px-6 py-3.5">{t.tableColDate}</th>
                    <th className="px-6 py-3.5 text-right">{t.tableColAction}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map((cmp) => (
                    <tr key={cmp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-blue-600">
                        <Link href={`/status/${cmp.application_id}`} className="hover:underline">
                          {cmp.application_id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div>{cmp.issue_type}</div>
                        {(cmp.image_url || cmp.video_url) && (
                          <div className="flex items-center gap-1 mt-1">
                            {cmp.image_url && (
                              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                Photo
                              </span>
                            )}
                            {cmp.video_url && (
                              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                                Video
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                        {cmp.address}
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
                          className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          <span>{t.trackStatus}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                        {t.noMatchedApps}
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
