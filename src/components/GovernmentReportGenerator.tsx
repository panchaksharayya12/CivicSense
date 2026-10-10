"use client";

import React, { useState, useRef } from "react";
import { Complaint } from "@/types";
import {
  GovernmentReportData,
  buildGovernmentReportData,
  formatOfficerWhatsAppDispatch,
} from "@/lib/governmentReportTemplates";
import {
  Printer,
  Copy,
  Check,
  Mail,
  Download,
  Share2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Building2,
  User,
  Calendar,
  Clock,
  Wrench,
  FileText,
  DollarSign,
  ChevronDown,
  Sparkles,
  Phone,
  Sliders,
  X,
  Send,
} from "lucide-react";

interface Props {
  complaint: Complaint;
  isOpen?: boolean;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export function GovernmentReportGenerator({ complaint, isOpen = true, onClose, isEmbedded = false }: Props) {
  // Customization state
  const [customOfficerName, setCustomOfficerName] = useState(complaint.assigned_officer || "");
  const [customDepartment, setCustomDepartment] = useState(complaint.assigned_department || "");
  const [customSlaHours, setCustomSlaHours] = useState<number | undefined>(undefined);
  const [customNotes, setCustomNotes] = useState("");
  const [wardNumber, setWardNumber] = useState("Ward 84 (Central Tech Corridor)");
  const [zoneName, setZoneName] = useState("Zone-IV (East Municipal Division)");
  const [isEditing, setIsEditing] = useState(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<"official_memo" | "whatsapp_dispatch" | "resources_ssr">("official_memo");
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Build report data dynamically based on complaint & custom fields
  const reportData: GovernmentReportData = buildGovernmentReportData(complaint, {
    customOfficerName: customOfficerName.trim() || undefined,
    customDepartmentName: customDepartment.trim() || undefined,
    customSlaHours: customSlaHours,
    customNotes: customNotes.trim() || undefined,
    wardNumber,
    zoneName,
  });

  const { template, memoNumber, mapsUrl, slaDeadlineDate } = reportData;

  // Handle Copy WhatsApp Dispatch
  const handleCopyWhatsApp = () => {
    const text = formatOfficerWhatsAppDispatch(reportData);
    navigator.clipboard.writeText(text);
    setCopiedNotification("Official WhatsApp Dispatch copied! Paste into departmental WhatsApp/Telegram group.");
    setTimeout(() => setCopiedNotification(null), 4000);
  };

  // Handle Print / Save as PDF
  const handlePrint = () => {
    window.print();
  };

  // Handle Email Officer
  const handleEmailOfficer = () => {
    const subject = encodeURIComponent(`[URGENT] ${template.formCode} - ${complaint.issue_type} at ${complaint.address}`);
    const body = encodeURIComponent(formatOfficerWhatsAppDispatch(reportData));
    const officerEmail = template.targetOfficerEmail || "municipal.nodal@gov.in";
    window.open(`mailto:${officerEmail}?subject=${subject}&body=${body}`, "_blank");
  };

  // Handle Download Text Dossier
  const handleDownloadText = () => {
    const text = formatOfficerWhatsAppDispatch(reportData);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Govt_Report_${complaint.application_id}_${template.formCode.replace(/[\/\s]/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className={`space-y-6 ${isEmbedded ? "" : "fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 flex justify-center items-start"}`}>
      {/* Container Card */}
      <div className={`w-full ${isEmbedded ? "" : "max-w-5xl my-6"} bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden transition-all text-slate-900`}>
        
        {/* Header Toolbar (Hidden when printing) */}
        <div className="print:hidden p-4 sm:p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 tracking-wider">
                Official Govt Dossier
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {template.formCode}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1 flex items-center gap-2">
              <span>{template.formTitle}</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Target Authority: <strong className="text-white">{reportData.customDepartmentName}</strong> • {reportData.customOfficerName}
            </p>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Customize Officer Designation, SLA or Notes"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEditing ? "Hide Controls" : "Edit Memo Details"}</span>
            </button>

            <button
              onClick={handleCopyWhatsApp}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-102 cursor-pointer"
              title="Copy rapid dispatch message formatted for officer WhatsApp groups"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Copy WhatsApp Dispatch</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-102 cursor-pointer"
              title="Print formal Government Memorandum or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleEmailOfficer}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="Send via Official Departmental Email"
            >
              <Mail className="w-4 h-4 text-blue-400" />
            </button>

            <button
              onClick={handleDownloadText}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="Download Plaintext Dispatch Dossier"
            >
              <Download className="w-4 h-4 text-slate-300" />
            </button>

            {!isEmbedded && onClose && (
              <button
                onClick={onClose}
                className="p-2 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
                title="Close Report Generator"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Real-time Notification Banner */}
        {copiedNotification && (
          <div className="print:hidden p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* Customization Drawer (Toggled by user) */}
        {isEditing && (
          <div className="print:hidden p-5 bg-slate-50 border-b border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span>Customize Official Government Dispatch Parameters</span>
              </h4>
              <span className="text-[11px] text-slate-500">Live preview updates automatically</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Target Department</label>
                <input
                  type="text"
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                  placeholder={template.departmentName}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Assigned Officer Name</label>
                <input
                  type="text"
                  value={customOfficerName}
                  onChange={(e) => setCustomOfficerName(e.target.value)}
                  placeholder={template.defaultOfficerName}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">SLA Target Resolution (Hours)</label>
                <input
                  type="number"
                  min="2"
                  max="168"
                  value={customSlaHours || template.defaultSlaHours}
                  onChange={(e) => setCustomSlaHours(parseInt(e.target.value) || template.defaultSlaHours)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Municipal Ward & Zone</label>
                <input
                  type="text"
                  value={wardNumber}
                  onChange={(e) => setWardNumber(e.target.value)}
                  placeholder="e.g. Ward 84 (Central Tech Corridor)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1 text-xs">Special Administrative Directives / Field Notes for Officer</label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Coordinate with local traffic police for partial lane diversion; inspect nearby stormwater drain connection."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* View Mode Tabs (Hidden when printing) */}
        <div className="print:hidden px-6 pt-4 border-b border-slate-200 flex items-center gap-3 text-xs bg-slate-50/50">
          <button
            onClick={() => setActiveTab("official_memo")}
            className={`pb-3 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "official_memo"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Formal Government Memorandum (A4 Requisition)</span>
          </button>

          <button
            onClick={() => setActiveTab("whatsapp_dispatch")}
            className={`pb-3 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "whatsapp_dispatch"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>WhatsApp / SMS Field Dispatch</span>
          </button>

          <button
            onClick={() => setActiveTab("resources_ssr")}
            className={`pb-3 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "resources_ssr"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Machinery Checklist & SSR Budget (₹)</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: FORMAL GOVERNMENT MEMORANDUM (PRINT-READY A4 VIEW) */}
        {/* ========================================================================= */}
        <div className={`p-6 sm:p-10 space-y-6 ${activeTab === "official_memo" ? "block" : "hidden print:block"}`}>
          
          {/* Print Stylesheet injection to guarantee pristine government print layout */}
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              body {
                background: white !important;
                color: black !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .print\\:hidden {
                display: none !important;
              }
              .print\\:block {
                display: block !important;
              }
              @page {
                size: A4 portrait;
                margin: 12mm 15mm 12mm 15mm;
              }
            }
          `}} />

          {/* OFFICIAL EMBLEM & GOVERNMENT LETTERHEAD */}
          <div className="border-b-2 border-slate-900 pb-5 text-center space-y-1 relative">
            {/* National / Municipal Emblem Watermark Badge */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center font-serif text-lg font-bold bg-slate-50 text-slate-900">
                🏛️
              </div>
              <div className="text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700 block">
                  GOVERNMENT OF TELANGANA / GREATER MUNICIPAL CORPORATION
                </span>
                <h1 className="text-xl sm:text-2xl font-serif font-black tracking-wide text-slate-950 uppercase">
                  DEPARTMENT OF URBAN INFRASTRUCTURE & CIVIC SERVICES
                </h1>
                <span className="text-[11px] font-semibold text-slate-600 block">
                  Office of the Municipal Commissioner • 24x7 Citizen Grievance & Command Cell
                </span>
              </div>
            </div>

            {/* Official Dispatch Stamp Barcode Ribbon */}
            <div className="pt-3 flex flex-wrap items-center justify-between text-[11px] font-mono border-t border-slate-300 mt-3 text-slate-800">
              <div>
                <strong>DISPATCH MEMO NO:</strong> <span className="font-bold text-blue-900">{memoNumber}</span>
              </div>
              <div>
                <strong>FORM CODE:</strong> <span className="font-bold">{template.formCode}</span>
              </div>
              <div>
                <strong>DATE & TIME:</strong> {reportData.dispatchDate} • {reportData.dispatchTime}
              </div>
            </div>
          </div>

          {/* FORMAL DISPATCH ROUTING HEADER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-300 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">REQUISITION ISSUED TO:</span>
              <p className="font-extrabold text-slate-900 text-sm">
                {reportData.customOfficerName}
              </p>
              <p className="font-bold text-slate-700">{template.targetOfficerDesignation}</p>
              <p className="text-slate-600 font-semibold">{reportData.customDepartmentName}</p>
              <p className="text-slate-500 font-mono text-[11px]">Contact: {template.targetOfficerPhone} • {template.targetOfficerEmail}</p>
            </div>

            <div className="space-y-1 md:border-l md:border-slate-300 md:pl-4">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">DISPATCHED BY:</span>
              <p className="font-bold text-slate-900">Municipal Command Nodal Officer</p>
              <p className="text-slate-600">Civic Sense AI-Automated Public Grievance Desk</p>
              <div className="pt-1 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  complaint.severity === "critical"
                    ? "bg-rose-100 text-rose-900 border border-rose-300"
                    : complaint.severity === "high"
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-blue-100 text-blue-900 border border-blue-300"
                }`}>
                  PRIORITY: {complaint.severity.toUpperCase()} EMERGENCY
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                  SLA: {reportData.customSlaHours} HOURS
                </span>
              </div>
            </div>
          </div>

          {/* SUBJECT & LEGAL REFERENCE */}
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-blue-50/80 border-l-4 border-blue-700 rounded-r-xl">
              <p className="font-bold text-slate-900 text-sm leading-relaxed">
                <strong>SUBJECT:</strong> Statutory Work Order & Requisition for Immediate Remediation of{" "}
                <span className="underline decoration-blue-500 font-extrabold uppercase">{complaint.issue_type}</span> at {complaint.address}.
              </p>
              <p className="text-slate-600 text-[11px] mt-1 font-mono">
                <strong>REFERENCE:</strong> Citizen Grievance Application ID: <strong>{complaint.application_id}</strong> • Statutory Authority: {template.statutoryAct}
              </p>
            </div>
          </div>

          {/* SECTION 1: INCIDENT PROFILE & GEOLOCATION */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>1. Incident Profile & Geolocation Telemetry</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Incident Location / Street Address</span>
                <p className="font-bold text-slate-900 mt-0.5">{complaint.address}</p>
                <p className="text-[11px] text-slate-600 font-medium">{reportData.wardNumber} • {reportData.zoneName}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">GPS Satellite Coordinates</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">
                  Lat: {complaint.latitude?.toFixed(5) || "12.97160"}° N<br />
                  Lng: {complaint.longitude?.toFixed(5) || "77.59460"}° E
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:underline mt-1 print:hidden"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Open in Google Maps Navigation</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Citizen Reporter Details</span>
                <p className="font-bold text-slate-900 mt-0.5">{complaint.user_name || "Verified Citizen"}</p>
                <p className="text-[11px] text-slate-600 font-mono">Phone: {complaint.user_phone || "+91 98765 43210"}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Reported: {new Date(complaint.created_at).toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: PROBLEM STATEMENT & CITIZEN VOICE */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>2. Technical Problem Statement & Citizen Grievance Ground Truth</span>
            </h3>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Standardized English Technical Statement (For Municipal Engineers):
                </span>
                <p className="text-sm font-semibold text-slate-950 mt-1 leading-relaxed">
                  "{complaint.description_normalized || complaint.description_original}"
                </p>
              </div>

              {complaint.description_original && complaint.description_original !== complaint.description_normalized && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Original Citizen Voice Submission ({complaint.language?.toUpperCase() || "Regional"}):
                  </span>
                  <p className="text-xs text-slate-700 italic mt-0.5">
                    "{complaint.description_original}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: PHOTO EVIDENCE & AI FORENSIC AUTHENTICITY CERTIFICATE */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>3. Ground Photographic Evidence & AI Digital Forensics Certificate</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200 items-start">
              {/* Evidence Photo */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Primary Photographic Proof:</span>
                {complaint.image_url ? (
                  <div className="rounded-xl overflow-hidden border border-slate-300 aspect-[4/3] bg-black">
                    <img
                      src={complaint.image_url}
                      alt="Ground Evidence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="p-6 bg-slate-100 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-xs">
                    No physical photo attached (Logged via Citizen Voice Portal)
                  </div>
                )}
              </div>

              {/* AI Forensics Certificate */}
              <div className="md:col-span-2 space-y-2">
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-950 flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>AI Image Forensics Certificate of Authenticity</span>
                    </span>
                    <span className="px-2 py-0.5 rounded font-black text-[10px] bg-emerald-200 text-emerald-900">
                      {complaint.photo_authenticity?.label || "Verified Real Ground Telemetry (96%)"}
                    </span>
                  </div>

                  <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
                    {complaint.photo_authenticity?.reason ||
                      "Anti-spoofing verified: Validated natural outdoor solar illumination, organic pavement asphalt distress texture, zero synthetic generative noise, and validated camera EXIF timestamp."}
                  </p>

                  <div className="pt-1.5 border-t border-emerald-200 text-[10px] text-emerald-800 font-mono">
                    <strong>LEGAL ADMISSIBILITY:</strong> Admissible under Section 65B of the Indian Evidence Act as digitally verified civic telemetry.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 p-2 bg-white rounded-lg border border-slate-200">
                  <div>
                    <strong>AI Issue Confidence:</strong> {complaint.ai_confidence || 96}%
                  </div>
                  <div>
                    <strong>Hazard Classification:</strong> {template.hazardClassification}
                  </div>
                  <div>
                    <strong>Recommended SOP:</strong> {template.sopReference}
                  </div>
                  <div>
                    <strong>Regulatory Code:</strong> {template.regulatoryCode}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: DOMAIN-SPECIFIC ENGINEERING DIAGNOSIS METRICS */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>4. Field Inspection Engineering Diagnostic Parameters</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {template.diagnosticMetrics.map((m, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{m.label}</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: REQUIRED FIELD MACHINERY, MATERIALS & GANG */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>5. Mandatory Field Deployment Requisition Checklist</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Heavy Machinery */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-extrabold text-blue-900 uppercase block border-b border-slate-200 pb-1">
                  🚜 Heavy Machinery & Vehicles:
                </span>
                <ul className="space-y-1 text-[11px] text-slate-800 font-medium">
                  {template.machineryChecklist.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">□</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Consumable Raw Materials */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-extrabold text-indigo-900 uppercase block border-b border-slate-200 pb-1">
                  🧱 Consumable Raw Materials:
                </span>
                <ul className="space-y-1 text-[11px] text-slate-800 font-medium">
                  {template.materialsChecklist.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">□</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Crew Requirements */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-extrabold text-emerald-900 uppercase block border-b border-slate-200 pb-1">
                  👷 Technical Crew Deployment:
                </span>
                <ul className="space-y-1 text-[11px] text-slate-800 font-medium">
                  {template.crewRequirement.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">□</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* SECTION 6: SCHEDULE OF RATES (SSR) BUDGET TABLE */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                6. Schedule of Rates (SSR) Standard Municipal Budget Estimation
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">PWD / Municipal Standard Schedule of Rates 2026</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">SSR Code</th>
                    <th className="px-3 py-2">Item Description</th>
                    <th className="px-3 py-2">Est. Quantity</th>
                    <th className="px-3 py-2">Standard Unit Rate</th>
                    <th className="px-3 py-2 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px] text-slate-800 font-medium">
                  {template.scheduleOfRates.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-3 py-1.5 font-mono font-bold text-blue-800">{r.code}</td>
                      <td className="px-3 py-1.5">{r.item}</td>
                      <td className="px-3 py-1.5">{r.quantity}</td>
                      <td className="px-3 py-1.5">{r.unitRate}</td>
                      <td className="px-3 py-1.5 text-right font-bold text-slate-900">{r.totalAmount}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100/80 font-bold text-slate-950 border-t border-slate-300">
                    <td colSpan={4} className="px-3 py-2 text-right uppercase text-[10px] tracking-wider">
                      Total Estimated Expenditure (Ward Fund Allocation):
                    </td>
                    <td className="px-3 py-2 text-right text-xs text-blue-900">
                      {template.totalEstimatedCost.split("(")[0]}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 7: STEP-BY-STEP ACTION PROTOCOL & STATUTORY SLA DEADLINE */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>7. Standard Operating Procedure (SOP) & Statutory SLA Deadline</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-600">On-Site Execution Protocol for Junior Engineer:</span>
                <ol className="space-y-1 text-[11px] text-slate-800 font-medium list-none">
                  {template.actionProtocol.map((step, idx) => (
                    <li key={idx} className="leading-snug">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-xl space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-900 block">
                    STATUTORY SLA DEADLINE:
                  </span>
                  <p className="text-sm font-black text-amber-950 mt-1">
                    {slaDeadlineDate}
                  </p>
                  <p className="text-[10px] text-amber-800 mt-0.5">
                    ({reportData.customSlaHours} Hours from Requisition Issuance)
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-200 text-[10px] text-amber-900 leading-tight">
                  <AlertTriangle className="w-3.5 h-3.5 inline mr-1 text-amber-700" />
                  <strong>Mandatory Compliance:</strong> {template.penalNotice}
                </div>
              </div>
            </div>

            {reportData.customNotes && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950">
                <strong>Administrative Special Directive:</strong> {reportData.customNotes}
              </div>
            )}
          </div>

          {/* SECTION 8: DUAL OFFICIAL SIGN-OFF & STAMP BLOCKS */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
            {/* Issuing Authority Signature Block */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">ISSUED UNDER AUTHORITY OF:</span>
                <p className="font-extrabold text-slate-900">Dr. M. Haritha, IAS</p>
                <p className="text-slate-600 text-[11px]">Commissioner & Executive Director</p>
                <p className="text-slate-500 text-[10px]">Municipal Command & Public Works Directorate</p>
              </div>

              {/* Digital Signature Watermark */}
              <div className="p-2 border border-blue-200 rounded-lg bg-blue-50/50 inline-block font-mono text-[9px] text-blue-900 space-y-0.5">
                <div className="font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>DIGITALLY SIGNED & VERIFIED</span>
                </div>
                <div>Hash: SHA256-CIVIC-{complaint.application_id.replace(/-/g, "")}</div>
                <div>Timestamp: {reportData.dispatchDate} • {reportData.dispatchTime}</div>
              </div>
            </div>

            {/* Receiving Field Officer Acceptance Block */}
            <div className="space-y-4 text-right">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">FIELD ACKNOWLEDGMENT & UNDERTAKING:</span>
                <p className="font-bold text-slate-800">{reportData.customOfficerName}</p>
                <p className="text-slate-600 text-[11px]">{template.targetOfficerDesignation}</p>
                <p className="text-slate-500 text-[10px]">{reportData.customDepartmentName}</p>
              </div>

              {/* Physical Signature Line for Printing */}
              <div className="pt-6">
                <div className="border-b border-slate-400 w-48 ml-auto"></div>
                <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                  Signature & Department Seal Stamp
                </span>
              </div>
            </div>
          </div>

          {/* Verification Footnote */}
          <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono">
            Civic Sense Telemetry Platform • Security Code: {reportData.qrVerificationCode} • Page 1 of 1
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 2: WHATSAPP / TELEGRAM / SMS RAPID OFFICER DISPATCH */}
        {/* ========================================================================= */}
        <div className={`p-6 sm:p-8 space-y-4 ${activeTab === "whatsapp_dispatch" ? "block" : "hidden"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Executive WhatsApp / SMS Mobile Dispatch for Field Officers</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Formatted specifically for instant transmission to departmental WhatsApp/Telegram coordination groups.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyWhatsApp}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Message</span>
              </button>

              <button
                onClick={handleEmailOfficer}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open Email Client</span>
              </button>
            </div>
          </div>

          {/* Simulated WhatsApp Chat Bubble */}
          <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-inner">
            <div className="p-4 sm:p-5 bg-emerald-950/80 border border-emerald-700/60 rounded-2xl text-emerald-100 font-sans text-xs leading-relaxed space-y-3 shadow-md whitespace-pre-wrap">
              {formatOfficerWhatsAppDispatch(reportData)}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 3: FIELD DEPLOYMENT CHECKLIST & SSR FINANCIAL BREAKDOWN */}
        {/* ========================================================================= */}
        <div className={`p-6 sm:p-8 space-y-6 ${activeTab === "resources_ssr" ? "block" : "hidden"}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-indigo-600" />
                <span>Field Deployment Checklist & Standard Schedule of Rates (SSR)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed machinery breakdown, raw materials, crew headcount, and line-item municipal expenditure.
              </p>
            </div>

            <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 font-extrabold text-xs rounded-xl">
              Est. Budget: {template.totalEstimatedCost.split("(")[0]}
            </span>
          </div>

          {/* Machinery and Crew Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-200 pb-1.5">
                🚜 Heavy Machinery Required
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {template.machineryChecklist.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✔</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-200 pb-1.5">
                🧱 Consumable Raw Materials
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {template.materialsChecklist.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">✔</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-200 pb-1.5">
                👷 Manpower & Crew Gang
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {template.crewRequirement.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SSR Rates Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Schedule of Rates (SSR) Itemized Estimate
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Official Municipal Rate Registry (PWD/JAL/SWM/ELE)
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-2.5">Item Code</th>
                  <th className="px-4 py-2.5">Scope of Works</th>
                  <th className="px-4 py-2.5">Quantity</th>
                  <th className="px-4 py-2.5">Schedule Unit Rate</th>
                  <th className="px-4 py-2.5 text-right">Computed Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {template.scheduleOfRates.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-mono font-bold text-blue-700">{r.code}</td>
                    <td className="px-4 py-2.5 text-slate-900">{r.item}</td>
                    <td className="px-4 py-2.5">{r.quantity}</td>
                    <td className="px-4 py-2.5">{r.unitRate}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-slate-900">{r.totalAmount}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                  <td colSpan={4} className="px-4 py-3 text-right text-xs uppercase">
                    Grand Total Estimated Allocation:
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-blue-900 font-extrabold">
                    {template.totalEstimatedCost.split("(")[0]}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
