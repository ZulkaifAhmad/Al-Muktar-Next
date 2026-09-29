"use client";

import React from "react";
import { Link, useNavigate } from "@/lib/navigation-adapter";
import { Home, ArrowLeft } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto text-center flex flex-col items-center py-16">
        <span className="text-[#0F6E8C] font-mono text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80">
          Error 404
        </span>

        <h1 className="text-7xl sm:text-9xl font-heading font-black text-slate-900 leading-none tracking-tight select-none">
          404
        </h1>

        <h2 className="mt-4 text-xl sm:text-2xl font-heading font-bold text-slate-900 tracking-tight">
          Page Not Found
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed font-normal">
          The academic page or resource you are looking for does not exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            Go Back
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#0F6E8C] rounded-xl hover:bg-[#0B5C74] transition-all shadow-2xs"
          >
            <Home size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;