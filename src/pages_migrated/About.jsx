"use client";

import React from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  BookOpen,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Building2,
  Quote,
  Check,
  Compass,
  Library,
  Layers,
  HeartHandshake,
  Clock,
  ChevronRight,
} from "lucide-react";
import { CampusImage, GreenDecorationBg } from "../assets/assets.js";


const corePillars = [
  {
    icon: ShieldCheck,
    title: "Classical Authenticity",
    description:
      "Grounded in verified transmission chains (Sanad) and classical foundational texts under authoritative scholarship.",
  },
  {
    icon: Layers,
    title: "Modern Academic Rigor",
    description:
      "Structured syllabi, modular assessments, and critical thinking methodologies adapted for contemporary students.",
  },
  {
    icon: HeartHandshake,
    title: "Holistic Character (Tarbiyah)",
    description:
      "Knowledge paired with spiritual discipline, moral integrity, humility, and community leadership ethos.",
  },
  {
    icon: Globe,
    title: "Global Reach & Relevance",
    description:
      "Equipping graduates to serve as principled educators, researchers, and counselors in communities worldwide.",
  },
];

const methodologySteps = [
  {
    number: "01",
    title: "Textual Immersion",
    desc: "Direct study of foundational classical treatises in Arabic grammar, Fiqh, Usul, Hadith, and Tajweed.",
  },
  {
    number: "02",
    title: "Scholarly Mentorship",
    desc: "One-on-one tutorial sessions and oral recitation examinations with verified resident scholars.",
  },
  {
    number: "03",
    title: "Applied Ethics & Context",
    desc: "Synthesizing timeless Shariah principles with contemporary legal, economic, and social challenges.",
  },
  {
    number: "04",
    title: "Certification & Ijazah",
    desc: "Awarding authenticated diplomas and continuous chains of transmission upon rigorous evaluation.",
  },
];

const campusFacilities = [
  {
    title: "Scholarly Reference Library",
    desc: "Curated collection of classical Arabic lexicons, Tafseer compendiums, and modern Islamic jurisprudence journals.",
  },
  {
    title: "Acoustic Recitation Chambers",
    desc: "Dedicated Tajweed studios designed for precise phonetic articulation and oral recitation training.",
  },
  {
    title: "Interactive Digital Portal",
    desc: "High-definition live streaming and archived modular repository for distance learning scholars.",
  },
  {
    title: "Seminar & Discourse Halls",
    desc: "Modern lecture spaces equipped for academic symposia, research workshops, and guest lectures.",
  },
];

