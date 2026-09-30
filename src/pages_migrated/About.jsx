"use client";

import React from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Quote,
  Compass,
  Layers,
  HeartHandshake,
  Building2,
  Library,
  Calendar,
  Award,
  Check,
  MapPin,
  FileCheck,
} from "lucide-react";
import { CampusImage, bg, FounderImage } from "../assets/assets.js";

function About() {
  return (
    <div className="bg-white dark:bg-[#070d18] font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* ── 1. INSTITUTIONAL HERO SECTION (CLEAR BG & NORMAL EDUCATIONAL TYPOGRAPHY) ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-10 sm:py-14 border-b border-slate-800/80">
        {/* Background Image — Clearly Visible */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={bg}
            alt="Islamic Academic Heritage"
            className="w-full h-full object-cover object-center opacity-80 sm:opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/20" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-teal-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider font-mono border border-white/20">
              <Sparkles size={11} className="text-teal-300" />
              <span>Institutional Profile</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-heading tracking-tight">
              About Al-Mukhtar Institute
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              An established academy of classical Islamic sciences and modern academic inquiry — dedicated to authentic scholarship, disciplined character, and preparing principled community leaders.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-white/15">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/10 backdrop-blur-md">
                <span className="text-base sm:text-lg font-bold text-white font-heading block">15+ Years</span>
                <span className="text-[9.5px] text-teal-300 font-mono uppercase">Tradition</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/10 backdrop-blur-md">
                <span className="text-base sm:text-lg font-bold text-teal-300 font-heading block">3,500+</span>
                <span className="text-[9.5px] text-slate-300 font-mono uppercase">Alumni</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/10 backdrop-blur-md">
                <span className="text-base sm:text-lg font-bold text-white font-heading block">100%</span>
                <span className="text-[9.5px] text-teal-300 font-mono uppercase">Verified Sanad</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/10 backdrop-blur-md">
                <span className="text-base sm:text-lg font-bold text-teal-300 font-heading block">Global</span>
                <span className="text-[9.5px] text-slate-300 font-mono uppercase">Curricula</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. MAIN ACADEMIC CONTENT (STARTS FROM THE LEFT) ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Main Content Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-10 text-left">
            
            {/* SECTION 1: GENESIS & MISSION */}
            <article className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0F6E8C] dark:text-teal-400">
                  Institutional Genesis
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-0.5">
                  Preserving Sacred Tradition with Academic Rigor
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                Founded under the supervision of verified scholars, <strong className="font-semibold text-slate-900 dark:text-white">Al-Mukhtar Institute</strong> was established to preserve the classical depth of traditional Islamic seminaries while adopting modern pedagogical clarity and structured learning.
              </p>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                In today’s fast-paced world, learning sacred knowledge requires more than casual reading—it demands an unbroken chain of transmission (<em className="italic font-serif">Sanad</em>), close teacher mentorship, and an emphasis on spiritual discipline (<em className="italic font-serif">Tarbiyah</em>).
              </p>

              {/* Campus Visual */}
              <div className="my-5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900">
                <div className="relative h-56 sm:h-72 w-full">
                  <img
                    src={CampusImage}
                    alt="Al-Mukhtar Academic Campus"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-4">
                    <div className="text-white space-y-0.5">
                      <p className="text-xs font-bold font-heading">Al-Mukhtar Academic Facility</p>
                      <p className="text-[10.5px] text-slate-300 font-mono">Peshawar, Khyber Pakhtunkhwa — Classical lecture halls and Tajweed recitation studios.</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                From foundational modular tracks in Arabic syntax (<em className="italic font-serif">Nahw &amp; Sarf</em>) and Tajweed to advanced compendiums of Jurisprudence (<em className="italic font-serif">Fiqh</em>) and Hadith sciences, each program is structured to cultivate balanced individuals equipped with both classical mastery and contemporary understanding.
              </p>

              {/* Pull-Quote */}
              <div className="my-5 p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#0c1827] border-l-3 border-[#0F6E8C] dark:border-teal-400 border border-slate-200/80 dark:border-slate-800">
                <blockquote className="space-y-1.5">
                  <p className="text-xs sm:text-sm font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed">
                    "Knowledge is not merely the accumulation of facts; true knowledge is a light that illuminates the heart and translates into righteous conduct, humility, and sincere service to humanity."
                  </p>
                  <footer className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[#0F6E8C] dark:text-teal-400">
                    — Founding Principle of Al-Mukhtar
                  </footer>
                </blockquote>
              </div>
            </article>

            {/* SECTION 2: THE FOUR CORE PILLARS */}
            <article className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0F6E8C] dark:text-teal-400">
                  Educational Philosophy
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-0.5">
                  The Four Pillars of Our Curriculum
                </h2>
              </div>

              <div className="space-y-3 pt-1">
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <ShieldCheck size={16} />
                    <span>1. Classical Authenticity (Al-Asalah)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    Direct study of foundational classical treatises with verified chains of transmission under authorized scholars holding traditional Ijazahs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Layers size={16} />
                    <span>2. Modern Academic Structure (Al-Manhajiyyah)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    Structured modular curricula, clear syllabi, continuous assessments, and interactive digital resources tailored for modern learners.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <HeartHandshake size={16} />
                    <span>3. Holistic Character &amp; Ethics (At-Tarbiyah)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    Emphasis on personal integrity, humility, sincerity, and ethical conduct through continuous faculty mentorship.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Globe size={16} />
                    <span>4. Global Relevance &amp; Community Leadership</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    Equipping students to articulate Islamic values clearly and engage positively in contemporary societal discussions.
                  </p>
                </div>
              </div>
            </article>

            {/* SECTION 3: LEARNING METHODOLOGY */}
            <article className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0F6E8C] dark:text-teal-400">
                  Instructional Framework
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-0.5">
                  How Students Progress
                </h2>
              </div>

              <div className="space-y-3.5 border-l-2 border-[#0F6E8C]/30 dark:border-teal-500/30 pl-4 sm:pl-5 ml-2">
                <div className="relative space-y-1">
                  <div className="absolute -left-[21px] sm:-left-[25px] top-1.5 w-3 h-3 rounded-full bg-[#0F6E8C] border-2 border-white dark:border-[#070d18]" />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-heading">
                    Phase 1: Textual Foundation
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Direct reading and structural understanding of core primer texts in Arabic grammar and Tajweed rules.
                  </p>
                </div>

                <div className="relative space-y-1 pt-2">
                  <div className="absolute -left-[21px] sm:-left-[25px] top-3.5 w-3 h-3 rounded-full bg-[#0F6E8C] border-2 border-white dark:border-[#070d18]" />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-heading">
                    Phase 2: Scholarly Mentorship &amp; Oral Recitation
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Interactive recitation sessions and real-time pronunciation corrections directly by authorized faculty.
                  </p>
                </div>

                <div className="relative space-y-1 pt-2">
                  <div className="absolute -left-[21px] sm:-left-[25px] top-3.5 w-3 h-3 rounded-full bg-[#0F6E8C] border-2 border-white dark:border-[#070d18]" />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-heading">
                    Phase 3: Applied Jurisprudence &amp; Ethics
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Connecting classical legal maxims to modern real-world contexts and developing analytical skills.
                  </p>
                </div>

                <div className="relative space-y-1 pt-2">
                  <div className="absolute -left-[21px] sm:-left-[25px] top-3.5 w-3 h-3 rounded-full bg-teal-500 border-2 border-white dark:border-[#070d18]" />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-heading">
                    Phase 4: Formal Evaluation &amp; Certification
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Comprehensive examinations leading to authenticated certificates and recognized Ijazah diplomas.
                  </p>
                </div>
              </div>
            </article>

            {/* SECTION 4: CAMPUS & FACILITIES */}
            <article className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0F6E8C] dark:text-teal-400">
                  Infrastructure
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-0.5">
                  Learning Facilities &amp; Campus Resources
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Library size={15} />
                    <span>Reference Library</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Classical Arabic manuscripts, Tafseer compendiums, and contemporary Islamic journals.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Building2 size={15} />
                    <span>Recitation Studios</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Acoustic studios calibrated for phonetics training and oral Tajweed examinations.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Globe size={15} />
                    <span>Online Learning Portal</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Live interactive classrooms and recorded modular resources for distance scholars.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Users size={15} />
                    <span>Lecture Halls</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Spacious halls designed for academic symposia, guest seminars, and student gatherings.
                  </p>
                </div>
              </div>
            </article>

          </div>

          {/* Right Sidebar Column (4 Cols — Sticky Quick Info & Portals) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            
            {/* Quick Fact Sheet Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0c1827] border border-slate-200/90 dark:border-slate-800 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-mono text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                <FileCheck size={14} />
                <span>Quick Facts</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Campus Location:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">Peshawar, KPK</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Study Modes:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">On-Campus &amp; Online</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Core Disciplines:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">Tajweed, Arabic, Fiqh, Hadith</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Certification:</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400 text-right">Sanad &amp; Ijazah</span>
                </div>
              </div>
            </div>

            {/* Quick Portal Navigation Links */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0c1827] border border-slate-200/90 dark:border-slate-800 space-y-3 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-heading uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Explore Portals
              </h3>

              <div className="space-y-2">
                <Link
                  to="/teachers"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#0F6E8C] dark:hover:border-teal-400 transition-all text-xs font-bold text-slate-800 dark:text-slate-200 group"
                >
                  <span className="flex items-center gap-2">
                    <Users size={14} className="text-[#0F6E8C] dark:text-teal-400" />
                    <span>Faculty Directory</span>
                  </span>
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/courses"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#0F6E8C] dark:hover:border-teal-400 transition-all text-xs font-bold text-slate-800 dark:text-slate-200 group"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={14} className="text-[#0F6E8C] dark:text-teal-400" />
                    <span>Academic Courses</span>
                  </span>
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/students"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#0F6E8C] dark:hover:border-teal-400 transition-all text-xs font-bold text-slate-800 dark:text-slate-200 group"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-[#0F6E8C] dark:text-teal-400" />
                    <span>Alumni Directory</span>
                  </span>
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Admission Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white space-y-3 border border-slate-800 shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-300">
                  Admissions
                </span>
                <h4 className="text-sm font-bold font-heading">
                  Ready to Enroll?
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Admissions are currently open for upcoming on-campus and online cohorts.
                </p>
              </div>

              <div className="pt-1 flex flex-col gap-2">
                <Link
                  to="/apply"
                  className="inline-flex items-center justify-center gap-1.5 bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-xs font-bold py-2 px-4 rounded-xl transition-all text-center"
                >
                  <span>Apply Now</span>
                  <ArrowRight size={12} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold py-2 px-4 rounded-xl border border-white/10 transition-all text-center"
                >
                  <span>Contact Admissions</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default About;