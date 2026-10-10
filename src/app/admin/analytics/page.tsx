"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  Flame,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>({
    totalReports: 1248,
    resolved: 652,
    activeIncidents: 48,
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Citywide Civic Analytics & Trends
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Resolution velocity, consolidation efficiency ratios, and department performance metrics.
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200">
            Real-Time Telemetry Active
          </span>
        </div>

        {/* 4 Efficiency KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">
              Avg. Resolution Time
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-extrabold text-slate-900">28.4 hrs</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> -18% faster
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">
              Consolidation Efficiency Ratio
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-extrabold text-indigo-700">68.2%</span>
              <span className="text-xs font-bold text-indigo-600">
                1 Inc / 26 Calls
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">
              AI Domain Classification Accuracy
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-extrabold text-blue-600">96.8%</span>
              <span className="text-xs font-bold text-emerald-600">High Precision</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">
              Citizen Satisfaction Index
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-extrabold text-emerald-600">4.8 / 5.0</span>
              <span className="text-xs font-bold text-emerald-600">94% Positive</span>
            </div>
          </div>
        </div>

        {/* Department Workload & Performance Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Department Resolution Performance
            </h3>
            <span className="text-xs text-slate-400">Monthly Audit</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Active Officers</th>
                  <th className="px-6 py-3.5">Assigned Grievances</th>
                  <th className="px-6 py-3.5">Resolved</th>
                  <th className="px-6 py-3.5">SLA Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    Road Maintenance & Traffic Department
                  </td>
                  <td className="px-6 py-4">58 Junior Engineers</td>
                  <td className="px-6 py-4 font-bold text-blue-600">312</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">188</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      94.2%
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    Water Supply & Sewerage Board (BWSSB)
                  </td>
                  <td className="px-6 py-4">36 Engineers</td>
                  <td className="px-6 py-4 font-bold text-blue-600">224</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">142</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      91.8%
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    Waste Management Department
                  </td>
                  <td className="px-6 py-4">42 Health Inspectors</td>
                  <td className="px-6 py-4 font-bold text-blue-600">380</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">246</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      96.4%
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    Electrical & Streetlight Division (BESCOM)
                  </td>
                  <td className="px-6 py-4">24 Linemen Supervisors</td>
                  <td className="px-6 py-4 font-bold text-blue-600">165</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">110</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      93.0%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
