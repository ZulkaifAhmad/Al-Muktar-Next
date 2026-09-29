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
    <article className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800/80 hover:border-[#0F6E8C]/50 dark:hover:border-teal-500/50 hover:shadow-xs transition-all duration-200 flex flex-col overflow-hidden shadow-2xs font-sans">
      {/* Image Section - Normal Proportional Height with Logo placeholder properly fitted */}
      <Link to={courseLink} className="relative h-40 sm:h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 block shrink-0">
        {imageSrc ? (
          <img
            src={imageSrc}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = LogoImg;
              e.currentTarget.className = "max-h-20 max-w-[80%] object-contain m-auto drop-shadow-2xs";
            }}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
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
        <span className="absolute top-2.5 left-2.5 bg-slate-900/80 dark:bg-black/80 backdrop-blur-xs text-white text-[9.5px] font-bold px-2 py-0.5 rounded shadow-2xs font-mono uppercase tracking-wider">
          {course.level || "Certificate"}
        </span>
      </Link>

      {/* Card Body - Clean Medium/Small Typography */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div className="space-y-1.5">
          <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0F6E8C] dark:group-hover:text-teal-400 transition-colors leading-snug break-normal hyphens-none">
            <Link to={courseLink}>{course.title}</Link>
          </h3>

          {course.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 font-normal break-normal hyphens-none">
              {course.description}
            </p>
          )}
        </div>

        {/* Footer Meta Details */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#0F6E8C] dark:text-teal-400" />
              {course.duration}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-[#0F6E8C] dark:text-teal-400" />
              {enrolledCount} enrolled
            </span>
          </div>

          <Link
            to={courseLink}
            className="inline-flex items-center gap-1 font-bold text-[#0F6E8C] dark:text-teal-400 group-hover:gap-1.5 transition-all text-xs shrink-0"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