function About() {
  return (
    <div className="bg-white dark:bg-[#070d18] font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* ── 1. INSTITUTIONAL HERO SECTION ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-12 sm:py-16 border-b border-slate-800">
        {/* Background Green Leaves Image & Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={GreenDecorationBg}
            alt="Islamic Academic Heritage"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#091E2D]/85 via-slate-950/70 to-[#0D2E45]/90" />
        </div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8FB3AA_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none z-0" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#0F6E8C]/25 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#8FB3AA] text-[11px] font-bold uppercase tracking-widest font-mono border border-white/10">
              <Sparkles size={12} className="text-[#8FB3AA]" />
              <span>Institutional Profile</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight">
              About Al-Mukhtar Institute
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              An established sanctuary of classical Islamic sciences and modern academic inquiry — dedicated to preserving authentic scholarship, cultivating principled character, and preparing leaders for the global community.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-xs">
                <span className="text-lg sm:text-xl font-black text-white font-heading block">15+ Years</span>
                <span className="text-[10.5px] text-[#8FB3AA] font-mono uppercase">Academic Tradition</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-xs">
                <span className="text-lg sm:text-xl font-black text-[#8FB3AA] font-heading block">3,500+</span>
                <span className="text-[10.5px] text-slate-300 font-mono uppercase">Scholarly Alumni</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-xs">
                <span className="text-lg sm:text-xl font-black text-white font-heading block">100%</span>
                <span className="text-[10.5px] text-[#8FB3AA] font-mono uppercase">Verified Sanad</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-xs">
                <span className="text-lg sm:text-xl font-black text-[#8FB3AA] font-heading block">Global</span>
                <span className="text-[10.5px] text-slate-300 font-mono uppercase">Accredited Syllabi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FOUNDATIONAL HISTORY & IDENTITY ── */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Campus Image & Inception Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
              <img
                src={CampusImage}
                alt="Al-Mukhtar Institute Campus"
                className="w-full h-64 sm:h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091E2D]/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-white space-y-0.5">
                  <p className="text-xs font-bold font-heading">Al-Mukhtar Academic Campus</p>
                  <p className="text-[10px] text-[#8FB3AA] font-mono">Peshawar, Khyber Pakhtunkhwa</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 text-xs font-bold font-mono uppercase">
                <Compass size={14} />
                <span>Foundational Inception</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Established under the guidance of senior scholars, Al-Mukhtar Institute was founded to revive the authentic methodology of traditional Islamic seminaries while utilizing modern pedagogical tools.
              </p>
            </div>
          </div>

          {/* Right Column: Mission & Vision */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-widest font-mono block">
                Vision &amp; Mission
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                Preserving Sacred Knowledge, Inspiring Principled Action
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              At Al-Mukhtar, education is not merely the transmission of abstract facts; it is a transformative spiritual journey. We believe that authentic scholarship must cultivate humility, intellectual acuity, and empathetic leadership.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-[#0F6E8C]/10 text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-heading">
                    Our Mission
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    To provide rigorous, accessible, and structured Islamic education anchored in classical texts, supervised by verified scholars, and relevant to modern intellectual questions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Globe size={16} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-heading">
                    Our Vision
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    To be a globally recognized center of learning that graduates principled scholars, teachers, and leaders capable of uplifting Muslim communities worldwide with wisdom and authenticity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. CORE INSTITUTIONAL PILLARS ── */}
      <section className="py-12 sm:py-16 bg-slate-50/70 dark:bg-[#08121f] border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-widest font-mono block">
              Core Principles
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
              The Four Pillars of Al-Mukhtar
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              The timeless educational philosophy that defines our institution across every course and curriculum.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {corePillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-[#0c1827] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0F6E8C]/10 dark:bg-[#0F6E8C]/20 text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. PEDAGOGY & METHODOLOGY ── */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-widest font-mono block">
            Academic Pedagogy
          </span>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
            How Knowledge is Cultivated
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            A step-by-step instructional model that preserves classical mastery while developing contemporary analytical skill.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {methodologySteps.map((step, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800/90 shadow-2xs space-y-2 relative"
            >
              <span className="text-2xl font-black text-[#0F6E8C]/30 dark:text-teal-400/30 font-heading block">
                {step.number}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. CAMPUS & LEARNING ENVIRONMENT ── */}
      <section className="py-12 sm:py-16 bg-slate-50/70 dark:bg-[#08121f] border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-widest font-mono block">
              Infrastructure
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
              Learning Facilities &amp; Campus
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Modern academic infrastructure designed to cultivate focus, reflection, and rigorous scholarship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {campusFacilities.map((fac, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c1827] border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-[#0F6E8C]/10 text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 size={16} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {fac.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. DEDICATED SECTIONS EXPLORER (Faculty, Alumni, Courses) ── */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-widest font-mono block">
            Explore Further
          </span>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
            Discover Our Community
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Meet the scholars directing our curricula and read about the global impact of our graduates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Teachers */}
          <Link
            to="/teachers"
            className="group p-5 rounded-2xl bg-white dark:bg-[#0c1827] border border-slate-200/90 dark:border-slate-800 hover:border-[#0F6E8C] dark:hover:border-teal-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0F6E8C]/10 text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users size={18} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors">
                Faculty &amp; Resident Scholars
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Meet our founding Mufti, senior professors, and Tajweed instructors who guide students daily.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F6E8C] dark:text-teal-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>View Faculty Directory</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Students */}
          <Link
            to="/students"
            className="group p-5 rounded-2xl bg-white dark:bg-[#0c1827] border border-slate-200/90 dark:border-slate-800 hover:border-[#0F6E8C] dark:hover:border-teal-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <GraduationCap size={18} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors">
                Alumni &amp; Graduates
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Discover where our alumni stand today across international pulpits, universities, and organizations.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F6E8C] dark:text-teal-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>View Alumni Stories</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Courses */}
          <Link
            to="/courses"
            className="group p-5 rounded-2xl bg-white dark:bg-[#0c1827] border border-slate-200/90 dark:border-slate-800 hover:border-[#0F6E8C] dark:hover:border-teal-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen size={18} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors">
                Academic Curricula
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Explore our accredited programs in Tajweed, Arabic syntax, Hadith studies, and Islamic jurisprudence.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F6E8C] dark:text-teal-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Explore Programs</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* ── 7. INSTITUTIONAL CTA ── */}
      <section className="bg-gradient-to-r from-[#091E2D] to-[#0D2E45] text-white py-12 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight">
            Begin Your Scholarly Journey at Al-Mukhtar
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Admissions are open for upcoming modular tracks and foundational certifications. Apply online or contact our admissions office.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-xs font-bold shadow-md transition-all hover:scale-105"
            >
              <span>Apply for Admission</span>
              <ArrowRight size={13} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15"
            >
              <span>Contact Admissions</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;