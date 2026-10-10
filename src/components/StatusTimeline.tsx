"use client";

import React from "react";
import { Check, Clock, CircleDot, AlertCircle } from "lucide-react";
import { ComplaintStatus, StatusHistory } from "@/types";
import { useLanguage } from "@/lib/LanguageContext";

interface StatusTimelineProps {
  currentStatus: ComplaintStatus;
  history?: StatusHistory[];
}

export function StatusTimeline({ currentStatus, history = [] }: StatusTimelineProps) {
  const { t } = useLanguage();

  const STAGES: { key: ComplaintStatus; label: string; desc: string }[] = [
    { key: "submitted", label: t.statusSubmitted || "Submitted", desc: "Complaint received & logged into central municipal system." },
    { key: "verified", label: t.statusVerified || "Verified", desc: "AI and GIS cross-verification completed. Priority flagged." },
    { key: "assigned", label: t.statusAssigned || "Assigned", desc: "Designated department and junior engineer allocated." },
    { key: "in_progress", label: t.statusInProgress || "In Progress", desc: "Field maintenance team mobilized with equipment on site." },
    { key: "resolved", label: t.statusResolved || "Resolved", desc: "Civil works finalized. Public space restored & inspected." },
  ];
  const getStageIndex = (status: ComplaintStatus) => {
    switch (status) {
      case "submitted":
        return 0;
      case "verified":
        return 1;
      case "assigned":
        return 2;
      case "in_progress":
        return 3;
      case "resolved":
        return 4;
      case "rejected":
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-slate-800">Status Timeline</h3>

      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;

          // Find matching timestamp and note from history if available
          const historyEntry = history.find((h) => h.new_status === stage.key);
          const dateStr = historyEntry
            ? new Date(historyEntry.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            : isCurrent
            ? "Current Stage"
            : "Pending";

          return (
            <div key={stage.key} className="relative group">
              {/* Timeline marker icon */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  isPassed
                    ? "bg-emerald-500 text-white ring-4 ring-emerald-50"
                    : isCurrent
                    ? "bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse"
                    : "bg-white text-slate-400 border-2 border-slate-300"
                }`}
              >
                {isPassed ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <CircleDot className="w-4 h-4" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                )}
              </div>

              {/* Stage content */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      isCurrent
                        ? "text-blue-600 font-extrabold"
                        : isPassed
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {stage.label}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-md">
                    {historyEntry?.note || stage.desc}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      isCurrent
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : isPassed
                        ? "text-slate-600"
                        : "text-slate-400"
                    }`}
                  >
                    {dateStr}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
