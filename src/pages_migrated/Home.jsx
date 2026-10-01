"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import { useCourses, useBlogs, useTeachers } from "@/lib/queries";
import {
  ArrowRight,
  BookOpen,
  Award,
  GraduationCap,
  Building,
  Globe,
  ShieldCheck,
  Monitor,
  Compass,
  CheckCircle2,
  Quote,
  ChevronDown,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import BlogCard from "../components/BlogCard.jsx";
import CourseCard from "../components/CourseCard.jsx";
import TeacherCards from "../components/TeacherCards.jsx";
import StudentShowcase from "../components/StudentShowcase.jsx";
import ApiErrorState from "../components/ApiErrorState.jsx";
import { AboutImage, FounderImage, Logo, getImageUrl, HeroAcademicBg } from "../assets/assets.js";

const faqs = [
  {
    question: "What courses and programs are taught at Al-Mukhtar?",
    answer:
      "Al-Mukhtar is a dedicated Islamic Madrasa teaching sacred Islamic sciences and classical Dars-e-Nizami, including Tajweed & Quran recitation, Arabic grammar & morphology, Fiqh (Islamic Jurisprudence), Hadith studies, Tafseer, and Seerat-un-Nabi ﷺ.",
  },
  {
    question: "Is there any age restriction or prior qualification requirement?",
    answer:
      "There is no age limitation at Al-Mukhtar. Our courses are specially designed for university students, working professionals, and elders, as well as young learners starting their journey in Deen. Everyone is taught step-by-step.",
  },
  {
    question: "What is the study mode and where is the campus located?",
    answer:
      "All classes are conducted On-Campus with direct scholar-to-student interaction at our Peshawar campus located at Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar, KPK, Pakistan.",
  },
  {
    question: "Who teaches the classes and what are their qualifications?",
    answer:
      "All courses are taught by certified Islamic scholars (Alims) with authentic Sanad, led by Founder & CEO Mulana Muhammad Anwar (M.Phil Media Studies & Mass Communication, M.Phil Seerat Studies, Kulliyyat al-Shariah Jamia Tur Rasheed).",
  },
  {
    question: "Are certificates provided at the end of the course?",
    answer:
      "Yes. Upon successful completion of the course syllabus and passing the final assessment, students are awarded an official certified Sanad / Certificate from Al-Mukhtar.",
  },
  {
    question: "How do I check examination results and download result PDFs?",
    answer:
      "Official examination result PDF gazettes are published under the Results section of our website, where students can view and download their course result gazette at any time.",
  },
];

function Home() {
  const [openFaq, setOpenFaq] = useState(0);

  const {
    data: courses = [],
    isLoading: coursesLoading,
    isError: isCoursesError,
    refetch: refetchCourses,
  } = useCourses();

  const {
    data: blogs = [],
    isLoading: blogsLoading,
    isError: isBlogsError,
    refetch: refetchBlogs,
  } = useBlogs();

  const { data: teachers = [] } = useTeachers();

  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  const activeTeachers = teachers.filter((t) => t.status !== "inactive");
  const activeTeacher =
    activeTeachers.find((t) => (t._id || t.id) === selectedTeacherId) || activeTeachers[0] || null;

  const featuredCourses = courses.slice(0, 6);
  const recentBlogs = blogs.slice(0, 6);

  return (
    <div className="bg-white dark:bg-[#070d18] font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* ── PRESTIGIOUS HERO SECTION WITH ACADEMIC BACKGROUND ── */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800/80 py-10 sm:py-16 lg:py-20 transition-colors">
        {/* Background Image with Deep Scholarly Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={HeroAcademicBg}
            alt="Al-Mukhtar Academic Hall"
            className="w-full h-full object-cover object-center opacity-30 sm:opacity-35 scale-105 transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(15,110,140,0.25),transparent_60%)]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column — Text & CTAs (Expanded Width) */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-5">
              {/* Institutional Badge — smaller font size on mobile */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-300 text-[10px] min-[380px]:text-[11px] sm:text-xs font-semibold font-mono tracking-wider shadow-sm">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>Premier Islamic Institute</span>
              </div>

              {/* Dignified Main Headline — Balanced Hero Headline Size & High Contrast Weight */}
              <h1 className="font-heading text-[30px] min-[380px]:text-[34px] sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] font-black text-white leading-[1.14] sm:leading-[1.1] lg:leading-[1.08] tracking-tight drop-shadow-sm">
                Your Journey Towards Islamic Knowledge Begins Here.
              </h1>

              {/* Description */}
              <p className="text-slate-200 text-sm sm:text-base lg:text-[17px] leading-relaxed font-normal max-w-2xl">
                Explore the world of Islamic knowledge with Al-Mukhtar. We offer structured Islamic education, Dars-e-Nizami and weekend short courses to help students strengthen their understanding of Deen.
              </p>

              {/* CTA Buttons — Always 2 buttons in a single row on mobile */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3.5 pt-2 max-w-md sm:max-w-none">
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#0F6E8C] hover:bg-[#0B5C74] text-white font-bold px-3 sm:px-6 py-3 sm:py-3.5 rounded-xl shadow-lg shadow-[#0F6E8C]/25 transition-all text-xs min-[400px]:text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98] text-center"
                >
                  <span>Explore Courses</span>
                  <ArrowRight size={15} className="hidden min-[400px]:inline shrink-0" />
                </Link>
                <Link
                  to="/apply"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-white/40 backdrop-blur-sm font-bold px-3 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all text-xs min-[400px]:text-sm sm:text-base shadow-sm hover:scale-[1.02] active:scale-[0.98] text-center"
                >
                  <span>Apply Now</span>
                </Link>
              </div>

              {/* Feature Checklist */}
              <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-6 gap-y-2.5 pt-2 text-xs sm:text-[13px] text-slate-300 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-teal-400 shrink-0" />
                  <span>Experienced Islamic Scholars</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-teal-400 shrink-0" />
                  <span>Flexible Shifts (Morning &amp; Evening)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-teal-400 shrink-0" />
                  <span>Recognized Certification</span>
                </span>
              </div>
            </div>

            {/* Right Column — Founder Showcase */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end mt-4 lg:mt-0">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px]">
                <Link
                  to="/teachers"
                  className="group block relative rounded-2xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-md p-2 shadow-2xl transition-all duration-300 hover:border-teal-400/50 hover:shadow-teal-900/30"
                  title="View Mulana Muhammad Anwar's Profile & Faculty"
                >
                  <div className="relative h-[300px] sm:h-[340px] lg:h-[360px] w-full rounded-xl overflow-hidden bg-slate-900">
                    <img
                      src={FounderImage}
                      alt="Mulana Muhammad Anwar — CEO Al-Mukhtar"
                      className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Top Floating Badge */}
                    <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 shadow-sm flex items-center gap-1.5 text-[9.5px] font-bold text-teal-300 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      FOUNDING DIRECTOR
                    </div>

                    {/* Bottom Floating Institution / Scholar Badge */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-white/15 shadow-md flex items-center justify-between gap-2 text-white">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate font-heading leading-tight flex items-center gap-1.5">
                          <span>Mulana Muhammad Anwar</span>
                          <span className="text-[9.5px] font-mono text-teal-400 font-normal">(CEO)</span>
                        </p>
                        <p className="text-[10px] text-slate-300 font-mono truncate">
                          FAST-NUCES Faculty • Jamia Tur Rasheed
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-teal-300 group-hover:text-teal-200 shrink-0 font-mono bg-white/10 px-2.5 py-1 rounded-lg">
                        <span>View Profile</span>
                        <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/15">
            <div className="p-3.5 sm:p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              <p className="font-heading text-xl sm:text-2xl font-black text-white mb-0.5">100+</p>
              <p className="text-teal-300 text-[10.5px] sm:text-xs font-mono uppercase tracking-wider font-semibold">Students Taught</p>
            </div>
            <div className="p-3.5 sm:p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              <p className="font-heading text-xl sm:text-2xl font-black text-white mb-0.5">10+</p>
              <p className="text-teal-300 text-[10.5px] sm:text-xs font-mono uppercase tracking-wider font-semibold">Scholars &amp; Faculty</p>
            </div>
            <div className="p-3.5 sm:p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              <p className="font-heading text-xl sm:text-2xl font-black text-white mb-0.5">3</p>
              <p className="text-teal-300 text-[10.5px] sm:text-xs font-mono uppercase tracking-wider font-semibold">Years of Service</p>
            </div>
            <div className="p-3.5 sm:p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              <p className="font-heading text-xl sm:text-2xl font-black text-white mb-0.5">5</p>
              <p className="text-teal-300 text-[10.5px] sm:text-xs font-mono uppercase tracking-wider font-semibold">Certified Programs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Credential Strip */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#070d18] py-4 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-between gap-3 sm:gap-8 text-xs text-slate-600 dark:text-slate-300 font-bold font-mono">
          <div className="flex items-center gap-2">
            <GraduationCap size={15} className="text-[#0F6E8C] dark:text-teal-400 shrink-0" />
            <span>Certified Curriculum</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={15} className="text-[#0F6E8C] dark:text-teal-400 shrink-0" />
            <span>Qualified Scholars</span>
          </div>
          <div className="flex items-center gap-2">
            <Building size={15} className="text-[#0F6E8C] dark:text-teal-400 shrink-0" />
            <span>Modern Campus</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={15} className="text-[#0F6E8C] dark:text-teal-400 shrink-0" />
            <span>Inclusive Community</span>
          </div>
        </div>
      </div>

      {/* ── ABOUT SECTION ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            <div className="rounded-xl overflow-hidden shadow-2xs border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
              <img
                src={AboutImage}
                alt="Students learning at Al-Mukhtar Institute"
                className="w-full h-[300px] sm:h-[320px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-white dark:bg-[#0c1827] rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 px-3.5 py-2 items-center gap-2.5 hidden sm:flex">
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/80 flex items-center justify-center text-[#0F6E8C] dark:text-teal-400">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="font-heading text-xs font-bold text-slate-900 dark:text-white leading-tight">Authentic</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Scholarly Methodology</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-3">
            <span className="text-[#0F6E8C] dark:text-teal-400 text-[10.5px] font-bold tracking-widest uppercase font-mono block">
              About Al-Mukhtar Institute
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
              A trusted center of learning, guidance, and character
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              Founded with the vision to cultivate intellect, spiritual clarity, and moral discipline, Al-Mukhtar Institute serves hundreds of students through structured Islamic and academic programs.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              Our teachers are rigorously trained, our curriculum carefully designed, and every student receives personalized attention to grow academically and morally.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {[
                "Authentic Classical Curriculum",
                "Qualified Faculty & Scholars",
                "Structured Academic Support",
                "Safe, Disciplined Environment",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#0F6E8C] dark:text-teal-400 shrink-0" />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 text-[#0F6E8C] dark:text-teal-400 text-xs sm:text-sm font-semibold hover:gap-2 transition-all"
              >
                <span>Learn more about our institute</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY / APPROACH ── */}
      <section className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#081220] py-12 sm:py-14 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[#0F6E8C] dark:text-teal-400 text-[10.5px] font-bold tracking-widest uppercase font-mono mb-1.5 block">
              Our Methodology
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              A Tri-fold Approach to Education
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                icon: BookOpen,
                title: "Traditional Sciences",
                text: "Tafseer, Hadith, Fiqh, and Arabic grammar, taught by scholars with verified chains of transmission (Ijazah).",
              },
              {
                icon: Monitor,
                title: "Practical Islamic Learning",
                text: "Islamic knowledge is connected to daily life through practical learning, real-life examples, worship guidance, and lessons that help students apply what they learn.",
              },
              {
                icon: Compass,
                title: "Tarbiyah & Character",
                text: "Active emphasis on Islamic ethics, personal discipline, integrity, and meaningful community service.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#0c1827] p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-[#0F6E8C]/40 dark:hover:border-teal-500/40 hover:shadow-xs transition-all shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/80 flex items-center justify-center mb-3 text-[#0F6E8C] dark:text-teal-400">
                  <item.icon size={15} />
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      {(coursesLoading || isCoursesError || featuredCourses.length > 0) && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-[#0F6E8C] text-[10.5px] font-bold tracking-widest uppercase font-mono mb-1.5 block">
                Academic Offerings
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Featured Courses
              </h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-[#0F6E8C] text-xs sm:text-sm font-semibold hover:gap-2 transition-all shrink-0"
            >
              <span>View all programs</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {coursesLoading && featuredCourses.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-200/80 overflow-hidden animate-pulse bg-white p-4 space-y-3">
                  <div className="h-40 bg-slate-100 rounded-lg" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {isCoursesError && featuredCourses.length === 0 && (
            <ApiErrorState
              title="Unable to load featured courses"
              message="Network or server connection issue while retrieving courses. Click refresh to try again."
              onRetry={refetchCourses}
            />
          )}

          {featuredCourses.length > 0 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
                {featuredCourses.map((course) => (
                  <CourseCard key={course._id || course.slug} course={course} />
                ))}
              </div>

              {courses.length > 6 && (
                <div className="text-center pt-2">
                  <Link
                    to="/courses"
                    className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 font-bold px-5 py-2.5 rounded-xl transition-all text-xs sm:text-sm shadow-2xs"
                  >
                    <span>Explore All Courses ({courses.length})</span>
                    <ArrowRight size={14} className="text-[#0F6E8C]" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── FACULTY / TEACHERS (STATIC GRID) ── */}
      {activeTeachers.length > 0 && (
        <section className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#070d18] py-12 sm:py-16 transition-colors">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[#0F6E8C] dark:text-teal-400 text-[10.5px] font-bold tracking-widest uppercase font-mono mb-1 block">
                  Our Distinguished Faculty
                </span>
                <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Learn Under Experienced Scholars
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mt-1">
                  Guided by qualified scholars holding verified chains of transmission (Ijazah) from recognized academic institutions.
                </p>
              </div>
              <Link
                to="/teachers"
                className="inline-flex items-center gap-1.5 text-[#0F6E8C] dark:text-teal-400 text-xs sm:text-sm font-semibold hover:underline transition-all shrink-0"
              >
                <span>View all faculty ({activeTeachers.length})</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Static Grid for Laptop & Mobile */}
            <TeacherCards />
          </div>
        </section>
      )}

      {/* ── NEWS & ANNOUNCEMENTS ── */}
      {(blogsLoading || isBlogsError || recentBlogs.length > 0) && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-[#0F6E8C] text-[10.5px] font-bold tracking-widest uppercase font-mono mb-1.5 block">
                News &amp; Publications
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Latest Blogs from the Institute
              </h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-[#0F6E8C] text-xs sm:text-sm font-semibold hover:gap-2 transition-all shrink-0"
            >
              <span>View all articles</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {blogsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 animate-pulse">
                  <div className="w-full h-40 bg-slate-100 rounded-lg" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {isBlogsError && !blogsLoading && (
            <ApiErrorState
              title="Unable to load latest articles"
              message="Failed to retrieve publications from the server. Click refresh to try again."
              onRetry={refetchBlogs}
            />
          )}

          {!blogsLoading && !isBlogsError && recentBlogs.length > 0 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 items-start">
                {recentBlogs.map((blog) => (
                  <BlogCard key={blog._id || blog.slug} blog={blog} />
                ))}
              </div>

              {blogs.length > 6 && (
                <div className="text-center pt-2">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 font-bold px-5 py-2.5 rounded-xl transition-all text-xs sm:text-sm shadow-2xs"
                  >
                    <span>Explore All Articles ({blogs.length})</span>
                    <ArrowRight size={14} className="text-[#0F6E8C]" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── STUDENTS & ALUMNI SUCCESS SHOWCASE (STATIC GRID) ── */}
      <StudentShowcase limit={6} showHeaderAction={true} />

      {/* ── FAQS ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[#0F6E8C] dark:text-teal-400 text-[10.5px] font-bold tracking-widest uppercase font-mono mb-1.5 block">
            FAQs
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#0c1827] shadow-2xs">
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-3 text-left px-4 py-3 bg-white dark:bg-[#0c1827] hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle size={14} className="text-[#0F6E8C] dark:text-teal-400 shrink-0" />
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">{faq.question}</span>
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#0F6E8C] dark:text-teal-400" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-200 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed px-4 pb-3.5 pl-9 font-normal">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CLEAN PRE-FOOTER CTA ── */}
      <section className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#081524] py-10 sm:py-14 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xs">
            <span className="inline-block text-[#0F6E8C] dark:text-teal-300 text-[9.5px] font-bold uppercase tracking-widest bg-teal-50 dark:bg-teal-950/80 border border-teal-200/60 dark:border-teal-800/60 px-2.5 py-0.5 rounded-full mb-2 font-mono">
              Admissions Open
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Ready to begin your educational journey?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4 max-w-md mx-auto text-xs leading-relaxed font-normal">
              Join students learning under qualified scholars in a structured, supportive academic environment.
            </p>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-sm sm:max-w-none mx-auto">
              <Link
                to="/apply"
                className="inline-flex items-center gap-1.5 bg-[#0F6E8C] dark:bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0B5C74] dark:hover:bg-teal-700 shadow-2xs transition-colors text-xs"
              >
                <span>Apply Now</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs"
              >
                <span>Contact Admissions</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;