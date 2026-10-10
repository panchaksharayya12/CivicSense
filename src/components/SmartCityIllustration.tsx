import React from "react";

export function SmartCityIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-blue-600 select-none ${className}`}>
      {/* Sky & Clouds */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 400">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#E0F2FE" />
          </linearGradient>

          <linearGradient id="bldgGlass1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <linearGradient id="bldgGlass2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="60%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id="bldgCyan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0E7490" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>

          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0369A1" />
            <stop offset="100%" stopColor="#0C4A6E" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="600" height="400" fill="url(#skyGrad)" />

        {/* Sun Glow */}
        <circle cx="500" cy="70" r="45" fill="#FEF08A" opacity="0.8" filter="blur(10px)" />
        <circle cx="500" cy="70" r="30" fill="#FEF9C3" opacity="0.9" />

        {/* Distant Hills / Horizon */}
        <path d="M0 260 Q 150 230 300 250 T 600 240 L 600 400 L 0 400 Z" fill="#93C5FD" opacity="0.4" />

        {/* Distant City Skyline Silhouettes */}
        <rect x="50" y="160" width="30" height="100" fill="#93C5FD" opacity="0.6" rx="2" />
        <rect x="90" y="140" width="35" height="120" fill="#93C5FD" opacity="0.7" rx="2" />
        <rect x="140" y="170" width="28" height="90" fill="#93C5FD" opacity="0.6" rx="2" />
        <rect x="420" y="150" width="40" height="110" fill="#93C5FD" opacity="0.6" rx="2" />
        <rect x="480" y="165" width="35" height="95" fill="#93C5FD" opacity="0.6" rx="2" />

        {/* Prominent Smart City Skyscrapers */}
        {/* Tower 1 - Cyan Smart Tower */}
        <rect x="180" y="90" width="55" height="170" fill="url(#bldgCyan)" rx="4" />
        <line x1="207" y1="50" x2="207" y2="90" stroke="#0891B2" strokeWidth="3" />
        <circle cx="207" cy="50" r="3" fill="#F43F5E" />
        {/* Windows */}
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x="188" y={105 + i * 16} width="39" height="8" fill="#CFFAFE" opacity="0.7" rx="1" />
        ))}

        {/* Tower 2 - High Rise Central Tower */}
        <rect x="250" y="60" width="70" height="200" fill="url(#bldgGlass1)" rx="4" />
        <polygon points="250,60 285,30 320,60" fill="#1D4ED8" />
        <line x1="285" y1="10" x2="285" y2="30" stroke="#60A5FA" strokeWidth="3" />
        <circle cx="285" cy="10" r="3.5" fill="#38BDF8" />
        {/* Window grid */}
        {Array.from({ length: 11 }).map((_, i) => (
          <g key={i}>
            <rect x="258" y={75 + i * 16} width="22" height="8" fill="#93C5FD" opacity="0.85" rx="1" />
            <rect x="288" y={75 + i * 16} width="22" height="8" fill="#BAE6FD" opacity="0.85" rx="1" />
          </g>
        ))}

        {/* Tower 3 - Modern Slanted Architecture */}
        <path d="M 335 110 L 390 85 L 390 260 L 335 260 Z" fill="url(#bldgGlass2)" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="343" y={120 + i * 16} width="38" height="7" fill="#E2E8F0" opacity="0.75" rx="1" />
        ))}

        {/* Tower 4 - Left Side */}
        <rect x="110" y="120" width="50" height="140" fill="url(#bldgGlass1)" rx="3" />
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x="118" y={135 + i * 16} width="34" height="7" fill="#93C5FD" opacity="0.8" rx="1" />
        ))}

        {/* Waterfront Promenade & Green Park */}
        <path d="M 0 250 Q 200 245 400 248 T 600 246 L 600 275 L 0 275 Z" fill="#15803D" />
        <path d="M 0 265 Q 250 260 500 264 T 600 262 L 600 285 L 0 285 Z" fill="#22C55E" />

        {/* Park Trees (Canopies) */}
        {Array.from({ length: 16 }).map((_, i) => (
          <g key={i}>
            <rect x={20 + i * 36} y="255" width="4" height="12" fill="#78350F" />
            <circle cx={22 + i * 36} cy="250" r={8 + (i % 3) * 2} fill={i % 2 === 0 ? "#16A34A" : "#15803D"} />
          </g>
        ))}

        {/* Pristine Clean City Lake */}
        <rect x="0" y="280" width="600" height="120" fill="url(#waterGrad)" />

        {/* Water Reflections */}
        <rect x="255" y="282" width="60" height="35" fill="#38BDF8" opacity="0.25" rx="4" />
        <rect x="185" y="282" width="45" height="25" fill="#22D3EE" opacity="0.2" rx="4" />
        <line x1="80" y1="310" x2="220" y2="310" stroke="#7DD3FC" strokeWidth="2" opacity="0.5" strokeDasharray="15, 10" />
        <line x1="240" y1="325" x2="420" y2="325" stroke="#7DD3FC" strokeWidth="2.5" opacity="0.6" strokeDasharray="25, 15" />
        <line x1="120" y1="345" x2="350" y2="345" stroke="#7DD3FC" strokeWidth="2" opacity="0.4" strokeDasharray="30, 20" />

        {/* Connected AI Civic Intelligence Beacons (Glowing Radar nodes) */}
        <g>
          <circle cx="207" cy="50" r="12" fill="#F43F5E" opacity="0.3" />
          <circle cx="285" cy="10" r="14" fill="#38BDF8" opacity="0.4" />
          <line x1="207" y1="50" x2="285" y2="10" stroke="#67E8F9" strokeWidth="1.5" strokeDasharray="4, 4" opacity="0.8" />
        </g>
      </svg>
    </div>
  );
}
