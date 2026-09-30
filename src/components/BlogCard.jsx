"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/lib/navigation-adapter";
import { Clock, Eye } from "lucide-react";
import { LogoImg, getImageUrl } from "../assets/assets.js";

export function getSnippet(html, maxLength = 130) {
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
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return "Recently";
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calculateReadingStats(contentOrHtml, imagesCount = 0) {
  if (!contentOrHtml) {
    return { words: 0, images: 0, seconds: 60, minutes: 1, text: "1 min read" };
  }

  let rawText = "";
  let totalImages = typeof imagesCount === "number" ? imagesCount : 0;

  if (typeof contentOrHtml === "object" && contentOrHtml !== null) {
    rawText = [
      contentOrHtml.title || "",
      contentOrHtml.description || "",
      contentOrHtml.content || "",
    ].join(" ");
    if (Array.isArray(contentOrHtml.images)) {
      totalImages = contentOrHtml.images.length;
    } else if (contentOrHtml.image) {
      totalImages = 1;
    }
  } else if (typeof contentOrHtml === "string") {
    rawText = contentOrHtml;
    const inlineImgs = (rawText.match(/<img\b[^>]*>/gi) || []).length;
    totalImages += inlineImgs;
  }

  // 1. Remove script/style tags and their inner content
  const withoutScripts = rawText
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ");

  // 2. Decode standard HTML entities and clean HTML tags
  const cleanText = withoutScripts
    .replace(/<wbr\s*\/?>/gi, "")
    .replace(/&shy;/gi, "")
    .replace(/[\u00AD\u200B\u200C\u200D\uFEFF]/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;|&#x27;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 3. Extract words (matches English, Arabic, and all multilingual tokens)
  const words = cleanText.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  if (wordCount === 0 && totalImages === 0) {
    return { words: 0, images: 0, seconds: 60, minutes: 1, text: "1 min read" };
  }

  // Standard adult reading speed: 200 words per minute (3.33 words per second)
  const wordSeconds = (wordCount / 200) * 60;

  // Staggered image viewing calculation: 12s, 11s, 10s... min 3s
  let imageSeconds = 0;
  for (let i = 1; i <= totalImages; i++) {
    imageSeconds += Math.max(3, 13 - i);
  }

  const totalSeconds = Math.max(30, wordSeconds + imageSeconds);
  const minutes = Math.max(1, Math.ceil(totalSeconds / 60));

  return {
    words: wordCount,
    images: totalImages,
    seconds: Math.round(totalSeconds),
    minutes,
    text: `${minutes} min read`,
  };
}

export function getReadingTime(contentOrHtml, imagesCount = 0) {
  return calculateReadingStats(contentOrHtml, imagesCount).text;
}

export function getBlogImage(blog) {
  if (Array.isArray(blog?.images) && blog.images.length > 0 && blog.images[0]) {
    return getImageUrl(blog.images[0], null);
  }
  if (blog?.image) return getImageUrl(blog.image, null);
  return null;
}

function BlogCard({ blog, onCategoryClick, layout = "grid" }) {
  const [imgError, setImgError] = useState(false);

  if (!blog) return null;

  const rawImage = getBlogImage(blog);
  const snippet = blog.description || getSnippet(blog.content, layout === "list" ? 180 : 130);
  const readTime = getReadingTime(blog);
  const formattedDate = formatDate(blog.createdAt || blog.publishedAt);
  const blogUrl = `/blog/${blog.slug || blog._id}`;
  const category = blog.subject || blog.category || "GENERAL";
  const viewsCount = typeof blog.views === "number" ? blog.views : 0;

  const thumbnailSrc = !imgError && rawImage ? rawImage : LogoImg;
  const isFallbackLogo = imgError || !rawImage;

  if (layout === "list") {
    return (
      <article className="group bg-transparent sm:bg-white sm:dark:bg-[#0c1827] rounded-none sm:rounded-2xl border-0 sm:border border-slate-200/90 dark:border-slate-800/80 hover:border-transparent sm:hover:border-[#0F6E8C]/60 sm:dark:hover:border-teal-400/50 shadow-none sm:shadow-2xs sm:hover:shadow-md transition-all duration-300 overflow-visible sm:overflow-hidden h-full flex flex-col justify-between">
        <div className="flex flex-row items-center sm:items-start justify-between p-0 sm:p-4 gap-3 sm:gap-4.5 h-full">
          {/* List Content (Left Side) */}
          <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-2">
            <div className="space-y-1.5 min-w-0">
              {/* Category Badge */}
              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    if (onCategoryClick) {
                      e.preventDefault();
                      e.stopPropagation();
                      onCategoryClick(category);
                    }
                  }}
                  className="text-[10px] min-[400px]:text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-[#0F6E8C] dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60 hover:bg-[#0F6E8C] hover:text-white dark:hover:bg-teal-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {category}
                </button>
              </div>

              {/* Title (Extra bold on mobile screen) */}
              <h2 className="text-[18px] min-[400px]:text-[20px] sm:text-base lg:text-[18px] font-black sm:font-bold font-heading text-slate-900 dark:text-white leading-[1.3] tracking-tight group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors line-clamp-2">
                <Link to={blogUrl}>{blog.title}</Link>
              </h2>

              {/* Excerpt */}
              {snippet && (
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 font-normal">
                  {snippet}
                </p>
              )}
            </div>

            {/* List Footer (Date, Read Time, and Views in the bottom) */}
            <div className="pt-2 flex items-center justify-between gap-2 text-xs border-t border-slate-100 dark:border-slate-800/80 mt-1">
              <div className="flex items-center flex-wrap gap-1.5 min-[400px]:gap-2 text-[10px] min-[400px]:text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                <span>{formattedDate}</span>
                <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>{readTime}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>{viewsCount} views</span>
                </span>
              </div>
              <Link
                to={blogUrl}
                className="inline-flex items-center gap-1 font-bold text-xs text-[#0F6E8C] dark:text-teal-400 group-hover:gap-1.5 transition-all ml-auto shrink-0"
              >
                <span>Read</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* List Small Thumbnail (Right Side) */}
          <Link
            to={blogUrl}
            className="relative w-20 h-20 min-[400px]:w-24 min-[400px]:h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 block group/img border border-slate-200/60 dark:border-slate-800 shadow-3xs"
          >
            <Image
              src={thumbnailSrc}
              alt={blog.title || "Blog article"}
              fill
              sizes="(max-width: 640px) 96px, 120px"
              className={`transition-transform duration-300 ease-out group-hover:scale-105 ${
                isFallbackLogo
                  ? "object-contain p-3 opacity-75"
                  : "object-cover object-center"
              }`}
              onError={() => setImgError(true)}
              unoptimized
            />
          </Link>
        </div>
      </article>
    );
  }

  // Default Grid Layout (Card style with bigger title font size & weight on mobile)
  return (
    <article className="w-full bg-transparent border-0 shadow-none">
      <Link
        to={blogUrl}
        className="group block w-full text-left cursor-pointer select-none"
      >
        {/* 1. Medium Thumbnail Image (Aspect 16:10, Rounded 2xl, overflow-hidden) */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-800">
          <Image
            src={thumbnailSrc}
            alt={blog.title || "Blog article"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`transition-transform duration-300 ease-out group-hover:scale-104 ${
              isFallbackLogo
                ? "object-contain p-6 opacity-75"
                : "object-cover object-center"
            }`}
            onError={() => setImgError(true)}
            unoptimized
          />
        </div>

        {/* 2. Medium Category Label */}
        <div className="mt-3.5">
          <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-[#0F6E8C] dark:text-teal-400 block">
            {category}
          </span>
        </div>

        {/* 3. Medium Bold Title — Extra bold & big font size on mobile screen only */}
        <h2 className="mt-1.5 text-[20px] min-[400px]:text-[22px] sm:text-base lg:text-[18px] font-black sm:font-bold font-heading text-slate-800 dark:text-slate-100 leading-[1.3] tracking-tight line-clamp-2 group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors">
          {blog.title}
        </h2>

        {/* 4. Medium Meta Row (Date, Read Time, and Views) */}
        <div className="mt-2 flex items-center flex-wrap gap-2 text-[11px] sm:text-xs text-slate-400 dark:text-slate-400 font-normal font-mono">
          <span>{formattedDate}</span>
          <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 shrink-0" />
            <span>{readTime}</span>
          </span>
          <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 shrink-0" />
            <span>{viewsCount} views</span>
          </span>
        </div>

        {/* 5. Medium Excerpt */}
        {snippet && (
          <p className="mt-2 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 font-normal">
            {snippet}
          </p>
        )}
      </Link>
    </article>
  );
}

export default BlogCard;
