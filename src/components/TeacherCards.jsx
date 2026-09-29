"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import { Quote, ArrowRight, Award, CheckCircle2, ChevronRight } from "lucide-react";
import { useTeachers } from "@/lib/queries";
import { getImageUrl, DirectorImage } from "../assets/assets.js";

function TeacherCards() {
  const { data: apiTeachers = [] } = useTeachers();
  const teachers = apiTeachers.filter((t) => t.status !== "inactive");

  if (teachers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teachers.slice(0, 6).map((teacher, i) => (
          <div
            key={teacher._id || teacher.id || `faculty-card-${i}`}
            className="bg-white dark:bg-[#0c1827] rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#0F6E8C]/50 dark:hover:border-teal-400/50 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Header: Photo, Name & Department */}
              <div className="flex items-start gap-3.5">
                <img
                  src={getImageUrl(teacher.image, DirectorImage)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DirectorImage;
                  }}
                  alt={teacher.name}
                  loading="lazy"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover object-top border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-wider font-mono block truncate">
                    {teacher.department}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading truncate group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">
                    {teacher.role}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-1">
                    <span>{teacher.experienceYears || "5+ Years"} Exp</span>
                    <span>•</span>
                    <span>{teacher.studentsMentored || "200+"} Mentored</span>
                  </div>
                </div>
              </div>

              {/* Quote Snippet */}
              {teacher.quote && (
                <blockquote className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2 bg-slate-50/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed font-serif">
                  "{teacher.quote}"
                </blockquote>
              )}

              {/* Specialization Badges */}
              {Array.isArray(teacher.specializations) && teacher.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {teacher.specializations.slice(0, 3).map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                  {teacher.specializations.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                      +{teacher.specializations.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                Verified Faculty
              </span>
              <Link
                to="/teachers"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0F6E8C] dark:text-teal-400 hover:underline"
              >
                <span>Faculty Details</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherCards;
