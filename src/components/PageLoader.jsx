"use client";

import React from "react";

function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-pulse">
      {/* Navbar skeleton */}
      <div className="h-[72px] bg-white border-b border-gray-100 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="w-28 h-5 rounded bg-gray-200" />
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden lg:flex gap-6">
            {[90, 70, 80, 55, 75].map((w, i) => (
              <div key={i} className={`h-4 rounded bg-gray-200`} style={{ width: w }} />
            ))}
          </div>
          <div className="w-20 h-9 rounded-lg bg-gray-200" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="h-80 bg-gray-200" />

      {/* Content skeleton */}
      <div className="max-w-6xl mx-auto w-full px-6 py-16 flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-48" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-32" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PageLoader;
