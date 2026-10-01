"use client";

import React from "react";
import { NavLink, Link, useNavigate } from "@/lib/navigation-adapter";
import {
  LayoutDashboard,
  Newspaper,
  BookOpen,
  Users,
  X,
  LogOut,
  GraduationCap,
  Bell,
  UserCheck,
  Award,
  FileSpreadsheet,
} from "lucide-react";
import { useAuth } from "../AuthContext.jsx";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Results & Marks", to: "/admin/results", icon: FileSpreadsheet },
  { label: "Courses", to: "/admin/course-post", icon: BookOpen },
  { label: "Teachers", to: "/admin/teachers", icon: UserCheck },
  { label: "Students", to: "/admin/students", icon: Award },
  { label: "Blog & News", to: "/admin/blog-post", icon: Newspaper },
  { label: "Notifications", to: "/admin/notifications", icon: Bell },
  { label: "Candidates", to: "/admin/applies", icon: GraduationCap },
  { label: "Users", to: "/admin/users", icon: Users },
];

function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setSidebarOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#0B1E2D] text-slate-300 flex flex-col h-screen border-r border-slate-800/80 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-slate-800/80 shrink-0 bg-[#081724]">
          <Link to="/admin" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-[#0F6E8C] flex items-center justify-center shrink-0 shadow-sm text-white">
              <GraduationCap size={15} />
            </div>
            <div className="min-w-0">
              <span className="font-heading font-bold text-sm tracking-tight text-white block leading-tight">
                Al-Mukhtar
              </span>
              <span className="text-[9px] text-[#8FB3AA] font-mono uppercase tracking-wider font-semibold block">
                Admin Console
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-2.5 pb-1.5 text-[9.5px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Main Menu
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#0F6E8C] text-white font-semibold shadow-xs"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                }`
              }
            >
              <item.icon size={15} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-slate-800/80 shrink-0 bg-[#081724]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          >
            <LogOut size={15} className="shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;

