"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Printer,
  Home,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  ShieldCheck,
  Flame,
  FileText,
  Clock,
  Layers,
  Award,
} from "lucide-react";

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageCaption: string;
  bullets: { title: string; desc: string }[];
  highlightBadge?: string;
  metrics?: { label: string; value: string }[];
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: "Slide 1 • Title & Introduction",
    title: "CivicSense",
    subtitle: "From Citizen Voice to City Action — AI-Powered Civic Grievance & Municipal Governance Platform",
    imageUrl: "/images/smart_city_cinematic.jpg",
    imageCaption: "CivicSense Smart City Operational Grid & Incident Core",
    highlightBadge: "Hackathon 2026 Pitch Deck • 4 Members",
    bullets: [
      {
        title: "Mission",
        desc: "Transforming chaotic, duplicate citizen complaints into unified, high-priority municipal action using spatial AI and Indic speech technology.",
      },
      {
        title: "Category",
        desc: "Smart Governance, AI for Public Good & Responsive Smart Cities.",
      },
      {
        title: "Team Structure",
        desc: "4 Members covering Full-Stack Architecture, AI/NLP Engineering, GIS Location Intelligence, and Civic UX Design.",
      },
    ],
    metrics: [
      { label: "Supported Languages", value: "6+ Indic" },
      { label: "Duplicate Reduction", value: "65%" },
      { label: "Dispatch Velocity", value: "< 4 Hours" },
    ],
  },
  {
    id: 2,
    tag: "Slide 2 • The Civic Crisis",
    title: "Why Current Civic Grievance Systems Fail",
    subtitle: "Municipal administrations are drowning in redundant tickets while citizens lose trust in civic redressal.",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Road craters, drainage bursts & urban neglect create duplicate complaint spikes",
    bullets: [
      {
        title: "The Duplicate Avalanche",
        desc: "When a major pothole opens on a busy junction, 50 citizens file 50 separate complaints. Field engineers waste hours inspecting the exact same spot 50 times.",
      },
      {
        title: "Language & Literacy Barrier",
        desc: "Current portals force citizens to type English text. Millions of rural, elderly, and non-English-speaking citizens are completely locked out.",
      },
      {
        title: "Fake Photos & Staged Grievances",
        desc: "Municipal workers frequently investigate old internet photos or staged non-issues, wasting valuable public manpower and fuel.",
      },
      {
        title: "Bureaucratic Paperwork Delay",
        desc: "No automated tool exists to convert digital complaints into official, compliant reports for Ward Commissioners and MLAs.",
      },
    ],
  },
  {
    id: 3,
    tag: "Slide 3 • The Solution",
    title: "Introducing CivicSense Ecosystem",
    subtitle: "A unified AI platform connecting citizen voices directly to municipal field officers.",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Mobile-first citizen empowerment linked directly to city maintenance squads",
    bullets: [
      {
        title: "Multilingual Voice-First Access",
        desc: "Citizens simply speak in their mother tongue (Kannada, Telugu, Hindi, etc.). AI transcribes, categorizes, and translates it instantly.",
      },
      {
        title: "AI Incident Clustering",
        desc: "Automatically detects multiple reports of the same physical problem and consolidates them into 1 unified priority city incident.",
      },
      {
        title: "AI Photo Authenticity Verification",
        desc: "Every uploaded evidence photo is scanned for image tampering, lighting naturalness, and anti-spoofing before dispatch.",
      },
      {
        title: "Closed-Loop Accountability",
        desc: "Citizens track live 5-stage progress and receive field-repair photo/video proof uploaded by on-site junior engineers.",
      },
    ],
  },
  {
    id: 4,
    tag: "Slide 4 • AI Innovations",
    title: "Breakthrough Artificial Intelligence Engine",
    subtitle: "Three dedicated AI pipelines operating seamlessly in real-time.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Multimodal AI combining Speech NLP, Computer Vision & Spatial Geospatial Graph",
    bullets: [
      {
        title: "1. Indic Speech NLP & Translation",
        desc: "Accurately processes voice input across 13 Indian dialects. Converts colloquial citizen audio into formal English statements for municipal engineers.",
      },
      {
        title: "2. Anti-Spoofing & Fake Photo Detection",
        desc: "Computer vision heuristics analyze photo fracture patterns, lighting physics, and compression artifacts to certify 96%+ authenticity.",
      },
      {
        title: "3. Spatial Incident Clustering Algorithm",
        desc: "Combines Haversine geo-distance, domain matching, and text semantic cosine similarity to group complaints into unified city incidents.",
      },
    ],
  },
  {
    id: 5,
    tag: "Slide 5 • Technical Architecture",
    title: "Robust & Scalable Technology Stack",
    subtitle: "Built with production-grade frameworks designed for high-concurrency public traffic.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Modern full-stack JavaScript architecture with modular AI services and REST APIs",
    bullets: [
      {
        title: "Frontend Layer (React / Next.js 14)",
        desc: "Responsive App Router architecture with Tailwind CSS, Lucide Icons, and client-side reactive language switching without page reloads.",
      },
      {
        title: "Backend & Data Pipeline",
        desc: "Next.js Server API Routes, JWT & secure session handling, ACID-compliant persistence with atomic file committing.",
      },
      {
        title: "GIS & Location Intelligence",
        desc: "HTML5 Geolocation API, reverse geocoding, spatial bounding boxes, and mini map telemetry canvas.",
      },
      {
        title: "Document Engine",
        desc: "Client-side official government report generation with high-resolution print styles and PDF export compatibility.",
      },
    ],
  },
  {
    id: 6,
    tag: "Slide 6 • Citizen Experience",
    title: "The 4-Step Citizen Journey",
    subtitle: "Designed for 100% digital inclusion — zero training required.",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Voice-driven mobile interface accessible to all literacy levels across India",
    bullets: [
      {
        title: "Step 1: Speak or Type",
        desc: "Press the microphone button and speak in Kannada, Hindi, or Telugu. The domain (roads, garbage, water, lighting) is auto-selected.",
      },
      {
        title: "Step 2: Auto GPS Pinpointing",
        desc: "One click detects exact coordinates or citizen types a nearby landmark (e.g. Near 5th Cross College Gate).",
      },
      {
        title: "Step 3: Instant Application ID",
        desc: "Generates a clean tracking ID (e.g. CS-2026-00001) starting from zero with instant local notification confirmation.",
      },
      {
        title: "Step 4: Live 5-Stage Tracking",
        desc: "Track real-time progress: Submitted → Verified → Assigned → In Progress → Resolved, with official field officer notes.",
      },
    ],
  },
  {
    id: 7,
    tag: "Slide 7 • Municipal Command Center",
    title: "Admin Operations Command Center",
    subtitle: "Empowering city managers and engineers to execute fast, coordinated field repairs.",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Centralized municipal dashboard for telemetry, department dispatch & incident clusters",
    bullets: [
      {
        title: "Consolidated Incident Matrix",
        desc: "City managers see grouped incidents (e.g. INC-TRAFFIC-1) with report counts instead of 50 individual unlinked complaints.",
      },
      {
        title: "Segmented Grievance Table",
        desc: "Structured table with distinct section gaps, domain tabs, severity badges, and quick search filters.",
      },
      {
        title: "Field Squad Allocation",
        desc: "Assign complaints directly to specialized departments: PWD Road Maintenance, BESCOM Electricals, BWSSB Water, or Solid Waste.",
      },
      {
        title: "Work Progress Proof",
        desc: "Field officers upload before-and-after photo/video proof directly on site before marking an issue resolved.",
      },
    ],
  },
  {
    id: 8,
    tag: "Slide 8 • Government Report Generator",
    title: "Official Government Report Generator",
    subtitle: "Instant municipal compliance reports ready for Corporators, Commissioners, and MLAs.",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Official government document formatting with reference numbers, GPS coords & sign-off blocks",
    bullets: [
      {
        title: "Direct Per-Problem Generator",
        desc: "Located directly in every complaint row under 'Action & Manage'. Officers generate a tailored report with 1 click.",
      },
      {
        title: "Government Compliance Format",
        desc: "Includes Official Header, Application ID, Domain, Severity, GPS Coordinates, Field Officer Notes, and Verification Seal.",
      },
      {
        title: "Instant Print / Save as PDF",
        desc: "Optimized clean A4 print styles that remove navigation and render crisp bureaucratic documentation for administrative sign-off.",
      },
      {
        title: "Accelerates Bureaucracy",
        desc: "Eliminates days of manual paperwork drafting, enabling municipal staff to focus on actual civil works.",
      },
    ],
  },
  {
    id: 9,
    tag: "Slide 9 • Measurable Impact",
    title: "Quantifiable Real-World Public Impact",
    subtitle: "Transforming civic budgets, municipal productivity, and citizen trust.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Analytics dashboard displaying resolution turnaround times and spatial resolution rates",
    bullets: [
      {
        title: "65% Reduction in Redundant Field Trips",
        desc: "Engineers resolve physical problem locations once rather than reacting to dozens of duplicate tickets.",
      },
      {
        title: "3x Faster Turnaround Time",
        desc: "AI routing skips departmental triage delays, delivering complaints straight to the correct road/water maintenance squad.",
      },
      {
        title: "100% Regional Language Inclusivity",
        desc: "Non-English speakers and illiterate citizens report problems with dignity through voice in their mother tongue.",
      },
      {
        title: "Zero Budget Wastage on Fake Claims",
        desc: "AI photo authenticity algorithms filter fraudulent claims before municipal funds or machinery are mobilized.",
      },
    ],
    metrics: [
      { label: "Duplicate Savings", value: "65%" },
      { label: "Turnaround Boost", value: "3x Faster" },
      { label: "Language Barrier", value: "0%" },
    ],
  },
  {
    id: 10,
    tag: "Slide 10 • Future Roadmap",
    title: "Future Roadmap & Vision for Smart India",
    subtitle: "Scaling CivicSense across 100+ Smart Cities and urban local bodies.",
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Next-generation connected city grid with predictive AI maintenance and IoT sensors",
    bullets: [
      {
        title: "Phase 1: WhatsApp Grievance Bot",
        desc: "Allow citizens to send photos, voice notes, and live locations directly through WhatsApp without installing an app.",
      },
      {
        title: "Phase 2: IoT City Sensor Integration",
        desc: "Smart water flow meters and streetlight corridor sensors auto-generate tickets before citizens even experience the outage.",
      },
      {
        title: "Phase 3: Predictive Infrastructure Budgeting",
        desc: "Spatial AI heatmaps identify recurring road damage clusters to inform municipal annual budget allocation.",
      },
      {
        title: "Conclusion",
        desc: "CivicSense turns passive citizen frustration into active city improvement. From Citizen Voice to City Action!",
      },
    ],
  },
];

