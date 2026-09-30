"use client";

import React from "react";
import { Link } from "@/lib/navigation-adapter";
import { Clock, Users, ArrowRight, Eye } from "lucide-react";
import { LogoImg, getImageUrl } from "../assets/assets.js";

function CourseCard({ course }) {
  if (!course) return null;

  const enrolledCount = course.applicationCount || course.students || 0;
  const imageSrc = getImageUrl(course.image, null);
  const courseLink = `/courses/${encodeURIComponent(course.slug || course._id)}`;

  return (
    <article className="group bg-white dark:bg-[#0c1827] rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#0F6E8C]/50 dark:hover:border-teal-400/50 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden shadow-2xs font-sans w-full">
      {/* Image Section - Big and Prominent for Both Mobile and Desktop */}
      <Link to={courseLink} className="relative w-full h-44 sm:h-48 md:h-52 overflow-hidden bg-slate-100 dark:bg-slate-800 block shrink-0">
        {imageSrc ? (
          <img
            src={imageSrc}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = LogoImg;
              e.currentTarget.className = "max-h-20 max-w-[80%] object-contain m-auto drop-shadow-2xs";
            }}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-100 dark:from-slate-800 via-teal-50/40 dark:via-slate-800/60 to-slate-50 dark:to-slate-900 flex items-center justify-center p-4">
            <img
              src={LogoImg}
              alt="Al-Mukhtar Institute"
              className="max-h-20 max-w-[80%] object-contain drop-shadow-2xs group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-slate-950/80 backdrop-blur-md text-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm font-mono uppercase tracking-wider border border-teal-500/20">
            {course.level || "Certificate"}
          </span>
          <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full font-mono flex items-center gap-1 border border-white/10">
            <Users size={11} className="text-teal-400" />
            {enrolledCount}
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#0F6E8C] dark:text-teal-400" />
              {course.duration || "Structured"}
            </span>
            <span>•</span>
            <span className="text-[#0F6E8C] dark:text-teal-400 font-semibold uppercase tracking-wider text-[10px]">
              Al-Mukhtar
            </span>
          </div>

          <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors leading-snug line-clamp-2">
            <Link to={courseLink}>{course.title}</Link>
          </h3>

          {course.description && (
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 font-normal">
              {course.description}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            Open for Enrollment
          </span>

          <Link
            to={courseLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-[#0F6E8C] hover:text-white dark:hover:bg-teal-600 text-[#0F6E8C] dark:text-teal-300 text-xs font-bold transition-all shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
