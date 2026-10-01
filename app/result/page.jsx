"use client";

import React, { useState } from "react";
import { usePublicResults, useResultsMeta } from "@/lib/queries/results";
import {
  FileText,
  Download,
  Eye,
  Search,
  BookOpen,
  Calendar,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  X,
  AlertCircle,
  FileCheck2,
  HelpCircle,
  ArrowDownToLine,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function PublicCourseResultsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  // PDF Preview Modal
  const [previewResult, setPreviewResult] = useState(null);

  // TanStack Query for results & course metadata
  const { data: courses = [] } = useResultsMeta();
  const { data: results = [], isLoading, isFetching } = usePublicResults({
    courseName: selectedCourse,
    q: debouncedSearch,
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setDebouncedSearch(searchQuery.trim());
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedCourse("all");
  };

  // Direct download trigger
  const handleDownload = (r) => {
    const link = document.createElement("a");
    link.href = r.pdfUrl;
    link.download = r.pdfName || `${r.courseName.replace(/\s+/g, "_")}_Result.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = (r) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(
        `<iframe src="${r.pdfUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      );
      newWindow.document.title = `${r.courseName} - Examination Result | Al-Mukhtar Institute`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d18] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Compact Top Header */}
      <section className="bg-[#0A2540] text-white border-b border-slate-800/80 pt-7 pb-6 sm:pt-9 sm:pb-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center space-y-2">
            
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0F6E8C]/30 border border-[#8FB3AA]/30 text-[#8FB3AA] text-[10.5px] font-semibold font-mono uppercase tracking-wider">
              <Sparkles size={11} className="text-teal-300" />
              <span>Examination Records</span>
            </div>

            <h1 className="text-lg sm:text-2xl font-bold font-heading tracking-tight text-white">
              Course Examination Results
            </h1>

            <p className="text-[11.5px] sm:text-xs text-slate-300 max-w-lg leading-relaxed font-normal">
              Official verified examination results and PDF gazettes published by Al-Mukhtar Madrasa.
            </p>

            {/* Compact Search & Filter Bar */}
            <div className="pt-3 w-full max-w-xl mx-auto">
              <div className="bg-white/95 dark:bg-[#0c1827] rounded-xl p-1.5 shadow-md border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-stretch gap-1.5 text-slate-900 dark:text-white">
                
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (!e.target.value) setDebouncedSearch("");
                    }}
                    placeholder="Search by course or title..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none border border-slate-200/80 dark:border-slate-700 focus:border-[#0F6E8C]"
                  />
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </form>

                {/* Course Dropdown */}
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="sm:w-44 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none border border-slate-200/80 dark:border-slate-700 cursor-pointer"
                >
                  <option value="all">All Courses</option>
                  {courses.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="px-3 py-1.5 rounded-lg bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  Search
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Results Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Results Bar Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white font-heading">
              Available Results
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              {results.length}
            </span>
            {isFetching && !isLoading && (
              <RefreshCw size={11} className="animate-spin text-[#0F6E8C]" />
            )}
          </div>

          {(selectedCourse !== "all" || debouncedSearch) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] font-semibold text-[#0F6E8C] dark:text-teal-400 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-8 text-center bg-white dark:bg-[#0c1827] rounded-xl border border-slate-200/80 dark:border-slate-800">
            <RefreshCw size={18} className="animate-spin text-[#0F6E8C] dark:text-teal-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading results...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#0c1827] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2 max-w-sm mx-auto">
            <AlertCircle size={22} className="text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              No results found
            </p>
            <p className="text-[11px] text-slate-500">
              No examination result documents match your filter.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-[#0F6E8C] dark:text-teal-400 hover:underline pt-1 cursor-pointer inline-block"
            >
              Reset filters
            </button>
          </div>
        ) : (
          /* Sleek Results Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {results.map((r) => (
              <div
                key={r._id}
                className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800/90 shadow-2xs hover:border-[#0F6E8C]/50 transition-all flex flex-col justify-between space-y-3"
              >
                {/* Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-[#0F6E8C] dark:text-teal-300 font-mono text-[10.5px] font-bold border border-teal-200/60 dark:border-teal-800/50 truncate max-w-[170px]">
                      <BookOpen size={10} className="shrink-0" />
                      <span className="truncate">{r.courseName}</span>
                    </span>

                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                      {r.session || "2025-2026"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {r.title || `${r.courseName} Result`}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {r.description || "Official examination result document."}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-mono font-semibold truncate max-w-[130px]">
                    <FileText size={12} className="shrink-0" />
                    <span className="truncate">{r.pdfName || "Result.pdf"}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewResult(r)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer active:scale-95 inline-flex items-center gap-1"
                      title="View PDF"
                    >
                      <Eye size={12} />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(r)}
                      className="px-3 py-1.5 rounded-lg bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-xs font-bold transition active:scale-95 cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                    >
                      <ArrowDownToLine size={12} />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Compact Inquiry Help Note */}
        <div className="mt-6 p-3 sm:p-3.5 rounded-xl bg-slate-100/80 dark:bg-[#081220] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-900 dark:text-white">
              Questions about your mark sheet or certificate?
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Campus: Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar
            </p>
          </div>

          <a
            href="https://wa.me/923431775096?text=Assalam-o-Alaikum,%20I%20have%20an%20inquiry%20regarding%20my%20examination%20result."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition shrink-0"
          >
            <span>WhatsApp Helpline</span>
            <ChevronRight size={12} />
          </a>
        </div>

      </main>

      {/* Responsive PDF Modal */}
      {previewResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <FileText size={15} className="text-[#0F6E8C] dark:text-teal-300 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {previewResult.courseName} — {previewResult.title || "Result"}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenNewTab(previewResult)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Open in new tab"
                >
                  <ExternalLink size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(previewResult)}
                  className="px-2.5 py-1 rounded-lg bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-[11px] font-bold transition cursor-pointer inline-flex items-center gap-1"
                >
                  <Download size={11} />
                  <span>Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewResult(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Embedded Iframe */}
            <div className="w-full h-[60vh] sm:h-[68vh] bg-slate-100 dark:bg-slate-950 relative">
              <iframe
                src={`${previewResult.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0"
                title={`${previewResult.courseName} Result`}
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
