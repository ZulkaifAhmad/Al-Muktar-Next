"use client";

import React from "react";
import { useCourses } from "@/lib/queries";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import CourseCard from "../components/CourseCard.jsx";
import ApiErrorState from "../components/ApiErrorState.jsx";

function Courses() {
  const {
    data: courses = [],
    isLoading,
    isError,
    refetch,
  } = useCourses();

  return (
    <div className="bg-white dark:bg-[#070d18] font-sans text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-200">
      {/* Clean Hero Section - Radiology-Hazel Aesthetic */}
      <section className="pt-6 sm:pt-8 pb-6 bg-white dark:bg-[#070d18] border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 text-[10px] font-bold text-[#0F6E8C] dark:text-teal-300 font-mono tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E8C] dark:bg-teal-400 animate-pulse" />
            <span>Academic Curriculum &amp; Enrollment</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
            Academic Programs &amp; Courses
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-normal">
            Structured Islamic scholarship, Quranic disciplines, and Arabic linguistics taught by certified faculty — designed for every stage of your educational pursuit.
          </p>
        </div>
      </section>

      {/* Courses Grid Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {isLoading && courses.length === 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#0F6E8C] dark:text-teal-400">
              <Loader2 size={14} className="animate-spin" />
              <span>Loading academic programs...</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0c1827] p-4 space-y-3 shadow-2xs animate-pulse">
                  <div className="w-full h-40 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-20" />
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16" />
                    </div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                  </div>
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-20" />
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isError && courses.length === 0 && (
          <ApiErrorState
            title="Unable to load academic programs"
            message="We couldn't connect to the curriculum server. Please check your network and click refresh."
            onRetry={refetch}
            className="my-8"
          />
        )}

        {!isLoading && !isError && courses.length === 0 && (
          <div className="text-center py-16 bg-slate-50/60 dark:bg-slate-900/40 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 max-w-md mx-auto">
            <BookOpen size={44} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-800 dark:text-slate-100 text-base font-bold font-heading">No courses available right now</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Check back soon — new course terms are being scheduled.</p>
          </div>
        )}

        {courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
            {courses.map((course) => (
              <CourseCard key={course._id || course.slug} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Courses;