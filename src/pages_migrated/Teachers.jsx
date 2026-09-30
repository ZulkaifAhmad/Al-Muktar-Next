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
  Compass,
  CheckCircle2,
  Award,
  Layers,
  MapPin,
  Calendar,
  Star,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { useTeachers } from "@/lib/queries";
import { FounderImage, DirectorImage, GreenDecorationBg, bg, getImageUrl } from "../assets/assets.js";

/* ── Founder Credentials ── */
const founderQualifications = [
  { label: "M.Phil. in Media Studies & Mass Communication" },
  { label: "M.Phil. in Seerat Studies" },
  { label: "Kulliyyat al-Shariah — Jamia Tur Rasheed, Karachi (Batch 5)" },
  { label: "Visiting Faculty — FAST-NUCES, Peshawar" },
];

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
      
      {/* ── 1. HERO — Simple dark header matching Students/About pages ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-14 sm:py-18 border-b border-slate-800">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={bg}
            alt="Faculty Background"
            className="w-full h-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/80 to-[#07111e]/95" />
        </div>
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#0F6E8C]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-[11px] font-bold uppercase tracking-widest font-mono border border-white/10 mx-auto">
            <Users size={12} className="text-teal-400" />
            <span>Faculty &amp; Leadership</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight max-w-3xl mx-auto leading-tight">
            Meet Our Scholars &amp; Faculty
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Guided by qualified scholars with verified chains of transmission and modern pedagogical training.
          </p>
        </div>
      </section>

      {/* ── 2. FOUNDER PORTFOLIO — Clean, white bg, normal sizing ── */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left: Photo */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
              <img
                src={FounderImage}
                alt="Muhammad Anwar — Founder & CEO"
                className="w-full h-72 sm:h-80 object-cover object-bottom"
              />
            </div>
            {/* Quick info card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-wider font-mono">
                <Briefcase size={12} />
                <span>Current Roles</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-[#0F6E8C] dark:text-teal-400 shrink-0" />
                  <span>Founder &amp; CEO — Al-Mukhtar Institute</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-[#0F6E8C] dark:text-teal-400 shrink-0" />
                  <span>Visiting Faculty — FAST-NUCES, Peshawar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Bio content */}
          <div className="lg:col-span-8 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-widest font-mono">
                Founding Leadership
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                Muhammad Anwar
              </h2>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Dedicated to reviving the authentic classical methodology of traditional seminaries while synthesizing contemporary pedagogy to cultivate intellectually acute, morally grounded, and resilient leaders.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800">
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                &ldquo;Our mission is to ensure knowledge is paired with spiritual discipline, moral integrity, and practical relevance in the modern world.&rdquo;
              </p>
            </div>

            {/* Qualifications */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Education &amp; Qualifications
              </h3>
              <div className="space-y-2">
                {founderQualifications.map((q, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-[#0F6E8C]/10 dark:bg-[#0F6E8C]/20 text-[#0F6E8C] dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Award size={11} />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{q.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. THREE PILLARS — Consistent section style ── */}
      <section className="py-12 sm:py-16 bg-slate-50/70 dark:bg-[#08121f] border-y border-slate-200/80 dark:border-slate-800">
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

      {/* ── 4. FACULTY DIRECTORY — Redesigned cards ── */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section heading */}
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

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredTeachers.length === 0 && (
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
        )}

        {/* ── NEW Teacher Cards: Horizontal layout with larger photo ── */}
        {!isLoading && filteredTeachers.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredTeachers.map((teacher, i) => (
              <div
                key={teacher._id || teacher.id || `faculty-${i}`}
                onClick={() => setActiveModalTeacher(teacher)}
                className="group bg-white dark:bg-[#0c1827] rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#0F6E8C]/40 dark:hover:border-teal-500/30 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col sm:flex-row min-w-0 cursor-pointer"
              >
                {/* Photo side */}
                <div className="sm:w-44 sm:self-stretch shrink-0 bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
                  <img
                    src={getImageUrl(teacher.image, DirectorImage)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DirectorImage;
                    }}
                    alt={teacher.name}
                    className="w-full h-48 sm:h-full min-h-[180px] object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Info side */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3 min-w-0">
                  <div className="space-y-2.5 min-w-0">
                    {/* Department tag */}
                    {teacher.department && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase tracking-wider font-mono">
                        {teacher.department}
                      </span>
                    )}

                    {/* Name & role */}
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors truncate">
                        {teacher.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
                        {teacher.role}
                      </p>
                    </div>

                    {/* Quick stats */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono min-w-0 truncate">
                      <span className="flex items-center gap-1 shrink-0">
                        <Calendar size={10} />
                        {teacher.experienceYears || "5+ Years"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate">
                        <Users size={10} className="shrink-0" />
                        {teacher.studentsMentored || "200+"} Mentored
                      </span>
                    </div>

                    {/* Quote — using normal sans-serif font, no italic */}
                    {teacher.quote && (
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 min-w-0">
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal break-words">
                          &ldquo;{teacher.quote}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Specializations */}
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

                  {/* Footer action */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between min-w-0 gap-2">
                    <span className="text-[10px] font-mono text-slate-400 truncate">
                      Faculty Profile
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalTeacher(teacher);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0F6E8C] dark:text-teal-400 hover:underline cursor-pointer shrink-0"
                    >
                      <span>View Bio</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 5. CTA SECTION ── */}
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

      {/* ── SCHOLAR DETAILS MODAL (Full Screen on mobile, Wide on desktop) ── */}
      {activeModalTeacher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
          onClick={() => setActiveModalTeacher(null)}
        >
          <div
            className="bg-white dark:bg-[#0c1827] border-0 sm:border border-slate-200 dark:border-slate-800 rounded-none sm:rounded-2xl max-w-full sm:max-w-4xl w-full h-full sm:h-[88vh] sm:max-h-[88vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-0 sm:my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0F6E8C] shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300 truncate">
                  Faculty Scholar Profile
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalTeacher(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs font-semibold"
                title="Cancel and close"
                aria-label="Cancel and close"
              >
                <span>Cancel</span>
                <X size={17} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 custom-scrollbar">
              
              {/* Profile Main Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pb-5 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={getImageUrl(activeModalTeacher.image, DirectorImage)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DirectorImage;
                  }}
                  alt={activeModalTeacher.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-top border-2 border-slate-200 dark:border-slate-700 shadow-md shrink-0"
                />

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {activeModalTeacher.department && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0F6E8C]/10 text-[#0F6E8C] dark:text-teal-300 text-[11px] font-bold font-mono uppercase tracking-wider">
                        {activeModalTeacher.department}
                      </span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Faculty Member
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading truncate">
                    {activeModalTeacher.name}
                  </h2>

                  <p className="text-xs sm:text-sm font-semibold text-[#0F6E8C] dark:text-teal-400 truncate">
                    {activeModalTeacher.role}
                  </p>
                </div>
              </div>

              {/* 2-Column Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {/* Experience */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#0F6E8C] dark:text-teal-400" />
                    Teaching Experience
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {activeModalTeacher.experienceYears || "5+ Years"}
                  </p>
                </div>

                {/* Students Mentored */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Users size={12} className="text-[#0F6E8C] dark:text-teal-400" />
                    Students Mentored
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {activeModalTeacher.studentsMentored || "200+"} Scholars
                  </p>
                </div>

                {/* Verified Faculty Status */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-1 sm:col-span-2 md:col-span-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    Accreditation
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    Verified Resident Faculty
                  </p>
                </div>
              </div>

              {/* Specializations */}
              {Array.isArray(activeModalTeacher.specializations) &&
                activeModalTeacher.specializations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                      Areas of Academic Specialization
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeModalTeacher.specializations.map((spec, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200/80 dark:border-slate-700"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Scholarly Creed / Quote — Normal non-italic font */}
              {activeModalTeacher.quote && (
                <div className="p-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 space-y-1">
                  <span className="text-[10px] font-bold text-[#0F6E8C] dark:text-teal-300 font-mono uppercase tracking-wider block">
                    Scholarly Creed &amp; Teaching Philosophy
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal pt-1">
                    &ldquo;{activeModalTeacher.quote}&rdquo;
                  </p>
                </div>
              )}

              {/* Academic Background / Bio */}
              {activeModalTeacher.bio && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                    Academic Background &amp; Profile
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {activeModalTeacher.bio}
                    </p>
                  </div>
                </div>
              )}

              {/* Pedagogical Rigor Note */}
              <div className="p-4 rounded-xl bg-[#0F6E8C]/5 dark:bg-[#0F6E8C]/10 border border-[#0F6E8C]/15 dark:border-[#0F6E8C]/20 space-y-1.5">
                <span className="text-[10.5px] font-bold text-[#0F6E8C] dark:text-teal-300 uppercase font-mono tracking-wider block">
                  Pedagogical Standards at Al-Mukhtar
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  All faculty members undergo rigorous scholarly vetting and maintain continuous instructional development to ensure authentic transmission of Islamic sciences alongside engaging contemporary teaching methodologies.
                </p>
              </div>

            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalTeacher(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <div className="flex items-center gap-2.5 ml-auto">
                <Link
                  to="/apply"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F6E8C] text-white text-xs font-bold hover:bg-[#0B5C74] shadow-xs transition-all"
                >
                  <span>Enroll in Course</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Teachers;
