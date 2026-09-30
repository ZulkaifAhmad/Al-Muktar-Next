"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  GraduationCap,
  Award,
  Globe,
  Building2,
  MapPin,
  Quote,
  Sparkles,
  ArrowRight,
  ChevronRight,
  X,
  Calendar,
  Users,
  CheckCircle2,
  BookOpen,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { useStudents } from "@/lib/queries";
import { GreenDecorationBg, bg, getImageUrl } from "../assets/assets.js";

function Students() {
  const { data: apiStudents = [], isLoading } = useStudents();
  const activeStudents = apiStudents.filter((s) => s.status !== "inactive");

  const [activeModalStudent, setActiveModalStudent] = useState(null);

  return (
    <div className="bg-white dark:bg-[#070d18] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200 min-h-screen">
      
      {/* ── 1. HERO SECTION: GLOBAL ALUMNI IMPACT ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-14 sm:py-18 border-b border-slate-800">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={bg}
            alt="Alumni Background"
            className="w-full h-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/80 to-[#07111e]/95" />
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

      {/* ── 2. ALUMNI DIRECTORY ── */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-widest font-mono block">
              Graduates Directory
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
              Alumni Profiles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Explore the professional journeys, academic contributions, and accomplishments of our institute's graduates.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl shrink-0">
            Total Profiles: <strong className="text-[#0F6E8C] dark:text-teal-400">{activeStudents.length}</strong>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col sm:flex-row animate-pulse">
                <div className="w-full sm:w-44 h-48 sm:h-auto bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 p-5 space-y-3">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && activeStudents.length === 0 && (
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-2">
            <GraduationCap size={30} className="text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No graduate records found.
            </p>
          </div>
        )}

        {/* ── Redesigned Student Cards matching Teachers Layout ── */}
        {!isLoading && activeStudents.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {activeStudents.map((student, i) => (
              <div
                key={student._id || student.id || `alum-${i}`}
                onClick={() => setActiveModalStudent(student)}
                className="group bg-white dark:bg-[#0c1827] rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#0F6E8C]/40 dark:hover:border-teal-500/30 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col sm:flex-row min-w-0 cursor-pointer"
              >
                {/* Photo Side */}
                <div className="sm:w-44 sm:self-stretch shrink-0 bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
                  <img
                    src={getImageUrl(student.image, `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0F6E8C&color=fff&bold=true`)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0F6E8C&color=fff&bold=true`;
                    }}
                    alt={student.name}
                    className="w-full h-48 sm:h-full min-h-[180px] object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {student.batchYear && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-mono font-medium">
                      {student.batchYear}
                    </span>
                  )}
                </div>

                {/* Information Side */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3 min-w-0">
                  <div className="space-y-2.5 min-w-0">
                    {/* Category & Status */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-wider font-mono shrink-0">
                        {student.category || "Graduate"}
                      </span>
                      {student.location && (
                        <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 min-w-0 truncate">
                          <MapPin size={10} className="text-[#0F6E8C] dark:text-teal-400 shrink-0" />
                          <span className="truncate">{student.location}</span>
                        </span>
                      )}
                    </div>

                    {/* Name & Academic Program */}
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors truncate">
                        {student.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
                        {student.program}
                      </p>
                    </div>

                    {/* Current Career & Institution */}
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug truncate">
                        {student.currentRole}
                      </p>
                      {student.currentOrganization && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5 truncate">
                          <Building2 size={11} className="text-slate-400 shrink-0" />
                          <span className="truncate">{student.currentOrganization}</span>
                        </p>
                      )}
                    </div>

                    {/* Testimonial Quote — Normal sans-serif font, no italic */}
                    {student.message && (
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 min-w-0">
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal break-words">
                          &ldquo;{student.message}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer Bar: Milestone & Profile Action on separate lines */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2 min-w-0">
                    {student.keyAchievement && (
                      <div className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 min-w-0">
                        <Award size={13} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="font-medium text-xs text-slate-700 dark:text-slate-300 leading-snug break-words flex-1">
                          {student.keyAchievement}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[10px] font-mono text-slate-400">
                        {student.category || "Graduate Alumnus"}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalStudent(student);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0F6E8C] dark:text-teal-400 hover:underline cursor-pointer ml-auto"
                      >
                        <span>View Profile</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 3. GRADUATE DETAILED BIO MODAL (Full Screen on mobile, Wide on desktop) ── */}
      {activeModalStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
          onClick={() => setActiveModalStudent(null)}
        >
          <div
            className="bg-white dark:bg-[#0c1827] border-0 sm:border border-slate-200 dark:border-slate-800 rounded-none sm:rounded-2xl max-w-full sm:max-w-4xl w-full h-full sm:h-[88vh] sm:max-h-[88vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-0 sm:my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0F6E8C] shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300 truncate">
                  Graduate Alumni Profile
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs font-semibold"
                title="Cancel and close"
                aria-label="Cancel and close"
              >
                <span>Cancel</span>
                <X size={17} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 custom-scrollbar">
              
              {/* Profile Main Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pb-5 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={getImageUrl(activeModalStudent.image, `https://ui-avatars.com/api/?name=${encodeURIComponent(activeModalStudent.name || "Student")}&background=0F6E8C&color=fff&bold=true`)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeModalStudent.name || "Student")}&background=0F6E8C&color=fff&bold=true`;
                  }}
                  alt={activeModalStudent.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-top border-2 border-slate-200 dark:border-slate-700 shadow-md shrink-0"
                />

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0F6E8C]/10 text-[#0F6E8C] dark:text-teal-300 text-[11px] font-bold font-mono uppercase tracking-wider">
                      {activeModalStudent.category || "Graduate"}
                    </span>
                    {activeModalStudent.batchYear && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {activeModalStudent.batchYear}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
                    {activeModalStudent.name}
                  </h2>

                  <p className="text-xs sm:text-sm font-semibold text-[#0F6E8C] dark:text-teal-400">
                    {activeModalStudent.currentRole}
                  </p>
                </div>
              </div>

              {/* 2-Column Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Organization */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Building2 size={12} className="text-[#0F6E8C] dark:text-teal-400" />
                    Current Organization
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {activeModalStudent.currentOrganization || "Private Scholarly Practice"}
                  </p>
                </div>

                {/* Location */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#0F6E8C] dark:text-teal-400" />
                    Location &amp; Region
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {activeModalStudent.location || "International"}
                  </p>
                </div>

                {/* Academic Program */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <GraduationCap size={12} className="text-[#0F6E8C] dark:text-teal-400" />
                    Completed Academic Track
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {activeModalStudent.program}
                  </p>
                </div>

                {/* Sanad / Verification */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    Sanad Status
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    Official Graduate &amp; Verified Alumnus
                  </p>
                </div>
              </div>

              {/* Key Scholarly Milestone / Achievement */}
              {activeModalStudent.keyAchievement && (
                <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase font-mono tracking-wider">
                    <Award size={14} className="text-amber-600 dark:text-amber-400" />
                    <span>Key Milestone &amp; Achievement</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal pt-1">
                    {activeModalStudent.keyAchievement}
                  </p>
                </div>
              )}

              {/* Graduate Reflection / Testimonial — Normal non-italic font */}
              {activeModalStudent.message && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                    Graduate Reflection &amp; Scholarly Journey
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2">
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      &ldquo;{activeModalStudent.message}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* Institute Mentorship & Pedagogical Context */}
              <div className="p-4 rounded-xl bg-[#0F6E8C]/5 dark:bg-[#0F6E8C]/10 border border-[#0F6E8C]/15 dark:border-[#0F6E8C]/20 space-y-1.5">
                <span className="text-[10.5px] font-bold text-[#0F6E8C] dark:text-teal-300 uppercase font-mono tracking-wider block">
                  About Al-Mukhtar Alumnus Community
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Graduates of Al-Mukhtar Institute are equipped with traditional Islamic sciences combined with modern critical scholarship, enabling them to lead responsibly in diverse academic, legal, and community fields.
                </p>
              </div>

            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <div className="flex items-center gap-2.5 ml-auto">
                <Link
                  to="/apply"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F6E8C] text-white text-xs font-bold hover:bg-[#0B5C74] shadow-xs transition-all"
                >
                  <span>Join Our Academy</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
