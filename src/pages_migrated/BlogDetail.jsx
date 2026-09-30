"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useLocation, useNavigate } from "@/lib/navigation-adapter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBlogs } from "@/lib/queries";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Eye,
  Share2,
  Printer,
  ShieldCheck,
  MessageCircle,
  BookOpen,
  ChevronDown,
  ListFilter,
  Check,
  Send,
  User,
  Sparkles,
  Tag,
  Loader2,
  Edit3,
  Trash2,
  CornerDownRight,
  X,
  MessageSquare,
  LogIn,
  ZoomIn,
} from "lucide-react";
import { LogoImg, getImageUrl } from "../assets/assets.js";
import ApiErrorState from "../components/ApiErrorState.jsx";
import { toast } from "react-toastify";
import { formatDate, getReadingTime, getSnippet } from "../components/BlogCard.jsx";

// Smart parser: cleans artifacts, extracts headings (H1-H6, bold headers, or paragraphs), and injects IDs
function processArticleContent(rawHtml) {
  if (!rawHtml) return { html: "", headings: [] };

  // 1. Clean out artificial word-break tags and soft hyphens
  let cleaned = rawHtml
    .replace(/<wbr\s*\/?>/gi, "")
    .replace(/&shy;/gi, "")
    .replace(/[\u00AD\u200B\u200C\u200D\uFEFF]/g, "")
    .replace(/&nbsp;/g, " ");

  let headings = [];
  let headingIndex = 0;

  // 2. First pass: look for H1-H6 tags
  let html = cleaned.replace(
    /<(h[1-6])([^>]*)>(.*?)<\/\1>/gi,
    (match, tag, attrs, inner) => {
      const plainText = inner.replace(/<[^>]*>/g, "").trim();
      if (!plainText) return match;

      const slug =
        plainText
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 40) || `section-${headingIndex}`;

      const id = `${slug}-${headingIndex++}`;
      headings.push({
        id,
        text: plainText,
        level: parseInt(tag[1], 10),
      });

      return `<${tag} id="${id}" ${attrs}>${inner}</${tag}>`;
    }
  );

  // 3. If no standard H1-H6 tags found, scan for bold headings inside paragraphs (<p><strong>...</strong></p>)
  if (headings.length < 2) {
    headingIndex = 0;
    const fallbackHeadings = [];
    const fallbackHtml = cleaned.replace(
      /<p([^>]*)>\s*<(strong|b)>([^<]{3,80})<\/\2>(.*?)<\/p>/gi,
      (match, pAttrs, bTag, boldText, rest) => {
        const plainText = boldText.trim();
        if (!plainText || plainText.length < 3) return match;

        const slug =
          plainText
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 40) || `topic-${headingIndex}`;

        const id = `${slug}-${headingIndex++}`;
        fallbackHeadings.push({
          id,
          text: plainText,
          level: 2,
        });

        return `<p id="${id}" ${pAttrs}><${bTag}>${boldText}</${bTag}>${rest}</p>`;
      }
    );

    if (fallbackHeadings.length >= 2) {
      headings = fallbackHeadings;
      html = fallbackHtml;
    }
  }

  // 4. If still no headings found (e.g. plain text / unstructured story), generate structured section anchors
  if (headings.length === 0) {
    let pCount = 0;
    const generatedHeadings = [];
    html = cleaned.replace(/<p([^>]*)>(.*?)<\/p>/gi, (match, pAttrs, inner) => {
      const plainText = inner.replace(/<[^>]*>/g, "").trim();
      if (!plainText || plainText.length < 20) return match;
      pCount++;
      if (pCount === 1) {
        const id = "overview-section";
        generatedHeadings.push({ id, text: "Overview & Introduction", level: 2 });
        return `<p id="${id}" ${pAttrs}>${inner}</p>`;
      } else if (pCount === 3) {
        const id = "details-section";
        generatedHeadings.push({ id, text: "Key Insights & Discussion", level: 2 });
        return `<p id="${id}" ${pAttrs}>${inner}</p>`;
      } else if (pCount === 6) {
        const id = "conclusion-section";
        generatedHeadings.push({ id, text: "Summary & Conclusion", level: 2 });
        return `<p id="${id}" ${pAttrs}>${inner}</p>`;
      }
      return match;
    });

    if (generatedHeadings.length > 0) {
      headings = generatedHeadings;
    }
  }

  return { html, headings };
}

