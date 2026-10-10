"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CivicLogo } from "./CivicLogo";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import {
  Bell,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Shield,
  Menu,
  X,
  FilePlus,
  Search,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, unreadCount, demoLogin } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: t.navHome, href: "/" },
    { name: t.navReport, href: "/report" },
    { name: t.navTrack, href: user ? "/dashboard" : "/status" },
    { name: t.navAbout, href: "/#about" },
    { name: t.navHelp, href: "/help" },
    { name: "Pitch Deck", href: "/presentation" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <CivicLogo size="md" />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Language / User controls */}
        <div className="flex items-center space-x-2.5">
          {/* Language Selector */}
          <LanguageSelector variant="navbar" />

          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Notifications Link */}
              <Link
                href="/notifications"
                className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                title={t.notificationsTitle || "Notifications"}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </p>
                    <span
                      className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 ${
                        user.role === "admin"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {user.role === "admin" ? "Municipal Admin" : "Citizen"}
                    </span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-sm">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href={user.role === "admin" ? "/admin" : "/dashboard"}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {user.role === "admin" ? t.navAdminOps : t.navCitizenDash}
                    </Link>

                    {user.role === "citizen" && (
                      <Link
                        href="/report"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
                      >
                        <FilePlus className="w-4 h-4" />
                        {t.navReport}
                      </Link>
                    )}

                    {user.role === "citizen" && (
                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await demoLogin("admin");
                          router.push("/admin");
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-amber-700 hover:bg-amber-50 font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        Switch to Admin View
                      </button>
                    )}

                    {user.role === "admin" && (
                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await demoLogin("citizen");
                          router.push("/dashboard");
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-blue-700 hover:bg-blue-50 font-medium"
                      >
                        <UserIcon className="w-4 h-4" />
                        Switch to Citizen View
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.navSignOut}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              >
                {t.navLogin}
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all hover:shadow"
              >
                {t.navRegister}
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              {link.name}
            </Link>
          ))}
          {!user && (
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
              >
                {t.navLogin}
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow"
              >
                {t.navRegister}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
