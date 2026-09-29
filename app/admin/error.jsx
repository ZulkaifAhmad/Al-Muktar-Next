"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error("Admin dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-[#0c1827] border border-rose-200 dark:border-rose-900/40 rounded-2xl p-6 text-center space-y-4 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle size={22} />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
            Admin Module Encountered an Error
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {error?.message || "Failed to load dashboard components."}
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw size={13} />
          <span>Reload Section</span>
        </button>
      </div>
    </div>
  );
}
