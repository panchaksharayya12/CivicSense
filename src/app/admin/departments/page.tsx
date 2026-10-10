"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Department } from "@/types";
import { Building2, Users, CheckCircle2, XCircle, Plus, Loader2 } from "lucide-react";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/departments");
      if (res.ok) {
        const data = await res.json();
        setDepartments(data.departments || []);
      }
    } catch (err) {
      console.error("Failed to load departments", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (dept: Department) => {
    try {
      const res = await fetch("/api/departments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: dept.id, active: !dept.active }),
      });
      if (res.ok) {
        setDepartments((prev) =>
          prev.map((d) => (d.id === dept.id ? { ...d, active: !d.active } : d))
        );
      }
    } catch (err) {
      console.error("Failed to update department", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Municipal Departments & Dispatch Roster
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Configure department titles, officer strengths, and AI automated routing assignments.
            </p>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                    <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      dept.active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {dept.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{dept.officer_count} Registered Field Officers</span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleActive(dept)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  {dept.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
