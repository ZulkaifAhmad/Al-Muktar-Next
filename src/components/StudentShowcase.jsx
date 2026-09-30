"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import { getImageUrl } from "../assets/assets.js";
import {
  GraduationCap,
  Briefcase,
  MapPin,
  Building2,
  Award,
  ArrowRight,
  Quote,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";

import { useStudents } from "@/lib/queries";

export default function StudentShowcase({ limit, showHeaderAction = false, marquee = false }) {
  const { data: apiStudents = [] } = useStudents();
  const activeStudents = apiStudents.filter((s) => s.status !== "inactive");
  const displayStudents = typeof limit === "number" ? activeStudents.slice(0, limit) : activeStudents;
  const [activeModalStudent, setActiveModalStudent] = useState(null);

  if (activeStudents.length === 0) {
    return null;
  }

  const renderStudentCard = (student, key) => (
    <div
      key={key}
      onClick={() => setActiveModalStudent(student)}
      className={`group bg-white dark:bg-[#0c1827] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-[#0F6E8C]/50 dark:hover:border-teal-400/50 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
        marquee ? "w-[280px] sm:w-[320px] shrink-0" : "w-full"
      }`}
    >
      {/* Top Image Section — Big & Prominent */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={getImageUrl(student.image, `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0F6E8C&color=fff&bold=true`)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0F6E8C&color=fff&bold=true`;
          }}
          alt={student.name}
          loading="lazy"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="bg-slate-950/80 backdrop-blur-md text-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm font-mono uppercase tracking-wider border border-teal-500/20 truncate">
            {student.category || "Alumnus"}
          </span>
          {student.batchYear && (
            <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full font-mono border border-white/10 shrink-0">
              Class {student.batchYear}
            </span>
          )}
        </div>

        {/* Bottom Tag */}
        <div className="absolute bottom-3 left-3 right-3 min-w-0">
          <p className="text-white text-xs font-semibold drop-shadow-sm font-heading truncate">
            {student.program || "Islamic Scholarship"}
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2.5">
          <div className="space-y-0.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors truncate">
              {student.name}
            </h3>
            <p className="text-xs text-[#0F6E8C] dark:text-teal-400 font-semibold truncate">
              {student.currentRole || "Graduate Scholar"}
            </p>
          </div>

          {/* Current Placement Box */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
            {student.currentOrganization && (
              <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-[11px] truncate">
                <Building2 size={12} className="text-slate-400 shrink-0" />
                <span className="truncate">{student.currentOrganization}</span>
              </p>
            )}
            <p className="text-slate-500 dark:text-slate-400 font-mono text-[10px] flex items-center gap-1.5">
              <MapPin size={11} className="text-[#0F6E8C] dark:text-teal-400 shrink-0" />
              <span className="truncate">{student.location || "International"}</span>
            </p>
          </div>

          {/* Key Achievement or Quote */}
          {student.keyAchievement ? (
            <div className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
              <Award size={13} className="text-amber-500 shrink-0 mt-0.5" />
              <span className="font-medium text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">{student.keyAchievement}</span>
            </div>
          ) : student.message ? (
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed italic border-l-2 border-[#0F6E8C] pl-2.5">
              &ldquo;{student.message}&rdquo;
            </p>
          ) : null}
        </div>

        {/* Footer Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles size={11} />
            Verified Alumnus
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0F6E8C] dark:text-teal-400 group-hover:text-[#0B5C74] dark:group-hover:text-teal-300 hover:underline">
            <span>View Bio</span>
            <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12 sm:py-16 bg-slate-50/70 dark:bg-[#07111e] border-t border-slate-200/80 dark:border-slate-800 transition-colors font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-[#0F6E8C] dark:text-teal-400 text-xs font-bold tracking-wider uppercase font-mono block">
              Alumni &amp; Graduates
            </span>
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Where Our Graduates Stand Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Our alumni serve as scholars, teachers, researchers, and community leaders around the world.
            </p>
          </div>

          {showHeaderAction && (
            <Link
              to="/students"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0F6E8C] dark:text-teal-400 hover:underline shrink-0"
            >
              <span>View all alumni ({activeStudents.length})</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Marquee or Grid Mode */}
        {marquee ? (
          <div className="relative w-full overflow-hidden py-2">
            <div className="flex gap-4 sm:gap-6 animate-marquee-slow hover:[animation-play-state:paused] active:[animation-play-state:paused]">
              {[...displayStudents, ...displayStudents].map((student, idx) =>
                renderStudentCard(student, `marquee-student-${idx}`)
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayStudents.map((student, i) =>
              renderStudentCard(student, student._id || student.id || `alum-${i}`)
            )}
          </div>
        )}
      </div>

      {/* Graduate Details Modal Dialog — Clean Non-Card Format */}
      {activeModalStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setActiveModalStudent(null)}
        >
          <div
            className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[85vh] shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0 sticky top-0 z-10 backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300">
                Alumnus Profile
              </span>
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs font-semibold"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={getImageUrl(activeModalStudent.image, `https://ui-avatars.com/api/?name=${encodeURIComponent(activeModalStudent.name || "Student")}&background=0F6E8C&color=fff&bold=true`)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeModalStudent.name || "Student")}&background=0F6E8C&color=fff&bold=true`;
                  }}
                  alt={activeModalStudent.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border border-slate-200 dark:border-slate-700 shadow-xs shrink-0"
                />
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase font-mono block truncate">
                    {activeModalStudent.program} • {activeModalStudent.batchYear}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading truncate">
                    {activeModalStudent.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 truncate">
                    {activeModalStudent.currentRole}
                  </p>
                </div>
              </div>

              {/* Clean Specification List (No Box Cards) */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium shrink-0">
                    <Building2 size={14} className="text-[#0F6E8C] dark:text-teal-400" />
                    Organization
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate">
                    {activeModalStudent.currentOrganization || "Private Scholarly Practice"}
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium shrink-0">
                    <MapPin size={14} className="text-[#0F6E8C] dark:text-teal-400" />
                    Location
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate">
                    {activeModalStudent.location || "International"}
                  </span>
                </div>
              </div>

              {activeModalStudent.keyAchievement && (
                <div className="pl-3.5 border-l-2 border-amber-500 py-1 space-y-1">
                  <span className="text-[10.5px] font-bold text-amber-700 dark:text-amber-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Award size={13} className="text-amber-500" />
                    Key Scholarly Achievement
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                    {activeModalStudent.keyAchievement}
                  </p>
                </div>
              )}

              {activeModalStudent.message && (
                <div className="pl-3.5 border-l-2 border-[#0F6E8C] dark:border-teal-400 py-1 space-y-1">
                  <span className="text-[10.5px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase font-mono tracking-wider block">
                    Graduate Reflection
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    &ldquo;{activeModalStudent.message}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer Actions — Two Buttons in Single Row */}
            <div className="grid grid-cols-2 gap-2.5 p-3.5 sm:px-6 sm:py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="w-full text-center py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/apply"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0F6E8C] text-white text-xs font-bold hover:bg-[#0B5C74] shadow-xs transition-all text-center"
              >
                <span>Join Academy</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
