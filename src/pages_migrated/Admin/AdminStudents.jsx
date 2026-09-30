"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStudents } from "@/lib/queries";
import api from "../../lib/api.js";
import { toast } from "react-toastify";
import { compressImageFile } from "../../lib/imageCompressor.js";
import ApiErrorState from "../../components/ApiErrorState.jsx";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  GraduationCap,
  Building2,
  MapPin,
  Award,
  Star,
  Quote,
  Eye,
  Globe,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { LogoImg, getImageUrl } from "../../assets/assets.js";

const CATEGORIES = [
  "Academia",
  "Quranic Sciences",
  "Research & Writing",
  "Islamic Finance",
  "Youth Leadership",
  "Community Service",
  "General",
];

function AdminStudents() {
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [apiMsg, setApiMsg] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      program: "",
      batchYear: "Class of 2024",
      category: "Academia",
      currentRole: "",
      currentOrganization: "",
      location: "",
      message: "",
      keyAchievement: "",
      status: "active",
      order: 0,
    },
  });

  const {
    data: students = [],
    isLoading,
    isError,
    refetch: refetchStudents,
  } = useStudents();

  // Unique categories in database
  const availableCategories = useMemo(() => {
    const set = new Set(CATEGORIES);
    students.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [students]);

  // Unique locations count
  const locationsCount = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.location) set.add(s.location);
    });
    return set.size;
  }, [students]);

  const stats = useMemo(() => {
    const total = students.length;
    const featured = students.filter((s) => s.status === "featured").length;
    const active = students.filter((s) => s.status === "active" || s.status === "featured").length;
    return { total, featured, active };
  }, [students]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchStudents();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      try {
        const compressed = await compressImageFile(file);
        setImageBase64(compressed);
      } catch {
        toast.error("Could not process image. Try a smaller file.");
      }
    }
  };

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageBase64(null);
  };

  const resetForm = () => {
    reset({
      name: "",
      program: "",
      batchYear: "Class of 2024",
      category: "Academia",
      currentRole: "",
      currentOrganization: "",
      location: "",
      message: "",
      keyAchievement: "",
      status: "active",
      order: 0,
    });
    removeImage();
    setShowForm(false);
    setEditingStudent(null);
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    reset({
      name: student.name || "",
      program: student.program || "",
      batchYear: student.batchYear || "Class of 2024",
      category: student.category || "Academia",
      currentRole: student.currentRole || "",
      currentOrganization: student.currentOrganization || "",
      location: student.location || "",
      message: student.message || "",
      keyAchievement: student.keyAchievement || "",
      status: student.status || "active",
      order: student.order ?? 0,
    });
    setImagePreview(student.image || null);
    setImageBase64(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createMutation = useMutation({
    mutationFn: (payload) => api.post("/api/students", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setApiMsg({ success: true, text: "Graduate profile added successfully." });
      resetForm();
      setTimeout(() => setApiMsg(null), 4000);
    },
    onError: (err) => {
      setApiMsg({
        success: false,
        text: err?.response?.data?.message || "Failed to add graduate profile.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/api/students/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setApiMsg({ success: true, text: "Graduate profile updated successfully." });
      resetForm();
      setTimeout(() => setApiMsg(null), 4000);
    },
    onError: (err) => {
      setApiMsg({
        success: false,
        text: err?.response?.data?.message || "Failed to update profile.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/students/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      if (refetchStudents) refetchStudents();
      toast.success("Graduate record removed successfully.");
      setStudentToDelete(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete record.");
    },
  });

  const onSubmit = async (formData) => {
    setApiMsg(null);
    const payload = {
      name: formData.name,
      program: formData.program,
      batchYear: formData.batchYear,
      category: formData.category,
      currentRole: formData.currentRole,
      currentOrganization: formData.currentOrganization,
      location: formData.location,
      message: formData.message,
      keyAchievement: formData.keyAchievement,
      status: formData.status,
      order: Number(formData.order) || 0,
      image: imageBase64 || (editingStudent ? editingStudent.image : imagePreview || ""),
    };

    if (editingStudent) {
      updateMutation.mutate({ id: editingStudent._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Alumni &amp; Graduates
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#0F6E8C]/10 text-[#0F6E8C] dark:bg-[#0F6E8C]/20 dark:text-teal-300 font-mono">
              {students.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add graduate profiles, showcase where alumni stand today, their global roles, and notable milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            title="Refresh list"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0F6E8C] hover:text-[#0F6E8C] dark:hover:border-teal-400 dark:hover:text-teal-400 text-xs font-medium shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#0F6E8C]" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => {
              if (showForm) resetForm();
              else {
                resetForm();
                setShowForm(true);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F6E8C] text-white text-xs font-semibold shadow-xs hover:bg-[#0B5C74] active:scale-95 transition-all cursor-pointer"
          >
            {showForm ? <X size={13} /> : <Plus size={13} />}
            <span>{showForm ? "Close Form" : "Add Graduate"}</span>
          </button>
        </div>
      </div>

      {/* ── Status Banner (Success / Error) ────────────────────────── */}
      {apiMsg && (
        <div
          className={`flex items-center gap-2.5 border text-xs font-medium px-4 py-3 rounded-lg shadow-2xs transition-all ${
            apiMsg.success
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
          }`}
        >
          {apiMsg.success ? (
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span>{apiMsg.text}</span>
        </div>
      )}

      {/* ── Metric Badges Strip ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800/80 p-3.5 rounded-xl shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0F6E8C]/10 dark:bg-[#0F6E8C]/20 text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center shrink-0">
            <GraduationCap size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              Total Alumni
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              {stats.total}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800/80 p-3.5 rounded-xl shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Star size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              Featured Stories
            </div>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400 font-heading">
              {stats.featured}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800/80 p-3.5 rounded-xl shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Globe size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              Global Locations
            </div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-heading">
              {locationsCount}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800/80 p-3.5 rounded-xl shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              Categories
            </div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-heading">
              {availableCategories.length}
            </div>
          </div>
        </div>
      </div>

      {/* ── Add / Edit Student Form — On Screen directly for Mobile, Card for Desktop/Laptop ── */}
      {showForm && (
        <div className="bg-transparent sm:bg-white sm:dark:bg-[#0c1827] border-0 sm:border border-slate-200 dark:border-slate-800 rounded-none sm:rounded-xl p-0 sm:p-6 shadow-none sm:shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#0F6E8C] text-white flex items-center justify-center">
                {editingStudent ? <Pencil size={12} /> : <Plus size={12} />}
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                {editingStudent ? `Edit: ${editingStudent.name}` : "Add Graduate Showcase Profile"}
              </h2>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4">
              {/* Full Name */}
              <div className="sm:col-span-6">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Student / Graduate Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hafiz Usman Tariq"
                  className={`w-full border rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all ${
                    errors.name ? "border-rose-400" : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <span className="text-[10px] text-rose-500 mt-1 block">{errors.name.message}</span>
                )}
              </div>

              {/* Program Completed */}
              <div className="sm:col-span-6">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Program Completed <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fazil Dars-e-Nizami (Alimiyyah)"
                  className={`w-full border rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all ${
                    errors.program ? "border-rose-400" : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("program", { required: "Program is required" })}
                />
                {errors.program && (
                  <span className="text-[10px] text-rose-500 mt-1 block">{errors.program.message}</span>
                )}
              </div>

              {/* Batch Year */}
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Batch / Graduation Year
                </label>
                <input
                  type="text"
                  placeholder="e.g. Class of 2022"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all"
                  {...register("batchYear")}
                />
              </div>

              {/* Category */}
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Category / Field
                </label>
                <select
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 cursor-pointer transition-all"
                  {...register("category")}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Role */}
              <div className="sm:col-span-6">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Current Role / Position <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Lecturer in Hadith & Fiqh"
                  className={`w-full border rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all ${
                    errors.currentRole ? "border-rose-400" : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("currentRole", { required: "Current role is required" })}
                />
              </div>

              {/* Current Organization */}
              <div className="sm:col-span-6">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Current Organization / Institute <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jamia Al-Hikmah International"
                  className={`w-full border rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all ${
                    errors.currentOrganization ? "border-rose-400" : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("currentOrganization", { required: "Organization is required" })}
                />
              </div>

              {/* Location */}
              <div className="sm:col-span-6">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Location (City, Country)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Manchester, United Kingdom"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all"
                  {...register("location")}
                />
              </div>

              {/* Status */}
              <div className="sm:col-span-6">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Display Status
                </label>
                <select
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 cursor-pointer transition-all"
                  {...register("status")}
                >
                  <option value="active">Active (Visible)</option>
                  <option value="featured">Featured on Homepage</option>
                  <option value="inactive">Hidden / Inactive</option>
                </select>
              </div>

              {/* Key Achievement */}
              <div className="sm:col-span-12">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Key Milestone / Notable Achievement
                </label>
                <input
                  type="text"
                  placeholder="e.g. Published 2 academic treatises on Usul al-Hadith and teaches 200+ undergraduate students."
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all"
                  {...register("keyAchievement")}
                />
              </div>

              {/* Testimonial Message (Very Big Height) */}
              <div className="sm:col-span-12">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono block">
                    Graduate Reflection, Academic Journey &amp; Detailed Testimonial
                  </label>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Mentorship experience, career accomplishments &amp; advice
                  </span>
                </div>
                <textarea
                  rows={6}
                  placeholder="Detailed student reflection: what they learned at Al-Mukhtar, teacher mentorship experience, classical grounding, career trajectory, community leadership contributions, and advice to prospective applicants..."
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm min-h-[160px] sm:min-h-[190px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 leading-relaxed transition-all resize-y"
                  {...register("message")}
                />
              </div>

              {/* Photo Upload */}
              <div className="sm:col-span-12">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Graduate Photograph
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
                  {imagePreview ? (
                    <div className="relative group shrink-0">
                      <img
                        src={imagePreview}
                        alt="Student preview"
                        className="w-16 h-16 rounded-full object-cover object-top border border-slate-200 dark:border-slate-700 shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition-colors"
                        title="Remove image"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-slate-800 shrink-0">
                      <GraduationCap size={20} className="opacity-50" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0F6E8C] dark:hover:border-teal-400 text-xs font-medium cursor-pointer shadow-2xs transition-colors">
                      <Upload size={13} className="text-[#0F6E8C] dark:text-teal-400" />
                      <span>{imagePreview ? "Change Photo" : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Supports PNG, JPG, WEBP. Automatically optimized and compressed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                disabled={isPending}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
              >
                {isPending && <Loader2 size={13} className="animate-spin" />}
                <span>{editingStudent ? "Update Profile" : "Save Profile"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Students Grid / Cards ───────────────────────────────────── */}
      {isLoading ? (
        <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
          <Loader2 size={28} className="animate-spin text-[#0F6E8C] dark:text-teal-400 mx-auto" />
          <p className="text-xs text-slate-500 mt-2 font-medium">Loading alumni profiles...</p>
        </div>
      ) : isError ? (
        <ApiErrorState
          title="Could not load alumni"
          message="An error occurred while fetching the graduates directory."
          onRetry={refetchStudents}
        />
      ) : students.length === 0 ? (
        <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#0F6E8C]/10 text-[#0F6E8C] dark:bg-[#0F6E8C]/20 dark:text-teal-300 flex items-center justify-center mx-auto">
            <GraduationCap size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No alumni profiles added yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add graduate profiles to display on the academy homepage and about page.
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F6E8C] text-white text-xs font-semibold shadow-xs hover:bg-[#0B5C74] transition-colors"
            >
              <Plus size={13} />
              <span>Add First Graduate</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => {
            const isFeatured = student.status === "featured";
            const isActive = student.status === "active" || isFeatured;

            return (
              <div
                key={student._id || student.id}
                className="bg-white dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800/80 hover:border-[#0F6E8C]/40 dark:hover:border-teal-500/30 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between transition-all group relative"
              >
                {/* Card Top: Photo + Name + Program */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    {Boolean(getImageUrl(student.image)) ? (
                      <img
                        src={getImageUrl(student.image)}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = LogoImg;
                        }}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover object-top border border-slate-100 dark:border-slate-700 shadow-2xs shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0F6E8C]/20 to-[#0B1E2D]/20 text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center font-bold text-sm border border-slate-200 dark:border-slate-700 shrink-0">
                        {student.name?.charAt(0) || "S"}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono ${
                            isFeatured
                              ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60"
                              : isActive
                              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {isFeatured && <Star size={9} className="fill-amber-500 text-amber-500" />}
                          {student.status || "active"}
                        </span>

                        <span className="text-[10px] text-slate-400 font-mono">
                          {student.batchYear}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate font-heading group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors">
                        {student.name}
                      </h3>
                      <p className="text-[11px] font-medium text-[#0F6E8C] dark:text-teal-400 truncate">
                        {student.program}
                      </p>
                    </div>
                  </div>

                  {/* Career & Location Box */}
                  <div className="p-2.5 rounded-lg bg-slate-50/70 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 space-y-1 text-xs">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {student.currentRole}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1 truncate">
                      <Building2 size={11} className="text-slate-400 shrink-0" />
                      <span className="truncate">{student.currentOrganization}</span>
                    </p>
                    {student.location && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 pt-0.5">
                        <MapPin size={10} className="text-[#0F6E8C] dark:text-teal-400 shrink-0" />
                        <span className="truncate">{student.location}</span>
                      </p>
                    )}
                  </div>

                  {/* Reflection quote */}
                  {student.message && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 italic line-clamp-2 border-l-2 border-[#0F6E8C]/40 dark:border-teal-400/40 pl-2">
                      "{student.message}"
                    </p>
                  )}

                  {/* Milestone */}
                  {student.keyAchievement && (
                    <div className="flex items-start gap-1 text-[10.5px] text-slate-500 dark:text-slate-400 pt-1">
                      <Award size={12} className="text-amber-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        <strong className="text-slate-700 dark:text-slate-300">Milestone: </strong>
                        {student.keyAchievement}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Footer: Category tag & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium font-mono">
                    {student.category || "General"}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingStudent(student)}
                      title="View full profile"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => openEdit(student)}
                      title="Edit graduate profile"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F6E8C] dark:hover:text-teal-300 hover:bg-[#0F6E8C]/10 transition-colors cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setStudentToDelete(student)}
                      title="Delete profile"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── View Profile Modal ───────────────────────────────────────── */}
      {viewingStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setViewingStudent(null)}
        >
          <div
            className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 max-w-lg w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                {Boolean(getImageUrl(viewingStudent.image)) ? (
                  <img
                    src={getImageUrl(viewingStudent.image)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = LogoImg;
                    }}
                    alt={viewingStudent.name}
                    className="w-14 h-14 rounded-full object-cover object-top border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#0F6E8C]/20 text-[#0F6E8C] flex items-center justify-center font-bold text-lg">
                    {viewingStudent.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                    {viewingStudent.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#0F6E8C] dark:text-teal-400">
                    {viewingStudent.program}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {viewingStudent.batchYear} • {viewingStudent.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Current Career Role
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {viewingStudent.currentRole}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <Building2 size={12} className="text-slate-400" />
                  <span>{viewingStudent.currentOrganization}</span>
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <MapPin size={11} className="text-[#0F6E8C] dark:text-teal-400" />
                  <span>{viewingStudent.location}</span>
                </span>
              </div>
            </div>

            {viewingStudent.message && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider block">
                  Graduate Testimonial
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-[#0F6E8C]/5 dark:bg-[#0F6E8C]/15 p-3 rounded-xl border border-[#0F6E8C]/20 leading-relaxed">
                  "{viewingStudent.message}"
                </p>
              </div>
            )}

            {viewingStudent.keyAchievement && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider block">
                  Key Achievement
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700 flex items-start gap-1.5">
                  <Award size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>{viewingStudent.keyAchievement}</span>
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  const s = viewingStudent;
                  setViewingStudent(null);
                  openEdit(s);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F6E8C] text-white text-xs font-semibold hover:bg-[#0B5C74]"
              >
                <Pencil size={12} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ───────────────────────────────── */}
      {studentToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setStudentToDelete(null)}
        >
          <div
            className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle size={20} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Remove Graduate Profile?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to delete the profile for{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {studentToDelete.name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => {
                  const idToDelete = studentToDelete?._id || studentToDelete?.id || studentToDelete?.slug;
                  if (idToDelete) deleteMutation.mutate(idToDelete);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
              >
                {deleteMutation.isPending && <Loader2 size={13} className="animate-spin" />}
                <span>Delete Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStudents;