export default function PresentationDeckPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : SLIDES.length - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Home") {
        setCurrentSlide(0);
      } else if (e.key === "End") {
        setCurrentSlide(SLIDES.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Deck Navigation Bar (hidden during print) */}
      <header className="print:hidden border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Return to Dashboard"
          >
            <Home className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="h-5 w-px bg-slate-700"></div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-1.5">
              <span>CivicSense</span>
              <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                Pitch Deck
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden md:block">
              From Citizen Voice to City Action • Hackathon Presentation
            </p>
          </div>
        </div>

        {/* Slide Counter & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1.5 rounded-xl">
            Slide {currentSlide + 1} / {SLIDES.length}
          </span>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Save as PDF</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-800/90 rounded-xl p-1 border border-slate-700">
            <button
              onClick={prevSlide}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
              title="Previous Slide (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-1.5 hover:bg-blue-600 rounded-lg text-white transition-colors"
              title="Next Slide (Right Arrow or Space)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Slide Stage (Optimized for 16:9 Presentation & Print) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2.5 py-1 rounded-lg">
                    {slide.tag}
                  </span>
                  {slide.highlightBadge && (
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800/50 px-2.5 py-1 rounded-lg">
                      {slide.highlightBadge}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                    {slide.subtitle}
                  </p>
                </div>

                {/* Key Points / Bullet Cards */}
                <div className="space-y-3 pt-2">
                  {slide.bullets.map((b, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all"
                    >
                      <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
                        <span>{b.title}</span>
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed pl-4">
                        {b.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Metrics Bar (if available) */}
              {slide.metrics && (
                <div className="pt-4 border-t border-slate-800 grid grid-cols-3 gap-3">
                  {slide.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center"
                    >
                      <div className="text-base sm:text-lg font-black text-cyan-300 font-mono">
                        {m.value}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Photo Column (5 cols) */}
            <div className="lg:col-span-5 relative bg-slate-950 min-h-[300px] lg:min-h-full overflow-hidden flex flex-col justify-end p-6 group">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

              {/* Caption Card Overlaid on Photo */}
              <div className="relative z-10 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                    Live Operational Visual
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-medium leading-snug">
                  {slide.imageCaption}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Thumbnail Strip & Controls (hidden in print) */}
      <footer className="print:hidden border-t border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Thumbnail Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-4xl scrollbar-none">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                idx === currentSlide
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-400"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {idx + 1}. {s.title.split(":")[0].substring(0, 16)}...
            </button>
          ))}
        </div>

        {/* Keyboard Hint */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
            ←
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
            →
          </span>
          <span>Arrow keys to flip</span>
        </div>
      </footer>
    </div>
  );
}
