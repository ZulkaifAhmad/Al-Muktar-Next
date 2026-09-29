"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle({ className = "", showLabel = false, size = "md" }) {
  const { isDark, toggleTheme } = useTheme();

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const iconSize = iconSizes[size] || 18;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 cursor-pointer border ${
        isDark
          ? "bg-slate-800/90 text-amber-300 border-slate-700 hover:bg-slate-700/80 hover:text-amber-200 shadow-xs"
          : "bg-slate-100/90 text-slate-600 border-slate-200 hover:bg-slate-200/80 hover:text-[#0F6E8C] shadow-2xs"
      } ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <Sun
          size={iconSize}
          className={`absolute transition-all duration-500 transform ${
            isDark
              ? "rotate-90 scale-0 opacity-0 text-amber-400"
              : "rotate-0 scale-100 opacity-100 text-amber-500"
          }`}
        />
        {/* Moon Icon */}
        <Moon
          size={iconSize}
          className={`absolute transition-all duration-500 transform ${
            isDark
              ? "rotate-0 scale-100 opacity-100 text-amber-300"
              : "-rotate-90 scale-0 opacity-0 text-slate-700"
          }`}
        />
      </div>

      {showLabel && (
        <span className="ml-2 text-xs font-semibold font-mono tracking-wider">
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
