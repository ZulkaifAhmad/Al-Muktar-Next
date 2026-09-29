import React from "react";
import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 p-6">
      <Loader2 size={24} className="text-[#0F6E8C] dark:text-teal-400 animate-spin" />
      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Loading Admin Workspace...
      </span>
    </div>
  );
}
