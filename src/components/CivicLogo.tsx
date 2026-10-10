import React from "react";
import Link from "next/link";

interface CivicLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  adminBadge?: boolean;
  className?: string;
}

export function CivicLogo({
  size = "md",
  showTagline = true,
  adminBadge = false,
  className = "",
}: CivicLogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Smart City & Civic Voice Emblem */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 shadow-md shadow-blue-500/25 text-white transition-all group-hover:scale-105 p-2`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          {/* Smart City Skyline Buildings */}
          <path
            d="M8 32V20L15 15V32"
            fill="currentColor"
            fillOpacity="0.4"
          />
          <path
            d="M15 32V12L25 8V32"
            fill="currentColor"
            fillOpacity="0.9"
          />
          <path
            d="M25 32V18L32 23V32"
            fill="currentColor"
            fillOpacity="0.5"
          />
          
          {/* Citizen Voice Pulse / Radar Waves (The 'Sense' element) */}
          <path
            d="M11 9C15 5 25 5 29 9"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M14 6C17 3 23 3 26 6"
            stroke="#A5F3FC"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Civic Action Beacon Sensor Dot */}
          <circle cx="20" cy="18" r="2.5" fill="#38BDF8" />
          <path d="M5 32H35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        {/* Live Pulse Indicator */}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse"></span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={`${textSizes[size]} font-extrabold tracking-tight text-slate-900 leading-none`}
          >
            Civic<span className="text-blue-600">Sense</span>
          </span>
          {adminBadge && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-blue-100 text-blue-800 rounded-full border border-blue-200">
              Admin Command
            </span>
          )}
        </div>
        {showTagline && (
          <span className="text-[11px] font-semibold text-slate-500 tracking-tight leading-tight mt-0.5">
            From Citizen Voice to City Action.
          </span>
        )}
      </div>
    </Link>
  );
}