function BlogDetail() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const [activeHeadingId, setActiveHeadingId] = useState("");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingReplyKey, setEditingReplyKey] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(10);
  const [copied, setCopied] = useState(false);
  const [activeImageModal, setActiveImageModal] = useState(null);
  const responsesRef = useRef(null);

  // Fetch current blog post with real-time view increment and cache synchronization
  const {
    data: blog,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const res = await api.get(`/api/blogs/${slug}`);
      const fetchedBlog = res.data?.blog;
      if (fetchedBlog) {
        // Synchronize updated views to global blogs cache in real-time
        queryClient.setQueryData(["blogs"], (oldBlogs) => {
          if (!Array.isArray(oldBlogs)) return oldBlogs;
          return oldBlogs.map((b) =>
            b.slug === slug || b._id === fetchedBlog._id || b.slug === fetchedBlog.slug
              ? { ...b, views: fetchedBlog.views }
              : b
          );
        });
        queryClient.setQueryData(["adminBlogs"], (oldAdminBlogs) => {
          if (!Array.isArray(oldAdminBlogs)) return oldAdminBlogs;
          return oldAdminBlogs.map((b) =>
            b.slug === slug || b._id === fetchedBlog._id || b.slug === fetchedBlog.slug
              ? { ...b, views: fetchedBlog.views }
              : b
          );
        });
      }
      return fetchedBlog;
    },
    placeholderData: () => {
      const all = queryClient.getQueryData(["blogs"]);
      return Array.isArray(all) ? all.find((b) => b.slug === slug || b._id === slug) : undefined;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  // Fetch all blogs for "More from Al-Mukhtar"
  const { data: allBlogs = [] } = useBlogs();

  // Post top-level comment
  const addCommentMutation = useMutation({
    mutationFn: async ({ comment }) => {
      const res = await api.post(`/api/blogs/${slug}/comment`, { comment });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      toast.success("Reflection posted successfully!");
      setNewCommentText("");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to submit reflection.");
    },
  });

  // Update top-level comment
  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, comment }) => {
      const res = await api.put(`/api/blogs/${slug}/comment/${commentId}`, { comment });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      toast.success("Comment updated successfully!");
      setEditingCommentId(null);
      setEditCommentText("");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update comment.");
    },
  });

  // Delete top-level comment
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const res = await api.delete(`/api/blogs/${slug}/comment/${commentId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      toast.success("Comment deleted.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete comment.");
    },
  });

  // Post reply to a comment
  const addReplyMutation = useMutation({
    mutationFn: async ({ commentId, comment }) => {
      const res = await api.post(`/api/blogs/${slug}/comment/${commentId}/reply`, { comment });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      toast.success("Reply posted successfully!");
      setReplyingToCommentId(null);
      setReplyText("");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to post reply.");
    },
  });

  // Update reply
  const updateReplyMutation = useMutation({
    mutationFn: async ({ commentId, replyId, comment }) => {
      const res = await api.put(`/api/blogs/${slug}/comment/${commentId}/reply/${replyId}`, { comment });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      toast.success("Reply updated successfully!");
      setEditingReplyKey(null);
      setEditReplyText("");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update reply.");
    },
  });

  // Delete reply
  const deleteReplyMutation = useMutation({
    mutationFn: async ({ commentId, replyId }) => {
      const res = await api.delete(`/api/blogs/${slug}/comment/${commentId}/reply/${replyId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      toast.success("Reply deleted.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete reply.");
    },
  });

  // Helper to check item author
  const isOwner = (itemUser) => {
    if (!user) return false;
    const currentUserId = user.id || user._id;
    if (!currentUserId) return false;
    const targetId = typeof itemUser === "object" && itemUser?._id ? itemUser._id : itemUser;
    return targetId?.toString() === currentUserId?.toString();
  };

  // Related blogs
  const relatedBlogs = useMemo(() => {
    if (!blog) return [];
    return allBlogs
      .filter((b) => (b.slug || b._id) !== (blog.slug || blog._id))
      .slice(0, 3);
  }, [allBlogs, blog]);

  // Process HTML and extract Headings
  const { html: processedContent, headings } = useMemo(() => {
    return processArticleContent(blog?.content || "");
  }, [blog?.content]);

  // Track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        const top = el.getBoundingClientRect().top + scrollY;
        if (scrollY >= top - 150) {
          setActiveHeadingId(el.id);
          return;
        }
      }
      if (headingElements.length > 0) {
        setActiveHeadingId(headingElements[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  // Scroll smoothly to heading
  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveHeadingId(id);
      setMobileTocOpen(false);
    }
  };

  // Get share URL using domain from window.location.origin or env
  const getShareUrl = () => {
    if (typeof window !== "undefined" && window.location.origin) {
      const origin = window.location.origin.replace(/\/$/, "");
      return `${origin}/blog/${blog?.slug || slug}`;
    }
    const envDomain = process.env.NEXT_PUBLIC_SITE_URL || "";
    const cleanDomain = envDomain.replace(/\/$/, "");
    return `${cleanDomain}/blog/${blog?.slug || slug}`;
  };

  const handleShare = async () => {
    if (!blog && !slug) return;
    const shareUrl = getShareUrl();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      toast.success("Blog link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to copy link to clipboard");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    if (!newCommentText.trim()) {
      toast.error("Please enter your thoughts before posting.");
      return;
    }
    addCommentMutation.mutate({ comment: newCommentText.trim() });
  };

  const handleStartEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.comment);
  };

  const handleSaveEditComment = (commentId) => {
    if (!editCommentText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    updateCommentMutation.mutate({ commentId, comment: editCommentText.trim() });
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this reflection?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const handleStartReply = (commentId) => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    if (replyingToCommentId === commentId) {
      setReplyingToCommentId(null);
      setReplyText("");
    } else {
      setReplyingToCommentId(commentId);
      setReplyText("");
    }
  };

  const handleSaveReply = (commentId) => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty.");
      return;
    }
    addReplyMutation.mutate({ commentId, comment: replyText.trim() });
  };

  const handleStartEditReply = (commentId, reply) => {
    setEditingReplyKey(`${commentId}_${reply._id}`);
    setEditReplyText(reply.comment);
  };

  const handleSaveEditReply = (commentId, replyId) => {
    if (!editReplyText.trim()) {
      toast.error("Reply cannot be empty.");
      return;
    }
    updateReplyMutation.mutate({ commentId, replyId, comment: editReplyText.trim() });
  };

  const handleDeleteReply = (commentId, replyId) => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      deleteReplyMutation.mutate({ commentId, replyId });
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 bg-slate-50 min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="w-48 h-4 bg-slate-200 rounded-md animate-pulse"></div>
          <div className="space-y-3 max-w-4xl">
            <div className="w-28 h-6 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="w-full h-12 bg-slate-200 rounded-xl animate-pulse"></div>
            <div className="w-3/4 h-12 bg-slate-200 rounded-xl animate-pulse"></div>
          </div>
          <div className="w-full h-80 sm:h-[400px] bg-slate-200 rounded-3xl animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 space-y-4">
              <div className="w-full h-4 bg-slate-200 rounded-md animate-pulse"></div>
              <div className="w-full h-4 bg-slate-200 rounded-md animate-pulse"></div>
              <div className="w-4/5 h-4 bg-slate-200 rounded-md animate-pulse"></div>
              <div className="w-full h-32 bg-slate-100 rounded-xl animate-pulse"></div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="w-full h-64 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <ApiErrorState
          variant="page"
          title="Unable to load research article"
          message="We couldn't retrieve this publication from the server. Check your connection and click refresh."
          onRetry={refetch}
          isRetrying={isFetching}
          className="bg-slate-800/90 border-slate-700 text-white"
        />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center space-y-6 bg-slate-800/80 border border-slate-700/80 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-2">
            <span className="inline-flex items-center font-medium select-none whitespace-nowrap bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono">
              404 • Article Anomaly
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white">
              Article Not Found
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              The publication or research article you requested has either been archived or does not exist in our academic archive.
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/blog"
              className="w-fit inline-flex items-center justify-center rounded-xl bg-[#C0DAD1] text-slate-900 hover:bg-[#a6cbbe] font-extrabold text-xs sm:text-sm px-6 py-3.5 gap-2 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Blog Index</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rawImages = Array.isArray(blog.images) && blog.images.length > 0
    ? blog.images
    : (blog.image ? [blog.image] : []);
  const blogImages = rawImages
    .map((img) => getImageUrl(img))
    .filter((src) => typeof src === "string" && src.trim().length > 0);

  const snippet = blog.description || getSnippet(blog.content, 260);
  const readTime = getReadingTime(blog);
  const commentsList = Array.isArray(blog.comments) ? blog.comments : [];

  return (
    <article className="py-6 sm:py-10 bg-white dark:bg-slate-950 min-h-screen font-sans text-slate-900 dark:text-slate-100 overflow-x-clip w-full transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-6">
        {/* Header Breadcrumbs & Title */}
        <header className="w-full space-y-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          {/* Breadcrumb row */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link to="/blog" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Academic Insights
            </Link>
            <span>/</span>
            <Link
              to={`/blog?category=${encodeURIComponent(blog.subject || "Blog")}`}
              className="text-[#0F6E8C] dark:text-teal-400 font-bold hover:underline"
            >
              {blog.subject || "Blog"}
            </Link>
          </div>

          {/* Article Title: Intact full words that wrap naturally */}
          <h1 className="text-2xl sm:text-3xl md:text-[32px] lg:text-[34px] font-extrabold tracking-tight text-slate-900 dark:text-white font-heading leading-tight w-full break-normal hyphens-none">
            {blog.title}
          </h1>

          {/* Lead Paragraph Excerpt */}
          {snippet && (
            <p className="text-xs sm:text-sm md:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal w-full break-normal hyphens-none">
              {snippet}
            </p>
          )}

          {/* Author Meta Row */}
          <div className="flex items-center justify-between gap-4 pt-1 flex-wrap">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-2xs">
                <img
                  src={LogoImg}
                  alt="Al-Mukhtar Institute"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Al-Mukhtar Institute</span>
                  <Link
                    to="/about"
                    className="text-xs font-semibold text-[#0F6E8C] dark:text-teal-400 hover:underline"
                  >
                    About Us
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>{readTime}</span>
                  <span>·</span>
                  <span>{formatDate(blog.createdAt)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{blog.views || 1} views</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 shrink-0 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Academically Verified Publication</span>
            </div>
          </div>
        </header>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between py-3 border-y border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-sans my-4 select-none">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => responsesRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0F6E8C] dark:hover:text-teal-400 transition-colors cursor-pointer"
              title="Jump to responses"
            >
              <MessageCircle className="w-4 h-4 text-[#0F6E8C] dark:text-teal-400" />
              <span>Responses &amp; Discussions ({commentsList.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Share article with domain link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer hidden sm:inline-flex"
              title="Print article"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Uniform Images Row - All images have equal size in a single row */}
        {blogImages.length > 0 && (
          <div className="space-y-2.5">
            <div
              className={`grid gap-3 sm:gap-4 items-stretch ${
                blogImages.length === 1
                  ? "grid-cols-1 max-w-2xl mx-auto"
                  : blogImages.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : blogImages.length === 3
                  ? "grid-cols-1 sm:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
              }`}
            >
              {blogImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageModal(img)}
                  className={`group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer ${
                    blogImages.length === 1
                      ? "h-64 sm:h-80 md:h-96"
                      : blogImages.length === 2
                      ? "h-56 sm:h-64 md:h-72"
                      : "h-48 sm:h-56 md:h-64"
                  }`}
                  title="Click to view full image"
                >
                  <img
                    src={img}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = LogoImg;
                      e.currentTarget.className = "max-h-24 max-w-[65%] object-contain m-auto drop-shadow-2xs";
                    }}
                    alt={`${blog.title} - Image ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                      <ZoomIn size={13} />
                      <span>View Full</span>
                    </span>
                  </div>
                  {blogImages.length > 1 && (
                    <div className="absolute bottom-2.5 right-2.5 bg-slate-950/70 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-mono text-white/90">
                      {idx + 1} of {blogImages.length}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              Al-Mukhtar Academic Publication • Authentic Knowledge &amp; Educational Research
            </p>
          </div>
        )}

        {/* MOBILE Table of Contents: Placed directly after the cover image & gallery */}
        {headings.length > 0 && (
          <div className="block lg:hidden w-full my-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 shadow-2xs">
            <button
              type="button"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#0F6E8C] dark:text-teal-400 shadow-2xs">
                  <ListFilter className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-heading">
                  Table of Contents
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F6E8C] dark:text-teal-400 font-mono">
                  {headings.length} Sections
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-medium hidden sm:inline">
                  {mobileTocOpen ? "Collapse" : "Explore Sections"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileTocOpen ? "rotate-180" : ""
                    }`}
                />
              </div>
            </button>

            {mobileTocOpen && (
              <nav className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1 max-h-64 overflow-y-auto">
                {headings.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => scrollToHeading(h.id)}
                    className={`block w-full text-left py-2 px-2.5 rounded-xl text-xs cursor-pointer transition-all hover:underline underline-offset-3 hover:text-blue-600 dark:hover:text-blue-400 ${h.level === 3 ? "pl-5 text-[11px]" : "font-semibold"
                      } ${activeHeadingId === h.id
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold underline border border-blue-200/60 dark:border-blue-800/60"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                  >
                    {h.text}
                  </button>
                ))}
              </nav>
            )}
          </div>
        )}

        {/* 2-Column Main Reading Grid (Left: Expanded Content (col-9), Right: Compact Sticky TOC (col-3)) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pt-2 w-full">
          {/* Main Article Content (Expanded to lg:col-span-9) */}
          <div className="lg:col-span-9 min-w-0 w-full space-y-8">
            {/* Rendered Prose Content with Natural Word Wrapping */}
            <div className="prose prose-slate dark:prose-invert max-w-full min-w-0 w-full break-normal hyphens-none [word-break:normal] [overflow-wrap:break-word] text-sm sm:text-[15px] md:text-[16px] lg:text-[16px] leading-relaxed prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-200 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-sm [&_img]:max-w-full [&_img]:h-auto prose-blockquote:border-l-4 prose-blockquote:border-l-[#0F6E8C] prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900 prose-blockquote:py-2.5 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300 prose-blockquote:not-italic prose-strong:text-slate-900 dark:prose-strong:text-white prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:text-[#0F6E8C] dark:prose-code:text-teal-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:max-w-full prose-pre:overflow-x-auto [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:block [&_iframe]:max-w-full">
              <div
                className="blog-content max-w-full min-w-0 break-normal hyphens-none text-slate-800 dark:text-slate-200"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>

            {/* Related Topics & Category Tags */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono block">
                Related Topics
              </span>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/blog?category=${encodeURIComponent(blog.subject || "Blog")}`}
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-[#0F6E8C] dark:hover:text-teal-300 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                >
                  #{blog.subject || "Blog"}
                </Link>
                <Link
                  to={`/blog?search=${encodeURIComponent(blog.title.split(" ")[0])}`}
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-[#0F6E8C] dark:hover:text-teal-300 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                >
                  #{blog.title.split(" ")[0]}
                </Link>
              </div>
            </div>
          </div>

          {/* Sticky Table of Contents & Sidebar on the RIGHT Side (Compact lg:col-span-3) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start border-l border-slate-200/80 dark:border-slate-800 pl-5 space-y-6 font-sans shrink-0 min-w-0 w-full z-10">
            {/* Table of Contents Header & Items */}
            {headings.length > 0 && (
              <div className="w-full flex flex-col font-sans max-h-[calc(100vh-140px)]">
                <div className="shrink-0 flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-[#0F6E8C] dark:text-teal-400" />
                    <span>Table of Contents</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {headings.length} Topics
                  </span>
                </div>

                <nav className="flex-1 overflow-y-auto pr-1.5 mt-3 space-y-1.5 text-xs border-l-2 border-slate-200 dark:border-slate-700 pl-2.5 scroll-smooth">
                  {headings.map((h) => {
                    const isActive = activeHeadingId === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => scrollToHeading(h.id)}
                        className={`block w-full text-left transition-all py-1 leading-snug cursor-pointer break-normal hover:underline underline-offset-3 hover:text-blue-600 dark:hover:text-blue-400 ${h.level === 3 ? "pl-2.5 text-[11px]" : "font-semibold"
                          } ${isActive
                            ? "text-blue-600 dark:text-blue-400 font-bold underline translate-x-1"
                            : "text-slate-600 dark:text-slate-300 hover:translate-x-0.5"
                          }`}
                      >
                        {h.text}
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Author / Academy Info */}
            <div className="space-y-3.5 pt-6 border-t border-slate-200/80 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
                About the Academy
              </h3>
              <div className="flex items-start gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-2xs">
                  <img
                    src={LogoImg}
                    alt="Al-Mukhtar Institute"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight font-heading">
                    Al-Mukhtar Institute
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 break-normal">
                    Dedicated to excellence in Quranic studies, Tajweed, Islamic jurisprudence, and Arabic literature.
                  </p>
                  <div className="pt-1">
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F6E8C] dark:text-teal-400 hover:underline"
                    >
                      <span>Learn more about us</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Share Widget */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono block">
                Share this Publication
              </span>
              <button
                type="button"
                onClick={handleShare}
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-500 text-xs font-bold text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? "Link Copied to Clipboard!" : "Copy Article Link"}</span>
              </button>
            </div>
          </aside>
        </div>

        {/* Below Article Section (TOC has stopped scrolling above) */}
        <div className="pt-10 border-t border-slate-200/80 dark:border-slate-800 space-y-12 w-full max-w-4xl">
          {/* Interactive Responses & Realtime Discussions */}
          <div
            id="responses-section"
            ref={responsesRef}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
                Responses &amp; Academic Reflections
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {commentsList.reduce((acc, c) => acc + 1 + (Array.isArray(c.replies) ? c.replies.length : 0), 0)}{" "}
                {commentsList.reduce((acc, c) => acc + 1 + (Array.isArray(c.replies) ? c.replies.length : 0), 0) === 1
                  ? "Thought"
                  : "Thoughts"}
              </span>
            </div>

            {/* Comment Input Box (Authenticated Gate) */}
            {!user ? (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 via-slate-50 to-slate-100/60 dark:from-slate-850 dark:via-slate-900 dark:to-slate-900 border border-teal-500/20 dark:border-slate-800 text-center space-y-3.5 shadow-2xs">
                <div className="w-11 h-11 mx-auto rounded-2xl bg-[#0F6E8C]/10 dark:bg-teal-500/20 text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading">
                    Join the Discussion
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sign in with your account to share your academic reflections or reply to others.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap items-center justify-center sm:gap-3 pt-1 max-w-sm sm:max-w-none mx-auto">
                  <Link
                    to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-5 py-2.5 rounded-xl bg-[#0F6E8C] hover:bg-[#0B5C74] text-white font-bold text-xs shadow-2xs text-center"
                  >
                    <LogIn size={14} />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to={`/signup?redirect=${encodeURIComponent(location.pathname)}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0F6E8C] text-slate-700 dark:text-slate-200 hover:text-[#0F6E8C] dark:hover:text-[#38BDF8] text-xs font-bold transition-all bg-white dark:bg-slate-800 shadow-3xs text-center"
                  >
                    <span>Sign Up</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleCommentSubmit}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F6E8C] to-[#0A2540] text-white flex items-center justify-center text-xs font-bold shadow-3xs shrink-0">
                      {user.username?.slice(0, 2).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        Posting as <span className="text-[#0F6E8C] dark:text-teal-300">@{user.username}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-[#0F6E8C] dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      Admin
                    </span>
                  )}
                </div>

                <textarea
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Share your thoughts, ask scholarly questions, or contribute a reflection..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 resize-none transition-colors"
                />

                <div className="flex justify-end items-center gap-2">
                  <button
                    type="submit"
                    disabled={addCommentMutation.isPending || !newCommentText.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0F6E8C] hover:bg-[#0B5C74] text-white font-bold text-xs transition-all shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                  >
                    {addCommentMutation.isPending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <span>Post Response</span>
                        <Send className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Live Comments List from MongoDB */}
            <div className="space-y-4">
              {commentsList.length > 0 ? (
                <>
                  {commentsList.slice(0, visibleCommentsCount).map((c, index) => {
                    const authorName =
                      (typeof c.user === "object" && c.user?.username) ||
                      c.name ||
                      "Anonymous";
                    const canManage = isOwner(c.user) || isAdmin;
                    const isEditing = editingCommentId === c._id;
                    const isReplying = replyingToCommentId === c._id;
                    const replies = Array.isArray(c.replies) ? c.replies : [];

                    return (
                      <div
                        key={c._id || index}
                        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3 shadow-2xs transition-all"
                      >
                        {/* Comment Top Header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F6E8C] to-[#0A2540] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-3xs">
                              {authorName.slice(0, 2).toUpperCase() || "U"}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate block">
                                {authorName}
                              </span>
                              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-mono block">
                                {formatDate(c.createdAt)}
                                {c.updatedAt && (
                                  <span className="ml-1.5 text-teal-600 dark:text-teal-400 italic">
                                    (edited)
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Action buttons if owner or admin */}
                          {canManage && !isEditing && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleStartEditComment(c)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F6E8C] dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Edit Reflection"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(c._id)}
                                disabled={deleteCommentMutation.isPending}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title="Delete Reflection"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Comment Body or Inline Edit Form */}
                        {isEditing ? (
                          <div className="space-y-2 pt-1">
                            <textarea
                              rows={3}
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 resize-none"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingCommentId(null)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEditComment(c._id)}
                                disabled={updateCommentMutation.isPending || !editCommentText.trim()}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-xs font-bold transition-all shadow-3xs cursor-pointer disabled:opacity-50"
                              >
                                {updateCommentMutation.isPending ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                                <span>Save Changes</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-wrap break-words">
                            {c.comment}
                          </p>
                        )}

                        {/* Action Row: Reply Toggle */}
                        <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 text-xs">
                          <button
                            type="button"
                            onClick={() => handleStartReply(c._id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F6E8C] dark:text-teal-400 hover:text-[#0B5C74] dark:hover:text-teal-300 hover:underline cursor-pointer transition-colors"
                          >
                            <CornerDownRight size={13} />
                            <span>Reply</span>
                            {replies.length > 0 && (
                              <span className="text-[10px] font-mono text-slate-400">
                                ({replies.length})
                              </span>
                            )}
                          </button>
                        </div>

                        {/* Inline Reply Form */}
                        {isReplying && (
                          <div className="mt-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                                Replying as <span className="text-[#0F6E8C] dark:text-teal-300">@{user?.username}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setReplyingToCommentId(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to @${authorName}...`}
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 resize-none"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setReplyingToCommentId(null)}
                                className="px-3 py-1 rounded-md text-xs font-semibold text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-700"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveReply(c._id)}
                                disabled={addReplyMutation.isPending || !replyText.trim()}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-md bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-xs font-bold transition-all shadow-3xs cursor-pointer disabled:opacity-50"
                              >
                                {addReplyMutation.isPending ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Send className="w-3 h-3" />
                                )}
                                <span>Post Reply</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Nested Replies List */}
                        {replies.length > 0 && (
                          <div className="border-l-2 border-teal-500/40 dark:border-teal-400/40 ml-3 sm:ml-6 pl-3 sm:pl-4 space-y-3 mt-3 pt-1">
                            {replies.map((r, rIdx) => {
                              const replyAuthorName =
                                (typeof r.user === "object" && r.user?.username) ||
                                r.name ||
                                "Anonymous";
                              const canManageReply = isOwner(r.user) || isAdmin;
                              const replyEditKey = `${c._id}_${r._id}`;
                              const isEditingReply = editingReplyKey === replyEditKey;

                              return (
                                <div
                                  key={r._id || rIdx}
                                  className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-600 to-[#0A2540] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                        {replyAuthorName.slice(0, 2).toUpperCase() || "U"}
                                      </div>
                                      <div className="min-w-0">
                                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate block">
                                          {replyAuthorName}
                                        </span>
                                        <span className="text-slate-400 dark:text-slate-500 text-[9px] font-mono block">
                                          {formatDate(r.createdAt)}
                                          {r.updatedAt && (
                                            <span className="ml-1 text-teal-600 dark:text-teal-400 italic">
                                              (edited)
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                    </div>

                                    {canManageReply && !isEditingReply && (
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleStartEditReply(c._id, r)}
                                          className="p-1 rounded text-slate-400 hover:text-[#0F6E8C] dark:hover:text-teal-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                          title="Edit Reply"
                                        >
                                          <Edit3 size={12} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteReply(c._id, r._id)}
                                          disabled={deleteReplyMutation.isPending}
                                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                          title="Delete Reply"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {isEditingReply ? (
                                    <div className="space-y-2 pt-1">
                                      <textarea
                                        rows={2}
                                        value={editReplyText}
                                        onChange={(e) => setEditReplyText(e.target.value)}
                                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F6E8C] resize-none"
                                      />
                                      <div className="flex justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setEditingReplyKey(null)}
                                          className="px-2.5 py-1 rounded text-[11px] font-semibold text-slate-500 hover:bg-slate-200/60"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleSaveEditReply(c._id, r._id)}
                                          disabled={updateReplyMutation.isPending || !editReplyText.trim()}
                                          className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#0F6E8C] text-white text-[11px] font-bold"
                                        >
                                          <Check size={12} />
                                          <span>Save</span>
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                                      {r.comment}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Show More Button if more than 10 comments */}
                  {commentsList.length > visibleCommentsCount && (
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => setVisibleCommentsCount((prev) => prev + 10)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:border-[#0F6E8C] dark:hover:border-teal-400 hover:text-[#0F6E8C] dark:hover:text-teal-300 shadow-3xs transition-all hover:scale-[1.01] cursor-pointer"
                      >
                        <span>Show More Reflections ({commentsList.length - visibleCommentsCount} more)</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 py-4 text-center">
                  No reflections posted yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>

          {/* "More from Al-Mukhtar Institute" Related Articles */}
          {relatedBlogs.length > 0 && (
            <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
                  More from Academic Insights
                </h3>
                <Link
                  to="/blog"
                  className="text-xs font-bold text-[#0F6E8C] dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedBlogs.map((rel) => {
                  const relImg = getImageUrl(
                    (Array.isArray(rel.images) && rel.images.length > 0)
                      ? rel.images[0]
                      : rel.image
                  );
                  return (
                    <Link
                      key={rel._id || rel.slug}
                      to={`/blog/${rel.slug || rel._id}`}
                      className="group p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-900 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 transition-all flex flex-col space-y-2.5"
                    >
                      <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                        {relImg ? (
                          <img
                            src={relImg}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = LogoImg;
                              e.currentTarget.className = "max-h-16 max-w-[70%] object-contain m-auto drop-shadow-2xs";
                            }}
                            alt={rel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-[#0B5C74] to-[#0A2540] flex items-center justify-center text-white">
                            <BookOpen className="w-6 h-6 text-teal-200" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 flex-1 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-[#0F6E8C] dark:text-teal-400 uppercase font-mono">
                          {rel.subject || "Blog"}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors line-clamp-2 leading-snug break-normal">
                          {rel.title}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {activeImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveImageModal(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute -top-10 right-0 sm:right-2 text-white/80 hover:text-white p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
              title="Close image view"
            >
              <X size={20} />
            </button>
            <img
              src={activeImageModal}
              alt="Full view"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </article>
  );
}

export default BlogDetail;
