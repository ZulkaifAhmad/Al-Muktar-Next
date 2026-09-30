"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "@/lib/navigation-adapter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCourses } from "@/lib/queries";
import api from "@/lib/api";
import {
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Eye,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Calendar,
  Languages,
  Award,
  ZoomIn,
  Maximize2,
  X,
} from "lucide-react";
import CourseCard from "./CourseCard.jsx";
import ApiErrorState from "./ApiErrorState.jsx";
import { LogoImg, GreenDecorationBg, getImageUrl } from "../assets/assets.js";


function CourseDetails() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { data: allCourses = [], isLoading: isAllCoursesLoading } = useCourses();
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  // Scroll to top whenever slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Handle ESC key and scroll lock for lightbox
  useEffect(() => {
    if (!isFullscreenImage) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsFullscreenImage(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreenImage]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      if (!slug || slug === "undefined" || slug === "null") {
        throw new Error("Invalid course slug");
      }
      const encoded = encodeURIComponent(slug);
      const res = await api.get(`/api/courses/${encoded}`);
      if (res.data?.course) return res.data.course;
      throw new Error("Course not found");
    },
    initialData: () => {
      const all = queryClient.getQueryData(["courses"]);
      if (!Array.isArray(all)) return undefined;
      try {
        const decoded = decodeURIComponent(slug || "");
        return (
          all.find(
            (c) =>
              c.slug === slug ||
              c.slug === decoded ||
              c._id === slug ||
              c.title?.toLowerCase() === decoded.toLowerCase()
          ) || undefined
        );
      } catch {
        return all.find((c) => c.slug === slug || c._id === slug);
      }
    },
  });

  // Filter other courses for "More Courses to Explore"
  const moreCourses = useMemo(() => {
    if (!Array.isArray(allCourses)) return [];
    return allCourses
      .filter((c) => (c.slug ? c.slug !== slug : c._id !== data?._id) && c._id !== data?._id)
      .slice(0, 3);
  }, [allCourses, slug, data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-[#0F6E8C]" />
        <p className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">Loading Course Details...</p>
      </div>
    );
  }

  const isNotFound = error?.response?.status === 404 || (!data && !isLoading && !isError);

  if (isNotFound || (isError && error?.response?.status === 404)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#080f19] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
          <AlertTriangle size={32} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-slate-800 dark:text-white mb-2">Course Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-xs sm:text-sm max-w-md font-normal">
          The requested course program does not exist, has been renamed, or was temporarily moved.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 bg-[#0F6E8C] hover:bg-[#0B5C74] text-white px-5 py-2.5 rounded-xl font-bold transition-all text-xs sm:text-sm shadow-xs"
        >
          <ArrowLeft size={15} /> Back to All Courses
        </Link>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#080f19] flex items-center justify-center p-4">
        <ApiErrorState
          variant="page"
          title="Unable to load course details"
          message="We couldn't retrieve this syllabus from the server. Check your network connection and click refresh."
          onRetry={refetch}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#080f19] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
          <AlertTriangle size={32} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-slate-800 dark:text-white mb-2">Course Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-xs sm:text-sm max-w-md font-normal">
          The requested course program does not exist, has been renamed, or was temporarily taken down for syllabus updates.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 bg-[#0F6E8C] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#0B5C74] transition-all text-xs sm:text-sm shadow-2xs"
        >
          <ArrowLeft size={15} /> Back to All Courses
        </Link>
      </div>
    );
  }

  const course = data;
  const enrolledCount = course.applicationCount || course.students || 0;
  const heroBgImage = GreenDecorationBg;

  return (
    <div className="bg-slate-50/50 font-sans text-slate-800 min-h-screen">
      {/* ── 1. Hero Section with Green Decoration Background Image ── */}
      <section className="relative text-white overflow-hidden border-b border-teal-900/30">
        {/* Background Image Container - Full image visibility without heavy solid blackout */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBgImage}
            alt="Course Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle, uniform translucent overlay for clear text contrast without obscuring the image */}
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12 sm:pb-16">
          {/* Breadcrumb / Back Link */}
          <div className="mb-6 sm:mb-8">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all font-mono uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Courses
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Course Meta & Title */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/40 text-emerald-200 text-[11px] font-bold font-mono tracking-wider uppercase backdrop-blur-md shadow-xs">
                  <Sparkles size={12} className="text-emerald-300" />
                  <span>{course.level || "Certificate Program"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-slate-100 text-[11px] font-semibold font-mono tracking-wider backdrop-blur-md shadow-xs">
                  <GraduationCap size={13} className="text-teal-300" />
                  <span>Certified Curriculum</span>
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                {course.title}
              </h1>

              {course.description && (
                <p className="text-slate-100 text-xs sm:text-sm leading-relaxed font-normal max-w-2xl line-clamp-3 sm:line-clamp-none drop-shadow-xs">
                  {course.description}
                </p>
              )}

              {/* Stat Badges */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-xl text-xs font-medium text-white shadow-xs">
                  <Clock size={15} className="text-emerald-300" />
                  <div>
                    <span className="text-[10px] uppercase text-slate-300 font-mono block leading-none">Duration</span>
                    <span className="font-bold text-white text-xs">{course.duration || "Self-paced"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-xl text-xs font-medium text-white shadow-xs">
                  <Users size={15} className="text-emerald-300" />
                  <div>
                    <span className="text-[10px] uppercase text-slate-300 font-mono block leading-none">Enrolled</span>
                    <span className="font-bold text-white text-xs">{enrolledCount} Students</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-xl text-xs font-medium text-white shadow-xs">
                  <Eye size={15} className="text-emerald-300" />
                  <div>
                    <span className="text-[10px] uppercase text-slate-300 font-mono block leading-none">Views</span>
                    <span className="font-bold text-white text-xs font-mono">{course.views ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Preview Card (Clickable Fullscreen Preview) */}
            <div className="lg:col-span-5">
              <div
                onClick={() => {
                  if (course.image) setIsFullscreenImage(true);
                }}
                role={course.image ? "button" : undefined}
                tabIndex={course.image ? 0 : undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && course.image) setIsFullscreenImage(true);
                }}
                title={course.image ? "Click to view full image" : undefined}
                className={`relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900/80 backdrop-blur-md aspect-[16/10] sm:aspect-[16/11] group ${
                  course.image ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0F6E8C]" : ""
                }`}
              >
                {course.image ? (
                  <img
                    src={getImageUrl(course.image, LogoImg)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = LogoImg;
                      e.currentTarget.className = "max-h-40 max-w-[80%] object-contain m-auto drop-shadow-2xs";
                    }}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-teal-950/60 to-slate-900 flex items-center justify-center p-6">
                    <img
                      src={LogoImg}
                      alt={course.title}
                      className="max-h-36 max-w-[80%] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

                {/* Hover Fullscreen Badge when image is present */}
                {course.image && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-lg">
                      <ZoomIn size={14} />
                      <span>Click for Full Image</span>
                    </span>
                  </div>
                )}

                {course.image && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white opacity-70 group-hover:opacity-100 backdrop-blur-xs transition-opacity">
                    <Maximize2 size={13} />
                  </div>
                )}

                <span className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/15 font-mono uppercase tracking-wider">
                  {course.level || "Academic Program"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Course Details & Sidebar Section ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Overview / About */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <BookOpen size={20} className="text-[#0F6E8C] dark:text-teal-400" />
                <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white">About this Course</h2>
              </div>
              {course.description ? (
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm font-normal space-y-3">
                  <p>{course.description}</p>
                </div>
              ) : (
                <p className="text-slate-400 dark:text-slate-500 italic text-xs">No extended syllabus description provided.</p>
              )}
            </div>

            {/* Course Features & Highlights */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Award size={20} className="text-[#0F6E8C] dark:text-teal-400" />
                <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white">Course Highlights &amp; Benefits</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80">
                  <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Verified Academic Certification</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Receive an accredited certificate upon successful completion of curriculum terms.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80">
                  <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Certified Scholarly Faculty</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Taught by experienced scholars holding recognized degrees and Sanad chains.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80">
                  <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Structured Study Modules</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Step-by-step syllabus with periodic assessments and practical recitation drill.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80">
                  <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Flexible Online &amp; On-Campus</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Attend live interactive sessions or on-campus classes with direct mentorship.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admission Instructions */}
            <div className="bg-gradient-to-r from-teal-50/70 dark:from-slate-800/80 to-slate-50 dark:to-slate-800/40 border border-teal-100 dark:border-teal-900/40 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F6E8C] dark:text-teal-400">Admission Open</span>
                <h4 className="font-heading text-sm sm:text-base font-bold text-slate-900 dark:text-white">Ready to begin this program?</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-normal">Fill out our simple application form to reserve your seat for the upcoming term.</p>
              </div>
              <Link
                to={`/apply?course=${encodeURIComponent(course.title)}`}
                className="shrink-0 inline-flex items-center gap-2 bg-[#0F6E8C] hover:bg-[#0B5C74] text-white font-bold px-5 py-2.5 rounded-xl transition-all text-xs shadow-2xs"
              >
                <span>Apply Now</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 sticky top-24 shadow-xs space-y-5">
              <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">Program Overview</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/80">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-slate-700 flex items-center justify-center text-[#0F6E8C] dark:text-teal-300 shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-bold">Duration</p>
                    <p className="font-bold text-slate-900 dark:text-white">{course.duration || "Flexible"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/80">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-slate-700 flex items-center justify-center text-[#0F6E8C] dark:text-teal-300 shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-bold">Level / Category</p>
                    <p className="font-bold text-slate-900 dark:text-white">{course.level || "Standard"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/80">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-slate-700 flex items-center justify-center text-[#0F6E8C] dark:text-teal-300 shrink-0">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-bold">Enrolled Students</p>
                    <p className="font-bold text-slate-900 dark:text-white">{enrolledCount} Active Learners</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/80">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-slate-700 flex items-center justify-center text-[#0F6E8C] dark:text-teal-300 shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-bold">Accreditation</p>
                    <p className="font-bold text-slate-900 dark:text-white">Al-Mukhtar Certified</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2 sm:space-y-2.5 sm:block">
                <Link
                  to={`/apply?course=${encodeURIComponent(course.title)}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0F6E8C] hover:bg-[#0B5C74] text-white font-bold py-2.5 sm:py-3 px-2 rounded-xl transition-all text-xs sm:text-sm shadow-2xs text-center"
                >
                  <span>Apply Now</span>
                  <ArrowRight size={13} className="hidden xs:inline" />
                </Link>

                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-2.5 px-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs text-center sm:mt-2.5"
                >
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. More Courses to Explore Section (Bottom) ── */}
      <section className="bg-slate-100/70 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-slate-800 border border-teal-200/80 dark:border-slate-700 text-[10px] font-bold text-[#0F6E8C] dark:text-teal-300 font-mono tracking-wider uppercase">
                <Sparkles size={11} />
                <span>Academic Pathways</span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                More Courses to Explore
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-xl font-normal">
                Expand your knowledge with our other structured Islamic disciplines and linguistic courses.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F6E8C] dark:text-teal-400 hover:text-[#0B5C74] font-mono uppercase tracking-wider transition-colors shrink-0"
            >
              <span>View All Courses</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Courses Grid */}
          {isAllCoursesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 animate-pulse">
                  <div className="w-full h-40 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : moreCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {moreCourses.map((c) => (
                <CourseCard key={c._id || c.slug} course={c} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6">
              <p className="text-xs text-slate-500 dark:text-slate-400">No additional courses available right now.</p>
              <Link to="/courses" className="inline-block mt-3 text-xs text-[#0F6E8C] dark:text-teal-400 font-bold">
                Browse Course Catalog
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. Fullscreen Course Image Lightbox Preview (70% Max Height) ── */}
      {isFullscreenImage && course.image && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000000] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
        >
          <div
            onClick={() => setIsFullscreenImage(false)}
            className="fixed inset-0 cursor-zoom-out"
          />

          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFullscreenImage(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 backdrop-blur-md shadow-xl transition-all cursor-pointer group"
            >
              <X size={16} className="group-hover:rotate-90 transition-transform" />
              <span>Close Preview</span>
            </button>
          </div>

          <div className="relative z-10 max-w-[90vw] max-h-[75vh] flex flex-col items-center justify-center">
            <img
              src={course.image}
              alt={course.title || "Course full image"}
              className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            {course.title && (
              <p className="mt-2.5 text-xs sm:text-sm text-slate-300 font-medium text-center bg-black/60 px-4 py-1 rounded-full border border-white/10 backdrop-blur-md max-w-lg truncate">
                {course.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;