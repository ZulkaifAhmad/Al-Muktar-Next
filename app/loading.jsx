import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 space-y-3">
      <div className="w-9 h-9 rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-[#0F6E8C] dark:border-t-teal-400 animate-spin" />
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider font-mono uppercase">
        Loading...
      </p>
    </div>
  );
}

