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

export default function StudentShowcase({ limit, showHeaderAction = false }) {
  const { data: apiStudents = [] } = useStudents();
  const activeStudents = apiStudents.filter((s) => s.status !== "inactive");
  const displayStudents = typeof limit === "number" ? activeStudents.slice(0, limit) : activeStudents;
  const [activeModalStudent, setActiveModalStudent] = useState(null);

  if (activeStudents.length === 0) {
    return null;
  }

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

          {showHeaderAction && typeof limit === "number" && activeStudents.length > limit && (
            <Link
              to="/students"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0F6E8C] dark:text-teal-400 hover:underline shrink-0"
            >
              <span>View all alumni ({activeStudents.length})</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Executive Alumni Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayStudents.map((student, i) => (
            <div
              key={student._id || student.id || `alum-${i}`}
              className="bg-white dark:bg-[#0c1827] rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#0F6E8C]/50 dark:hover:border-teal-400/50 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3.5">
                {/* Avatar & Identifiers */}
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

                {/* Professional Placement Box */}
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

                {/* Reflection Quote */}
                {student.message && (
                  <blockquote className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2 leading-relaxed pl-3.5 py-0.5 border-l-2 border-[#0F6E8C] dark:border-teal-400 font-serif">
                    "{student.message}"
                  </blockquote>
                )}
              </div>

              {/* Milestone Achievement Badge */}
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
      </div>

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
    </section>
  );
}
