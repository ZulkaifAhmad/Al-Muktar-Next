"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Upload,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  BookOpen,
  Lock,
  Unlock,
  Sparkles,
  Calendar,
  Save,
  FileCheck2,
  ExternalLink,
} from "lucide-react";

export default function AdminCoursePdfResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterReleaseStatus, setFilterReleaseStatus] = useState("all");
  const [coursesList, setCoursesList] = useState([]);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    courseName: "",
    title: "Annual Examination Result",
    session: "2025-2026",
    pdfUrl: "",
    pdfName: "",
    pdfSize: "",
    description: "Official certified examination result document.",
    isReleased: true,
    holdReason: "",
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const fileInputRef = useRef(null);

  // Fetch results and metadata
  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (filterCourse !== "all") params.set("courseName", filterCourse);
      if (filterReleaseStatus !== "all") params.set("isReleased", filterReleaseStatus);
      params.set("limit", "100");

      const res = await fetch(`/api/results?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results || []);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to load results:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const res = await fetch("/api/results/meta");
      const data = await res.json();
      if (data.success) {
        setCoursesList(data.courses || []);
        if (data.courses?.length > 0 && !formData.courseName) {
          setFormData((prev) => ({ ...prev, courseName: data.courses[0] }));
        }
      }
    } catch (err) {
      console.error("Failed to load meta:", err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [filterCourse, filterReleaseStatus]);

  useEffect(() => {
    fetchMeta();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResults();
  };

  // Convert uploaded PDF to Base64
  const processPdfFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setFormError("Only official PDF (.pdf) files are supported.");
      return;
    }

    const sizeKB = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeKB} KB`;

    // Attempt to auto-infer course or title from file name
    const cleanName = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ").trim();

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        courseName: prev.courseName || cleanName,
        pdfUrl: event.target.result,
        pdfName: file.name,
        pdfSize: sizeStr,
      }));
      setFormError("");
    };
    reader.readAsDataURL(file);
  };

  // 1-Click Release or Hold Toggle
  const handleToggleRelease = async (resultItem) => {
    setTogglingId(resultItem._id);
    try {
      const res = await fetch(`/api/results/${resultItem._id}/toggle-release`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isReleased: !resultItem.isReleased }),
      });
      const data = await res.json();
      if (data.success) {
        setResults((prev) =>
          prev.map((r) => (r._id === resultItem._id ? { ...r, isReleased: data.isReleased } : r))
        );
        setSuccessNotice(data.message);
        setTimeout(() => setSuccessNotice(""), 3500);
      } else {
        alert(data.message || "Failed to update release status");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenUploadModal = () => {
    setEditingId(null);
    setPdfFile(null);
    setFormData({
      courseName: coursesList[0] || "Quran Recitation & Tajweed",
      title: "Annual Examination Result",
      session: "2025-2026",
      pdfUrl: "",
      pdfName: "",
      pdfSize: "",
      description: "Official certified examination result document.",
      isReleased: true,
      holdReason: "",
    });
    setFormError("");
    setShowUploadModal(true);
  };

  const handleEdit = (r) => {
    setEditingId(r._id);
    setFormData({
      courseName: r.courseName || "",
      title: r.title || "Annual Examination Result",
      session: r.session || "2025-2026",
      pdfUrl: r.pdfUrl || "",
      pdfName: r.pdfName || "Result_Document.pdf",
      pdfSize: r.pdfSize || "",
      description: r.description || "Official certified examination result document.",
      isReleased: r.isReleased !== false,
      holdReason: r.holdReason || "",
    });
    setFormError("");
    setShowUploadModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.courseName.trim()) {
      setFormError("Please enter or select a Course Name.");
      return;
    }

    if (!formData.pdfUrl) {
      setFormError("Please upload the result PDF document (.pdf).");
      return;
    }

    setSavingResult(true);
    setFormError("");

    try {
      const url = editingId ? `/api/results/${editingId}` : "/api/results";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setShowUploadModal(false);
        setEditingId(null);
        setSuccessNotice(
          editingId
            ? "Result document updated successfully."
            : `Result PDF for "${formData.courseName}" uploaded successfully.`
        );
        setTimeout(() => setSuccessNotice(""), 4000);
        fetchResults();
        fetchMeta();
      } else {
        setFormError(data.message || "Failed to save PDF result.");
      }
    } catch (err) {
      setFormError(`Error: ${err.message}`);
    } finally {
      setSavingResult(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course result PDF document?")) return;

    try {
      const res = await fetch(`/api/results/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchResults();
        fetchMeta();
      } else {
        alert(data.message || "Failed to delete result");
      }
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#0B1E2D] to-[#081724] text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#0F6E8C]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F6E8C]/30 border border-[#8FB3AA]/30 text-[#8FB3AA] text-[11px] font-semibold uppercase tracking-wider">
              <Sparkles size={12} />
              Course Results Admin
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
              Course Result PDF Uploads
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upload course result PDF documents, specify the course name, and toggle results between <strong>Released (Live)</strong> and <strong>On Hold</strong>.
            </p>
          </div>

          <button
            onClick={handleOpenUploadModal}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0F6E8C] to-[#0B5C74] hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0F6E8C]/30 transition active:scale-95 cursor-pointer shrink-0"
          >
            <Upload size={16} />
            Upload Course Result PDF
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Responsive KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F6E8C]/10 text-[#0F6E8C] dark:text-[#8FB3AA] flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                Total Course Results
              </span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {totalCount}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Unlock size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                Released (Live for Students)
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                {results.filter((r) => r.isReleased !== false).length}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Lock size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                On Hold (Withheld / Hidden)
              </span>
              <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">
                {results.filter((r) => r.isReleased === false).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Query */}
          <form onSubmit={handleSearchSubmit} className="sm:col-span-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course name, title, session..."
              className="w-full px-4 py-2.5 pl-9 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0F6E8C]"
            />
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </form>

          {/* Filter Course */}
          <div className="sm:col-span-4">
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
            >
              <option value="all">All Courses</option>
              {coursesList.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Release Status */}
          <div className="sm:col-span-2">
            <select
              value={filterReleaseStatus}
              onChange={(e) => setFilterReleaseStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
            >
              <option value="all">All Status</option>
              <option value="true">Live Only</option>
              <option value="false">On Hold Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results View: Responsive Dual Mode */}
      {/* 1. Mobile Cards View */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#0F6E8C]" />
            Loading results...
          </div>
        ) : results.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <AlertCircle size={24} className="mx-auto mb-2 text-slate-400" />
            No course results found. Tap <strong>Upload Course Result PDF</strong>.
          </div>
        ) : (
          results.map((r) => (
            <div
              key={r._id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {r.courseName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {r.title || "Examination Result"} • {r.session}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleRelease(r)}
                  disabled={togglingId === r._id}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer active:scale-95 ${
                    r.isReleased !== false
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-amber-500/15 hover:text-amber-600 hover:border-amber-500/30"
                      : "bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-emerald-500/10 hover:text-emerald-600"
                  }`}
                >
                  {r.isReleased !== false ? (
                    <>
                      <Unlock size={11} /> Released
                    </>
                  ) : (
                    <>
                      <Lock size={11} /> On Hold
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <FileText size={13} />
                  {r.pdfName ? (r.pdfName.length > 16 ? `${r.pdfName.slice(0, 14)}...` : r.pdfName) : "PDF"}
                  {r.pdfSize && <span className="text-slate-400 font-normal">({r.pdfSize})</span>}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedResult(r);
                      setShowPreviewModal(true);
                    }}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#0F6E8C]"
                    title="View PDF"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => handleEdit(r)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600"
                    title="Edit"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Course Name</th>
                <th className="py-3.5 px-4">Result Title & Session</th>
                <th className="py-3.5 px-4 text-center">PDF Document</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#0F6E8C]" />
                    Loading course results...
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <AlertCircle size={24} className="mx-auto mb-2 text-slate-400" />
                    No course result PDFs uploaded. Click <strong>Upload Course Result PDF</strong> to add one.
                  </td>
                </tr>
              ) : (
                results.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <BookOpen size={15} className="text-[#0F6E8C]" />
                        <span>{r.courseName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {r.title || "Examination Result"}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Session: {r.session}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[11px] font-bold border border-rose-500/20">
                        <FileText size={13} />
                        {r.pdfName ? (r.pdfName.length > 20 ? `${r.pdfName.slice(0, 18)}...` : r.pdfName) : "Result.pdf"}
                        {r.pdfSize && <span className="text-slate-400 font-normal">({r.pdfSize})</span>}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleRelease(r)}
                        disabled={togglingId === r._id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition cursor-pointer active:scale-95 ${
                          r.isReleased !== false
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-amber-500/15 hover:text-amber-600 hover:border-amber-500/30"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-emerald-500/10 hover:text-emerald-600"
                        }`}
                        title={r.isReleased !== false ? "Click to Hold (Hide) Result" : "Click to Release (Make Live) Result"}
                      >
                        {togglingId === r._id ? (
                          <RefreshCw size={12} className="animate-spin" />
                        ) : r.isReleased !== false ? (
                          <>
                            <Unlock size={12} /> Released (Live)
                          </>
                        ) : (
                          <>
                            <Lock size={12} /> On Hold (Hidden)
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedResult(r);
                            setShowPreviewModal(true);
                          }}
                          className="p-2 rounded-xl text-slate-500 hover:text-[#0F6E8C] hover:bg-[#0F6E8C]/10 transition cursor-pointer"
                          title="View PDF Document"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleEdit(r)}
                          className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-500/10 transition cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Delete PDF"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: UPLOAD / EDIT COURSE RESULT PDF */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F6E8C] to-[#0B5C74] text-white flex items-center justify-center shrink-0 shadow-md">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {editingId ? "Edit Course Result Document" : "Upload Course Result PDF"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Specify the course name, attach the official PDF result file, and select release status.
                </p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-900 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* PDF Dropzone Area */}
              <div>
                <label className="block text-xs font-bold uppercase font-mono text-slate-500 mb-1.5">
                  Result PDF Document (.pdf) <span className="text-rose-500">*</span>
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    processPdfFile(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition cursor-pointer ${
                    isDragging
                      ? "border-[#0F6E8C] bg-[#0F6E8C]/10 scale-[1.01]"
                      : formData.pdfUrl
                      ? "border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20"
                      : "border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:border-[#0F6E8C]"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => processPdfFile(e.target.files?.[0])}
                    accept="application/pdf,.pdf"
                    className="hidden"
                  />
                  {formData.pdfUrl ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                        <FileCheck2 size={26} />
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {formData.pdfName || "Result_Document.pdf"}
                      </p>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-xs font-bold">
                        {formData.pdfSize || "PDF Attached"}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Click or drop another file to replace
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-[#0F6E8C]/10 text-[#0F6E8C] dark:text-[#8FB3AA] flex items-center justify-center mx-auto">
                        <Upload size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Click to select or drag & drop course result PDF
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        Format: Strictly PDF (.pdf) only
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Name Input + Quick Presets */}
              <div>
                <label className="block text-xs font-bold uppercase font-mono text-slate-600 dark:text-slate-300 mb-1.5">
                  Course Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  placeholder="e.g. Quran Recitation & Tajweed, Arabic Language, Hifz Program"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0F6E8C] mb-2"
                />

                {/* Quick Course Presets from DB */}
                {coursesList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {coursesList.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, courseName: preset })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                          formData.courseName === preset
                            ? "bg-[#0F6E8C] text-white border-[#0F6E8C]"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Session */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase font-mono text-slate-600 dark:text-slate-300 mb-1.5">
                    Result Title / Examination Name
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Annual Examination 2025-2026 Gazette"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase font-mono text-slate-600 dark:text-slate-300 mb-1.5">
                    Session / Academic Year
                  </label>
                  <input
                    type="text"
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    placeholder="e.g. 2025-2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Option of On Hold Result */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Release or Hold Result
                    </span>
                    <p className="text-[11px] text-slate-400">
                      When On Hold, this course result is hidden from the public website.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isReleased: !formData.isReleased })}
                    className={`py-2 px-4 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                      formData.isReleased
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20"
                        : "bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/25"
                    }`}
                  >
                    {formData.isReleased ? (
                      <>
                        <Unlock size={14} /> Released (Live)
                      </>
                    ) : (
                      <>
                        <Lock size={14} /> On Hold (Hidden)
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingResult}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0F6E8C] to-[#0B5C74] hover:brightness-110 text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {savingResult ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Saving PDF...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      {editingId ? "Update Result" : "Publish Course Result PDF"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN PDF PREVIEW MODAL */}
      {/* ========================================================================= */}
      {showPreviewModal && selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden relative max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText size={20} className="text-[#0F6E8C] dark:text-[#8FB3AA] shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {selectedResult.courseName} — {selectedResult.title || "Examination Result"}
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Session: {selectedResult.session || "2025-2026"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="w-full h-[600px] sm:h-[750px] bg-slate-100 dark:bg-slate-950 relative">
              <iframe
                src={`${selectedResult.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0"
                title={`${selectedResult.courseName} Result`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
