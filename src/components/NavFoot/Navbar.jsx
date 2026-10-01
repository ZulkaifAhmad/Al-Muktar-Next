"use client";

import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "@/lib/navigation-adapter";
import {
  Menu,
  X,
  LogOut,
  User,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon,
  Building2,
  UserCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Logo } from "../../assets/assets.js";
import { useAuth } from "../AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import UserProfileMenu from "../UserProfileMenu.jsx";
import NotificationBell from "../NotificationBell.jsx";

const aboutDropdownItems = [
  {
    name: "About Institute",
    path: "/about",
    description: "History, mission, campus & methodology",
    icon: Building2,
    badge: "Overview",
  },
  {
    name: "Faculty & Scholars",
    path: "/teachers",
    description: "Meet our resident scholars & founder",
    icon: UserCheck,
    badge: "Faculty",
  },
  {
    name: "Alumni & Graduates",
    path: "/students",
    description: "Where our graduates stand worldwide",
    icon: GraduationCap,
    badge: "Network",
  },
];

const primaryNavLinks = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
  { name: "Results", path: "/result" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutExpanded, setMobileAboutExpanded] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const location = useLocation();

  const { user, loading, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const navigate = useNavigate();

  // Close dropdown and drawer on route change
  useEffect(() => {
    setIsOpen(false);
    setAboutDropdownOpen(false);
    setMobileAboutExpanded(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    setMobileAboutExpanded(false);
  };

  const handleMouseEnterAbout = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setAboutDropdownOpen(true);
  };

  const handleMouseLeaveAbout = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setAboutDropdownOpen(false);
    }, 150);
  };

  const handleMobileLogout = async () => {
    closeMenu();
    await logout();
    navigate("/login");
  };

  const isAboutActive =
    location.pathname === "/about" ||
    location.pathname === "/teachers" ||
    location.pathname === "/students" ||
    location.pathname === "/alumni";

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-200 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 py-3 sm:py-3.5 font-sans">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group min-w-0">
              <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-teal-50 dark:bg-slate-800 shadow-xs group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                <img
                  src={Logo}
                  alt="Al-Mukhtar Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-heading tracking-tight leading-tight group-hover:text-[#0F6E8C] dark:group-hover:text-[#38BDF8] transition-colors truncate">
                  Al-Mukhtar
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate font-mono">
                  Where the Choosen Rise
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `relative py-1 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#0F6E8C] dark:text-[#38BDF8] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#0F6E8C] dark:hover:text-[#38BDF8]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Home</span>
                    {isActive && (
                      <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#0F6E8C] dark:bg-[#38BDF8] rounded-full" />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `relative py-1 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#0F6E8C] dark:text-[#38BDF8] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#0F6E8C] dark:hover:text-[#38BDF8]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Courses</span>
                    {isActive && (
                      <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#0F6E8C] dark:bg-[#38BDF8] rounded-full" />
                    )}
                  </>
                )}
              </NavLink>



              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  `relative py-1 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#0F6E8C] dark:text-[#38BDF8] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#0F6E8C] dark:hover:text-[#38BDF8]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Blog</span>
                    {isActive && (
                      <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#0F6E8C] dark:bg-[#38BDF8] rounded-full" />
                    )}
                  </>
                )}
              </NavLink>

              {/* ── About Hover Dropdown Menu ── */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnterAbout}
                onMouseLeave={handleMouseLeaveAbout}
              >
                <button
                  type="button"
                  onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                  className={`relative py-1 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                    isAboutActive
                      ? "text-[#0F6E8C] dark:text-[#38BDF8] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#0F6E8C] dark:hover:text-[#38BDF8]"
                  }`}
                >
                  <span>About</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      aboutDropdownOpen ? "rotate-180 text-[#0F6E8C] dark:text-[#38BDF8]" : ""
                    }`}
                  />
                  {isAboutActive && (
                    <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#0F6E8C] dark:bg-[#38BDF8] rounded-full" />
                  )}
                </button>

                {/* Dropdown Container with hover bridge padding */}
                {aboutDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 p-2 space-y-1">
                      {aboutDropdownItems.map((item) => {
                        const Icon = item.icon;
                        const isCurrentActive = location.pathname === item.path;

                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setAboutDropdownOpen(false)}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-all group ${
                              isCurrentActive
                                ? "bg-[#0F6E8C]/10 dark:bg-[#0F6E8C]/20 text-[#0F6E8C] dark:text-teal-300"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                isCurrentActive
                                  ? "bg-[#0F6E8C] text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-[#0F6E8C] group-hover:text-white"
                              }`}
                            >
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold font-heading truncate">
                                  {item.name}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                  {item.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1 mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `relative py-1 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#0F6E8C] dark:text-[#38BDF8] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#0F6E8C] dark:hover:text-[#38BDF8]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Contact</span>
                    {isActive && (
                      <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#0F6E8C] dark:bg-[#38BDF8] rounded-full" />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/result"
                className={({ isActive }) =>
                  `relative py-1 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#0F6E8C] dark:text-[#38BDF8] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#0F6E8C] dark:hover:text-[#38BDF8]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Results</span>
                    {isActive && (
                      <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#0F6E8C] dark:bg-[#38BDF8] rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            </nav>

            {/* Desktop Right Action Section */}
            <div className="hidden md:flex items-center gap-2.5">
              {loading ? (
                <div className="w-24 h-9 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
              ) : user ? (
                <>
                  {!isAdmin && (
                    <Link
                      to="/apply"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F6E8C] hover:bg-[#0B5C74] text-white font-bold text-xs sm:text-sm shadow-2xs transition-all hover:scale-105"
                    >
                      <span>Apply Now</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}

                  {/* Notification Bell */}
                  <NotificationBell />

                  <UserProfileMenu />
                </>
              ) : (
                <div className="flex items-center gap-2.5">
                  <NotificationBell />
                  <Link
                    to="/login"
                    className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#0F6E8C] dark:hover:text-[#38BDF8] px-3.5 py-2 rounded-full transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/apply"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0F6E8C] hover:bg-[#0B5C74] text-white font-bold text-xs sm:text-sm shadow-2xs transition-all hover:scale-105"
                  >
                    <span>Apply Now</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center gap-1.5 md:hidden">
              <NotificationBell />
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#0F6E8C] dark:hover:text-[#38BDF8] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-over Drawer Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[85%] max-w-[320px] sm:w-80 bg-white dark:bg-slate-900 shadow-2xl md:hidden flex flex-col border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out font-sans ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-teal-50 dark:bg-slate-800">
              <img src={Logo} alt="Al-Mukhtar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-heading tracking-tight truncate">
                Al-Mukhtar
              </span>
              <span className="text-[10px] font-semibold text-[#0F6E8C] dark:text-[#38BDF8] uppercase tracking-wider truncate font-mono">
                Academic Institute
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto">
          {/* Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 font-mono">
              Navigation
            </span>
            <div className="space-y-1 pt-1">
              <NavLink
                to="/"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-teal-50 dark:bg-slate-800 text-[#0F6E8C] dark:text-[#38BDF8] font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`
                }
              >
                <span>Home</span>
                <ChevronRight size={16} className="text-slate-400" />
              </NavLink>

              <NavLink
                to="/courses"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-teal-50 dark:bg-slate-800 text-[#0F6E8C] dark:text-[#38BDF8] font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`
                }
              >
                <span>Courses</span>
                <ChevronRight size={16} className="text-slate-400" />
              </NavLink>



              <NavLink
                to="/blog"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-teal-50 dark:bg-slate-800 text-[#0F6E8C] dark:text-[#38BDF8] font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`
                }
              >
                <span>Blog</span>
                <ChevronRight size={16} className="text-slate-400" />
              </NavLink>

              {/* Mobile About Accordion */}
              <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setMobileAboutExpanded(!mobileAboutExpanded)}
                  className={`w-full flex items-center justify-between p-3 text-sm font-semibold transition-colors cursor-pointer ${
                    isAboutActive
                      ? "bg-teal-50/70 dark:bg-slate-800/70 text-[#0F6E8C] dark:text-[#38BDF8]"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span>About Academy</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${
                      mobileAboutExpanded ? "rotate-180 text-[#0F6E8C]" : ""
                    }`}
                  />
                </button>

                {mobileAboutExpanded && (
                  <div className="bg-slate-50/50 dark:bg-slate-900/40 p-1.5 space-y-1 border-t border-slate-100 dark:border-slate-800">
                    <NavLink
                      to="/about"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-[#0F6E8C] text-white font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                        }`
                      }
                    >
                      <Building2 size={14} />
                      <span>About Institute</span>
                    </NavLink>

                    <NavLink
                      to="/teachers"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-[#0F6E8C] text-white font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                        }`
                      }
                    >
                      <UserCheck size={14} />
                      <span>Faculty &amp; Teachers</span>
                    </NavLink>

                    <NavLink
                      to="/students"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-[#0F6E8C] text-white font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                        }`
                      }
                    >
                      <GraduationCap size={14} />
                      <span>Alumni &amp; Graduates</span>
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink
                to="/contact"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-teal-50 dark:bg-slate-800 text-[#0F6E8C] dark:text-[#38BDF8] font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`
                }
              >
                <span>Contact</span>
                <ChevronRight size={16} className="text-slate-400" />
              </NavLink>

              <NavLink
                to="/result"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-teal-50 dark:bg-slate-800 text-[#0F6E8C] dark:text-[#38BDF8] font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`
                }
              >
                <span>Examination Results</span>
                <ChevronRight size={16} className="text-slate-400" />
              </NavLink>

              {/* My Profile Link (if logged in) */}
              {user && (
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-teal-50 dark:bg-slate-800 text-[#0F6E8C] dark:text-[#38BDF8] font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`
                  }
                >
                  <span>My Profile</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </NavLink>
              )}

              {/* Admin Dashboard Link (for admins) */}
              {user && isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-teal-50 dark:bg-slate-800 text-[#0F6E8C] dark:text-[#38BDF8] font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`
                  }
                >
                  <span>Admin Dashboard</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </NavLink>
              )}

              {/* Dark / Light Mode Option */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {isDark ? (
                    <Sun size={17} className="text-amber-400" />
                  ) : (
                    <Moon size={17} className="text-slate-600 dark:text-slate-400" />
                  )}
                  <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                </div>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {isDark ? "Dark" : "Light"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Bottom Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 shrink-0">
          {user ? (
            <button
              type="button"
              onClick={handleMobileLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all cursor-pointer shadow-2xs"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className="w-full text-center py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/apply"
                onClick={closeMenu}
                className="w-full text-center py-2.5 px-3 rounded-xl bg-[#0F6E8C] text-white text-xs font-bold hover:bg-[#0B5C74] transition-all shadow-2xs"
              >
                Apply Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
