"use client";

import React, { useState } from "react";
import { RefreshCw, WifiOff, AlertTriangle } from "lucide-react";

/**
 * Reusable, modern API Error State component with one-click refresh/retry button.
 * Used whenever queries fail due to network loss, server issues, or timeouts.
 *
 * @param {Object} props
 * @param {string} [props.title="Unable to load content"]
 * @param {string} [props.message="Please check your internet connection and try refreshing."]
 * @param {Function} [props.onRetry] - Function to trigger the API refetch
 * @param {Function} [props.refetch] - Alias for onRetry
 * @param {boolean} [props.isRetrying=false] - If the parent is actively refetching
 * @param {"card" | "page" | "inline" | "banner"} [props.variant="card"] - Display layout
 * @param {string} [props.className=""] - Custom classes
 */
export default function ApiErrorState({
  title = "Unable to load content",
  message = "Please check your internet connection or try refreshing.",
  onRetry,
  refetch,
  isRetrying = false,
  variant = "card",
  className = "",
}) {
  const [internalRetrying, setInternalRetrying] = useState(false);
  const handleRetry = onRetry || refetch;

  const handleTriggerRetry = async () => {
    if (!handleRetry || internalRetrying || isRetrying) return;
    setInternalRetrying(true);
    try {
      await handleRetry();
    } catch (e) {
      // Handled by query client
    } finally {
      setTimeout(() => setInternalRetrying(false), 500);
    }
  };

  const isSpinning = isRetrying || internalRetrying;

  // 1. Inline / Compact Variant (Sidebars, small widgets, form fields)
  if (variant === "inline") {
    return (
      <div
        className={`flex items-center justify-between gap-3 p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 text-xs ${className}`}
        role="alert"
      >
        <div className="flex items-center gap-2 min-w-0">
          <WifiOff size={14} className="text-rose-500 shrink-0" />
          <p className="text-slate-700 dark:text-slate-300 font-medium truncate">
            {title}
          </p>
        </div>
        {handleRetry && (
          <button
            type="button"
            onClick={handleTriggerRetry}
            disabled={isSpinning}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-[#0F6E8C] dark:text-teal-400 font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-[11px] shrink-0 cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <RefreshCw size={11} className={isSpinning ? "animate-spin" : ""} />
            <span>{isSpinning ? "Retrying..." : "Refresh"}</span>
          </button>
        )}
      </div>
    );
  }

  // 2. Banner Variant (Across tops of containers)
  if (variant === "banner") {
    return (
      <div
        className={`p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
        role="alert"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <WifiOff size={16} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-heading">
              {title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {message}
            </p>
          </div>
        </div>
        {handleRetry && (
          <button
            type="button"
            onClick={handleTriggerRetry}
            disabled={isSpinning}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F6E8C] hover:bg-[#0B5C74] dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer disabled:opacity-60 shrink-0 self-start sm:self-auto"
          >
            <RefreshCw size={13} className={isSpinning ? "animate-spin" : ""} />
            <span>{isSpinning ? "Refreshing..." : "Refresh Connection"}</span>
          </button>
        )}
      </div>
    );
  }

  // 3. Full Page Variant (For whole page failures like /courses/:slug, /blog/:slug)
  if (variant === "page") {
    return (
      <div
        className={`min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 font-sans ${className}`}
        role="alert"
      >
        <div className="max-w-md w-full bg-white dark:bg-[#0c1827] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 shadow-lg shadow-slate-900/5 dark:shadow-slate-950/40 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-2xs">
            <WifiOff size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {message}
            </p>
          </div>
          {handleRetry && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleTriggerRetry}
                disabled={isSpinning}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F6E8C] hover:bg-[#0B5C74] dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-all text-xs sm:text-sm shadow-sm cursor-pointer disabled:opacity-60 active:scale-98"
              >
                <RefreshCw size={15} className={isSpinning ? "animate-spin" : ""} />
                <span>{isSpinning ? "Retrying Connection..." : "Refresh Page"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. Default Card Variant (Inside grids, tables, dashboard panels)
  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 text-center space-y-4 max-w-lg mx-auto font-sans shadow-2xs ${className}`}
      role="alert"
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-2xs">
        <WifiOff size={20} />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading">
          {title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
          {message}
        </p>
      </div>
      {handleRetry && (
        <div className="pt-1">
          <button
            type="button"
            onClick={handleTriggerRetry}
            disabled={isSpinning}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#0F6E8C] hover:bg-[#0B5C74] dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer disabled:opacity-60 active:scale-95"
          >
            <RefreshCw size={13} className={isSpinning ? "animate-spin" : ""} />
            <span>{isSpinning ? "Retrying..." : "Refresh"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
