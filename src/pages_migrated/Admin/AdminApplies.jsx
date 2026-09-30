"use client";

import React, { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApplications } from "@/lib/queries";
import api from "../../lib/api.js";
import {
  exportToCSV,
  exportToPDF,
  getCourseLabel,
} from "../../lib/exportApplications.js";
import {
  Search,
  Eye,
  X,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Trash2,
  GraduationCap,
  Download,
  FileText,
  Printer,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
import ApiErrorState from "../../components/ApiErrorState.jsx";

const STATUS_COLORS = {
  pending: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60",
  approved: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60",
  rejected: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60",
};

const STATUS_ICONS = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
};

const COURSE_LABELS = {
  "quran-tajweed-course": "Quran Recitation & Tajweed",
  "islamic-studies-fundamentals": "Islamic Studies Fundamentals",
  "arabic-language": "Arabic Language",
  "hifz-program": "Hifz Program",
};

function AppliedCandidates() {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const queryClient = useQueryClient();
  const {
    data: applications = [],
    isLoading,
    isError,
    refetch: refetchApplications,
  } = useApplications();

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      api.patch(`/api/applications/${id}/status`, { status }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application-stats"] });
      // Update selected if open
      if (selected && selected._id === res.data.application._id) {
        setSelected(res.data.application);
      }
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/applications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application-stats"] });
      toast.success("Candidate application deleted successfully.");
      setCandidateToDelete(null);
      setSelected(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete application.");
    },
  });

  const courses = useMemo(
    () => ["all", ...new Set(applications.map((c) => c.course))],
    [applications]
  );

  const filtered = applications.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter === "all" || c.course === courseFilter;
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const courseLabel = (val) => COURSE_LABELS[val] || val;

  const exportPrefix = useMemo(() => {
    if (courseFilter !== "all") {
      const sanitized = (COURSE_LABELS[courseFilter] || courseFilter).replace(/[^a-zA-Z0-9]/g, "-");
      return `Al-Mukhtar-${sanitized}-Candidates`;
    }
    return "Al-Mukhtar-All-Courses-Candidates";
  }, [courseFilter]);

  const exportTitle = useMemo(() => {
    if (courseFilter !== "all") {
      return `Al-Mukhtar Admissions Dossier — ${courseLabel(courseFilter)}`;
    }
    return "Al-Mukhtar Admissions Dossier — All Courses";
  }, [courseFilter]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-5">
      {/* Header with Export Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Applied Candidates
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review admissions applications, filter by course, update enrolment status, and download records.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Export Actions Dropdown / Buttons */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              disabled={filtered.length === 0}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title={filtered.length === 0 ? "No candidates found for selected filters" : `Download ${filtered.length} candidates`}
            >
              <Download size={13} />
              <span>
                {courseFilter !== "all"
                  ? `Download (${filtered.length})`
                  : `Download Registry (${filtered.length})`}
              </span>
              <ChevronDown size={12} className={exportMenuOpen ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>

            {exportMenuOpen && (
              <>
                {/* Backdrop for closing dropdown on tap outside on mobile */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setExportMenuOpen(false)}
                />

                <div
                  className="absolute left-0 sm:left-auto sm:right-0 mt-1.5 w-60 sm:w-64 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#0f1d2e] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-40 space-y-1 font-sans text-xs animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setExportMenuOpen(false)}
                >
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 font-mono">
                    {courseFilter !== "all" ? courseLabel(courseFilter) : "All Courses"} ({filtered.length} Records)
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      exportToCSV(filtered, exportPrefix);
                      setExportMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer font-medium"
                  >
                    <Download size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">Spreadsheet Data (.csv)</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {courseFilter !== "all" ? `Filtered for ${courseLabel(courseFilter)}` : "All courses included"}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      exportToPDF(filtered, exportTitle);
                      setExportMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-[#0F6E8C] dark:hover:text-teal-300 transition-colors cursor-pointer font-medium border-t border-slate-100 dark:border-slate-800"
                  >
                    <FileText size={14} className="text-[#0F6E8C] dark:text-teal-400 shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">PDF Document (.pdf)</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        Printable dossier with course header
                      </p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-[#0F6E8C]/10 dark:bg-[#0F6E8C]/20 text-[#0F6E8C] dark:text-teal-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <GraduationCap size={14} />
            <span>{applications.length} Total</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex items-center gap-2 bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 sm:py-2 min-h-[46px] sm:min-h-[38px] flex-1 shadow-2xs focus-within:border-[#0F6E8C] dark:focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-[#0F6E8C]/15 transition-all">
          <Search size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search candidate by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs sm:text-sm outline-none w-full placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent text-slate-800 dark:text-slate-100"
          />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 sm:py-2 min-h-[46px] sm:min-h-[38px] text-xs sm:text-sm bg-white dark:bg-slate-800 focus:outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 text-slate-700 dark:text-slate-200 shadow-2xs sm:w-52 cursor-pointer transition-all"
        >
          {courses.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All Courses" : courseLabel(c)}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 sm:py-2 min-h-[46px] sm:min-h-[38px] text-xs sm:text-sm bg-white dark:bg-slate-800 focus:outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 text-slate-700 dark:text-slate-200 shadow-2xs sm:w-40 cursor-pointer transition-all"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table & Mobile Cards */}
      <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-5 space-y-3 animate-pulse">
            <div className="flex items-center gap-2 text-xs font-mono text-[#0F6E8C] dark:text-teal-400">
              <Loader2 className="animate-spin" size={13} />
              <span>Loading applications...</span>
            </div>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6">
            <ApiErrorState
              title="Unable to load applications"
              message="Failed to retrieve course applications from the server."
              onRetry={refetchApplications}
            />
          </div>
        ) : (
          <>
            {/* Mobile Card List (<768px) */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/70 block md:hidden">
              {filtered.map((c) => {
                const StatusIcon = STATUS_ICONS[c.status];
                return (
                  <div key={c._id} className="p-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-xs text-slate-900 dark:text-white truncate">{c.name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{courseLabel(c.course)}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded capitalize shrink-0 border ${STATUS_COLORS[c.status]}`}>
                        <StatusIcon size={9} />
                        {c.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                          {c.shift}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{formatDate(c.createdAt)}</span>
                      </div>

                      <button
                        onClick={() => setSelected(c)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F6E8C] dark:text-teal-300 bg-[#0F6E8C]/10 dark:bg-[#0F6E8C]/25 px-2.5 py-0.5 rounded hover:bg-[#0F6E8C]/20 dark:hover:bg-[#0F6E8C]/40 transition-colors cursor-pointer"
                      >
                        <Eye size={11} />
                        View File
                      </button>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
                  No candidates found.
                </div>
              )}
            </div>

            {/* Desktop Table (>=768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-[#0a1420] border-b border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                    <th className="py-2.5 px-3.5">Candidate</th>
                    <th className="py-2.5 px-3">Course</th>
                    <th className="py-2.5 px-3">Shift</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Applied Date</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  {filtered.map((c) => {
                    const StatusIcon = STATUS_ICONS[c.status];
                    return (
                      <tr
                        key={c._id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-3.5 font-semibold text-slate-900 dark:text-white text-xs">{c.name}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 text-xs">{courseLabel(c.course)}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize border border-slate-200 dark:border-slate-700">
                            {c.shift}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border capitalize ${STATUS_COLORS[c.status]}`}>
                            <StatusIcon size={9} />
                            {c.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-[11px]">{formatDate(c.createdAt)}</td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelected(c)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F6E8C] dark:text-teal-400 hover:underline cursor-pointer"
                          >
                            <Eye size={12} />
                            <span>Dossier</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                        No candidates found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#0c1827] rounded-xl w-full max-w-md p-5 relative max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-1.5 text-[#0F6E8C] dark:text-teal-400 text-[10px] font-bold uppercase tracking-wider mb-1 font-mono">
              <GraduationCap size={13} />
              <span>Candidate Dossier</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{selected.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3.5">{courseLabel(selected.course)}</p>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs mb-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/70">
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-mono font-semibold">Father's Name</p>
                <p className="text-slate-900 dark:text-slate-100 font-medium truncate">{selected.fatherName || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-mono font-semibold">Shift</p>
                <p className="text-slate-900 dark:text-slate-100 font-medium capitalize">{selected.shift || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-mono font-semibold">Qualification</p>
                <p className="text-slate-900 dark:text-slate-100 font-medium truncate">{selected.qualification || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-mono font-semibold">Age</p>
                <p className="text-slate-900 dark:text-slate-100 font-medium">{selected.age ? `${selected.age} Yrs` : "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-mono font-semibold">CNIC</p>
                <p className="text-slate-900 dark:text-slate-100 font-medium font-mono text-[11px]">{selected.cnic || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-mono font-semibold">Submission</p>
                <p className="text-slate-900 dark:text-slate-100 font-medium font-mono text-[11px]">{formatDate(selected.createdAt)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-mono font-semibold">Address</p>
                <p className="text-slate-900 dark:text-slate-100 font-medium flex items-start gap-1 text-xs">
                  <MapPin size={12} className="text-[#0F6E8C] dark:text-teal-400 mt-0.5 shrink-0" />
                  {selected.address || "—"}
                </p>
              </div>
            </div>

            {/* Status Actions */}
            <div className="mb-4">
              <p className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-mono font-semibold mb-1.5">Application Status</p>
              <div className="flex flex-wrap gap-1.5">
                {["pending", "approved", "rejected"].map((s) => (
                  <button
                    key={s}
                    onClick={() => statusMutation.mutate({ id: selected._id, status: s })}
                    disabled={statusMutation.isPending || selected.status === s}
                    className={`text-xs font-semibold px-2.5 py-1 rounded border transition-all capitalize disabled:opacity-50 cursor-pointer ${
                      selected.status === s
                        ? STATUS_COLORS[s] + " cursor-default shadow-xs"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#0F6E8C] dark:hover:border-teal-400 hover:text-[#0F6E8C] dark:hover:text-teal-300"
                    }`}
                  >
                    {s === "approved" && <CheckCircle2 size={11} className="inline mr-1" />}
                    {s === "rejected" && <XCircle size={11} className="inline mr-1" />}
                    {s === "pending" && <Clock size={11} className="inline mr-1" />}
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`https://wa.me/${selected.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#25D366] text-white font-semibold py-1.5 rounded-lg hover:bg-[#20bd5a] shadow-2xs transition-colors text-xs"
              >
                <MessageCircle size={13} />
                WhatsApp
              </a>
              <a
                href={`tel:${selected.mobile}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs"
              >
                <Phone size={13} />
                Call
              </a>
              <button
                type="button"
                onClick={() => setCandidateToDelete(selected)}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center justify-center border border-rose-200 dark:border-rose-900/60 text-rose-500 dark:text-rose-400 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-xs disabled:opacity-50 cursor-pointer"
                title="Delete dossier"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal Dialog for Application Deletion */}
      {candidateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white dark:bg-[#0c1827] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  Confirm Application Deletion
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Are you sure you want to permanently delete the application record for{" "}
                  <span className="font-bold text-slate-900 dark:text-white">"{candidateToDelete.name}"</span> (
                  {courseLabel(candidateToDelete.course)})?
                </p>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium pt-1">
                  Warning: This action is permanent and removes the applicant's submission dossier.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCandidateToDelete(null)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(candidateToDelete._id)}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-60"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={13} />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppliedCandidates;