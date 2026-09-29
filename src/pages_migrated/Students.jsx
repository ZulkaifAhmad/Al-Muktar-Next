"use client";

import React, { useState, useMemo } from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  GraduationCap,
  Award,
  Globe,
  Building2,
  MapPin,
  Search,
  Quote,
  Sparkles,
  ArrowRight,
  ChevronRight,
  X,
} from "lucide-react";
import { useStudents } from "@/lib/queries";
import { GreenDecorationBg, getImageUrl } from "../assets/assets.js";

const CATEGORIES = [
  "All",
  "Academia",
  "Quranic Sciences",
  "Research & Writing",
  "Islamic Finance",
  "Youth Leadership",
  "Community Service",
];

function Students() {
  const { data: apiStudents = [], isLoading } = useStudents();
  const activeStudents = apiStudents.filter((s) => s.status !== "inactive");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalStudent, setActiveModalStudent] = useState(null);

  // Filtered alumni list
  const filteredStudents = useMemo(() => {
    return activeStudents.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.program?.toLowerCase().includes(q) ||
        s.currentRole?.toLowerCase().includes(q) ||
        s.currentOrganization?.toLowerCase().includes(q) ||
        s.location?.toLowerCase().includes(q) ||
        s.batchYear?.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === "All" || s.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [activeStudents, searchQuery, selectedCategory]);

  return (
    <div className="bg-white dark:bg-[#070d18] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200 min-h-screen">
      
      {/* ── 1. HERO SECTION: GLOBAL ALUMNI IMPACT ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-12 sm:py-16 border-b border-slate-800">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={GreenDecorationBg}
            alt="Alumni Background"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-[#07111e]" />
        </div>
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#0F6E8C]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-[11px] font-bold uppercase tracking-widest font-mono border border-white/10 mx-auto">
            <Globe size={12} className="text-teal-400" />
            <span>Alumni &amp; Global Impact</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight max-w-3xl mx-auto leading-tight">
            Where Our Graduates Stand Today
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Celebrating alumni serving across academic seminaries, research institutions, community pulpits, and ethical finance organizations worldwide.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-3">
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-xs">
              <span className="text-lg sm:text-2xl font-black text-white font-heading block">
                3,500+
              </span>
              <span className="text-[10px] text-teal-400 uppercase tracking-wider font-mono">
                Scholarly Graduates
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-xs">
              <span className="text-lg sm:text-2xl font-black text-teal-300 font-heading block">
                15+
              </span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-mono">
                Countries Placed
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-xs">
              <span className="text-lg sm:text-2xl font-black text-white font-heading block">
                100%
              </span>
              <span className="text-[10px] text-teal-400 uppercase tracking-wider font-mono">
                Verified Sanad Tracks
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-xs">
              <span className="text-lg sm:text-2xl font-black text-teal-300 font-heading block">
                50+
              </span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-mono">
                Academies &amp; Treatises
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ALUMNI DIRECTORY, FILTERS & SEARCH ── */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Heading & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-widest font-mono block">
              Graduates Directory
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
              Alumni Profiles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Explore the professional journeys and accomplishments of our institute's graduates.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl shrink-0">
            Total Profiles: <strong className="text-[#0F6E8C] dark:text-teal-400">{activeStudents.length}</strong>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0F6E8C] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px] sm:min-w-[260px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search graduates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Executive Alumni Cards Grid */}
        {filteredStudents.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-2">
            <GraduationCap size={30} className="text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No graduate records found matching your filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="text-xs text-[#0F6E8C] dark:text-teal-400 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudents.map((student, i) => (
              <div
                key={student._id || student.id || `alum-${i}`}
                className="bg-white dark:bg-[#0c1827] rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#0F6E8C]/50 dark:hover:border-teal-400/50 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={getImageUrl(student.image, `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0F6E8C&color=fff&bold=true`)}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0F6E8C&color=fff&bold=true`;
                      }}
                      alt={student.name}
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover object-top border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0 group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-wider font-mono block truncate">
                        {student.category || "Graduate"}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate font-heading group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors">
                        {student.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5 font-medium">
                        {student.program}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {student.batchYear}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white leading-snug">
                      {student.currentRole}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 text-[11px]">
                      <Building2 size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{student.currentOrganization}</span>
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 font-mono text-[10px] flex items-center gap-1.5 pt-0.5">
                      <MapPin size={11} className="text-[#0F6E8C] dark:text-teal-400 shrink-0" />
                      <span>{student.location}</span>
                    </p>
                  </div>

                  {student.message && (
                    <blockquote className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2 leading-relaxed pl-3.5 py-0.5 border-l-2 border-[#0F6E8C] dark:border-teal-400 font-serif">
                      "{student.message}"
                    </blockquote>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[65%]">
                    <Award size={13} className="text-amber-500 shrink-0" />
                    <span className="truncate font-medium">{student.keyAchievement || "Alumnus"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModalStudent(student)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0F6E8C] dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    <span>Profile</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Graduate Details Modal Dialog */}
      {activeModalStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setActiveModalStudent(null)}
        >
          <div
            className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={getImageUrl(activeModalStudent.image, `https://ui-avatars.com/api/?name=${encodeURIComponent(activeModalStudent.name || "Student")}&background=0F6E8C&color=fff&bold=true`)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeModalStudent.name || "Student")}&background=0F6E8C&color=fff&bold=true`;
                  }}
                  alt={activeModalStudent.name}
                  className="w-14 h-14 rounded-xl object-cover object-top border border-slate-200 dark:border-slate-700 shadow-xs"
                />
                <div>
                  <span className="text-[10px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase font-mono">
                    {activeModalStudent.program} • {activeModalStudent.batchYear}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                    {activeModalStudent.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {activeModalStudent.currentRole}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[9.5px] text-slate-400 uppercase font-mono block">Organization</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {activeModalStudent.currentOrganization}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[9.5px] text-slate-400 uppercase font-mono block">Location</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {activeModalStudent.location}
                </span>
              </div>
            </div>

            {activeModalStudent.keyAchievement && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 space-y-0.5">
                <span className="text-[9.5px] font-bold text-amber-700 dark:text-amber-300 font-mono uppercase tracking-wider block">
                  Key Scholarly Achievement
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {activeModalStudent.keyAchievement}
                </p>
              </div>
            )}

            {activeModalStudent.message && (
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                  Testimonial &amp; Reflection
                </h4>
                <blockquote className="text-xs font-serif italic text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  "{activeModalStudent.message}"
                </blockquote>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/apply"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F6E8C] text-white text-xs font-bold hover:bg-[#0B5C74]"
              >
                <span>Join Our Academy</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
