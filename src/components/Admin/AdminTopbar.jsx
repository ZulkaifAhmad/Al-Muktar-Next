"use client";

import React from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  Menu,
  UserPlus,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../AuthContext.jsx";
import NotificationBell from "../NotificationBell.jsx";
import ThemeToggle from "../ThemeToggle.jsx";

function AdminTopbar({ setSidebarOpen }) {
  const { user } = useAuth();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "AD";

  return (
    <header className="h-14 bg-white dark:bg-[#0c1827] border-b border-slate-200 dark:border-slate-800/90 flex items-center justify-between px-3 sm:px-5 md:px-6 sticky top-0 z-40 font-sans shadow-2xs transition-colors duration-200">
      {/* Left side: Mobile Menu toggle + Quick Action Links */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          title="Toggle Navigation Menu"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Add Admin Button */}
        <Link
          to="/admin/users?action=add-admin"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#0F6E8C] text-white text-xs font-semibold shadow-2xs hover:bg-[#0B5C74] transition-colors shrink-0 cursor-pointer"
        >
          <UserPlus size={13} />
          <span className="hidden xs:inline sm:inline">Add Admin</span>
          <span className="xs:hidden sm:hidden">Admin</span>
        </Link>

        {/* Live Website Button */}
        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-medium hover:border-[#0F6E8C] hover:text-[#0F6E8C] dark:hover:border-teal-400 dark:hover:text-teal-400 transition-colors shadow-2xs shrink-0"
        >
          <ExternalLink size={12} />
          <span className="hidden sm:inline">Live Site</span>
        </Link>
      </div>

      {/* Right side: NotificationBell, ThemeToggle & User Profile Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 pl-2">
        {/* Notification Bell */}
        <NotificationBell />

        {/* Dark/Light Mode Theme Toggle */}
        <ThemeToggle />

        {/* Admin Avatar & Meta */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div
            className="w-8 h-8 rounded-lg bg-[#0F6E8C] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs select-none"
            title={user?.username || "Admin"}
          >
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight truncate max-w-[130px]">
              {user?.username || "Administrator"}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[130px] leading-tight font-mono">
              {user?.email || "admin@almukhtar.com"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
