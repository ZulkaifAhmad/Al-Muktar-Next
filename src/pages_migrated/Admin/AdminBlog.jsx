"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminBlogs } from "@/lib/queries";
import { Link } from "@/lib/navigation-adapter";
import api from "../../lib/api.js";
import { toast } from "react-toastify";
import ReactQuill from "@/components/QuillEditor";
import { LogoImg, getImageUrl } from "../../assets/assets.js";
import {
  Plus,
  Trash2,
  X,
  Newspaper,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Eye,
  RefreshCw,
  Edit3,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Tag,
  FileText,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { getReadingTime, calculateReadingStats } from "../../components/BlogCard.jsx";
import ApiErrorState from "../../components/ApiErrorState.jsx";
import { compressImageFile } from "../../lib/imageCompressor.js";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["blockquote", "code-block"],
    ["link"],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
};

// Note: formats prop is intentionally omitted to allow all registered formats.
// react-quill-new v3.x (Quill 2.x) changed format registration and specifying
// formats like "bullet" explicitly causes registration errors.

const PRESET_CATEGORIES = [
  "Blog",
  "News or Notification",
];

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function AdminBlog() {
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]); // { preview, base64, existing }
  const [apiMsg, setApiMsg] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [customSubject, setCustomSubject] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      subject: "Blog",
      description: "",
      content: "",
      status: "published",
    },
  });

  const selectedSubject = watch("subject");
  const watchTitle = watch("title");
  const watchDescription = watch("description");
  const watchContent = watch("content");

  const liveReadingStats = React.useMemo(() => {
    return calculateReadingStats({
      title: watchTitle,
      description: watchDescription,
      content: watchContent,
      images: selectedImages,
    });
  }, [watchTitle, watchDescription, watchContent, selectedImages]);

  // Fetch blogs directly via TanStack Query
  const {
    data: blogs = [],
    isLoading,
    isError,
    refetch: refetchAdminBlogs,
  } = useAdminBlogs();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchAdminBlogs();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (selectedImages.length + files.length > 3) {
      toast.warning("You can upload up to 3 images per article.");
      return;
    }
    const newImages = await Promise.all(
      files.map(async (file) => ({
        file,
        preview: URL.createObjectURL(file),
        base64: await compressImageFile(file),
      }))
    );
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => {
      const updated = [...prev];
      if (updated[index]?.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  const createMutation = useMutation({
    mutationFn: (payload) => api.post("/api/blogs", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Publication created successfully!");
      resetForm();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to publish article."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/blogs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Article deleted successfully.");
      setBlogToDelete(null);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to delete article."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/api/blogs/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Publication updated successfully!");
      resetForm();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update article."),
  });

  const resetForm = () => {
    reset({
      title: "",
      subject: "Blog",
      description: "",
      content: "",
      status: "published",
    });
    selectedImages.forEach((img) => {
      if (img.preview?.startsWith("blob:")) URL.revokeObjectURL(img.preview);
    });
    setSelectedImages([]);
    setShowForm(false);
    setEditingBlog(null);
    setCustomSubject(false);
  };

  const openEdit = (blog) => {
    setEditingBlog(blog);
    const isPreset = PRESET_CATEGORIES.includes(blog.subject);
    setCustomSubject(!isPreset);
    reset({
      title: blog.title || "",
      subject: blog.subject || "Quran Studies",
      description: blog.description || "",
      content: blog.content || "",
      status: blog.status || "published",
    });

    const existingImgs = (Array.isArray(blog.images) ? blog.images : blog.image ? [blog.image] : [])
      .map((url) => ({ preview: url, base64: url, existing: true }));
    setSelectedImages(existingImgs);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (formData) => {
    const images = selectedImages.map((img) => img.base64);
    const payload = {
      title: formData.title,
      subject: formData.subject,
      description: formData.description,
      content: formData.content,
      status: formData.status || "published",
      images,
    };

    if (editingBlog) {
      updateMutation.mutate({ id: editingBlog._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Publications &amp; Blog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create, edit, and organize research articles, scholarly guides, and academy news.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh database"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0F6E8C] hover:text-[#0F6E8C] dark:hover:border-teal-400 dark:hover:text-teal-400 text-xs font-medium shadow-2xs transition-colors"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (showForm) resetForm();
              else setShowForm(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F6E8C] text-white text-xs font-semibold shadow-xs hover:bg-[#0B5C74] transition-colors"
          >
            {showForm ? <X size={13} /> : <Plus size={13} />}
            <span>{showForm ? "Cancel" : "New Article"}</span>
          </button>
        </div>
      </div>

      {/* Editor Form — On Screen directly for Mobile, Card for Desktop/Laptop */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-transparent sm:bg-white sm:dark:bg-[#0c1827] border-0 sm:border border-slate-200 dark:border-slate-800 rounded-none sm:rounded-xl p-0 sm:p-5 shadow-none sm:shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-3 sm:pb-2.5 border-b border-slate-200/80 dark:border-slate-800">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              {editingBlog ? "Edit Article" : "Compose Article"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={15} />
            </button>
          </div>

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono block mb-1.5">
                Article Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Understanding the Rules of Tajweed in Quranic Recitation..."
                className={`w-full border rounded-xl px-4 py-3 sm:py-2.5 min-h-[48px] sm:min-h-[44px] text-sm sm:text-base font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 bg-slate-50/50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 transition-all ${
                  errors.title ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
                }`}
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Subject / Category & Status */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono block">
                    Category / Subject <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomSubject(!customSubject)}
                    className="text-xs text-[#0F6E8C] dark:text-teal-400 font-semibold hover:underline cursor-pointer"
                  >
                    {customSubject ? "Choose from presets" : "+ Custom category"}
                  </button>
                </div>

                {customSubject ? (
                  <input
                    type="text"
                    placeholder="Enter custom category name..."
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15"
                    {...register("subject", { required: "Subject is required" })}
                  />
                ) : (
                  <select
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 cursor-pointer"
                    {...register("subject", { required: "Subject is required" })}
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
                {errors.subject && (
                  <p className="text-xs text-rose-500 mt-1">{errors.subject.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="md:col-span-4">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono block mb-1.5">
                  Publication Status
                </label>
                <select
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 cursor-pointer"
                  {...register("status")}
                >
                  <option value="published">Published (Public)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            {/* Short Description / Lead Excerpt (Very Big Height) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono block">
                  Lead Excerpt &amp; Article Summary <span className="text-slate-400 dark:text-slate-500 font-normal font-sans">(Displayed at top of article & in cards)</span>
                </label>
              </div>
              <textarea
                rows={4}
                placeholder="Brief multi-sentence overview summarizing key takeaways, target audience, and executive thesis of this research or educational article..."
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm min-h-[120px] sm:min-h-[140px] text-slate-800 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 leading-relaxed transition-all resize-y"
                {...register("description")}
              />
            </div>

            {/* Images Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#0F6E8C] dark:text-teal-400" />
                  <span>Cover Image &amp; Gallery (Max 3)</span>
                </label>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {selectedImages.length}/3 selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {selectedImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-video border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden group shadow-2xs bg-slate-100 dark:bg-slate-800"
                  >
                    <img
                      src={img.preview}
                      alt="Article preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-mono font-bold">
                      {index === 0 ? "Cover Image" : `Attachment ${index + 1}`}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-all cursor-pointer shadow-md"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {selectedImages.length < 3 && (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0F6E8C] dark:hover:border-teal-400 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-teal-50/30 dark:hover:bg-teal-950/30 rounded-2xl aspect-video cursor-pointer transition-all">
                    <Upload size={24} className="text-slate-400 dark:text-slate-500 mb-1.5" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Media</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">PNG, JPG, WEBP (Max 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Rich Text Editor Content (Very Big Height) */}
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono block">
                  Article Body Content <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-[#0F6E8C] dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60 shadow-2xs">
                    <Clock className="w-3 h-3 text-[#0F6E8C] dark:text-teal-400" />
                    <span>{liveReadingStats.text}</span>
                    <span className="text-slate-400 dark:text-slate-500 font-normal">({liveReadingStats.words} words)</span>
                  </span>
                </div>
              </div>
              <Controller
                name="content"
                control={control}
                rules={{
                  required: "Content is required",
                  validate: (v) => {
                    const text = v?.replace(/<[^>]*>/g, "").trim();
                    return text?.length >= 20 || "Content must be at least 20 characters";
                  },
                }}
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    modules={quillModules}
                    className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden [&>.ql-container]:min-h-[380px] sm:[&>.ql-container]:min-h-[440px] [&>.ql-container]:rounded-b-2xl [&>.ql-toolbar]:rounded-t-2xl [&>.ql-container]:text-base border border-slate-200 dark:border-slate-700"
                    placeholder="Write detailed Islamic research insights, Quranic explanations, or announcements..."
                  />
                )}
              />
              {errors.content && (
                <p className="text-xs text-rose-500 mt-1.5">{errors.content.message}</p>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 bg-[#0F6E8C] hover:bg-[#0B5C74] text-white font-extrabold px-6 py-2.5 rounded-xl transition-all text-xs sm:text-sm shadow-md disabled:opacity-60 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : editingBlog ? (
                  <span>Update Publication</span>
                ) : (
                  <span>Publish Article</span>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Publications Table */}
      <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-5 space-y-3 animate-pulse">
            <div className="flex items-center gap-2 text-xs font-mono text-[#0F6E8C] dark:text-teal-400">
              <Loader2 className="animate-spin" size={13} />
              <span>Loading publications...</span>
            </div>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6">
            <ApiErrorState
              title="Unable to load publications"
              message="Failed to retrieve blog articles from the server."
              onRetry={handleRefresh}
              isRetrying={isRefreshing}
            />
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500">
            <Newspaper className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={32} />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">
              No publications found
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-sm mx-auto mt-0.5">
              Create your first article by clicking "New Article" above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-[#0a1420] border-b border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                  <th className="py-2.5 px-3.5">Article</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Views</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-3.5 max-w-[280px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                          <img
                            src={getImageUrl((blog.images && blog.images[0]) || blog.image, LogoImg)}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = LogoImg;
                            }}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white text-xs truncate leading-snug">
                            {blog.title}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">
                            /{blog.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <Tag className="w-2.5 h-2.5 text-[#0F6E8C] dark:text-teal-400" />
                        {blog.subject || "General"}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize font-mono border ${
                          blog.status === "published"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                        <Eye className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span>{blog.views || 1}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {formatDate(blog.createdAt)}
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/blog/${blog.slug || blog._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded-md text-slate-400 hover:text-[#0F6E8C] dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 transition-colors"
                          title="View Live Article"
                        >
                          <ExternalLink size={13} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEdit(blog)}
                          className="p-1 rounded-md text-slate-400 hover:text-[#0F6E8C] dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setBlogToDelete(blog)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="Delete Article"
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

      {/* Confirmation Modal Dialog for Article Deletion */}
      {blogToDelete && (
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
                  Confirm Article Deletion
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Are you sure you want to permanently delete the article{" "}
                  <span className="font-bold text-slate-900 dark:text-white">"{blogToDelete.title}"</span>?
                </p>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium pt-1">
                  Warning: This action cannot be undone and will remove the publication from the live website.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setBlogToDelete(null)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(blogToDelete._id)}
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

export default AdminBlog;