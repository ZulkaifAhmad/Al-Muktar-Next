"use client";

import React, { useState, useMemo } from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  GraduationCap,
  BookOpen,
  Search,
  Users,
  ArrowRight,
  ShieldCheck,
  X,
  ChevronRight,
  Sparkles,
  Quote,
  Building2,
  ScrollText,
  Compass,
  CheckCircle2,
  Award,
  Layers,
} from "lucide-react";
import { useTeachers } from "@/lib/queries";
import { FounderImage, DirectorImage, GreenDecorationBg, getImageUrl } from "../assets/assets.js";

const founderPillars = [
  {
    icon: ShieldCheck,
    step: "01",
    title: "Classical Shariah Rigor",
    institution: "Jamia Tur Rasheed, Karachi",
    desc: "Grounded in traditional Dars-e-Nizami, Usul-ul-Fiqh, and classical Hadith transmission under senior scholarship.",
  },
  {
    icon: Layers,
    step: "02",
    title: "Contemporary Pedagogy",
    institution: "Visiting Faculty, FAST-NUCES",
    desc: "Integrating modern academic methodologies, media communication, and critical thinking for university students.",
  },
  {
    icon: Compass,
    step: "03",
    title: "Tarbiyah & Leadership",
    institution: "Al-Mukhtar Institute",
    desc: "Mentoring youth to synthesize sacred values with professional excellence, integrity, and community service.",
  },
];

