"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Complaint, Incident } from "@/types";
import {
  AlertOctagon,
  Flame,
  AlertTriangle,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  FileText,
} from "lucide-react";

export default function AdminPriorityIssuesPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPriorityData();
  }, []);

  const fetchPriorityData = async () => {
    try {
      setLoading(true);
      const [compRes, incRes] = await Promise.all([
        fetch("/api/complaints?all=true&severity=high"),
        fetch("/api/incidents"),
      ]);

      if (compRes.ok) {
        const d = await compRes.json();
        setComplaints(d.complaints || []);
      }
      if (incRes.ok) {
        const d = await incRes.json();
        setIncidents(d.incidents || []);
      }
    } catch (err) {
      console.error("Failed to load priority data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-6 h-6 text-rose-600" />
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Priority Civic Issues & Emerging Hotspots
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Urgent municipal alerts, duplicate report spikes, and severe community safety hazards.
            </p>
          </div>

          <span className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span>23 High Priority Issues Flagged</span>
          </span>
        </div>

        {/* AI Insight Flash Cards matching Section 28 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 to-blue-900 text-white shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">
                AI Hotspot Insight #1
              </span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white">
              47 reports describe the same road crater
            </h3>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Consolidated into <strong>PTH-1042</strong> near Koramangala 5th Block. Asphalt crew scheduled.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/incidents/PTH-1042"
                className="text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1"
              >
                <span>Inspect Incident</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-900 to-cyan-900 text-white shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300">
                AI Hotspot Insight #2
              </span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white">
              14 reports describe the same water leakage
            </h3>
            <p className="text-xs text-cyan-100 leading-relaxed">
              Consolidated into <strong>WTR-2088</strong> along Indiranagar 12th Cross. Water Supply Board notified.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/incidents/WTR-2088"
                className="text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1"
              >
                <span>Inspect Incident</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-900 to-red-900 text-white shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-300">
                AI Hotspot Insight #3
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-300" />
            </div>
            <h3 className="text-base font-bold text-white">
              3 emerging civic hotspots detected
            </h3>
            <p className="text-xs text-rose-100 leading-relaxed">
              Elevated grievance density in Jayanagar, Koramangala, and Indiranagar sectors.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/map"
                className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1"
              >
                <span>View Heatmap on Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Priority Complaints Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Immediate High-Severity Complaints
            </h3>
            <span className="text-xs text-slate-400">Ordered by Urgency</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Application No.</th>
                  <th className="px-6 py-3.5">Issue</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5">Severity</th>
                  <th className="px-6 py-3.5">Consolidated Incident</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-blue-600">
                      <Link href={`/admin/complaints/${c.application_id}`} className="hover:underline">
                        {c.application_id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{c.issue_type}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{c.address}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                        {c.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {c.incident_id ? (
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {c.incident_id}
                        </span>
                      ) : (
                        <span className="text-slate-400">Independent</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/complaints/${c.application_id}?tab=report`}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-colors shadow-2xs"
                          title="Generate official statutory Government Dossier for this issue"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-700" />
                          <span className="hidden sm:inline">Govt Report</span>
                        </Link>

                        <Link
                          href={`/admin/complaints/${c.application_id}`}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Manage</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
