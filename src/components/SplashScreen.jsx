"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQueryClient, useIsFetching } from "@tanstack/react-query";
import { LogoImg } from "../assets/assets.js";
import api from "@/lib/api.js";
import { courseKeys } from "@/lib/queries/courses.js";
import { blogKeys } from "@/lib/queries/blogs.js";
import { teacherKeys } from "@/lib/queries/teachers.js";
import { notificationKeys } from "@/lib/queries/notifications.js";

export default function SplashScreen({ onComplete }) {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const isFinishedRef = useRef(false);
  const startTimeRef = useRef(Date.now());
  const minTimeMs = 2000; // Strictly at least 2 seconds (2.0s)
  const maxTimeMs = 5000; // Max safety fallback timeout (5s)

  // Initialize and trigger background API prefetching on first session visit
  useEffect(() => {
    if (typeof window === "undefined") return;

    const alreadyShown = sessionStorage.getItem("almukhtar_splash_shown");
    if (alreadyShown) {
      setIsVisible(false);
      isFinishedRef.current = true;
      document.body.style.overflow = "";
      if (onComplete) onComplete();
      return;
    }

    // First time in this session: activate splash screen and lock scroll
    setIsVisible(true);
    document.body.style.overflow = "hidden";

    // ── Prefetch all critical platform APIs in parallel ──
    const prefetchAll = async () => {
      try {
        await Promise.allSettled([
          // 1. Auth & User Profile API
          queryClient.prefetchQuery({
            queryKey: ["authUser"],
            queryFn: async () => {
              try {
                const res = await api.get("/api/auth/me");
                return res.data?.success ? res.data.user : null;
              } catch {
                return null;
              }
            },
            staleTime: 5 * 60 * 1000,
          }),

          // 2. Courses API
          queryClient.prefetchQuery({
            queryKey: courseKeys.all,
            queryFn: async () => {
              const res = await api.get("/api/courses");
              return res.data?.courses || [];
            },
            staleTime: 60 * 1000,
          }),

          // 3. Blogs API
          queryClient.prefetchQuery({
            queryKey: blogKeys.all,
            queryFn: async () => {
              const res = await api.get("/api/blogs");
              return res.data?.blogs || [];
            },
            staleTime: 60 * 1000,
          }),

          // 4. Teachers / Faculty API
          queryClient.prefetchQuery({
            queryKey: teacherKeys.all,
            queryFn: async () => {
              const res = await api.get("/api/teachers");
              return res.data?.teachers || [];
            },
            staleTime: 60 * 1000,
          }),

          // 5. Active Notifications API
          queryClient.prefetchQuery({
            queryKey: notificationKeys.active,
            queryFn: async () => {
              const res = await api.get("/api/notifications/active");
              return res.data?.notifications || [];
            },
            staleTime: 60 * 1000,
          }),
        ]);
      } catch (err) {
        console.error("Prefetch error:", err);
      }
    };

    prefetchAll();
  }, [queryClient, onComplete]);

  // Animate progress smoothly over at least 2000ms
  useEffect(() => {
    if (!isVisible || isFinishedRef.current) return;

    const interval = setInterval(() => {
      if (isFinishedRef.current) {
        clearInterval(interval);
        return;
      }

      const elapsed = Date.now() - startTimeRef.current;
      const isTimePassed = elapsed >= minTimeMs;
      const isApiReady = isFetching === 0 && isTimePassed;
      const isTimedOut = elapsed >= maxTimeMs;

      setProgress((prev) => {
        if (isApiReady || isTimedOut) {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return Math.min(100, prev + Math.max(8, (100 - prev) * 0.35));
        }

        // Smooth time-based progression toward 95% over the 2 seconds
        const targetPercent = Math.min(95, (elapsed / minTimeMs) * 90);
        if (prev < targetPercent) {
          return Math.min(95, prev + Math.max(1, (targetPercent - prev) * 0.2));
        }

        if (prev < 95) {
          return prev + 0.2;
        }

        return prev;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isVisible, isFetching]);

  // Handle completion, release scroll lock, inform parent, and smoothly fade out
  useEffect(() => {
    if (progress >= 100 && isVisible && !isFinishedRef.current) {
      isFinishedRef.current = true;
      sessionStorage.setItem("almukhtar_splash_shown", "true");

      // Release body scroll lock immediately
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }

      // Notify parent that loading is completed so website UI can render
      if (onComplete) {
        onComplete();
      }

      const timer = setTimeout(() => {
        setIsFading(true);
        const hideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 350);
        return () => clearTimeout(hideTimer);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [progress, isVisible, onComplete]);

  // Cleanup on unmount ensures scroll is ALWAYS restored
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  const roundedProgress = Math.min(100, Math.round(progress));

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#09111e] text-slate-100 select-none transition-opacity duration-350 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-6 animate-in fade-in duration-300">
        {/* Simple, Clean, Professional Logo Card (No Gradients) */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-3 bg-[#0f1d30] border border-slate-700/60 shadow-xl flex items-center justify-center">
          <img
            src={LogoImg}
            alt="Al-Mukhtar Logo"
            className="w-full h-full object-contain"
            loading="eager"
          />
        </div>

        {/* Institution Title */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-heading font-black tracking-wide text-white">
            AL-MUKHTAR
          </h1>
          <p className="text-xs font-mono text-slate-400 font-medium tracking-wider uppercase">
            Where the Choosen Rise
          </p>
        </div>

        {/* Clean Linear Progress Indicator (Solid Colors, No Gradients) */}
        <div className="w-56 sm:w-64 space-y-2.5 pt-2">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0F6E8C] rounded-full transition-all duration-100 ease-out"
              style={{ width: `${roundedProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>
              {roundedProgress < 35
                ? "Connecting..."
                : roundedProgress < 75
                ? "Loading courses & profile..."
                : roundedProgress < 100
                ? "Almost ready..."
                : "Welcome to Al-Mukhtar"}
            </span>
            <span className="font-semibold text-slate-300 font-mono">
              {roundedProgress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
