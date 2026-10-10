"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { CityMap } from "@/components/CityMap";
import { Complaint, Incident, CivicDomain } from "@/types";
import { CIVIC_DOMAINS } from "@/lib/constants";
import {
  Filter,
  Search,
  Layers,
  MapPin,
  Calendar,
  Flame,
  AlertTriangle,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function AdminLiveCityMapPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMapData();
  }, [selectedDomain, selectedSeverity, selectedStatus]);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      let compUrl = "/api/complaints?all=true&";
      if (selectedDomain !== "all") compUrl += `category=${selectedDomain}&`;
      if (selectedSeverity !== "all") compUrl += `severity=${selectedSeverity}&`;
      if (selectedStatus !== "all") compUrl += `status=${selectedStatus}&`;

      const [compRes, incRes] = await Promise.all([
        fetch(compUrl),
        fetch("/api/incidents"),
      ]);

      if (compRes.ok) {
        const compData = await compRes.json();
        setComplaints(compData.complaints || []);
      }

      if (incRes.ok) {
        const incData = await incRes.json();
        setIncidents(incData.incidents || []);
      }
    } catch (err) {
      console.error("Failed to load map data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 space-y-5 overflow-hidden flex flex-col h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Live City Operations Map & Hotspots
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Geographic clustering, incident heatmaps, and spatial grievance intelligence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMapData}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Pins</span>
            </button>
          </div>
        </div>

        {/* Filter Bar matching screenshot */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
          {/* Domain Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Domain:</span>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Domains</option>
              {CIVIC_DOMAINS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="submitted">Submitted</option>
              <option value="verified">Verified</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Date range display matching screenshot */}
          <div className="ml-auto text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Apr 1, 2026 - Apr 30, 2026</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 w-full relative min-h-[450px]">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-white rounded-3xl border border-slate-200">
              <div className="text-center space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  Loading city coordinates & geospatial pins...
                </p>
              </div>
            </div>
          ) : (
            <CityMap
              complaints={complaints}
              incidents={incidents}
              selectedIncidentId="PTH-1042"
              height="100%"
            />
          )}
        </div>
      </main>
    </div>
  );
}
