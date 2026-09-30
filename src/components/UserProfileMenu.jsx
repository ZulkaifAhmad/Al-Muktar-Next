"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@/lib/navigation-adapter";
import {
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Sun,
  Moon,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import { useTheme } from "@/context/ThemeContext";

function UserProfileMenu() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/login");
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "AM";

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile trigger button (clean circle avatar + chevron icon without wrapper background) */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 p-0.5 rounded-full bg-transparent focus:outline-hidden cursor-pointer group"
        aria-label="User profile menu"
        aria-expanded={open}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0F6E8C] to-[#0A2540] text-white flex items-center justify-center text-xs font-extrabold shrink-0 shadow-xs ring-2 ring-transparent group-hover:ring-[#0F6E8C]/30 dark:group-hover:ring-teal-400/30 transition-all duration-200 group-hover:scale-105">
          {initials}
        </div>
        <ChevronDown
          size={15}
          className={`text-slate-500 dark:text-slate-400 transition-transform duration-200 group-hover:text-[#0F6E8C] dark:group-hover:text-[#38BDF8] ${
            open ? "rotate-180 text-[#0F6E8C] dark:text-[#38BDF8]" : ""
          }`}
        />
      </button>

      {/* Dropdown card - Highly visible & professional */}
      <div
        className={`absolute right-0 top-full mt-2.5 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-750 shadow-2xl shadow-slate-900/15 dark:shadow-black/70 overflow-hidden z-50 transition-all duration-200 origin-top-right backdrop-blur-md ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* User Info Header with subtle background gradient */}
        <div className="p-4 bg-gradient-to-b from-slate-50 to-slate-100/60 dark:from-slate-800/90 dark:to-slate-900/80 border-b border-slate-150 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F6E8C] via-[#0B5C74] to-[#0A2540] text-white flex items-center justify-center text-sm font-extrabold shadow-md ring-2 ring-white dark:ring-slate-800 shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-slate-900 dark:text-white font-bold text-sm truncate leading-tight">
                {user?.username}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs truncate mt-0.5 font-sans">
                {user?.email}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-[#0F6E8C] dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80 font-mono shadow-3xs">
                    <ShieldCheck size={11} className="text-teal-600 dark:text-teal-400" />
                    <span>{user?.role || "Admin"}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                    <User size={10} className="text-slate-400" />
                    <span>Student</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Admin Dashboard Featured Action (only if admin) */}
        {isAdmin && (
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-teal-50/40 dark:bg-teal-950/20">
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-teal-500/15 via-[#0F6E8C]/15 to-sky-500/10 dark:from-teal-500/25 dark:via-[#0F6E8C]/30 dark:to-sky-950/40 border border-teal-400/30 dark:border-teal-500/30 text-[#0F6E8C] dark:text-teal-300 hover:border-teal-500/50 dark:hover:border-teal-400/50 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0F6E8C] text-white flex items-center justify-center shadow-xs">
                  <LayoutDashboard size={16} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
                    <span>Admin Dashboard</span>
                    <Sparkles size={12} className="text-amber-500" />
                  </p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                    Dashboard &amp; management
                  </p>
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-slate-400 group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          </div>
        )}

        {/* Theme Switcher section */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <div className="px-3 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  isDark
                    ? "bg-amber-400/15 text-amber-300"
                    : "bg-amber-100 text-amber-600 shadow-3xs"
                }`}
              >
                {isDark ? <Moon size={15} /> : <Sun size={15} />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  Display Theme
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {isDark ? "Dark Theme Active" : "Light Theme Active"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isDark ? "bg-[#0F6E8C]" : "bg-slate-300"
              }`}
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isDark ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Profile Link */}
        <div className="p-2 space-y-1">
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-teal-50/70 dark:hover:bg-slate-800 hover:text-[#0F6E8C] dark:hover:text-[#38BDF8] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-slate-800 flex items-center justify-center text-[#0F6E8C] dark:text-[#38BDF8] border border-teal-100 dark:border-slate-700">
                <User size={15} />
              </div>
              <div>
                <p className="font-bold text-xs">My Profile</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                  Credentials &amp; settings
                </p>
              </div>
            </div>
            <ChevronRight size={15} className="text-slate-300 dark:text-slate-600 group-hover:text-[#0F6E8C] dark:group-hover:text-[#38BDF8] transition-colors" />
          </Link>
        </div>

        {/* Footer / Logout */}
        <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-300 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfileMenu;
