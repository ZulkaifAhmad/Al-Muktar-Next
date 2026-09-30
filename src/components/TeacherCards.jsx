"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  Award,
  Users,
  Calendar,
  ArrowRight,
  ChevronRight,
  GraduationCap,
  Building2,
  CheckCircle2,
  Quote,
  X,
  Sparkles,
} from "lucide-react";
import { useTeachers } from "@/lib/queries";
import { getImageUrl, DirectorImage } from "../assets/assets.js";

function TeacherCards({ marquee = false, onTeacherClick, limit }) {
  const { data: apiTeachers = [] } = useTeachers();
  const teachers = apiTeachers.filter((t) => t.status !== "inactive");
  const displayTeachers = typeof limit === "number" ? teachers.slice(0, limit) : teachers;
  const [activeModalTeacher, setActiveModalTeacher] = useState(null);

  if (teachers.length === 0) {
    return null;
  }

  const handleCardClick = (teacher) => {
    if (onTeacherClick) {
      onTeacherClick(teacher);
    } else {
      setActiveModalTeacher(teacher);
    }
  };

  const renderCard = (teacher, key) => (
    <div
      key={key}
      onClick={() => handleCardClick(teacher)}
      className={`group bg-white dark:bg-[#0c1827] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-[#0F6E8C]/50 dark:hover:border-teal-400/50 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
        marquee ? "w-[280px] sm:w-[320px] shrink-0" : "w-full"
      }`}
    >
      {/* Top Image Section — Big & Prominent */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={getImageUrl(teacher.image, DirectorImage)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DirectorImage;
          }}
          alt={teacher.name}
          loading="lazy"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-slate-950/80 backdrop-blur-md text-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm font-mono uppercase tracking-wider border border-teal-500/20">
            {teacher.department || "Islamic Studies"}
          </span>
          <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full font-mono border border-white/10">
            {teacher.experienceYears || "5+ Years"} Exp
          </span>
        </div>

        {/* Bottom Tag */}
        <div className="absolute bottom-3 left-3">
          <p className="text-white text-xs font-semibold drop-shadow-sm font-heading">
            {teacher.role || "Senior Scholar"}
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors line-clamp-1">
            {teacher.name}
          </h3>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Users size={12} className="text-[#0F6E8C] dark:text-teal-400" />
              <span>{teacher.studentsMentored || "200+"} Mentored</span>
            </span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Verified
            </span>
          </div>

          {/* Specializations */}
          {Array.isArray(teacher.specializations) && teacher.specializations.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {teacher.specializations.slice(0, 2).map((spec, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10.5px] font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            Al-Mukhtar Faculty
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick(teacher);
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0F6E8C] dark:text-teal-400 group-hover:text-[#0B5C74] dark:group-hover:text-teal-300 hover:underline cursor-pointer"
          >
            <span>View Bio</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {marquee ? (
        <div className="relative w-full overflow-hidden py-2">
          <div className="flex gap-4 sm:gap-6 animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused]">
            {[...teachers, ...teachers].map((teacher, idx) =>
              renderCard(teacher, `marquee-teacher-${idx}`)
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayTeachers.map((teacher, i) =>
            renderCard(teacher, teacher._id || teacher.id || `faculty-${i}`)
          )}
        </div>
      )}

      {/* Teacher Details Modal Dialog — Clean Non-Card Format */}
      {activeModalTeacher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setActiveModalTeacher(null)}
        >
          <div
            className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0F6E8C] shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300 truncate">
                  Faculty Scholar Profile
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalTeacher(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs font-semibold"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body — Clean Non-Card Layout */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
              {/* Profile Main Banner */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={getImageUrl(activeModalTeacher.image, DirectorImage)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DirectorImage;
                  }}
                  alt={activeModalTeacher.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border border-slate-200 dark:border-slate-700 shadow-xs shrink-0"
                />

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {activeModalTeacher.department && (
                      <span className="px-2 py-0.5 rounded bg-[#0F6E8C]/10 text-[#0F6E8C] dark:text-teal-300 text-[10px] font-bold font-mono uppercase tracking-wider">
                        {activeModalTeacher.department}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Faculty Member
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading truncate">
                    {activeModalTeacher.name}
                  </h2>

                  <p className="text-xs sm:text-sm font-semibold text-[#0F6E8C] dark:text-teal-400 truncate">
                    {activeModalTeacher.role || "Senior Scholar"}
                  </p>
                </div>
              </div>

              {/* Clean Specification List (No Box Cards) */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium shrink-0">
                    <Calendar size={14} className="text-[#0F6E8C] dark:text-teal-400" />
                    Teaching Experience
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                    {activeModalTeacher.experienceYears || "5+ Years"}
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium shrink-0">
                    <Users size={14} className="text-[#0F6E8C] dark:text-teal-400" />
                    Scholars Mentored
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                    {activeModalTeacher.studentsMentored || "200+"} Students
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium shrink-0">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Accreditation
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-right">
                    Verified Resident Faculty
                  </span>
                </div>
              </div>

              {/* Areas of Academic Specialization */}
              {Array.isArray(activeModalTeacher.specializations) &&
                activeModalTeacher.specializations.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10.5px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                      Academic Specializations
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeModalTeacher.specializations.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200/80 dark:border-slate-700"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Scholarly Philosophy / Quote */}
              {activeModalTeacher.quote && (
                <div className="pl-3.5 border-l-2 border-[#0F6E8C] dark:border-teal-400 py-1 space-y-1">
                  <span className="text-[10.5px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase font-mono tracking-wider block">
                    Scholarly Philosophy
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    &ldquo;{activeModalTeacher.quote}&rdquo;
                  </p>
                </div>
              )}

              {/* Academic Background / Bio */}
              {activeModalTeacher.bio && (
                <div className="space-y-1.5">
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                    Academic Background &amp; Profile
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {activeModalTeacher.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer Actions — Two Buttons in Single Row */}
            <div className="grid grid-cols-2 gap-2.5 p-3.5 sm:px-6 sm:py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalTeacher(null)}
                className="w-full text-center py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/apply"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0F6E8C] text-white text-xs font-bold hover:bg-[#0B5C74] shadow-xs transition-all text-center"
              >
                <span>Enroll Now</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TeacherCards;

