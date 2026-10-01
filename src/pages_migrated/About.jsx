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
              About Al-Mukhtar
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              At Al-Mukhtar we are dedicated to nurturing a deeper understanding of Islam through quality Islamic education, Dars-e-Nizami programs, and short weekend courses. Learn, understand, and practice the teachings of Islam in your daily life.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-white/15">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/10 backdrop-blur-md">
                <span className="text-base sm:text-lg font-bold text-white font-heading block">3 Years</span>
                <span className="text-[9.5px] text-teal-300 font-mono uppercase">Tradition</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/10 backdrop-blur-md">
                <span className="text-base sm:text-lg font-bold text-teal-300 font-heading block">100+</span>
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

            {/* SECTION 1: GENESIS & MADRASA IDENTITY */}
            <article className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0F6E8C] dark:text-teal-400">
                  Madrasa Profile &amp; Mission
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-0.5">
                  Authentic Islamic Education &amp; Dars-e-Nizami
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                <strong className="font-semibold text-slate-900 dark:text-white">Al-Mukhtar</strong> is a dedicated Islamic Madrasa exclusively focused on teaching sacred Islamic courses and classical <strong className="font-semibold text-slate-900 dark:text-white">Dars-e-Nizami</strong>. Our institution stands committed to reviving traditional scholarly knowledge in an authentic, structured learning environment.
              </p>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                All programs and classes are conducted by qualified, certified Islamic scholars (<em className="italic font-serif">Alims</em>) who carry rigorous credentials and traditional sanad. Every student who completes their course successfully is awarded an official completion certificate recognized for its academic authenticity.
              </p>

              {/* Campus Visual */}
              <div className="my-5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900">
                <div className="relative h-56 sm:h-72 w-full">
                  <img
                    src={CampusImage}
                    alt="Al-Mukhtar Madrasa Campus"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-4">
                    <div className="text-white space-y-0.5">
                      <p className="text-xs font-bold font-heading">Al-Mukhtar Campus</p>
                      <p className="text-[10.5px] text-slate-300 font-mono flex items-center gap-1">
                        <MapPin size={12} className="text-teal-300 shrink-0" />
                        <span>Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar — On-Campus Study</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inclusivity & Target Audience Highlight */}
              <div className="p-4 sm:p-5 rounded-xl bg-teal-50/60 dark:bg-[#08202c] border border-teal-200/80 dark:border-teal-900/50 space-y-2">
                <h3 className="text-xs sm:text-sm font-bold text-[#0F6E8C] dark:text-teal-300 font-heading flex items-center gap-2">
                  <GraduationCap size={16} />
                  <span>Tailored for University Students, Professionals &amp; All Age Groups</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Our curriculum is uniquely structured to accommodate <strong className="font-semibold text-slate-900 dark:text-white">university students</strong> and <strong className="font-semibold text-slate-900 dark:text-white">working professionals</strong>. We believe seeking Islamic knowledge has <strong className="font-semibold text-slate-900 dark:text-white">no age limitation</strong>—whether young students starting out or elders seeking deep understanding, all learners are warmly welcomed and guided step-by-step.
                </p>
              </div>

              {/* Pull-Quote */}
              <div className="my-5 p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#0c1827] border-l-3 border-[#0F6E8C] dark:border-teal-400 border border-slate-200/80 dark:border-slate-800">
                <blockquote className="space-y-1.5">
                  <p className="text-xs sm:text-sm font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed">
                    "Seeking sacred knowledge is an obligation upon every Muslim. At Al-Mukhtar, we open the doors of traditional Islamic learning to professionals, students, and elders alike under the tutelage of certified scholars."
                  </p>
                  <footer className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[#0F6E8C] dark:text-teal-400">
                    — Al-Mukhtar Institutional Mission
                  </footer>
                </blockquote>
              </div>
            </article>

            {/* SECTION 2: CORE DISCIPLINES */}
            <article className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0F6E8C] dark:text-teal-400">
                  Curriculum &amp; Specializations
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-0.5">
                  Core Disciplines Taught at Al-Mukhtar
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Tajweed */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <BookOpen size={16} />
                    <span>1. Tajweed (تجويد)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Mastery of Quranic phonetics, correct Makharij (articulation points), and rhythmic recitation rules taught through direct oral transmission.
                  </p>
                </div>

                {/* Arabic */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Layers size={16} />
                    <span>2. Arabic Language (اللغة العربية)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Comprehensive study of classical Arabic grammar (<em className="font-serif">Nahw</em>) and morphology (<em className="font-serif">Sarf</em>) to read and comprehend sacred texts directly.
                  </p>
                </div>

                {/* Fiqh */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <ShieldCheck size={16} />
                    <span>3. Fiqh (الفقه الإسلامي)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Islamic Jurisprudence covering daily worship (Ibadat), financial transactions (Muamalat), family laws, and modern ethical dilemmas.
                  </p>
                </div>

                {/* Hadith */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <HeartHandshake size={16} />
                    <span>4. Hadith (الحديث النبوي)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Study of authentic prophetic traditions, sciences of narration (<em className="font-serif">Usul al-Hadith</em>), and moral character formation.
                  </p>
                </div>

                {/* Tafseer */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-1.5 sm:col-span-2">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Globe size={16} />
                    <span>5. Tafseer (تفسير القرآن الكريم)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Verse-by-verse Quranic exegesis, exploring linguistic nuances, historical context of revelation (Asbab al-Nuzul), and timeless guidance for living.
                  </p>
                </div>
              </div>
            </article>

            {/* SECTION 3: KEY PILLARS */}
            <article className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0F6E8C] dark:text-teal-400">
                  Academic Framework
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-0.5">
                  Why Study at Al-Mukhtar
                </h2>
              </div>

              <div className="space-y-3 pt-1">
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <CheckCircle2 size={16} />
                    <span>Certified Scholars &amp; Alims</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    Our faculty comprises professional, authorized Alims equipped with deep classical mastery and dedicated to individualized student mentorship.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Award size={16} />
                    <span>Verified Course Certification</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    Students receive authenticated completion certificates at the conclusion of their studies upon clearing formal assessments.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Users size={16} />
                    <span>Zero Age Restrictions — Open for Young &amp; Old</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    Age is never a barrier. Whether you are a school/university student, a busy professional, or a senior seeking Islamic enlightenment, our classes cater to all.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <MapPin size={16} />
                    <span>On-Campus Interactive Learning</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    Direct on-campus interaction located conveniently at Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar with conducive lecture spaces.
                  </p>
                </div>
              </div>
            </article>

            {/* SECTION 4: CAMPUS & FACILITIES */}
            <article className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0F6E8C] dark:text-teal-400">
                  Campus Facilities
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-0.5">
                  Our On-Campus Learning Environment
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Library size={15} />
                    <span>Islamic Reference Library</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Classical Arabic manuscripts, Tafseer compendiums, Hadith collections, and Fiqh treatises.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Building2 size={15} />
                    <span>Tajweed &amp; Recitation Rooms</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Dedicated quiet spaces for one-on-one phonetic pronunciation practice and oral evaluations.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Users size={15} />
                    <span>Dars-e-Nizami Lecture Halls</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Spacious traditional halls organized for scholar lectures, group discussions, and revision.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <MapPin size={15} />
                    <span>Peshawar Campus</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Conveniently situated at Ghaz Masjid, Tanga Adda, Landi Arbab, accessible to students from across Peshawar.
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
                <span>Institutional Factsheet</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Location:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Study Mode:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">On-Campus</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Faculty:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">Certified Scholars (Alims)</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Certification:</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400 text-right">Awarded Upon Completion</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Core Disciplines:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">Tajweed, Arabic, Fiqh, Hadith, Tafseer</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Eligibility / Age:</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400 text-right">No Age Limit (Young &amp; Old)</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Target Audience:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">Uni Students &amp; Professionals</span>
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
                    <span>Faculty Directory (Scholars)</span>
                  </span>
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/courses"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#0F6E8C] dark:hover:border-teal-400 transition-all text-xs font-bold text-slate-800 dark:text-slate-200 group"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={14} className="text-[#0F6E8C] dark:text-teal-400" />
                    <span>Islamic Courses &amp; Dars-e-Nizami</span>
                  </span>
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/students"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#0F6E8C] dark:hover:border-teal-400 transition-all text-xs font-bold text-slate-800 dark:text-slate-200 group"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-[#0F6E8C] dark:text-teal-400" />
                    <span>Alumni &amp; Graduates</span>
                  </span>
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Admission Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white space-y-3 border border-slate-800 shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-300">
                  On-Campus Admissions
                </span>
                <h4 className="text-sm font-bold font-heading">
                  Join Al-Mukhtar Madrasa
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Admissions are open for university students, professionals, and all age groups at Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar.
                </p>
              </div>

              <div className="pt-1 flex flex-col gap-2">
                <Link
                  to="/apply"
                  className="inline-flex items-center justify-center gap-1.5 bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-xs font-bold py-2 px-4 rounded-xl transition-all text-center"
                >
                  <span>Apply for Admission</span>
                  <ArrowRight size={12} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold py-2 px-4 rounded-xl border border-white/10 transition-all text-center"
                >
                  <span>Contact Campus Office</span>
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