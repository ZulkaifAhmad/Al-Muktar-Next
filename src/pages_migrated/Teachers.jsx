"use client";

import React, { useState, useMemo } from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  GraduationCap,
  BookOpen,
  Users,
  ArrowRight,
  ShieldCheck,
  X,
  ChevronRight,
  Sparkles,
  Quote,
  Building2,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Briefcase,
  Newspaper,
  Award,
  HeartHandshake,
  MapPin,
} from "lucide-react";
import { useTeachers } from "@/lib/queries";
import { FounderImage, DirectorImage, bg, getImageUrl } from "../assets/assets.js";

function Teachers() {
  const { data: apiTeachers = [], isLoading } = useTeachers();
  const activeTeachers = apiTeachers.filter((t) => t.status !== "inactive");

  const [activeModalTeacher, setActiveModalTeacher] = useState(null);
  const filteredTeachers = activeTeachers;

  return (
    <div className="bg-white dark:bg-[#070d18] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200 min-h-screen">

      {/* ── 1. HERO SECTION — Clean Institutional Header ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-9 sm:py-12 border-b border-slate-800/80">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={bg}
            alt="Faculty Background"
            className="w-full h-full object-cover object-center opacity-80 sm:opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/20" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-teal-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider font-mono border border-white/20">
            <Users size={11} className="text-teal-300" />
            <span>Faculty &amp; Scholarly Leadership</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-heading tracking-tight max-w-2xl">
            Meet Our Scholars &amp; Faculty
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed font-normal">
            Guided by qualified scholars with verified chains of transmission and dedicated pedagogical training.
          </p>
        </div>
      </section>

      {/* ── 2. FOUNDER & LEADERSHIP PROFILE (HIGH-VISIBILITY EDITORIAL DOSSIER) ── */}
      <section className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 text-left">
          <div className="space-y-0.5">
            <span className="text-[10.5px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-widest font-mono block">
              Founding Leadership
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
              Founder Profile &amp; Dossier
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md">
            Al-Mukhtar Leadership
          </span>
        </div>

        {/* Main 2-Column Academic Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start text-left">

          {/* Left Column: Prominent Portrait & Sticky Highlight Panel */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
            {/* Portrait Card */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-md bg-slate-900 group">
              <img
                src={FounderImage}
                alt="Mulana Muhammad Anwar — Founder & CEO"
                className="w-full h-80 sm:h-96 object-cover object-bottom transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent flex flex-col justify-end p-4">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#0F6E8C]/80 dark:bg-teal-500/80 text-white text-[10px] font-mono font-bold uppercase tracking-wider w-fit mb-1 shadow-sm">
                  Founder &amp; CEO
                </span>
                <p className="text-base font-bold font-heading text-white">Mulana Muhammad Anwar</p>
                <p className="text-[11px] text-teal-300 font-mono">Al-Mukhtar &bull; FAST-NUCES</p>
              </div>
            </div>

            {/* Primary Appointments Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1827] border border-slate-200/90 dark:border-slate-800 space-y-2.5 shadow-2xs">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#0F6E8C] dark:text-teal-400 block border-b border-slate-200 dark:border-slate-800 pb-1.5">
                Primary Appointments
              </span>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#0F6E8C] dark:text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Chief Executive Officer (CEO)</strong> — Al-Mukhtar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#0F6E8C] dark:text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Visiting Faculty Member</strong> — FAST-NUCES Peshawar</span>
                </li>
              </ul>
            </div>

            {/* Focus Areas Tags */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1827] border border-slate-200/90 dark:border-slate-800 space-y-2 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Focus Areas &amp; Research
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Islamic Studies",
                  "Seerat Studies",
                  "Media Communication",
                  "Youth Development",
                  "Islamic Thought",
                  "Religion & Society",
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: High-Visibility Scholarly Dossier */}
          <div className="lg:col-span-8 space-y-6">

            {/* Profile Header Block */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-50 via-teal-50/20 to-slate-50 dark:from-[#0c1827] dark:via-[#092230] dark:to-[#0c1827] border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-2xs">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0F6E8C]/10 dark:bg-teal-400/10 text-[#0F6E8C] dark:text-teal-300 text-[10.5px] font-mono font-bold uppercase tracking-wider border border-[#0F6E8C]/20 dark:border-teal-400/20">
                <Sparkles size={11} />
                <span>Founder &amp; Chief Executive Officer</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                Mulana Muhammad Anwar
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#0F6E8C] dark:text-teal-400 leading-relaxed">
                Scholar in Islamic Studies, Media Communication &amp; Seerat Studies
              </p>
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-start gap-2 text-xs sm:text-[13px] font-serif italic text-slate-700 dark:text-slate-300">
                <Quote size={16} className="text-[#0F6E8C] dark:text-teal-400 shrink-0 mt-0.5" />
                <p>
                  &ldquo;My academic journey represents an effort to bring together traditional Islamic scholarship and contemporary academic disciplines, particularly media, communication, and Seerat Studies.&rdquo;
                </p>
              </div>
            </div>

            {/* 1. Education & Qualifications */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <GraduationCap size={18} className="text-[#0F6E8C] dark:text-teal-400" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                  Education &amp; Qualifications
                </h3>
              </div>

              <div className="space-y-2.5">
                {/* Degree 1 */}
                <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      M.Phil. in Media Studies &amp; Mass Communication
                    </h4>
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      Postgraduate
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    A postgraduate degree focusing on media, communication, journalism, and the role of mass media in shaping society and public discourse.
                  </p>
                </div>

                {/* Degree 2 */}
                <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      M.Phil. in Seerat Studies
                    </h4>
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      Postgraduate
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Advanced academic study of the life, character, teachings, communication, leadership, and legacy of the Prophet Muhammad ﷺ.
                  </p>
                </div>

                {/* Degree 3 */}
                <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Kulliyyat al-Shariah (Faculty of Shariah)
                    </h4>
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      Jamia Tur Rasheed (Batch 5)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Graduated from the Faculty of Shariah, gaining comprehensive traditional Islamic education in Qur’an, Hadith, Fiqh, Islamic jurisprudence, Arabic, and other foundational Islamic sciences.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Currently Involved In */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <Briefcase size={18} className="text-[#0F6E8C] dark:text-teal-400" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                  Currently Involved In
                </h3>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    <CheckCircle2 size={15} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>Visiting Faculty Member — FAST-NUCES, Peshawar Campus</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 pl-6">
                    Serving as a Visiting Faculty Member at the FAST-NUCES Peshawar Campus, contributing to the academic and intellectual development of university students.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    <CheckCircle2 size={15} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>Chief Executive Officer (CEO) — Al-Mukhtar</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 pl-6">
                    Serving as the CEO of Al-Mukhtar, an organization committed to promoting knowledge, character, faith, and constructive engagement with contemporary society.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/50 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#0F6E8C] dark:text-teal-300">
                    Youth &amp; Societal Vision
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Through Al-Mukhtar, my aim is to contribute to the development of a generation that is grounded in Islamic values, intellectually capable, morally responsible, and prepared to meet the challenges of the modern world.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Professional Experience in Media & Journalism */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <Newspaper size={18} className="text-[#0F6E8C] dark:text-teal-400" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                  Professional Experience
                </h3>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  I have professional experience in both media and academia, allowing me to engage with contemporary issues from academic, journalistic, and Islamic perspectives.
                </p>

                {/* Media Organizations Worked With */}
                <div className="space-y-1.5">
                  <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Media Organizations Worked With:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
                      📰 Daily Mashriq, Peshawar
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
                      📰 Daily Islam, Karachi
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
                      📰 Daily Times, Peshawar
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  I have also contributed columns and articles to various newspapers, writing on social, religious, educational, intellectual, and contemporary issues. My experience in journalism and media has provided me with a strong understanding of public communication, media discourse, and the social influence of communications.
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-200 dark:border-slate-800">
                  Alongside my media career, my academic background in Media Studies, Mass Communication, and Seerat Studies, together with my traditional Islamic education from Jamia Tur Rasheed, has enabled me to work at the intersection of Islamic scholarship, contemporary education, media, and social development.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ── 3. A MESSAGE TO THE YOUTH (ELEVATED EXECUTIVE ADDRESS DOCUMENT) ── */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-[#0c1827] dark:to-[#070d18] border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 space-y-5 text-left shadow-sm">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0F6E8C] dark:text-teal-400 flex items-center gap-1.5">
                <HeartHandshake size={13} />
                <span>Executive Scholarly Address</span>
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                A Message to the Youth
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              By Mulana Muhammad Anwar &bull; Founder &amp; CEO, Al-Mukhtar
            </span>
          </div>

          <div className="space-y-3.5 text-xs sm:text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Dear Young Men and Women,
            </p>

            <p>
              You are not merely the future of our society—you are an important part of its present. The direction of our communities, our institutions, and our Ummah depends greatly on how you use the opportunities, knowledge, energy, and talents that Allah has blessed you with.
            </p>

            <p>
              Islam does not teach us to choose between faith and worldly achievement. Rather, Islam calls us to seek success in both: to build a strong relationship with Allah while becoming people of knowledge, character, excellence, and positive contribution.
            </p>

            <p>
              The life of the Prophet Muhammad ﷺ teaches us that faith should inspire action, knowledge should produce wisdom, and spirituality should lead to service. A successful Muslim is one who strives to become closer to Allah while also striving for excellence in education, profession, leadership, innovation, and service to humanity.
            </p>

            {/* Call to action guidance box */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="font-bold text-[#0F6E8C] dark:text-teal-400 text-xs sm:text-sm">
                Therefore, I encourage you to come forward:
              </p>
              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-[13px]">
                Pursue education with dedication. Develop your professional skills. Read, think, question, research, and create. Become competent in the fields that shape the modern world. At the same time, remain connected to the Qur’an, the Sunnah, Islamic values, and the noble character taught by the Prophet Muhammad ﷺ.
              </p>
              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-[13px]">
                Do not think that religious commitment is an obstacle to worldly success, nor that worldly success requires you to compromise your faith. True success is to excel in this world without losing sight of the Hereafter.
              </p>
            </div>

            <p>
              Our Ummah needs young people who are simultaneously faithful and capable, spiritually grounded and intellectually confident, morally upright and professionally excellent.
            </p>

            <p>
              Let your education serve a purpose. Let your profession become a means of benefit. Let your talents become a source of service. And let your success be measured not only by what you achieve for yourself, but also by what you contribute to your family, your society, your Ummah, and humanity.
            </p>

            <div className="p-3 rounded-xl bg-[#0F6E8C]/10 dark:bg-teal-950/40 border border-[#0F6E8C]/20 dark:border-teal-500/30 text-center sm:text-left">
              <p className="text-xs sm:text-sm font-bold text-[#0F6E8C] dark:text-teal-300">
                &ldquo;Dream greatly. Work sincerely. Learn continuously. Serve selflessly. And remain connected to Allah.&rdquo;
              </p>
            </div>

            <p>
              The world needs your talent, the Ummah needs your commitment, and your future is waiting for your effort. Step forward, take responsibility, and become a source of positive change.
            </p>

            {/* Quranic Ayah Citation */}
            <div className="py-2.5 px-4 my-2 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-1">
              <p className="font-serif italic text-xs sm:text-sm text-teal-200">
                &ldquo;And say: Do [righteous] deeds, for Allah will see your deeds, and so will His Messenger and the believers.&rdquo;
              </p>
              <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 block">
                — Qur’an 9:105
              </span>
            </div>

            <p className="text-xs font-semibold text-[#0F6E8C] dark:text-teal-400 pt-1">
              May Allah make our youth a generation of knowledge, faith, character, excellence, and service. Ameen.
            </p>
          </div>
        </div>

      </section>

      {/* ── 4. FACULTY ROSTER — Open Institutional Gallery (No Boxy Cards) ── */}
      <section className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-widest font-mono block">
              Faculty Directory
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
              Our Teachers
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Qualified scholars and instructors delivering authentic curricula across our programs.
            </p>
          </div>

          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md shrink-0 self-start sm:self-auto">
            Active Faculty: <strong className="text-[#0F6E8C] dark:text-teal-400">{activeTeachers.length}</strong>
          </div>
        </div>


        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2.5 animate-pulse">
                <div className="h-64 rounded-xl bg-slate-200 dark:bg-slate-800 w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTeachers.length === 0 && (
          <div className="py-10 text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <GraduationCap size={28} className="text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              No faculty records available at this time.
            </p>
          </div>
        )}

        {/* ── Open Editorial Faculty Roster (Prominent Portrait + Clean Minimal Meta) ── */}
        {!isLoading && filteredTeachers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {filteredTeachers.map((teacher, i) => (
              <div
                key={teacher._id || teacher.id || `faculty-${i}`}
                onClick={() => setActiveModalTeacher(teacher)}
                className="group flex flex-col space-y-2.5 cursor-pointer text-left"
              >
                {/* Prominent Large Portrait */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800">
                  <img
                    src={getImageUrl(teacher.image, DirectorImage)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DirectorImage;
                    }}
                    alt={teacher.name}
                    className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Clean Corner Department Tag */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-slate-950/80 backdrop-blur-md text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                      {teacher.department || "Faculty"}
                    </span>
                  </div>
                </div>

                {/* Open Clean Editorial Info (No card box) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors truncate">
                      {teacher.name}
                    </h3>
                    <span className="text-[10.5px] font-mono text-slate-400 shrink-0">
                      {teacher.experienceYears || "5+ Yrs"}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#0F6E8C] dark:text-teal-400 truncate">
                    {teacher.role}
                  </p>

                  {/* Specializations (Minimal text list) */}
                  {Array.isArray(teacher.specializations) && teacher.specializations.length > 0 && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {teacher.specializations.slice(0, 3).join(" • ")}
                    </p>
                  )}

                  {/* Clean Profile Link */}
                  <div className="pt-1 flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300">
                    <span>View Bio &amp; Credentials</span>
                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 5. CTA SECTION (Clean Non-Bulky Layout) ── */}
      <section className="bg-slate-900 text-white py-10 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <h2 className="text-lg sm:text-2xl font-bold font-heading tracking-tight">
            Begin Your Scholarly Journey at Al-Mukhtar
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-300 max-w-lg mx-auto leading-relaxed">
            Admissions are open for upcoming modular tracks and foundational certifications.
          </p>
          <div className="pt-2 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 max-w-xs sm:max-w-none mx-auto">
            <Link
              to="/apply"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-xs font-bold shadow-sm transition-all text-center"
            >
              <span>Apply Now</span>
              <ArrowRight size={12} className="hidden xs:inline" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 text-center"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SCHOLAR DETAILS MODAL (Clean Institutional Dossier View) ── */}
      {activeModalTeacher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
          onClick={() => setActiveModalTeacher(null)}
        >
          <div
            className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl max-w-xl w-full max-h-[90vh] shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300">
                Faculty Scholar Profile
              </span>
              <button
                type="button"
                onClick={() => setActiveModalTeacher(null)}
                className="p-1 rounded text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">

              {/* Profile Top Row */}
              <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={getImageUrl(activeModalTeacher.image, DirectorImage)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DirectorImage;
                  }}
                  alt={activeModalTeacher.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover object-top border border-slate-200 dark:border-slate-700 shrink-0"
                />

                <div className="space-y-0.5 flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-[#0F6E8C] dark:text-teal-400 uppercase font-bold">
                    {activeModalTeacher.department || "Faculty"}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading truncate">
                    {activeModalTeacher.name}
                  </h2>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
                    {activeModalTeacher.role}
                  </p>
                </div>
              </div>

              {/* Specs */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Teaching Experience</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {activeModalTeacher.experienceYears || "5+ Years"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Scholars Mentored</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {activeModalTeacher.studentsMentored || "200+"} Students
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Accreditation</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Verified Resident Faculty
                  </span>
                </div>
              </div>

              {/* Specializations */}
              {Array.isArray(activeModalTeacher.specializations) &&
                activeModalTeacher.specializations.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                      Academic Specializations
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {activeModalTeacher.specializations.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Bio */}
              {activeModalTeacher.bio && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                    Scholarly Bio
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeModalTeacher.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2 p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalTeacher(null)}
                className="py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer text-center"
              >
                Close
              </button>
              <Link
                to="/apply"
                className="py-1.5 text-xs font-bold bg-[#0F6E8C] text-white hover:bg-[#0B5C74] rounded-lg text-center"
              >
                Enroll Now
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Teachers;
