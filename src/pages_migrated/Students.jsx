"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  GraduationCap,
  Award,
  Globe,
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronRight,
  X,
  CheckCircle2,
} from "lucide-react";
import { useStudents } from "@/lib/queries";
import { bg, getImageUrl } from "../assets/assets.js";

function Students() {
  const { data: apiStudents = [], isLoading } = useStudents();
  const activeStudents = apiStudents.filter((s) => s.status !== "inactive");

  const [activeModalStudent, setActiveModalStudent] = useState(null);

  return (
    <div className="bg-white dark:bg-[#070d18] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200 min-h-screen">

      {/* ── 1. HERO SECTION: GLOBAL ALUMNI DIRECTORY ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-9 sm:py-12 border-b border-slate-800/80">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={bg}
            alt="Alumni Background"
            className="w-full h-full object-cover object-center opacity-80 sm:opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/20" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-teal-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider font-mono border border-white/20">
            <Globe size={11} className="text-teal-300" />
            <span>Alumni &amp; Global Impact</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-heading tracking-tight max-w-2xl">
            Where Our Graduates Stand Today
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed font-normal">
            Our graduates carry the knowledge, values, and character they developed at Al-Mukhtar into communities around the world. Today, they serve as scholars, educators, professionals, and community leaders, making meaningful contributions in their respective fields while continuing the legacy of knowledge and service.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl pt-2.5 border-t border-white/15 text-left">
            <div className="p-2 rounded bg-slate-950/60 border border-white/10 backdrop-blur-md">
              <span className="text-base sm:text-lg font-bold text-white font-heading block">
                100+
              </span>
              <span className="text-[9.5px] text-teal-300 uppercase tracking-wider font-mono">
                Graduates
              </span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-white/10 backdrop-blur-md">
              <span className="text-base sm:text-lg font-bold text-teal-300 font-heading block">
                3
              </span>
              <span className="text-[9.5px] text-slate-300 uppercase tracking-wider font-mono">
                Years of Excellence
              </span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-white/10 backdrop-blur-md">
              <span className="text-base sm:text-lg font-bold text-white font-heading block">
                100%
              </span>
              <span className="text-[9.5px] text-teal-300 uppercase tracking-wider font-mono">
                Verified Sanad
              </span>
            </div>
            
          </div>
        </div>
      </section>

      {/* ── 2. ALUMNI DIRECTORY (OPEN EDITORIAL ROSTER — NO BOXY CARDS) ── */}
      <section className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3 text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-wider font-mono block">
              Graduates Directory
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
              Alumni Profiles
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Explore the professional journeys and contributions of our graduates.
            </p>
          </div>

          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md shrink-0 self-start sm:self-auto">
            Total Profiles: <strong className="text-[#0F6E8C] dark:text-teal-400 font-semibold">{activeStudents.length}</strong>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2.5 animate-pulse">
                <div className="h-56 rounded-xl bg-slate-200 dark:bg-slate-800 w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && activeStudents.length === 0 && (
          <div className="py-10 text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <GraduationCap size={28} className="text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              No graduate records found.
            </p>
          </div>
        )}

        {/* ── Open Editorial Alumni Roster ── */}
        {!isLoading && activeStudents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {activeStudents.map((student, i) => (
              <div
                key={student._id || student.id || `alum-${i}`}
                onClick={() => setActiveModalStudent(student)}
                className="group flex flex-col space-y-2.5 cursor-pointer text-left"
              >
                {/* Prominent Large Portrait */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800">
                  <img
                    src={getImageUrl(student.image, `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0F6E8C&color=fff&bold=true`)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0F6E8C&color=fff&bold=true`;
                    }}
                    alt={student.name}
                    className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Corner Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                    <span className="bg-slate-950/80 backdrop-blur-md text-teal-300 text-[9.5px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                      {student.category || "Alumnus"}
                    </span>
                    {student.batchYear && (
                      <span className="bg-slate-950/80 backdrop-blur-md text-white text-[9.5px] font-mono px-2 py-0.5 rounded">
                        Class {student.batchYear}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors truncate">
                      {student.name}
                    </h3>
                    <span className="text-[10.5px] font-mono text-slate-400 shrink-0">
                      {student.location || "Alumnus"}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#0F6E8C] dark:text-teal-400 truncate">
                    {student.currentRole || "Graduate Scholar"}
                  </p>

                  {student.currentOrganization && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                      <Building2 size={11} className="shrink-0" />
                      <span>{student.currentOrganization}</span>
                    </p>
                  )}

                  {/* Action link */}
                  <div className="pt-1 flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300">
                    <span>View Bio &amp; Journey</span>
                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 3. GRADUATE DETAILED BIO MODAL ── */}
      {activeModalStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
          onClick={() => setActiveModalStudent(null)}
        >
          <div
            className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full max-h-[90vh] shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300">
                Alumni Profile
              </span>
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="p-1 rounded text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 custom-scrollbar">

              {/* Profile Top Row */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={getImageUrl(activeModalStudent.image, `https://ui-avatars.com/api/?name=${encodeURIComponent(activeModalStudent.name || "Student")}&background=0F6E8C&color=fff&bold=true`)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeModalStudent.name || "Student")}&background=0F6E8C&color=fff&bold=true`;
                  }}
                  alt={activeModalStudent.name}
                  className="w-14 h-14 rounded-lg object-cover object-top border border-slate-200 dark:border-slate-700 shrink-0"
                />

                <div className="space-y-0.5 flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-[#0F6E8C] dark:text-teal-400 uppercase font-bold">
                    {activeModalStudent.category || "Graduate"}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading truncate">
                    {activeModalStudent.name}
                  </h2>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
                    {activeModalStudent.currentRole}
                  </p>
                </div>
              </div>

              {/* Clean Specification List */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Organization</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                    {activeModalStudent.currentOrganization || "Private Scholarly Practice"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Location</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {activeModalStudent.location || "International"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Academic Program</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                    {activeModalStudent.program}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Sanad Verification</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Verified Alumnus
                  </span>
                </div>
              </div>

              {/* Key Milestone */}
              {activeModalStudent.keyAchievement && (
                <div className="space-y-0.5 pt-1">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase font-mono tracking-wider block">
                    Key Milestone
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                    {activeModalStudent.keyAchievement}
                  </p>
                </div>
              )}

              {/* Reflection */}
              {activeModalStudent.message && (
                <div className="space-y-0.5 pt-1">
                  <span className="text-[10px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase font-mono tracking-wider block">
                    Graduate Reflection
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal italic">
                    &ldquo;{activeModalStudent.message}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2 p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer text-center"
              >
                Close
              </button>
              <Link
                to="/apply"
                className="py-1.5 text-xs font-bold bg-[#0F6E8C] text-white hover:bg-[#0B5C74] rounded-lg text-center"
              >
                Apply Now
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
