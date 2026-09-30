"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminNotifications, useCourses } from "@/lib/queries";
import api from "../../lib/api.js";
import { toast } from "react-toastify";
import {
  Bell,
  Plus,
  Trash2,
  Edit3,
  Eye,
  X,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Link as LinkIcon,
  BookOpen,
  Image as ImageIcon,
  Search,
  ZoomIn,
} from "lucide-react";
import NotificationModal from "../../components/NotificationModal.jsx";
import ApiErrorState from "../../components/ApiErrorState.jsx";
import { compressImageFile } from "../../lib/imageCompressor.js";
import { LogoImg, getImageUrl } from "../../assets/assets.js";

const PRESET_BADGES = [
  "Announcement",
  "New Course Launch",
  "Special Offer",
  "Urgent Notice",
  "Workshop & Event",
  "Admission Open",
];

export default function AdminNotifications() {
  const queryClient = useQueryClient();
  const {
    data: adminNotifications = [],
    isLoading: adminNotificationsLoading,
    isError: isAdminNotificationsError,
    refetch: refetchAdminNotifications,
  } = useAdminNotifications();
  const { data: courses = [] } = useCourses();

  // Form & View States
  const [showForm, setShowForm] = useState(false);
  const [editingNotif, setEditingNotif] = useState(null);
  const [notifToDelete, setNotifToDelete] = useState(null);
  const [previewNotif, setPreviewNotif] = useState(null);
  const [previewNotifsList, setPreviewNotifsList] = useState(null);
  const [fullscreenImageSrc, setFullscreenImageSrc] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [apiMsg, setApiMsg] = useState(null);

  // Image state
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      badge: "Announcement",
      title: "",
      description: "",
      buttonText: "",
      buttonUrl: "",
      isActive: true,
    },
  });

  const watchedBadge = watch("badge");

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return adminNotifications.filter((n) => {
      const q = search.toLowerCase();
      return (
        n.title?.toLowerCase().includes(q) ||
        n.description?.toLowerCase().includes(q) ||
        n.badge?.toLowerCase().includes(q)
      );
    });
  }, [adminNotifications, search]);

  const activeNotifications = useMemo(() => {
    return adminNotifications.filter((n) => n.isActive);
  }, [adminNotifications]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchAdminNotifications();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error("Image size must be under 8MB");
        return;
      }
      setImagePreview(URL.createObjectURL(file));
      const b64 = await compressImageFile(file);
      setImageBase64(b64);
    }
  };

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageBase64("");
  };

  const resetForm = () => {
    reset({
      badge: "Announcement",
      title: "",
      description: "",
      buttonText: "",
      buttonUrl: "",
      isActive: true,
    });
    removeImage();
    setEditingNotif(null);
    setShowForm(false);
  };

  const openEdit = (item) => {
    setEditingNotif(item);
    setImagePreview(item.image || null);
    setImageBase64(null);
    reset({
      badge: item.badge || "Announcement",
      title: item.title || "",
      description: item.description || "",
      buttonText: item.buttonText || "",
      buttonUrl: item.buttonUrl || "",
      isActive: Boolean(item.isActive),
    });
    setShowForm(true);
  };

  const handleCourseSelect = (e) => {
    const courseId = e.target.value;
    if (!courseId) return;

    const selectedCourse = courses.find((c) => c._id === courseId);
    if (selectedCourse) {
      const courseSlugOrId = selectedCourse.slug || selectedCourse._id;
      setValue("buttonUrl", `/courses/${courseSlugOrId}`);
      if (!watch("buttonText")) {
        setValue("buttonText", "View Course");
      }
      if (!watch("badge") || watch("badge") === "Announcement") {
        setValue("badge", "New Course Launch");
      }
      if (!watch("title")) {
        setValue("title", `New Course: ${selectedCourse.title}`);
      }
    }
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload) => api.post("/api/notifications", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      setApiMsg({ success: true, text: "Notification published successfully." });
      resetForm();
      setTimeout(() => setApiMsg(null), 4000);
    },
    onError: (err) => {
      setApiMsg({ success: false, text: err?.response?.data?.message || "Failed to create notification." });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/api/notifications/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      setApiMsg({ success: true, text: "Notification updated successfully." });
      resetForm();
      setTimeout(() => setApiMsg(null), 4000);
    },
    onError: (err) => {
      setApiMsg({ success: false, text: err?.response?.data?.message || "Failed to update notification." });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => api.patch(`/api/notifications/${id}/toggle`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      toast.success(res.data?.message || "Status updated.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to toggle status.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      toast.success("Notification deleted successfully.");
      setNotifToDelete(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete notification.");
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data) => {
    const payload = {
      ...data,
      image: imageBase64 ?? imagePreview ?? "",
    };

    if (editingNotif) {
      updateMutation.mutate({ id: editingNotif._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isAdminNotificationsError) {
    return (
      <ApiErrorState
        title="Failed to Load Notifications"
        message="An error occurred while fetching notifications from the server."
        onRetry={refetchAdminNotifications}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ── FULLSCREEN IMAGE LIGHTBOX ── */}
      {fullscreenImageSrc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000000] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
        >
          <div
            onClick={() => setFullscreenImageSrc(null)}
            className="fixed inset-0 cursor-zoom-out"
          />
          <div className="absolute top-4 right-4 z-30">
            <button
              type="button"
              onClick={() => setFullscreenImageSrc(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <X size={15} />
              <span>Close</span>
            </button>
          </div>
          <div className="relative z-10 max-w-[95vw] max-h-[90vh] flex items-center justify-center">
            <img
              src={fullscreenImageSrc}
              alt="Fullscreen preview"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}

      {/* ── INTERACTIVE USER POPUP PREVIEW ── */}
      {(previewNotif || previewNotifsList) && (
        <NotificationModal
          notifications={previewNotifsList}
          notification={previewNotif}
          isOpen={Boolean(previewNotif || previewNotifsList)}
          onClose={() => {
            setPreviewNotif(null);
            setPreviewNotifsList(null);
          }}
          previewMode={true}
        />
      )}

      {/* ── STANDARD ADMIN HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3 sm:pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Website Notifications
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage site-wide popup announcements, new course alerts, and banners.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {activeNotifications.length > 0 && (
            <button
              type="button"
              onClick={() => setPreviewNotifsList(activeNotifications)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0F6E8C] hover:text-[#0F6E8C] text-xs font-medium shadow-2xs transition-colors cursor-pointer"
              title="Preview all active notifications on website"
            >
              <Eye size={13} className="text-[#0F6E8C]" />
              <span>Preview Live ({activeNotifications.length})</span>
            </button>
          )}

          <button
            onClick={handleRefresh}
            title="Refresh list"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0F6E8C] hover:text-[#0F6E8C] text-xs font-medium shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#0F6E8C]" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => {
              if (showForm) resetForm();
              else {
                reset();
                setImagePreview(null);
                setEditingNotif(null);
                setShowForm(true);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F6E8C] text-white text-xs font-semibold shadow-xs hover:bg-[#0B5C74] transition-colors cursor-pointer"
          >
            {showForm ? <X size={13} /> : <Plus size={13} />}
            <span>{showForm ? "Cancel" : "Add Notification"}</span>
          </button>
        </div>
      </div>

      {/* ── API MESSAGE BANNER ── */}
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

      {/* ── INLINE CREATE / EDIT FORM PANEL — On Screen directly for Mobile, Card for Desktop/Laptop ── */}
      {showForm && (
        <div className="bg-transparent sm:bg-white sm:dark:bg-[#0c1827] border-0 sm:border border-slate-200 dark:border-slate-800 rounded-none sm:rounded-xl p-0 sm:p-5 shadow-none sm:shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 sm:pb-2.5">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Sparkles size={13} className="text-[#0F6E8C]" />
              <span>{editingNotif ? "Edit Notification Details" : "Create New Notification"}</span>
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4">
              {/* Title */}
              <div className="sm:col-span-8">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Notification Title <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Tajweed & Qira'at Certification Course Announced!"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all"
                  {...register("title")}
                />
              </div>

              {/* Badge Tag */}
              <div className="sm:col-span-4">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Category Tag / Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. Announcement"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all"
                  {...register("badge")}
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {PRESET_BADGES.slice(0, 4).map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setValue("badge", b)}
                      className={`text-[10px] px-2 py-1 rounded-md border transition-all cursor-pointer ${
                        watchedBadge === b
                          ? "bg-[#0F6E8C] text-white border-[#0F6E8C]"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-[#0F6E8C]"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description (Very Big Height) */}
              <div className="sm:col-span-12">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono block">
                    Detailed Announcement / Notification Message
                  </label>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Comprehensive notice details displayed to students
                  </span>
                </div>
                <textarea
                  rows={5}
                  placeholder="Enter full announcement details, schedule notes, instructions, admission highlights, or eligibility guidelines..."
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm min-h-[140px] sm:min-h-[170px] outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 leading-relaxed transition-all resize-y"
                  {...register("description")}
                />
              </div>

              {/* Course Quick Auto-fill */}
              <div className="sm:col-span-12 p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <BookOpen size={14} className="text-[#0F6E8C]" />
                  <span>Link to a Course (Auto-fill Button Text & Route)</span>
                </div>

                <select
                  onChange={handleCourseSelect}
                  defaultValue=""
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs min-h-[46px] sm:min-h-[42px] bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0F6E8C] cursor-pointer"
                >
                  <option value="">-- Optional: Select course to auto-fill redirect details --</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title} ({course.level || "Course"})
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. View Course"
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm sm:text-xs min-h-[44px] sm:min-h-[40px] bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0F6E8C]"
                      {...register("buttonText")}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Redirect URL (Internal route or external link)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /courses/quran-tajweed-course"
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm sm:text-xs min-h-[44px] sm:min-h-[40px] bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0F6E8C]"
                      {...register("buttonUrl")}
                    />
                  </div>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="sm:col-span-8">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Banner Image <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="flex items-center gap-3">
                  {imagePreview ? (
                    <div className="relative w-16 h-12 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : null}
                  <label className="flex items-center gap-2 px-4 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:border-[#0F6E8C] cursor-pointer bg-slate-50 dark:bg-slate-800/60 transition-all">
                    <Upload size={14} className="text-slate-400 dark:text-slate-500" />
                    <span>{imagePreview ? "Change Image" : "Upload Banner (PNG/JPG)"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="sm:col-span-4 flex items-center pt-2 sm:pt-4">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-[#0F6E8C] border-slate-300 dark:border-slate-700 focus:ring-[#0F6E8C]"
                    {...register("isActive")}
                  />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Active (Live on Website)
                  </span>
                </label>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0F6E8C] text-white text-xs font-semibold shadow-xs hover:bg-[#0B5C74] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isPending && <Loader2 size={13} className="animate-spin" />}
                <span>{editingNotif ? "Save Changes" : "Publish Notification"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── SEARCH & SUMMARY STRIP ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search notifications by title, badge or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-[#0F6E8C]"
          />
          <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing <strong>{filteredNotifications.length}</strong> notifications (<strong>{activeNotifications.length}</strong> active)
        </div>
      </div>

      {/* ── NOTIFICATIONS TABLE (Responsive, Compact Text, Invisible Scrollbar on Mobile) ── */}
      <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        {adminNotificationsLoading ? (
          <div className="p-8 text-center text-slate-500">
            <Loader2 size={24} className="animate-spin text-[#0F6E8C] mx-auto mb-2" />
            <p className="text-xs font-medium">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500">
            <Bell size={28} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {search ? "No notifications match your search." : "No notifications created yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50/80 dark:bg-[#0a1420] border-b border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-2.5 px-3.5">Notification / Details</th>
                  <th className="py-2.5 px-2.5">Badge</th>
                  <th className="py-2.5 px-2.5 hidden sm:table-cell">Target Action</th>
                  <th className="py-2.5 px-2.5">Status</th>
                  <th className="py-2.5 px-2.5 hidden md:table-cell">Created</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {filteredNotifications.map((notif) => (
                  <tr
                    key={notif._id}
                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                      notif.isActive ? "bg-[#0F6E8C]/5 dark:bg-[#0F6E8C]/10" : ""
                    }`}
                  >
                    {/* Notification info */}
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-2.5">
                        {Boolean(getImageUrl(notif.image)) ? (
                          <div
                            onClick={() => setFullscreenImageSrc(getImageUrl(notif.image))}
                            title="Click to view full image"
                            className="relative group cursor-pointer shrink-0"
                          >
                            <img
                              src={getImageUrl(notif.image)}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = LogoImg;
                              }}
                              alt=""
                              className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-2xs group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <ZoomIn size={11} />
                            </div>
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                            <ImageIcon size={15} />
                          </div>
                        )}
                        <div className="min-w-0 max-w-[130px] sm:max-w-[170px] md:max-w-[200px] lg:max-w-[230px]">
                          <p className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                            {notif.title || <span className="italic text-slate-400">Untitled Announcement</span>}
                          </p>
                          {notif.description && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {notif.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Badge */}
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {notif.badge || "Announcement"}
                      </span>
                    </td>

                    {/* Target Action */}
                    <td className="py-2.5 px-2.5 whitespace-nowrap hidden sm:table-cell">
                      {notif.buttonText && notif.buttonUrl ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0F6E8C] dark:text-teal-400 truncate max-w-[140px]">
                          <LinkIcon size={10} className="shrink-0" />
                          <span className="truncate">{notif.buttonText}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">None</span>
                      )}
                    </td>

                    {/* Live Status */}
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleMutation.mutate(notif._id)}
                        disabled={toggleMutation.isPending}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                          notif.isActive
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-700"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${notif.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                        <span>{notif.isActive ? "Active" : "Inactive"}</span>
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="py-2.5 px-2.5 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400 hidden md:table-cell">
                      {new Date(notif.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewNotif(notif)}
                          title="Preview modal popup"
                          className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-[#0F6E8C] dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(notif)}
                          title="Edit notification"
                          className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setNotifToDelete(notif)}
                          title="Delete notification"
                          className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {notifToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-[#0c1827] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Delete Notification?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Are you sure you want to delete "{notifToDelete.title || "this notification"}"?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setNotifToDelete(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(notifToDelete._id)}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                {deleteMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
