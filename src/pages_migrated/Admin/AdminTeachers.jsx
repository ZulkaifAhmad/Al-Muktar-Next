"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTeachers } from "@/lib/queries";
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
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Quote,
  Mail,
  Phone,
  Eye,
  Sparkles,
  Check,
  UserCheck,
  Building2,
  Briefcase,
  Star,
} from "lucide-react";
import { LogoImg, getImageUrl } from "../../assets/assets.js";

function AdminTeachers() {
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [apiMsg, setApiMsg] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      role: "",
      department: "",
      experienceYears: "5+ Years",
      studentsMentored: "200+",
      email: "",
      phone: "",
      quote: "",
      bio: "",
      specializations: "",
      status: "active",
      order: 0,
    },
  });

  const {
    data: teachers = [],
    isLoading,
    isError,
    refetch: refetchTeachers,
  } = useTeachers();

  // Extract unique departments for metric calculation
  const departments = useMemo(() => {
    const set = new Set();
    teachers.forEach((t) => {
      if (t.department) set.add(t.department);
    });
    return Array.from(set);
  }, [teachers]);

  // Key stats calculation
  const stats = useMemo(() => {
    const total = teachers.length;
    const active = teachers.filter((t) => t.status === "active").length;
    const deptCount = departments.length;
    return { total, active, deptCount };
  }, [teachers, departments]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchTeachers();
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
      role: "",
      department: "",
      experienceYears: "5+ Years",
      studentsMentored: "200+",
      email: "",
      phone: "",
      quote: "",
      bio: "",
      specializations: "",
      status: "active",
      order: 0,
    });
    removeImage();
    setShowForm(false);
    setEditingTeacher(null);
  };

  const openEdit = (teacher) => {
    setEditingTeacher(teacher);
    reset({
      name: teacher.name || "",
      role: teacher.role || "",
      department: teacher.department || "",
      experienceYears: teacher.experienceYears || "5+ Years",
      studentsMentored: teacher.studentsMentored || "200+",
      email: teacher.email || "",
      phone: teacher.phone || "",
      quote: teacher.quote || "",
      bio: teacher.bio || "",
      specializations: Array.isArray(teacher.specializations)
        ? teacher.specializations.join(", ")
        : teacher.specializations || "",
      status: teacher.status || "active",
      order: teacher.order ?? 0,
    });
    setImagePreview(teacher.image || null);
    setImageBase64(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createMutation = useMutation({
    mutationFn: (payload) => api.post("/api/teachers", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setApiMsg({ success: true, text: "Teacher added successfully." });
      resetForm();
      setTimeout(() => setApiMsg(null), 4000);
    },
    onError: (err) => {
      setApiMsg({
        success: false,
        text: err?.response?.data?.message || "Failed to add teacher.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/api/teachers/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setApiMsg({ success: true, text: "Teacher updated successfully." });
      resetForm();
      setTimeout(() => setApiMsg(null), 4000);
    },
    onError: (err) => {
      setApiMsg({
        success: false,
        text: err?.response?.data?.message || "Failed to update teacher.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/teachers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      if (refetchTeachers) refetchTeachers();
      toast.success("Teacher removed successfully.");
      setTeacherToDelete(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete teacher.");
    },
  });

  const onSubmit = async (formData) => {
    setApiMsg(null);
    const specsArray = formData.specializations
      ? formData.specializations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const payload = {
      name: formData.name,
      role: formData.role,
      department: formData.department,
      experienceYears: formData.experienceYears,
      studentsMentored: formData.studentsMentored,
      email: formData.email,
      phone: formData.phone,
      quote: formData.quote,
      bio: formData.bio,
      specializations: specsArray,
      status: formData.status,
      order: Number(formData.order) || 0,
      image: imageBase64 || (editingTeacher ? editingTeacher.image : imagePreview || ""),
    };

    if (editingTeacher) {
      updateMutation.mutate({ id: editingTeacher._id, payload });
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
              Faculty & Instructors
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#0F6E8C]/10 text-[#0F6E8C] dark:bg-[#0F6E8C]/20 dark:text-teal-300 font-mono">
              {teachers.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add new teachers, update scholarly qualifications, biographies, and department allocations.
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
            <span>{showForm ? "Close Form" : "Add Teacher"}</span>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800/80 p-3.5 rounded-xl shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0F6E8C]/10 dark:bg-[#0F6E8C]/20 text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center shrink-0">
            <Users size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              Total Faculty
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              {stats.total}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800/80 p-3.5 rounded-xl shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              Active Instructors
            </div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-heading">
              {stats.active}
            </div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800/80 p-3.5 rounded-xl shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Building2 size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              Departments
            </div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-heading">
              {stats.deptCount}
            </div>
          </div>
        </div>
      </div>

      {/* ── Add / Edit Teacher Form — On Screen directly for Mobile, Card for Desktop/Laptop ── */}
      {showForm && (
        <div className="bg-transparent sm:bg-white sm:dark:bg-[#0c1827] border-0 sm:border border-slate-200 dark:border-slate-800 rounded-none sm:rounded-xl p-0 sm:p-6 shadow-none sm:shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#0F6E8C] text-white flex items-center justify-center">
                {editingTeacher ? <Pencil size={12} /> : <Plus size={12} />}
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                {editingTeacher ? `Edit: ${editingTeacher.name}` : "Add New Faculty Member"}
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
                  Teacher Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mufti Muhammad Ismail"
                  className={`w-full border rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all ${
                    errors.name ? "border-rose-400" : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("name", { required: "Teacher name is required" })}
                />
                {errors.name && (
                  <span className="text-[10px] text-rose-500 mt-1 block">{errors.name.message}</span>
                )}
              </div>

              {/* Role / Title */}
              <div className="sm:col-span-6">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Academic Role / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Scholar & Director"
                  className={`w-full border rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all ${
                    errors.role ? "border-rose-400" : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("role", { required: "Role is required" })}
                />
                {errors.role && (
                  <span className="text-[10px] text-rose-500 mt-1 block">{errors.role.message}</span>
                )}
              </div>

              {/* Department */}
              <div className="sm:col-span-6">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Department <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Islamic Jurisprudence & Hadith"
                  className={`w-full border rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all ${
                    errors.department ? "border-rose-400" : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("department", { required: "Department is required" })}
                />
                {errors.department && (
                  <span className="text-[10px] text-rose-500 mt-1 block">{errors.department.message}</span>
                )}
              </div>

              {/* Experience Years */}
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Experience
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10+ Years"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all"
                  {...register("experienceYears")}
                />
              </div>

              {/* Students Mentored */}
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Mentored Count
                </label>
                <input
                  type="text"
                  placeholder="e.g. 800+"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all"
                  {...register("studentsMentored")}
                />
              </div>

              {/* Email (Optional) */}
              <div className="sm:col-span-4">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="teacher@almukhtar.edu"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all"
                  {...register("email")}
                />
              </div>

              {/* Phone (Optional) */}
              <div className="sm:col-span-4">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all"
                  {...register("phone")}
                />
              </div>

              {/* Status */}
              <div className="sm:col-span-4">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Status
                </label>
                <select
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 cursor-pointer transition-all"
                  {...register("status")}
                >
                  <option value="active">Active Faculty</option>
                  <option value="inactive">Inactive / On Leave</option>
                </select>
              </div>

              {/* Specializations */}
              <div className="sm:col-span-12">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Specializations (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fiqh, Usul-ul-Fiqh, Hadith Studies, Tafseer"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all"
                  {...register("specializations")}
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Separate multiple tags with commas. Example: Tajweed, Vocal Cadence, Qira'at
                </span>
              </div>

              {/* Scholarly Philosophy / Quote */}
              <div className="sm:col-span-12">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Scholarly Philosophy / Direct Quote
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Our mission is to cultivate principled scholars anchored in classical authenticity..."
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 text-xs sm:text-sm min-h-[90px] sm:min-h-[110px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 leading-relaxed transition-all resize-y"
                  {...register("quote")}
                />
              </div>

              {/* Biography / Description (Very Big Height) */}
              <div className="sm:col-span-12">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono block">
                    Detailed Academic Biography, Publications &amp; Sanad History
                  </label>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Comprehensive scholarly pedigree &amp; teaching achievements
                  </span>
                </div>
                <textarea
                  rows={7}
                  placeholder="Comprehensive academic dossier: seminary education, teachers, ijazaat (licenses to teach), published treatises, research work, departmental responsibilities, and mentorship methodology..."
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm min-h-[180px] sm:min-h-[220px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 leading-relaxed transition-all resize-y"
                  {...register("bio")}
                />
              </div>

              {/* Teacher Photo Upload */}
              <div className="sm:col-span-12">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Teacher Photograph
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
                  {imagePreview ? (
                    <div className="relative group shrink-0">
                      <img
                        src={imagePreview}
                        alt="Teacher preview"
                        className="w-20 h-20 rounded-xl object-cover object-top border border-slate-200 dark:border-slate-700 shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition-colors"
                        title="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-slate-800 shrink-0">
                      <GraduationCap size={24} className="opacity-50" />
                      <span className="text-[9px] mt-1">No photo</span>
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
                <span>{editingTeacher ? "Update Teacher" : "Save Teacher"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Teachers Grid / Cards ───────────────────────────────────── */}
      {isLoading ? (
        <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
          <Loader2 size={28} className="animate-spin text-[#0F6E8C] dark:text-teal-400 mx-auto" />
          <p className="text-xs text-slate-500 mt-2 font-medium">Loading faculty members...</p>
        </div>
      ) : isError ? (
        <ApiErrorState
          title="Could not load teachers"
          message="An error occurred while fetching the faculty directory."
          onRetry={refetchTeachers}
        />
      ) : teachers.length === 0 ? (
        <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#0F6E8C]/10 text-[#0F6E8C] dark:bg-[#0F6E8C]/20 dark:text-teal-300 flex items-center justify-center mx-auto">
            <GraduationCap size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No teachers added yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your first faculty scholar to showcase them across course details and the academy about page.
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
              <span>Add First Teacher</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((teacher) => {
            const isActive = teacher.status === "active";
            return (
              <div
                key={teacher._id || teacher.id}
                className="bg-white dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800/80 hover:border-[#0F6E8C]/40 dark:hover:border-teal-500/30 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between transition-all group relative"
              >
                {/* Card Top: Photo + Details + Status */}
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3.5">
                    {Boolean(getImageUrl(teacher.image)) ? (
                      <img
                        src={getImageUrl(teacher.image)}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = LogoImg;
                        }}
                        alt={teacher.name}
                        className="w-14 h-14 rounded-xl object-cover object-top border border-slate-100 dark:border-slate-700 shadow-2xs shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0F6E8C]/20 to-[#0B1E2D]/20 text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center font-bold text-base border border-slate-200 dark:border-slate-700 shrink-0">
                        {teacher.name?.charAt(0) || "T"}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider font-mono ${
                            isActive
                              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          {teacher.status || "active"}
                        </span>

                        {teacher.experienceYears && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {teacher.experienceYears}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate font-heading group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors">
                        {teacher.name}
                      </h3>
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">
                        {teacher.role}
                      </p>
                      <p className="text-[10px] text-[#0F6E8C] dark:text-teal-400 font-mono font-medium truncate mt-0.5">
                        {teacher.department}
                      </p>
                    </div>
                  </div>

                  {/* Scholarly Quote Preview */}
                  {teacher.quote && (
                    <div className="bg-slate-50/70 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300 italic line-clamp-2">
                      "{teacher.quote}"
                    </div>
                  )}

                  {/* Specialization Tags */}
                  {Array.isArray(teacher.specializations) &&
                    teacher.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {teacher.specializations.slice(0, 3).map((spec, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9.5px] font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                        {teacher.specializations.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[9.5px] text-slate-400">
                            +{teacher.specializations.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                </div>

                {/* Card Footer: Metrics & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-400 font-mono">
                    Mentored:{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {teacher.studentsMentored || "—"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingTeacher(teacher)}
                      title="View full profile"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => openEdit(teacher)}
                      title="Edit teacher"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F6E8C] dark:hover:text-teal-300 hover:bg-[#0F6E8C]/10 transition-colors cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setTeacherToDelete(teacher)}
                      title="Delete teacher"
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

      {/* ── View Teacher Profile Modal ───────────────────────────────── */}
      {viewingTeacher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setViewingTeacher(null)}
        >
          <div
            className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 max-w-lg w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                {Boolean(getImageUrl(viewingTeacher.image)) ? (
                  <img
                    src={getImageUrl(viewingTeacher.image)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = LogoImg;
                    }}
                    alt={viewingTeacher.name}
                    className="w-16 h-16 rounded-2xl object-cover object-top border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#0F6E8C]/20 text-[#0F6E8C] flex items-center justify-center font-bold text-xl">
                    {viewingTeacher.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                    {viewingTeacher.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {viewingTeacher.role}
                  </p>
                  <p className="text-[11px] text-[#0F6E8C] dark:text-teal-400 font-mono">
                    {viewingTeacher.department}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingTeacher(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Experience
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {viewingTeacher.experienceYears || "—"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Students Mentored
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {viewingTeacher.studentsMentored || "—"}
                </span>
              </div>
            </div>

            {viewingTeacher.quote && (
              <div className="p-3 rounded-xl bg-[#0F6E8C]/5 dark:bg-[#0F6E8C]/15 border border-[#0F6E8C]/20 text-xs text-slate-700 dark:text-slate-200 italic">
                "{viewingTeacher.quote}"
              </div>
            )}

            {viewingTeacher.bio && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider block">
                  Biography & Background
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {viewingTeacher.bio}
                </p>
              </div>
            )}

            {Array.isArray(viewingTeacher.specializations) &&
              viewingTeacher.specializations.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider block">
                    Specializations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingTeacher.specializations.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  const t = viewingTeacher;
                  setViewingTeacher(null);
                  openEdit(t);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F6E8C] text-white text-xs font-semibold hover:bg-[#0B5C74]"
              >
                <Pencil size={12} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ───────────────────────────────── */}
      {teacherToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setTeacherToDelete(null)}
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
                Remove Faculty Member?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {teacherToDelete.name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setTeacherToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => {
                  const idToDelete = teacherToDelete?._id || teacherToDelete?.id || teacherToDelete?.slug;
                  if (idToDelete) deleteMutation.mutate(idToDelete);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
              >
                {deleteMutation.isPending && <Loader2 size={13} className="animate-spin" />}
                <span>Delete Teacher</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTeachers;
