"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CivicLogo } from "./CivicLogo";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard,
  Inbox,
  Flame,
  MapPin,
  AlertOctagon,
  BarChart3,
  Building2,
  PhoneCall,
  Settings,
  LogOut,
  UserCheck,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, demoLogin } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "All Applications",
      href: "/admin/complaints",
      icon: Inbox,
    },
    {
      name: "Incidents",
      href: "/admin/incidents",
      icon: Flame,
    },
    {
      name: "Live City Map",
      href: "/admin/map",
      icon: MapPin,
    },
    {
      name: "Priority Issues",
      href: "/admin/priority",
      icon: AlertOctagon,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Departments",
      href: "/admin/departments",
      icon: Building2,
    },
    {
      name: "Helplines",
      href: "/admin/helplines",
      icon: PhoneCall,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold text-sm shadow-md">
            CS
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-none">CivicSense</h1>
            <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
              Admin Command
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="p-3 space-y-1 flex-1 overflow-y-auto">
        <p className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
          Municipal Operations
        </p>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-full text-white ${
                    item.badgeColor || "bg-blue-500"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Switcher & Logout */}
      <div className="p-3 border-t border-slate-800 space-y-1.5">
        <button
          onClick={async () => {
            await demoLogin("citizen");
            router.push("/dashboard");
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-cyan-400 hover:bg-slate-800 transition-colors"
        >
          <UserCheck className="w-4 h-4" />
          <span>Switch to Citizen View</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
