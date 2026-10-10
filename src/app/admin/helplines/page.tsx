"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Helpline, CivicDomain } from "@/types";
import { CIVIC_DOMAINS } from "@/lib/constants";
import { PhoneCall, Plus, CheckCircle2, ShieldAlert, Loader2 } from "lucide-react";

export default function AdminHelplinesPage() {
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const [loading, setLoading] = useState(true);

  // New helpline form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CivicDomain | "general">("general");
  const [isEmergency, setIsEmergency] = useState(false);

  useEffect(() => {
    fetchHelplines();
  }, []);

  const fetchHelplines = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/helplines");
      if (res.ok) {
        const data = await res.json();
        setHelplines(data.helplines || []);
      }
    } catch (err) {
      console.error("Failed to load helplines", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !number) return;

    try {
      const res = await fetch("/api/helplines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          number,
          description,
          category,
          is_emergency: isEmergency,
          active: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setHelplines((prev) => [...prev, data.helpline]);
        setShowAddForm(false);
        setName("");
        setNumber("");
        setDescription("");
      }
    } catch (err) {
      console.error("Failed to create helpline", err);
    }
  };

  const toggleActive = async (hl: Helpline) => {
    try {
      const res = await fetch("/api/helplines", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: hl.id, active: !hl.active }),
      });
      if (res.ok) {
        setHelplines((prev) =>
          prev.map((h) => (h.id === hl.id ? { ...h, active: !h.active } : h))
        );
      }
    } catch (err) {
      console.error("Failed to update helpline", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Helplines & Emergency Directory Management
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Configure real municipal contact numbers, emergency hotlines, and category routing.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Helpline</span>
          </button>
        </div>

        {/* Add Helpline Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreate}
            className="bg-white p-6 rounded-3xl border border-blue-200 shadow-md space-y-4 animate-in fade-in duration-150"
          >
            <h3 className="text-sm font-bold text-slate-900">Add New Official Helpline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Metro Rail Emergency"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Helpline Number *
                </label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="e.g. 1925"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                >
                  <option value="general">General Municipal</option>
                  {CIVIC_DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.shortName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief information for citizen guidance"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Flag as Critical Emergency (Highlights in Red)</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                >
                  Save Helpline
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Helplines Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Service Name</th>
                <th className="px-6 py-3.5">Number</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {helplines.map((hl) => (
                <tr key={hl.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{hl.name}</td>
                  <td className="px-6 py-4 font-extrabold text-blue-700 text-sm">
                    {hl.number}
                  </td>
                  <td className="px-6 py-4 capitalize text-slate-600">{hl.category}</td>
                  <td className="px-6 py-4">
                    {hl.is_emergency ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                        Emergency
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        hl.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {hl.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleActive(hl)}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      {hl.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
