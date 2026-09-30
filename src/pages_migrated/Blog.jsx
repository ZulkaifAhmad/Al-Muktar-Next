"use client";

import React, { useState, useMemo, useRef } from "react";
import { useBlogs } from "@/lib/queries";
import { Link, useSearchParams } from "@/lib/navigation-adapter";
import api from "@/lib/api";
import {
  Search,
  List as ListIcon,
  LayoutGrid,
  Sparkles,
  ArrowRight,
  Eye,
  Mail,
  X,
  BookOpen,
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Tag,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import BlogCard, { getReadingTime, calculateReadingStats, getSnippet, getBlogImage, formatDate } from "../components/BlogCard.jsx";
import ApiErrorState from "../components/ApiErrorState.jsx";
import { LogoImg } from "../assets/assets.js";
import { toast } from "react-toastify";

const BLOGS_PER_PAGE = 24;

function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const articlesSectionRef = useRef(null);

  const {
    data: blogs = [],
    isLoading,
    isError,
    refetch,
  } = useBlogs();

  // Extract dynamic categories with counts (capped to at most 5 buttons total: All + top 4)
  const displayedCategories = useMemo(() => {
    const counts = {};
    blogs.forEach((b) => {
      const subject = b.subject ? b.subject.trim() : "General";
      counts[subject] = (counts[subject] || 0) + 1;
    });

    // Sort subjects by count descending
    const sortedSubjects = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

    // Take top 4 categories
    let topCategories = sortedSubjects.slice(0, 4);

    // If active category is selected but not in top 4, include it
    if (
      selectedCategory !== "All" &&
      !topCategories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase()) &&
      counts[selectedCategory]
    ) {
      topCategories = [...topCategories.slice(0, 3), selectedCategory];
    }

    const result = { All: blogs.length };
    topCategories.forEach((cat) => {
      result[cat] = counts[cat] || 0;
    });

    return result;
  }, [blogs, selectedCategory]);

  // Latest publication for hero spotlight card (most recent createdAt)
  const latestBlog = useMemo(() => {
    if (!blogs || blogs.length === 0) return null;
    return [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
  }, [blogs]);

  // Extract popular tags
  const activeTags = useMemo(() => {
    const subjects = new Set();
    blogs.forEach((b) => {
      if (b.subject) subjects.add(b.subject.trim());
    });
    return Array.from(subjects).slice(0, 8);
  }, [blogs]);

  // Filter & Sort blogs
  const filteredBlogs = useMemo(() => {
    let result = [...blogs];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (b) => (b.subject || "General").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b) => {
        const titleMatch = (b.title || "").toLowerCase().includes(q);
        const subjectMatch = (b.subject || "").toLowerCase().includes(q);
        const descriptionMatch = (b.description || "").toLowerCase().includes(q);
        const contentMatch = (b.content || "").toLowerCase().includes(q);
        return titleMatch || subjectMatch || descriptionMatch || contentMatch;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "views") return (b.views || 0) - (a.views || 0);
      if (sortBy === "readTime") {
        return calculateReadingStats(a).seconds - calculateReadingStats(b).seconds;
      }
      return 0;
    });

    return result;
  }, [blogs, selectedCategory, searchQuery, sortBy]);

  // Pagination calculation: 24 blogs per page
  const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedBlogs = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * BLOGS_PER_PAGE;
    return filteredBlogs.slice(startIndex, startIndex + BLOGS_PER_PAGE);
  }, [filteredBlogs, safeCurrentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === safeCurrentPage) return;
    setCurrentPage(page);
    if (articlesSectionRef.current) {
      const yOffset = -80;
      const element = articlesSectionRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPaginationRange = (current, total) => {
    const delta = 1;
    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (current - delta > 2) {
      range.unshift("...");
    }
    if (current + delta < total - 1) {
      range.push("...");
    }
    range.unshift(1);
    if (total > 1) {
      range.push(total);
    }
    return range;
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  const latestBlogImage = latestBlog ? getBlogImage(latestBlog) : null;

  return (
    <div className="bg-white dark:bg-[#070d18] min-h-screen font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Modern Redesigned Hero Section */}
      <section className="relative bg-gradient-to-b from-[#F0F7F5] via-[#F8FBFA] to-white dark:from-[#081524] dark:via-[#0a1727] dark:to-[#070d18] border-b border-slate-200/80 dark:border-slate-800/80 pt-8 sm:pt-12 pb-10 sm:pb-12 overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0F6E8C]/5 dark:bg-[#0F6E8C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-teal-200/20 dark:bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Subtitle & Interactive Search */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 text-[10.5px] font-bold text-[#0F6E8C] dark:text-teal-300 font-mono tracking-wider uppercase shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#0F6E8C] dark:bg-teal-400 animate-pulse" />
                <span>Al-Mukhtar Journal &amp; Academic Archive</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading leading-[1.2]">
                Scholarly Insights &amp; <span className="text-[#0F6E8C] dark:text-[#38BDF8]">Islamic Reflections</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl">
                Explore in-depth Quranic commentaries, Arabic linguistics, classical jurisprudence essays, and academic campus announcements curated by certified faculty.
              </p>

              {/* Integrated Hero Search Bar */}
              <div className="pt-2 max-w-lg">
                <div className="relative flex items-center bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-700/80 focus-within:border-[#0F6E8C] dark:focus-within:border-[#38BDF8] focus-within:ring-2 focus-within:ring-[#0F6E8C]/15 dark:focus-within:ring-[#38BDF8]/20 rounded-xl shadow-xs transition-all p-1">
                  <Search className="ml-3 w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search articles by title, subject, or keyword..."
                    className="w-full px-3 py-2 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setCurrentPage(1);
                      }}
                      className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Topic Chips below Search */}
                {activeTags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Popular:</span>
                    {activeTags.slice(0, 4).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleCategorySelect(tag)}
                        className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#0F6E8C] dark:hover:text-[#38BDF8] text-[11px] font-medium transition-colors cursor-pointer shadow-2xs"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Credibility Trust Strip */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#0F6E8C] dark:text-teal-400" />
                  Verified Scholarship
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#0F6E8C] dark:text-teal-400" />
                  Peer-Reviewed
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#0F6E8C] dark:text-teal-400" />
                  Open Academic Archive
                </span>
              </div>
            </div>

            {/* Right Column: Latest Publication Spotlight Card */}
            <div className="lg:col-span-5">
              {latestBlog ? (
                <div className="relative group bg-white dark:bg-[#0c1827] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-[#0F6E8C]/60 dark:hover:border-teal-500/50 hover:shadow-md transition-all duration-300 overflow-hidden p-3.5">
                  {/* Spotlight Top Badge: Latest Publication */}
                  <div className="flex items-center justify-between pb-2.5">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-[#0F6E8C] dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60 text-[10px] font-bold font-mono uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-[#0F6E8C] dark:text-teal-300" />
                      <span>Latest Publication</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        {getReadingTime(latestBlog)}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        {latestBlog.views || 1}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Banner with properly framed fallback */}
                  <Link
                    to={`/blog/${latestBlog.slug || latestBlog._id}`}
                    className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 block group/img"
                  >
                    {latestBlogImage ? (
                      <img
                        src={latestBlogImage}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = LogoImg;
                          e.currentTarget.className = "max-h-24 max-w-[75%] object-contain m-auto drop-shadow-2xs";
                        }}
                        alt={latestBlog.title}
                        className="w-full h-full object-cover group-hover/img:scale-104 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-slate-100 dark:from-slate-800 via-teal-50/40 dark:via-slate-800/60 to-slate-50 dark:to-slate-900 flex items-center justify-center p-4">
                        <img
                          src={LogoImg}
                          alt="Al-Mukhtar Institute"
                          className="max-h-24 max-w-[75%] object-contain drop-shadow-2xs group-hover/img:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/80 dark:bg-black/80 text-white backdrop-blur-xs shadow-2xs font-mono">
                        <Tag className="w-2.5 h-2.5 text-teal-300" />
                        {latestBlog.subject || "General"}
                      </span>
                    </div>
                  </Link>

                  {/* Content snippet */}
                  <div className="pt-3 space-y-1.5">
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      <span>Al-Mukhtar Institute</span> · <span>{formatDate(latestBlog.createdAt)}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0F6E8C] dark:group-hover:text-teal-400 transition-colors line-clamp-2 font-heading leading-snug">
                      <Link to={`/blog/${latestBlog.slug || latestBlog._id}`}>
                        {latestBlog.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                      {latestBlog.description || getSnippet(latestBlog.content, 120)}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">New Release</span>
                      <Link
                        to={`/blog/${latestBlog.slug || latestBlog._id}`}
                        className="inline-flex items-center gap-1 font-bold text-[#0F6E8C] dark:text-teal-400 group-hover:gap-1.5 transition-all"
                      >
                        <span>Read Publication</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#0c1827] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0">
                      <img src={LogoImg} alt="Al-Mukhtar Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-slate-900 dark:text-white">Al-Mukhtar Institute</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Center for Quranic &amp; Islamic Studies</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Advancing high standards of Islamic academic research, Quranic recitation mastery, and classical Arabic linguistics.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6">
          {/* Category Pills & Toolbar Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            {/* Category Pills (Horizontal Scroll) - Capped to at most 5 buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-nowrap whitespace-nowrap">
              {Object.entries(displayedCategories).map(([cat, count]) => {
                const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#0F6E8C] dark:bg-teal-600 text-white shadow-2xs font-bold"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort & View Options */}
            <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 dark:text-slate-500 text-[11px] hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold outline-none cursor-pointer transition-colors border border-transparent dark:border-slate-700 focus:border-[#0F6E8C] dark:focus:border-teal-400"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="views">Most Viewed</option>
                  <option value="readTime">Quick Reads</option>
                </select>
              </div>

              {/* View Switcher Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-700 text-[#0F6E8C] dark:text-teal-300 shadow-2xs font-bold"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                  title="Grid View (3-4 cards per row)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white dark:bg-slate-700 text-[#0F6E8C] dark:text-teal-300 shadow-2xs font-bold"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                  title="List View (2 per row)"
                >
                  <ListIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Full Width Grid / List Section */}
          <div ref={articlesSectionRef} className="w-full space-y-8 pt-2">
            {isLoading && (
              <div
                className={
                  viewMode === "list"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
                    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
                }
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) =>
                  viewMode === "list" ? (
                    <div
                      key={n}
                      className="p-0 sm:p-4 rounded-none sm:rounded-2xl bg-transparent sm:bg-slate-50/70 sm:dark:bg-slate-800/40 border-0 sm:border border-slate-200/80 dark:border-slate-800 animate-pulse flex flex-row items-center justify-between gap-3 sm:gap-4"
                    >
                      <div className="flex-1 space-y-2 py-1 min-w-0">
                        <div className="w-20 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="w-4/5 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                      </div>
                      <div className="w-20 h-20 min-[400px]:w-24 min-[400px]:h-24 sm:w-28 sm:h-28 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
                    </div>
                  ) : (
                    <div
                      key={n}
                      className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-3"
                    >
                      <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-700 rounded-xl" />
                      <div className="w-24 h-3.5 bg-slate-200 dark:bg-slate-700 rounded-md" />
                      <div className="w-4/5 h-5 bg-slate-200 dark:bg-slate-700 rounded-md" />
                      <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-md" />
                    </div>
                  )
                )}
              </div>
            )}

            {isError && (
              <ApiErrorState
                title="Unable to load academic articles"
                message="We were unable to connect to the publications archive. Please verify your connection and click refresh."
                onRetry={refetch}
              />
            )}

            {!isLoading && !isError && filteredBlogs.length === 0 && (
              <div className="py-16 text-center space-y-3 bg-slate-50/60 dark:bg-[#0c1827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  No articles found matching criteria
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {searchQuery
                    ? `No publications found for "${searchQuery}". Try searching with different keywords.`
                    : "No articles are published in this category yet."}
                </p>
                {(searchQuery || selectedCategory !== "All") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      handleCategorySelect("All");
                    }}
                    className="mt-2 px-4 py-2 rounded-full bg-[#0F6E8C] dark:bg-teal-600 text-white text-xs font-bold hover:bg-[#0B5C74] dark:hover:bg-teal-700 transition-all cursor-pointer shadow-2xs inline-block"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Render Blogs: Grid (3-4 per row) vs List (2 per row) layout */}
            {!isLoading && !isError && filteredBlogs.length > 0 && (
              <>
                <div
                  className={
                    viewMode === "list"
                      ? "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
                      : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
                  }
                >
                  {paginatedBlogs.map((blog) => (
                    <BlogCard
                      key={blog._id || blog.slug}
                      blog={blog}
                      layout={viewMode}
                      onCategoryClick={handleCategorySelect}
                    />
                  ))}
                </div>

                {/* Pagination Toolbar when totalPages > 1 */}
                {totalPages > 1 ? (
                  <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Showing <span className="font-bold text-slate-900 dark:text-white">{(safeCurrentPage - 1) * BLOGS_PER_PAGE + 1}</span>–<span className="font-bold text-slate-900 dark:text-white">{Math.min(safeCurrentPage * BLOGS_PER_PAGE, filteredBlogs.length)}</span> of <span className="font-bold text-slate-900 dark:text-white">{filteredBlogs.length}</span> articles
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                      {/* Previous Button */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(safeCurrentPage - 1)}
                        disabled={safeCurrentPage === 1}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0F6E8C] dark:hover:border-teal-400 hover:text-[#0F6E8C] dark:hover:text-teal-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-3xs cursor-pointer"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Prev</span>
                      </button>

                      {/* Page Numbers */}
                      {getPaginationRange(safeCurrentPage, totalPages).map((item, idx) => {
                        if (item === "...") {
                          return (
                            <span
                              key={`ellipsis-${idx}`}
                              className="px-2 py-1 text-slate-400 dark:text-slate-500 text-xs select-none"
                            >
                              •••
                            </span>
                          );
                        }

                        const isPageActive = item === safeCurrentPage;
                        return (
                          <button
                            key={`page-${item}`}
                            type="button"
                            onClick={() => handlePageChange(item)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                              isPageActive
                                ? "bg-[#0F6E8C] dark:bg-teal-600 text-white shadow-2xs scale-105"
                                : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#0F6E8C] dark:hover:border-teal-400 hover:text-[#0F6E8C] dark:hover:text-teal-300 shadow-3xs"
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}

                      {/* Next Button */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(safeCurrentPage + 1)}
                        disabled={safeCurrentPage === totalPages}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0F6E8C] dark:hover:border-teal-400 hover:text-[#0F6E8C] dark:hover:text-teal-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-3xs cursor-pointer"
                        aria-label="Next page"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Feed Summary when 1 page only */
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500 font-mono">
                    Showing {filteredBlogs.length} of {blogs.length} published articles
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Blog;
