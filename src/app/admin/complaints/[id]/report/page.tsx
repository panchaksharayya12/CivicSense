"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Complaint } from "@/types";
import { GovernmentReportGenerator } from "@/components/GovernmentReportGenerator";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function StandaloneGovernmentReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchComplaint();
    }
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/complaints/${id}`);
      if (res.ok) {
        const data = await res.json();
        setComplaint(data.complaint);
      }
    } catch (err) {
      console.error("Failed to load complaint for government report", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Navigation back */}
        <div className="print:hidden flex items-center justify-between pb-2">
          <Link
            href={`/admin/complaints/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Problem Management</span>
          </Link>

          <span className="text-xs text-slate-400 font-mono">
            Government Requisition System • Application: {id}
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-800">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs text-slate-500 mt-2">Generating official government dossier...</p>
          </div>
        ) : !complaint ? (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-800">
            <p className="text-sm font-semibold text-slate-800">Application not found.</p>
          </div>
        ) : (
          <GovernmentReportGenerator complaint={complaint} isEmbedded={true} />
        )}
      </div>
    </div>
  );
}
