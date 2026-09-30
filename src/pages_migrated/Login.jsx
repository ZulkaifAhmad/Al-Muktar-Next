"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useLocation, useSearchParams } from "@/lib/navigation-adapter";
import api from "@/lib/api";
import { Eye, EyeOff, BookOpen, Users, Award, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo, moon_light } from "../assets/assets.js";


function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || location.state?.from || "/";
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginMutation = useMutation({
    mutationFn: (data) => api.post("/api/auth/login", data),
    onSuccess: (response) => {
      login(response.data.user);
      navigate(redirectUrl, { replace: true });
    },
    onError: (error) => {
      console.error("Login failed:", error?.response?.data?.message);
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex bg-slate-50 font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[42%] relative bg-gradient-to-br from-[#0A2540] via-[#081E2E] to-[#0F6E8C] overflow-hidden">
        <img
          src={moon_light}
          alt=""
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-25 pointer-events-none"
        />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#8FB3AA]/15 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#0F6E8C]/20 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-14 w-full">
          {/* Logo + Name */}
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="Madrasa Logo"
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-[#8FB3AA]/40 shadow-sm"
            />
            <span className="text-white font-heading font-extrabold text-lg tracking-tight">
              Al-Mukhtar Institute
            </span>
          </div>

          {/* Main message */}
          <div className="py-8">
            <span className="inline-block text-[#8FB3AA] text-[11px] font-bold tracking-widest uppercase mb-3 font-mono">
              Welcome Back
            </span>
            <h1 className="font-heading text-3xl xl:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
              Continue your journey of knowledge & faith
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm font-normal">
              Sign in to access your courses, track your applications, and connect with your instructors.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <BookOpen size={16} className="text-[#8FB3AA]" />
              </div>
              <span className="text-xs text-slate-200 font-medium">
                Structured authentic curriculum
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <Users size={16} className="text-[#8FB3AA]" />
              </div>
              <span className="text-xs text-slate-200 font-medium">
                Experienced, qualified scholars
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <Award size={16} className="text-[#8FB3AA]" />
              </div>
              <span className="text-xs text-slate-200 font-medium">
                Recognized course certification
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form (Starts from top on mobile with full screen height, centered on desktop) */}
      <div className="w-full lg:w-[58%] flex flex-col justify-start lg:justify-center items-center px-5 pt-6 pb-10 sm:px-14 sm:py-12 min-h-[100dvh] lg:min-h-screen overflow-y-auto">
        <div className="w-full max-w-[420px] flex flex-col justify-start">
          {/* Back to Home Button on top left */}
          <div className="mb-4 sm:mb-6 self-start">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0F6E8C] bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 transition-all group shadow-2xs"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-6">
            <img
              src={Logo}
              alt="Madrasa Logo"
              className="w-9 h-9 rounded-xl object-cover shadow-2xs"
            />
            <span className="font-heading font-extrabold text-base text-slate-900">
              Al-Mukhtar Institute
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 mb-1.5 tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Enter your credentials to access your portal.
            </p>
          </div>

          {loginMutation.isError && (
            <div className="mb-6 text-xs sm:text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 font-medium space-y-1.5">
              <p>
                {loginMutation.error?.response?.data?.message ||
                  "Invalid email or password. Please try again."}
              </p>
              {loginMutation.error?.response?.status === 403 && (
                <div className="pt-1">
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0F6E8C] underline hover:text-[#0B5C74]"
                  >
                    <span>Re-enter credentials in Signup to receive a fresh OTP</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="text"
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] ${errors.email ? "border-rose-400 bg-rose-50/30" : "border-slate-200 bg-white"
                  }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1.5 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#0F6E8C] font-bold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] ${errors.password ? "border-rose-400 bg-rose-50/30" : "border-slate-200 bg-white"
                    }`}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 mt-1.5 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#0F6E8C] text-white py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-[#0B5C74] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 text-center"
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] text-slate-400 font-mono font-bold tracking-wider">OR</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <p className="text-xs sm:text-sm text-center text-slate-600">
            Don't have an account?{" "}
            <Link
              to={redirectUrl && redirectUrl !== "/" ? `/signup?redirect=${encodeURIComponent(redirectUrl)}` : "/signup"}
              className="text-[#0F6E8C] font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;