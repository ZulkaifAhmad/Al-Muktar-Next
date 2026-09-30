"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCourses } from "@/lib/queries";
import api from "../../lib/api.js";
import { LogoImg, getImageUrl } from "../../assets/assets.js";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Clock,
  Users,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  BookOpen,
  Search,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";
import ApiErrorState from "../../components/ApiErrorState.jsx";
import { compressImageFile } from "../../lib/imageCompressor.js";

const LEVEL_COLORS = {
  Beginner: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
  Intermediate: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
  Advanced: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
};

function CoursePost() {
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [apiMsg, setApiMsg] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    data: courses = [],
    isLoading,
    isError,
    refetch: refetchCourses,
  } = useCourses();

  const filteredCourses = useMemo(() => {
    return courses.filter((c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.level?.toLowerCase().includes(search.toLowerCase())
    );
  }, [courses, search]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchCourses();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const compressed = await compressImageFile(file);
      setImageBase64(compressed);
    }
  };

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageBase64(null);
  };

  const createMutation = useMutation({
    mutationFn: (payload) => api.post("/api/courses", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setApiMsg({ success: true, text: "Course published successfully." });
      resetForm();
      setTimeout(() => setApiMsg(null), 4000);
    },
    onError: (err) => setApiMsg({ success: false, text: err?.response?.data?.message || "Failed to create course." }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/api/courses/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setApiMsg({ success: true, text: "Course updated successfully." });
      resetForm();
      setTimeout(() => setApiMsg(null), 4000);
    },
    onError: (err) => setApiMsg({ success: false, text: err?.response?.data?.message || "Failed to update course." }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/courses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      refetchCourses();
      toast.success("Course deleted successfully.");
      setCourseToDelete(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete course.");
    },
  });

  const resetForm = () => {
    reset();
    removeImage();
    setShowForm(false);
    setEditingCourse(null);
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    reset({
      title: course.title,
      level: course.level,
      duration: course.duration,
      description: course.description || "",
    });
    setImagePreview(course.image || null);
    setImageBase64(null);
    setShowForm(true);
  };

  const onSubmit = async (formData) => {
    setApiMsg(null);
    const payload = {
      title: formData.title,
      level: formData.level,
      duration: formData.duration,
      description: formData.description,
      image: imageBase64 || (editingCourse ? editingCourse.image : null),
    };
    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Academic Courses
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage academy curricula, levels, schedules, and view enrollment counts.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            title="Refresh database"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0F6E8C] hover:text-[#0F6E8C] dark:hover:border-teal-400 dark:hover:text-teal-400 text-xs font-medium shadow-2xs transition-colors"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => {
              if (showForm) resetForm();
              else {
                reset();
                setImagePreview(null);
                setEditingCourse(null);
                setShowForm(true);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F6E8C] text-white text-xs font-semibold shadow-xs hover:bg-[#0B5C74] transition-colors"
          >
            {showForm ? <X size={13} /> : <Plus size={13} />}
            <span>{showForm ? "Cancel" : "Add Course"}</span>
          </button>
        </div>
      </div>

      {apiMsg && (
        <div
          className={`flex items-center gap-2 border text-xs font-medium px-3.5 py-2.5 rounded-lg ${
            apiMsg.success
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
          }`}
        >
          {apiMsg.success ? (
            <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle size={14} className="text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span>{apiMsg.text}</span>
        </div>
      )}

      {/* Course Form — On Screen directly for Mobile, Card for Desktop/Laptop */}
      {showForm && (
        <div className="bg-transparent sm:bg-white sm:dark:bg-[#0c1827] border-0 sm:border border-slate-200 dark:border-slate-800 rounded-none sm:rounded-xl p-0 sm:p-5 shadow-none sm:shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 sm:pb-2.5">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              {editingCourse ? "Edit Course Details" : "Create New Course"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4">
              <div className="sm:col-span-8">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Course Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arabic Language & Syntax (Nahw)"
                  className={`w-full border rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all ${
                    errors.title ? "border-rose-400" : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("title", { required: "Course title is required" })}
                />
                {errors.title && <p className="text-[10px] text-rose-500 mt-1">{errors.title.message}</p>}
              </div>

              <div className="sm:col-span-4">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Academic Level <span className="text-rose-500">*</span>
                </label>
                <select
                  defaultValue=""
                  className={`w-full border rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 cursor-pointer transition-all ${
                    errors.level ? "border-rose-400" : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("level", { required: "Select level" })}
                >
                  <option value="" disabled>Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {errors.level && <p className="text-[10px] text-rose-500 mt-1">{errors.level.message}</p>}
              </div>

              <div className="sm:col-span-4">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Duration <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6 Months / 2 Semesters"
                  className={`w-full border rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all ${
                    errors.duration ? "border-rose-400" : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("duration", { required: "Duration is required" })}
                />
                {errors.duration && <p className="text-[10px] text-rose-500 mt-1">{errors.duration.message}</p>}
              </div>

              <div className="sm:col-span-8">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Cover Image
                </label>
                <div className="flex items-center gap-3">
                  {imagePreview ? (
                    <div className="relative w-16 h-12 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : null}
                  <label className="flex items-center gap-2 px-4 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:border-[#0F6E8C] dark:hover:border-teal-400 cursor-pointer bg-slate-50 dark:bg-slate-800/60 transition-all">
                    <Upload size={14} className="text-slate-400 dark:text-slate-500" />
                    <span>{imagePreview ? "Change Image" : "Upload Thumbnail"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              {/* Description & Detailed Syllabus (Very Big Height) */}
              <div className="sm:col-span-12">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono block">
                    Detailed Course Description &amp; Curriculum Overview
                  </label>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Comprehensive syllabus, requirements &amp; outcomes
                  </span>
                </div>
                <textarea
                  rows={6}
                  placeholder="Provide detailed description of the course, curriculum breakdown, modules covered, prerequisites, learning outcomes, and expected student commitments..."
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm min-h-[160px] sm:min-h-[190px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 leading-relaxed transition-all resize-y"
                  {...register("description")}
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 bg-[#0F6E8C] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 sm:py-2 rounded-xl hover:bg-[#0B5C74] shadow-xs transition-all disabled:opacity-60 cursor-pointer active:scale-95"
              >
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{editingCourse ? "Update Course" : "Save Course"}</span>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 sm:py-2 min-h-[46px] sm:min-h-[38px] w-full sm:w-80 shadow-2xs focus-within:border-[#0F6E8C] dark:focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-[#0F6E8C]/15 transition-all">
          <Search size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs sm:text-sm outline-none w-full bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100"
          />
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          Showing <strong className="text-slate-800 dark:text-slate-200">{filteredCourses.length}</strong> course(s)
        </div>
      </div>

      {/* Professional Data Table */}
      <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-5 space-y-3 animate-pulse">
            <div className="flex items-center gap-2 text-xs font-mono text-[#0F6E8C] dark:text-teal-400">
              <Loader2 size={13} className="animate-spin" />
              <span>Loading academic catalog...</span>
            </div>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg gap-4">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-md shrink-0" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6">
            <ApiErrorState
              title="Unable to load courses"
              message="Failed to retrieve course catalog from server."
              onRetry={handleRefresh}
              isRetrying={isRefreshing}
            />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500">
            <BookOpen size={30} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">No courses match your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50/80 dark:bg-[#0a1420] border-b border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-2.5 px-3.5">Course / Details</th>
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Applicants</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {filteredCourses.map((course) => {
                  const levelClass = LEVEL_COLORS[course.level] || "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
                  return (
                    <tr key={course._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Course info */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(course.image, LogoImg)}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = LogoImg;
                            }}
                            alt={course.title}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50 dark:bg-slate-800"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white text-xs truncate max-w-xs sm:max-w-md">
                              {course.title}
                            </p>
                            {course.description && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                                {course.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Level */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${levelClass}`}>
                          {course.level}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#0F6E8C] dark:text-teal-400" />
                          {course.duration}
                        </span>
                      </td>

                      {/* Applicants */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                          <Users size={12} className="text-[#0F6E8C] dark:text-teal-400" />
                          {course.applicationCount || course.students || 0}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(course)}
                            title="Edit course"
                            className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-[#0F6E8C] dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCourseToDelete(course)}
                            title="Delete course"
                            className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal Dialog for Course Deletion */}
      {courseToDelete && (
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
                  Confirm Course Deletion
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Are you sure you want to permanently delete the course{" "}
                  <span className="font-bold text-slate-900 dark:text-white">"{courseToDelete.title}"</span>?
                </p>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium pt-1">
                  Warning: This action cannot be undone and will remove the course from the public catalog.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const idToDelete = courseToDelete?._id || courseToDelete?.id || courseToDelete?.slug;
                  if (idToDelete) {
                    deleteMutation.mutate(idToDelete);
                  }
                }}
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

export default CoursePost;