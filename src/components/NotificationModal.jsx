"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "@/lib/navigation-adapter";
import { Logo, getImageUrl } from "../assets/assets.js";
import {
  X,
  Sparkles,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Check,
  Maximize2,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";

/**
 * NotificationModal
 * 
 * Supports both single and MULTIPLE active notifications.
 * When multiple notifications are active:
 * - Shows an interactive slide switcher / pagination / quick tabs
 * - Next / Prev controls + Keyboard arrow navigation
 * - Notice counter (e.g. "Notice 1 of 3")
 * - 80%-90% responsive width with backdrop blur
 * - Clickable image with Fullscreen Lightbox Preview
 * - Session/Local dismiss memory per notification
 */
export default function NotificationModal({
  notifications: rawNotifications,
  notification: singleNotification,
  isOpen: forceIsOpen,
  onClose: customOnClose,
  previewMode = false,
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);
  const [dismissedIds, setDismissedIds] = useState(new Set());

  // Normalize incoming notifications array
  const allNotifications = React.useMemo(() => {
    if (rawNotifications && Array.isArray(rawNotifications)) {
      return rawNotifications.filter((n) => n && n.isActive);
    }
    if (singleNotification && singleNotification.isActive) {
      return [singleNotification];
    }
    return [];
  }, [rawNotifications, singleNotification]);

  // Filter out notifications dismissed during current session
  const activeList = React.useMemo(() => {
    if (previewMode) return allNotifications;
    return allNotifications.filter((n) => {
      const storageKey = `dismissed_notif_${n._id}_${n.updatedAt || ""}`;
      return !sessionStorage.getItem(storageKey) && !dismissedIds.has(n._id);
    });
  }, [allNotifications, previewMode, dismissedIds]);

  useEffect(() => {
    if (previewMode) {
      setIsOpen(Boolean(forceIsOpen) && allNotifications.length > 0);
      setCurrentIndex(0);
      return;
    }

    if (activeList.length > 0) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [activeList.length, previewMode, forceIsOpen, allNotifications.length]);

  // Lock background page scroll when notification modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Adjust index if out of bounds
  useEffect(() => {
    if (currentIndex >= activeList.length && activeList.length > 0) {
      setCurrentIndex(activeList.length - 1);
    }
  }, [activeList.length, currentIndex]);

  // Auto-play slider: advance to next notification every 5 seconds when multiple notifications exist
  useEffect(() => {
    if (!isOpen || activeList.length <= 1 || isFullscreenImage) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeList.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isOpen, activeList.length, isFullscreenImage, currentIndex]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (isFullscreenImage) {
        if (e.key === "Escape") setIsFullscreenImage(false);
        return;
      }

      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        handleDismissAll();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFullscreenImage, activeList.length, currentIndex]);

  const currentNotification = activeList[currentIndex] || activeList[0] || null;

  const handleNext = () => {
    if (activeList.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % activeList.length);
  };

  const handlePrev = () => {
    if (activeList.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + activeList.length) % activeList.length);
  };

  const handleDismissCurrent = () => {
    if (!currentNotification) return;

    if (!previewMode && currentNotification._id) {
      const storageKey = `dismissed_notif_${currentNotification._id}_${currentNotification.updatedAt || ""}`;
      sessionStorage.setItem(storageKey, "true");
      setDismissedIds((prev) => new Set([...prev, currentNotification._id]));
    }

    // If this was the last remaining notification, close modal smoothly
    if (activeList.length <= 1) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
        if (customOnClose) customOnClose();
      }, 200);
    } else {
      handleNext();
    }
  };

  const handleDismissAll = () => {
    setIsClosing(true);
    if (!previewMode) {
      allNotifications.forEach((n) => {
        if (n._id) {
          const storageKey = `dismissed_notif_${n._id}_${n.updatedAt || ""}`;
          sessionStorage.setItem(storageKey, "true");
        }
      });
      setDismissedIds(new Set(allNotifications.map((n) => n._id)));
    }
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setIsFullscreenImage(false);
      if (customOnClose) customOnClose();
    }, 150);
  };

  const handleActionClick = () => {
    if (!currentNotification?.buttonUrl) {
      handleDismissAll();
      return;
    }

    const url = currentNotification.buttonUrl.trim();

    // Completely dismiss all notifications so modal NEVER re-opens
    if (!previewMode) {
      allNotifications.forEach((n) => {
        if (n._id) {
          const storageKey = `dismissed_notif_${n._id}_${n.updatedAt || ""}`;
          sessionStorage.setItem(storageKey, "true");
        }
      });
      setDismissedIds(new Set(allNotifications.map((n) => n._id)));
    }

    // Immediately close the entire modal and restore document scrolling
    setIsOpen(false);
    setIsClosing(false);
    setIsFullscreenImage(false);
    document.body.style.overflow = "";
    if (customOnClose) customOnClose();

    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      const internalRoute = url.startsWith("/") ? url : `/${url}`;
      navigate(internalRoute);
    }
  };

  if (!isOpen || !currentNotification) return null;

  const {
    title = "",
    description = "",
    image = "",
    badge = "Announcement",
    buttonText = "",
    buttonUrl = "",
  } = currentNotification;

  const totalNotices = activeList.length;
  const hasMultiple = totalNotices > 1;
  const notificationImage = getImageUrl(image, null);
  const hasImage = Boolean(notificationImage);
  const hasTitle = Boolean(title && title.trim());
  const hasDesc = Boolean(description && description.trim());
  const hasAction = Boolean(buttonText && buttonText.trim() && buttonUrl && buttonUrl.trim());

  return (
    <>
      {/* ── 1. MAIN NOTIFICATION MODAL OVERLAY (No Blur, Dark Tint) ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-modal-title"
        className={`fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 md:p-6 transition-all duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Unblurred Dark Overlay */}
        <div
          onClick={handleDismissAll}
          className="fixed inset-0 bg-black/70 dark:bg-black/85 transition-opacity"
        />

        {/* Modal Card Container: Consistent Fixed Size across short/long notices */}
        <div
          className={`relative w-[92%] sm:w-[85%] md:w-[78%] lg:w-[70%] max-w-3xl min-h-[380px] sm:min-h-[420px] md:h-[460px] max-h-[90vh] flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-[#0c1827] text-slate-800 dark:text-slate-100 shadow-2xl border border-slate-200/90 dark:border-slate-800 transition-all duration-300 transform ${
            isClosing ? "scale-95 translate-y-4" : "scale-100 translate-y-0"
          }`}
          style={{
            boxShadow:
              "0 20px 50px -10px rgba(0, 0, 0, 0.5), 0 0 30px -5px rgba(15, 110, 140, 0.25)",
          }}
        >
          {/* Close / Dismiss Button */}
          <button
            onClick={handleDismissAll}
            aria-label="Close notifications"
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={17} />
          </button>

          {/* ── TOP NOTIFICATION HEADER ── */}
          <div className="px-5 sm:px-6 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 shrink-0 pr-12">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F6E8C]/15 dark:bg-[#0F6E8C]/25 text-[#0F6E8C] dark:text-[#8FB3AA] flex items-center justify-center shrink-0">
                <Bell size={16} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F6E8C] dark:text-[#8FB3AA] font-mono">
                    Website Notification
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{badge || "Announcement"}</span>
                  {hasMultiple && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-slate-600 dark:text-slate-300">
                        Notice {currentIndex + 1} of {totalNotices}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT AREA (Scroll-safe, Centered) ── */}
          <div className="px-5 sm:px-6 py-4 flex-1 flex flex-col justify-center overflow-y-auto no-scrollbar">
            <div className={`grid grid-cols-1 ${hasImage ? "md:grid-cols-12 gap-5 md:gap-6 items-center" : "gap-3"} w-full`}>
              {/* Image Preview */}
              {hasImage && (
                <div className="md:col-span-5 flex items-center justify-center">
                  <div
                    onClick={() => setIsFullscreenImage(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setIsFullscreenImage(true)}
                    title="Click to view image in full screen"
                    className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-900 shadow-xs w-full h-44 sm:h-52 md:h-56 focus:outline-none focus:ring-2 focus:ring-[#0F6E8C]"
                  >
                    <img
                      src={notificationImage}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = Logo;
                      }}
                      alt={title || "Notification banner"}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
                      loading="lazy"
                    />

                    {/* Hover Fullscreen Badge */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 text-white text-[11px] font-semibold border border-white/20 shadow-md">
                        <ZoomIn size={13} />
                        <span>View Full Screen</span>
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white opacity-70 group-hover:opacity-100 transition-opacity">
                      <Maximize2 size={12} />
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Message Details */}
              <div className={`${hasImage ? "md:col-span-7 space-y-2.5" : "space-y-3 max-w-xl mx-auto w-full"}`}>
                {/* Title */}
                {hasTitle && (
                  <div className="flex items-center gap-2.5">
                    {!hasImage && (
                      <span className="relative flex h-3 w-3 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F6E8C] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0F6E8C]"></span>
                      </span>
                    )}
                    <h2
                      id="notification-modal-title"
                      className="text-base sm:text-lg md:text-xl font-bold font-heading text-slate-900 dark:text-white tracking-tight leading-snug"
                    >
                      {title}
                    </h2>
                  </div>
                )}

                {/* Announcement Message Box */}
                {hasDesc && (
                  <div className={`p-3.5 rounded-xl border-l-4 border-[#0F6E8C] bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans max-h-36 sm:max-h-44 overflow-y-auto custom-scrollbar shadow-2xs ${
                    !hasImage && !hasTitle ? "flex items-start gap-2.5" : ""
                  }`}>
                    {!hasImage && !hasTitle && (
                      <span className="relative flex h-2.5 w-2.5 shrink-0 mt-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F6E8C] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0F6E8C]"></span>
                      </span>
                    )}
                    <div className="flex-1">
                      {description}
                    </div>
                  </div>
                )}

                {/* In-Content Action / View Course / Blog Button */}
                {hasAction && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleActionClick}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all group cursor-pointer"
                    >
                      <span>{buttonText}</span>
                      {buttonUrl.startsWith("http") ? (
                        <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      ) : (
                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── BOTTOM ACTION BAR (Next fixed at bottom-right if multiple notices) ── */}
          {hasMultiple && (
            <div className="px-5 sm:px-6 py-2.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-xs sm:text-sm font-semibold shadow-xs w-auto transition-colors cursor-pointer shrink-0"
              >
                <span>Next</span>
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. FULLSCREEN IMAGE LIGHTBOX PREVIEW (70% Max Height) ── */}
      {isFullscreenImage && hasImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000000] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
        >
          <div
            onClick={() => setIsFullscreenImage(false)}
            className="fixed inset-0 cursor-zoom-out"
          />

          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFullscreenImage(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 backdrop-blur-md shadow-xl transition-all cursor-pointer group"
            >
              <X size={16} className="group-hover:rotate-90 transition-transform" />
              <span>Cancel Preview</span>
            </button>
          </div>

          <div className="relative z-10 max-w-[90vw] max-h-[75vh] flex flex-col items-center justify-center">
            <img
              src={image}
              alt={title || "Fullscreen preview"}
              className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            {title && (
              <p className="mt-2.5 text-xs sm:text-sm text-slate-300 font-medium text-center bg-black/60 px-4 py-1 rounded-full border border-white/10 backdrop-blur-md max-w-lg truncate">
                {title}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
