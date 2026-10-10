"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus2,
  FolderKanban,
  Activity,
  Bell,
  HelpCircle,
  Bot,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";

interface CitizenSidebarProps {
  onOpenAIChat?: () => void;
}

export function CitizenSidebar({ onOpenAIChat }: CitizenSidebarProps) {
  const pathname = usePathname();
  const { unreadCount } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    {
      name: t.sidebarDashboard,
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t.sidebarReport,
      href: "/report",
      icon: FilePlus2,
      highlight: true,
    },
    {
      name: t.sidebarMyApps,
      href: "/applications",
      icon: FolderKanban,
    },
    {
      name: t.sidebarStatus,
      href: "/status",
      icon: Activity,
    },
    {
      name: t.sidebarNotifications,
      href: "/notifications",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      name: t.sidebarHelp,
      href: "/help",
      icon: HelpCircle,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1.5 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20"
                  : item.highlight
                  ? "text-blue-700 bg-blue-50/80 hover:bg-blue-100 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />
                <span>{item.name}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    isActive
                      ? "bg-white text-blue-700"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* CivicSense AI Assistant Launcher in Sidebar */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <button
            onClick={onOpenAIChat}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-blue-700 hover:bg-blue-100/70 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span>{t.sidebarAIChat}</span>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t.sidebarOnline}
            </span>
          </button>
        </div>
      </div>

      {/* City Action banner at bottom */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white text-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-cyan-300">{t.sidebarCityActionCore}</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          {t.sidebarCityActionCoreDesc}
        </p>
      </div>
    </aside>
  );
}
