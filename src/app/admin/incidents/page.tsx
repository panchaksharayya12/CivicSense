"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Incident, Complaint, CivicDomain, ComplaintSeverity } from "@/types";
import { CIVIC_DOMAINS, INITIAL_DEPARTMENTS } from "@/lib/constants";
import {
  Flame,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  AlertTriangle,
  Loader2,
  X,
  Plus,
  Layers,
} from "lucide-react";

export default function AdminIncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [unlinkedComplaints, setUnlinkedComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<CivicDomain>("traffic");
  const [formIssue, setFormIssue] = useState("Pothole");
  const [formAddress, setFormAddress] = useState("");
  const [formSeverity, setFormSeverity] = useState<ComplaintSeverity>("high");
  const [formDepartment, setFormDepartment] = useState("Road Maintenance & Traffic Department");
  const [formOfficer, setFormOfficer] = useState("Ramesh Kumar (Junior Engineer)");
  const [formReason, setFormReason] = useState("");
  const [selectedComplaintIds, setSelectedComplaintIds] = useState<string[]>([]);

  useEffect(() => {
    fetchIncidents();
    fetchComplaints();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/incidents");
      if (res.ok) {
        const data = await res.json();
        setIncidents(data.incidents || []);
      }
    } catch (err) {
      console.error("Failed to load incidents", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints?all=true");
      if (res.ok) {
        const data = await res.json();
        const all: Complaint[] = data.complaints || [];
        setUnlinkedComplaints(all.filter((c) => !c.incident_id || c.incident_id === "Unlinked"));
      }
    } catch (err) {
      console.error("Failed to load complaints for consolidation", err);
    }
  };

  const toggleSelectComplaint = (appId: string) => {
    setSelectedComplaintIds((prev) =>
      prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId]
    );
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formAddress.trim()) {
      setFormError("Please provide an incident title and address.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          category: formCategory,
          issue_type: formIssue,
          address: formAddress.trim(),
          severity: formSeverity,
          department: formDepartment,
          assigned_officer: formOfficer,
          grouping_reason:
            formReason.trim() ||
            `Consolidated by Municipal Operations Officer to coordinate ${selectedComplaintIds.length} citizen complaints.`,
          report_count: Math.max(selectedComplaintIds.length, 1),
          linkedComplaintIds: selectedComplaintIds,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setFormSuccess(`Consolidated incident ${data.incident.incident_id} created successfully!`);
        // Reset form
        setFormTitle("");
        setFormAddress("");
        setFormReason("");
        setSelectedComplaintIds([]);
        setShowCreateForm(false);
        fetchIncidents();
        fetchComplaints();
      } else {
        const err = await res.json();
        setFormError(err.error || "Failed to create incident.");
      }
    } catch (err) {
      console.error("Create incident error:", err);
      setFormError("Network error creating consolidated incident.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto min-h-screen">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Consolidated Civic Incidents
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              AI-driven grouping of multiple duplicate citizen complaints into unified municipal work orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {showCreateForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showCreateForm ? "Close Form" : "Create Consolidated Incident"}</span>
            </button>

            <span className="px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span>Duplicate Intelligence Active</span>
            </span>
          </div>
        </div>

        {/* Success or Error Notes */}
        {formSuccess && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{formSuccess}</span>
            </div>
            <button onClick={() => setFormSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* CREATE / CONSOLIDATE INCIDENT FORM */}
        {showCreateForm && (
          <form
            onSubmit={handleCreateIncident}
            className="p-6 bg-white rounded-3xl border-2 border-indigo-200 shadow-md space-y-5 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Create New Consolidated Municipal Work Order
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Group multiple duplicate citizen complaints into a single coordinated action.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 font-medium">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Incident Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Road Crater & Asphalt Collapse near College Gate"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Civic Domain
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => {
                    const cat = e.target.value as CivicDomain;
                    setFormCategory(cat);
                    const domainObj = CIVIC_DOMAINS.find((d) => d.id === cat);
                    if (domainObj && domainObj.issues[0]) setFormIssue(domainObj.issues[0]);
                    if (domainObj) setFormDepartment(domainObj.department);
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {CIVIC_DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Issue Type
                </label>
                <input
                  type="text"
                  value={formIssue}
                  onChange={(e) => setFormIssue(e.target.value)}
                  placeholder="e.g. Pothole, Water Leakage"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / Address *
                </label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="e.g. Main College Gate, Koramangala 5th Block"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Severity Level
                </label>
                <select
                  value={formSeverity}
                  onChange={(e) => setFormSeverity(e.target.value as ComplaintSeverity)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="critical">Critical (Immediate Hazard)</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Field Officer
                </label>
                <input
                  type="text"
                  value={formOfficer}
                  onChange={(e) => setFormOfficer(e.target.value)}
                  placeholder="e.g. Ramesh Kumar (Junior Engineer)"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                AI / Administrative Grouping Reason
              </label>
              <input
                type="text"
                value={formReason}
                onChange={(e) => setFormReason(e.target.value)}
                placeholder="e.g. Multiple citizens reported identical road crater within 180m radius on Koramangala Main Road."
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Select citizen complaints to link */}
            {unlinkedComplaints.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Select Citizen Complaints to Consolidate into this Work Order:</span>
                  </span>
                  <span className="text-[11px] text-indigo-600 font-bold">
                    {selectedComplaintIds.length} Selected
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  {unlinkedComplaints.map((c) => {
                    const isSelected = selectedComplaintIds.includes(c.application_id);
                    return (
                      <label
                        key={c.id}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-300 shadow-2xs"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectComplaint(c.application_id)}
                          className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{c.application_id} • {c.issue_type}</span>
                            <span className="text-[10px] text-slate-400 capitalize">{c.category}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                            "{c.description_normalized || c.description_original}"
                          </p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                            📍 {c.address}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Consolidating Work Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save & Consolidate Incident</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Core Innovation Explainer Banner */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/30 border border-indigo-400/40 rounded-full text-indigo-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>AI Spatial & Semantic Clustering</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Multiple Citizen Voices → 1 Consolidated Incident → 1 Field Action
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              When multiple citizens report the same road crater or water leak, CivicSense clusters nearby duplicate complaints into a single unified work order. Each citizen retains their personal tracking number and receives automatic status notifications upon repair.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="shrink-0 px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Consolidated Incident</span>
          </button>
        </div>

        {/* Incidents Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Active Consolidated Incidents ({incidents.length})</span>
            </h2>
            <span className="text-xs text-slate-500">
              Each incident consolidates duplicate neighborhood complaints into 1 municipal team dispatch.
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
              <p className="text-xs text-slate-500 mt-2">Loading consolidated incidents...</p>
            </div>
          ) : incidents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Flame className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No active consolidated incidents yet.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                + Create First Consolidated Incident
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-900 font-extrabold text-xs rounded-xl">
                          {inc.incident_id}
                        </span>
                        <span className="text-xs font-bold text-slate-500 capitalize">
                          {inc.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          inc.severity === "critical" || inc.severity === "high"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {inc.severity}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize bg-blue-50 text-blue-700 border border-blue-200">
                          {inc.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {inc.title}
                    </h3>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed">
                        <strong className="text-slate-800">AI Grouping Reason:</strong> {inc.grouping_reason}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium block text-[11px]">Location</span>
                        <span className="text-slate-800 font-semibold block truncate">
                          {inc.address}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block text-[11px]">Department</span>
                        <span className="text-blue-700 font-semibold block truncate">
                          {inc.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{inc.report_count} Linked Citizen Complaints</span>
                      </div>
                    </div>

                    <Link
                      href={`/admin/incidents/${inc.incident_id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Manage Incident</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