function Teachers() {
  const { data: apiTeachers = [], isLoading } = useTeachers();
  const activeTeachers = apiTeachers.filter((t) => t.status !== "inactive");

  const [selectedDept, setSelectedDept] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalTeacher, setActiveModalTeacher] = useState(null);

  // Unique departments
  const departments = useMemo(() => {
    const depts = new Set();
    activeTeachers.forEach((t) => {
      if (t.department) depts.add(t.department);
    });
    return Array.from(depts);
  }, [activeTeachers]);

  // Filtered teachers list
  const filteredTeachers = useMemo(() => {
    return activeTeachers.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        t.name?.toLowerCase().includes(q) ||
        t.role?.toLowerCase().includes(q) ||
        t.department?.toLowerCase().includes(q) ||
        (Array.isArray(t.specializations) &&
          t.specializations.some((s) => s.toLowerCase().includes(q)));

      const matchesDept =
        selectedDept === "all" || t.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [activeTeachers, searchQuery, selectedDept]);

  return (
    <div className="bg-white dark:bg-[#070d18] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200 min-h-screen">
      
      {/* ── 1. FOUNDER & LEADERSHIP HERO CARD (Clean, Professional & Compact) ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-12 sm:py-16 border-b border-slate-800">
        {/* Subtle Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={GreenDecorationBg}
            alt="Islamic Academic Heritage"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-[#07111e]" />
        </div>
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#0F6E8C]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Executive Bio & Mission */}
            <div className="lg:col-span-8 space-y-4 text-left order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-[11px] font-bold uppercase tracking-widest font-mono border border-white/10">
                <Sparkles size={12} className="text-teal-400" />
                <span>Founding Leadership</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight leading-tight">
                  Muhammad Anwar
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-teal-300 font-mono">
                  Founder &amp; CEO, Al-Mukhtar • Visiting Faculty, FAST-NUCES Peshawar
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-200 space-y-1 backdrop-blur-xs">
                <span className="text-[10px] font-bold text-teal-400 uppercase font-mono tracking-wider block">
                  Dual Academic Synthesis
                </span>
                <p className="leading-relaxed">
                  Classical Shariah Scholar <span className="text-teal-400 font-bold mx-1">✕</span> Modern Media, Seerat Studies &amp; University Pedagogy
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Dedicated to reviving the authentic classical methodology of traditional seminaries while synthesizing contemporary pedagogy to cultivate intellectually acute, morally grounded, and resilient leaders.
              </p>

              <blockquote className="text-xs sm:text-sm text-slate-200 font-serif italic border-l-2 border-teal-500 pl-3.5 py-0.5 max-w-2xl">
                "Our mission is to ensure knowledge is paired with spiritual discipline, moral integrity, and practical relevance in the modern world."
              </blockquote>
            </div>

            {/* Right Column: Executive Portrait */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative w-full max-w-[240px] sm:max-w-[270px]">
                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900">
                  <img
                    src={FounderImage}
                    alt="Muhammad Anwar — Founder & CEO"
                    className="w-full h-72 sm:h-80 object-cover object-top"
                  />
                  <div className="p-3 bg-slate-950/90 border-t border-white/10 text-center">
                    <span className="text-xs font-bold text-white block font-heading">
                      Muhammad Anwar
                    </span>
                    <span className="text-[10px] text-teal-400 font-mono">
                      Jamia Tur Rasheed • FAST-NUCES
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. ACADEMIC FOUNDATIONS & PATHWAY (3 Compact Sections) ── */}
      <section className="py-10 sm:py-14 bg-slate-50/70 dark:bg-[#08121f] border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-xs font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-widest font-mono block">
              Educational Philosophy
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
              The Three Pillars of Our Scholarship
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {founderPillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-[#0c1827] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-[#0F6E8C]/10 text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center">
                        <Icon size={18} />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-600">
                        {pillar.step}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading">
                      {pillar.title}
                    </h3>
                    <p className="text-[11px] font-mono text-[#0F6E8C] dark:text-teal-400">
                      {pillar.institution}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. RESIDENT FACULTY DIRECTORY & MODERN TEACHER CARDS ── */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-widest font-mono block">
              Faculty Directory
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
              Resident Scholars &amp; Teachers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Meet the qualified scholars and instructors who deliver authentic curricula across our academic programs.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl shrink-0">
            Active Faculty: <strong className="text-[#0F6E8C] dark:text-teal-400">{activeTeachers.length}</strong>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedDept("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedDept === "all"
                  ? "bg-[#0F6E8C] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All Departments ({activeTeachers.length})
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedDept === dept
                    ? "bg-[#0F6E8C] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px] sm:min-w-[260px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Modern & Professional Teacher Cards Grid */}
        {filteredTeachers.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-2">
            <GraduationCap size={30} className="text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No faculty records match your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDept("all");
              }}
              className="text-xs text-[#0F6E8C] dark:text-teal-400 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTeachers.map((teacher, i) => (
              <div
                key={teacher._id || teacher.id || `faculty-${i}`}
                className="bg-white dark:bg-[#0c1827] rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#0F6E8C]/50 dark:hover:border-teal-400/50 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={getImageUrl(teacher.image, DirectorImage)}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DirectorImage;
                      }}
                      alt={teacher.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover object-top border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0 group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-wider font-mono block truncate">
                        {teacher.department}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading truncate group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors">
                        {teacher.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">
                        {teacher.role}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-1">
                        <span>{teacher.experienceYears || "5+ Years"}</span>
                        <span>•</span>
                        <span>{teacher.studentsMentored || "200+"} Mentored</span>
                      </div>
                    </div>
                  </div>

                  {teacher.quote && (
                    <blockquote className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2 bg-slate-50/90 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed font-serif">
                      "{teacher.quote}"
                    </blockquote>
                  )}

                  {Array.isArray(teacher.specializations) &&
                    teacher.specializations.length > 0 && (
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
                    Faculty Profile
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveModalTeacher(teacher)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0F6E8C] dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    <span>View Bio</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 4. SCHOLAR DETAILS MODAL DIALOG ── */}
      {activeModalTeacher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setActiveModalTeacher(null)}
        >
          <div
            className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={getImageUrl(activeModalTeacher.image, DirectorImage)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DirectorImage;
                  }}
                  alt={activeModalTeacher.name}
                  className="w-14 h-14 rounded-xl object-cover object-top border border-slate-200 dark:border-slate-700 shadow-xs"
                />
                <div>
                  <span className="text-[10px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase font-mono">
                    {activeModalTeacher.department}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                    {activeModalTeacher.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {activeModalTeacher.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalTeacher(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[9.5px] text-slate-400 uppercase font-mono block">Experience</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activeModalTeacher.experienceYears || "—"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[9.5px] text-slate-400 uppercase font-mono block">Students Mentored</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activeModalTeacher.studentsMentored || "—"}
                </span>
              </div>
            </div>

            {activeModalTeacher.quote && (
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/40 space-y-0.5">
                <span className="text-[9.5px] font-bold text-[#0F6E8C] dark:text-teal-300 font-mono uppercase tracking-wider block">
                  Scholarly Creed
                </span>
                <p className="text-xs font-serif italic text-slate-700 dark:text-slate-200 leading-relaxed">
                  "{activeModalTeacher.quote}"
                </p>
              </div>
            )}

            {activeModalTeacher.bio && (
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                  Academic Background
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeModalTeacher.bio}
                </p>
              </div>
            )}

            {Array.isArray(activeModalTeacher.specializations) &&
              activeModalTeacher.specializations.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                    Specializations
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {activeModalTeacher.specializations.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveModalTeacher(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/apply"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F6E8C] text-white text-xs font-bold hover:bg-[#0B5C74]"
              >
                <span>Enroll in Course</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teachers;
