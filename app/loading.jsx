import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-3 border-teal-500/20 animate-ping" />
        <div className="w-12 h-12 rounded-full border-3 border-[#0F6E8C] dark:border-teal-400 border-t-transparent animate-spin" />
      </div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide font-mono uppercase animate-pulse">
        Loading Al-Mukhtar...
      </p>
    </div>
  );
}
