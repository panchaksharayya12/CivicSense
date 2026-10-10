"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { CitizenSidebar } from "@/components/CitizenSidebar";
import { CivicSenseAIChat } from "@/components/CivicSenseAIChat";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { localizeNotification } from "@/lib/i18n";
import { Notification } from "@/types";
import {
  Bell,
  CheckCircle2,
  Clock,
  Flame,
  MessageSquare,
  CheckCheck,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function NotificationsPage() {
  const { user, refreshNotifications } = useAuth();
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      refreshNotifications();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleMarkSingleAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      refreshNotifications();
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredList =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const getIconForType = (type: string) => {
    switch (type) {
      case "incident_linked":
        return (
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200">
            <Flame className="w-5 h-5" />
          </div>
        );
      case "assignment":
        return (
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
            <MessageSquare className="w-5 h-5" />
          </div>
        );
      case "status_update":
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <CitizenSidebar onOpenAIChat={() => setAiChatOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {t.notificationsTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {t.notificationsSubtitle}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="self-start sm:self-auto text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs hover:bg-blue-50 flex items-center gap-1.5 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                <span>{t.markAllRead}</span>
              </button>
            )}
          </div>

          {/* Filter Tabs matching screenshot */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {t.filterAll} ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filter === "unread"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{t.filterUnread}</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px]">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notification List matching screenshot */}
          <div className="space-y-3">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                <p className="text-xs text-slate-500 mt-2">{t.loadingNotifications}</p>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-400 text-xs">
                {t.noNotificationsFound}
              </div>
            ) : (
              filteredList.map((notif) => {
                const localized = localizeNotification(notif, language);

                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!notif.read) handleMarkSingleAsRead(notif.id);
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start justify-between gap-4 ${
                      !notif.read
                        ? "bg-white border-blue-200 shadow-xs ring-1 ring-blue-100"
                        : "bg-white/80 border-slate-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {getIconForType(notif.type)}

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {localized.title}
                          </h4>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {localized.message}
                        </p>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          {new Date(notif.created_at).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </div>

                    {notif.application_id && (
                      <Link
                        href={`/status/${notif.application_id}`}
                        className="shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <span>{t.notifTrackBtn || t.trackStatus || "Track"}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      <CivicSenseAIChat isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}
