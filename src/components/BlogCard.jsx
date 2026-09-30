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

export function getReadingTime(contentOrHtml, imagesCount = 0) {
  if (!contentOrHtml) return "1 min read";

  let rawText = "";
  let totalImages = imagesCount;

  if (typeof contentOrHtml === "object" && contentOrHtml !== null) {
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
    const inlineImgs = (rawText.match(/<img\b[^>]*>/gi) || []).length;
    totalImages += inlineImgs;
  }

  const cleanText = rawText
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/[\u00AD\u200B\u200C\u200D\uFEFF]/g, "")
    .trim();

  const words = cleanText.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  if (wordCount === 0) return "1 min read";

  const wordSeconds = (wordCount / 200) * 60;
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

function BlogCard({ blog, onCategoryClick }) {
  const [imgError, setImgError] = useState(false);

  if (!blog) return null;

  const rawImage = getBlogImage(blog);
  const snippet = blog.description || getSnippet(blog.content, 130);
  const readTime = getReadingTime(blog);
  const formattedDate = formatDate(blog.createdAt || blog.publishedAt);
  const blogUrl = `/blog/${blog.slug || blog._id}`;
  const category = blog.subject || blog.category || "GENERAL";
  const viewsCount = typeof blog.views === "number" ? blog.views : 0;

  const thumbnailSrc = !imgError && rawImage ? rawImage : LogoImg;
  const isFallbackLogo = imgError || !rawImage;

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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
            {category}
          </span>
        </div>

        {/* 3. Medium Bold Title */}
        <h2 className="mt-1.5 text-sm sm:text-base lg:text-[17px] font-bold font-heading text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-[#0F6E8C] dark:group-hover:text-teal-300 transition-colors">
          {blog.title}
        </h2>

        {/* 4. Medium Meta Row */}
        <div className="mt-2 flex items-center flex-wrap gap-2 text-[11px] sm:text-xs text-slate-400 dark:text-slate-400 font-normal">
          <span>{formattedDate}</span>
          <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 shrink-0" />
            <span>{viewsCount} views</span>
          </span>
          <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 shrink-0" />
            <span>{readTime}</span>
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
