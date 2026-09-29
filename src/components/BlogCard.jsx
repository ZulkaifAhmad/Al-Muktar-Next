"use client";

import React from "react";
import { Link } from "@/lib/navigation-adapter";
import { Clock, Eye, Tag, BookOpen, ArrowRight } from "lucide-react";
import { LogoImg, getImageUrl } from "../assets/assets.js";

export function getSnippet(html, maxLength = 180) {
  if (!html) return "";
  const text = html
    .replace(/<wbr\s*\/?>/gi, "")
    .replace(/&shy;/gi, "")
    .replace(/[\u00AD\u200B\u200C\u200D\uFEFF]/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function formatDate(d) {
  if (!d) return "Recently";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getReadingTime(contentOrHtml, imagesCount = 0) {
  if (!contentOrHtml) return "1 min read";

  let rawText = "";
  let totalImages = imagesCount;

  if (typeof contentOrHtml === "object" && contentOrHtml !== null) {
    // If a full blog object was passed
    rawText = [
      contentOrHtml.content || "",
      contentOrHtml.description || "",
      contentOrHtml.title || "",
    ].join(" ");
    if (Array.isArray(contentOrHtml.images)) {
      totalImages = contentOrHtml.images.length;
    } else if (contentOrHtml.image) {
      totalImages = 1;
    }
  } else if (typeof contentOrHtml === "string") {
    rawText = contentOrHtml;
    // Count inline <img> tags if any
    const inlineImgs = (rawText.match(/<img\b[^>]*>/gi) || []).length;
    totalImages += inlineImgs;
  }

  // Strip all HTML markup & entities
  const cleanText = rawText
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/[\u00AD\u200B\u200C\u200D\uFEFF]/g, "")
    .trim();

  // Extract clean words
  const words = cleanText.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  if (wordCount === 0) return "1 min read";

  // Standard adult reading speed: 200 words per minute
  // 200 wpm = 3.33 words/sec
  const wordSeconds = (wordCount / 200) * 60;

  // Add 10 seconds per image (industry standard calculation)
  const imageSeconds = totalImages * 10;

  const totalSeconds = wordSeconds + imageSeconds;
  const minutes = Math.max(1, Math.ceil(totalSeconds / 60));

  return `${minutes} min read`;
}

export function getBlogImage(blog) {
  if (Array.isArray(blog?.images) && blog.images.length > 0 && blog.images[0]) {
    return getImageUrl(blog.images[0], null);
  }
  if (blog?.image) return getImageUrl(blog.image, null);
  return null;
}

function BlogCard({ blog, viewMode = "list", onCategoryClick }) {
  if (!blog) return null;

  const rawImage = getBlogImage(blog);
  const snippet = blog.description || getSnippet(blog.content);
  const readTime = getReadingTime(blog);
  const formattedDate = formatDate(blog.createdAt);
  const blogUrl = `/blog/${blog.slug || blog._id}`;

  if (viewMode === "grid") {
    return (
      <article className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-800/80 hover:border-[#0F6E8C]/50 dark:hover:border-teal-500/50 hover:shadow-xs transition-all duration-200 flex flex-col font-sans shadow-2xs">
        {/* Normal Height Image with Logo fallback properly fitted */}
        <Link to={blogUrl} className="relative w-full h-40 sm:h-44 overflow-hidden bg-slate-100 dark:bg-slate-800 block shrink-0">
          {rawImage ? (
            <img
              src={rawImage}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = LogoImg;
                e.currentTarget.className = "max-h-20 max-w-[80%] object-contain m-auto drop-shadow-2xs";
              }}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-slate-100 dark:from-slate-800 via-teal-50/40 dark:via-slate-800/60 to-slate-50 dark:to-slate-900 flex items-center justify-center p-4">
              <img
                src={LogoImg}
                alt="Al-Mukhtar Institute"
                className="max-h-20 max-w-[80%] object-contain drop-shadow-2xs group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/80 dark:bg-black/80 text-white backdrop-blur-xs shadow-2xs font-mono">
              <Tag className="w-2.5 h-2.5 text-teal-300" />
              {blog.subject || "General"}
            </span>
          </div>
        </Link>

        {/* Normal Height Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Al-Mukhtar</span>
              <span>·</span>
              <span>{formattedDate}</span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0F6E8C] dark:group-hover:text-teal-400 transition-colors line-clamp-2 leading-snug font-heading break-normal hyphens-none">
              <Link to={blogUrl}>{blog.title}</Link>
            </h3>

            {snippet && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal break-normal hyphens-none">
                {snippet}
              </p>
            )}
          </div>

          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {readTime}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-slate-400" />
                {blog.views || 1}
              </span>
            </div>

            <Link
              to={blogUrl}
              className="inline-flex items-center gap-1 font-bold text-[#0F6E8C] dark:text-teal-400 group-hover:gap-1.5 transition-all text-xs"
            >
              <span>Read</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // List View
  return (
    <article className="group bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-[#0F6E8C]/50 dark:hover:border-teal-500/50 hover:shadow-xs transition-all duration-200 flex flex-row items-start justify-between gap-3 sm:gap-4 font-sans shadow-2xs h-full">
      <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0 flex flex-col justify-between h-full">
        {/* Author row */}
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <span className="font-bold text-slate-800 dark:text-slate-200">Al-Mukhtar Institute</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span>{formattedDate}</span>
        </div>

        {/* Title */}
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0F6E8C] dark:group-hover:text-teal-400 transition-colors line-clamp-2 leading-snug font-heading break-normal hyphens-none">
          <Link to={blogUrl}>{blog.title}</Link>
        </h2>

        {/* Snippet */}
        {snippet && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 font-normal break-normal hyphens-none">
            {snippet}
          </p>
        )}

        {/* Meta Bar */}
        <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 pt-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          <button
            type="button"
            onClick={(e) => {
              if (onCategoryClick && blog.subject) {
                e.preventDefault();
                onCategoryClick(blog.subject);
              }
            }}
            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-[#0F6E8C] dark:hover:text-teal-300 text-slate-600 dark:text-slate-300 font-semibold whitespace-nowrap transition-colors cursor-pointer"
          >
            {blog.subject || "General"}
          </button>

          <span className="flex items-center gap-1 whitespace-nowrap">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{readTime}</span>
          </span>

          <span className="text-slate-300 dark:text-slate-600">·</span>

          <span className="flex items-center gap-1 whitespace-nowrap">
            <Eye className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{blog.views || 1}</span>
          </span>
        </div>
      </div>

      {/* Right Thumbnail with Logo fallback properly fitted */}
      <Link
        to={blogUrl}
        className="relative w-20 h-18 sm:w-36 sm:h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 block border border-slate-200/80 dark:border-slate-700 shadow-2xs group-hover:border-[#0F6E8C]/50 dark:group-hover:border-teal-400/50 transition-colors"
      >
        {rawImage ? (
          <img
            src={rawImage}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = LogoImg;
              e.currentTarget.className = "max-h-12 sm:max-h-14 max-w-full object-contain m-auto drop-shadow-2xs";
            }}
            alt={blog.title}
            className="object-cover w-full h-full group-hover:scale-103 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-100 dark:from-slate-800 via-teal-50/40 dark:via-slate-800/60 to-slate-50 dark:to-slate-900 flex items-center justify-center p-2">
            <img
              src={LogoImg}
              alt="Al-Mukhtar Institute"
              className="max-h-12 sm:max-h-14 max-w-full object-contain drop-shadow-2xs group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}
      </Link>
    </article>
  );
}

export default BlogCard;
