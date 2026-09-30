"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@/lib/navigation-adapter";
import api from "@/lib/api";
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Users,
  Award,
} from "lucide-react";
import { Logo, moon_light } from "../assets/assets.js";


/* ──────────────────────────────────────────────────────────
   Step 1 — Enter Email
────────────────────────────────────────────────────────── */
function StepEmail({ onNext }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => api.post("/api/auth/forgot-password", data),
    onSuccess: (_, variables) => onNext(variables.email),
  });

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F6E8C] flex items-center justify-center mb-5 border border-teal-100">
          <Mail size={22} />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 mb-1.5 tracking-tight">
          Forgot your password?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
          Enter your registered email address. We'll send you a 6-digit OTP to reset your password.
        </p>
      </div>

      {mutation.isError && (
        <div className="mb-5 text-xs sm:text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 font-medium">
          {mutation.error?.response?.data?.message || "Something went wrong. Please try again."}
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] ${errors.email ? "border-rose-400 bg-rose-50/30" : "border-slate-200 bg-white"
              }`}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
            })}
          />
          {errors.email && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[#0F6E8C] text-white py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-[#0B5C74] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-center"
        >
          {mutation.isPending ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>

      <p className="text-xs sm:text-sm text-center text-slate-500 mt-6">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-[#0F6E8C] font-bold hover:underline">
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Step 2 — Enter OTP
────────────────────────────────────────────────────────── */
function StepOtp({ email, onNext }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => api.post("/api/auth/verify-reset-otp", { email, otp: data.otp }),
    onSuccess: (res) => onNext(res.data.resetToken),
  });

  const resendMutation = useMutation({
    mutationFn: () => api.post("/api/auth/forgot-password", { email }),
  });

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F6E8C] flex items-center justify-center mb-5 border border-teal-100">
          <KeyRound size={22} />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 mb-1.5 tracking-tight">
          Enter the OTP
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
          We sent a 6-digit code to <span className="font-semibold text-slate-800">{email}</span>. It expires in 10 minutes.
        </p>
      </div>

      {mutation.isError && (
        <div className="mb-5 text-xs sm:text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 font-medium">
          {mutation.error?.response?.data?.message || "Invalid OTP. Please try again."}
        </div>
      )}
      {resendMutation.isSuccess && (
        <div className="mb-5 text-xs sm:text-sm text-teal-800 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 font-medium">
          A new OTP has been sent to your email.
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            6-Digit OTP
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="e.g. 482910"
            className={`w-full px-4 py-2.5 rounded-xl border text-center text-2xl font-bold tracking-[0.4em] text-slate-900 outline-none transition-all focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] bg-white ${errors.otp ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
              }`}
            {...register("otp", {
              required: "OTP is required",
              pattern: { value: /^\d{6}$/, message: "Enter a valid 6-digit OTP" },
            })}
          />
          {errors.otp && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.otp.message}</p>}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[#0F6E8C] text-white py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-[#0B5C74] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-center"
        >
          {mutation.isPending ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <p className="text-xs sm:text-sm text-center text-slate-500 mt-5">
        Didn't receive it?{" "}
        <button
          onClick={() => resendMutation.mutate()}
          disabled={resendMutation.isPending}
          className="text-[#0F6E8C] font-bold hover:underline disabled:opacity-50"
        >
          {resendMutation.isPending ? "Sending..." : "Resend OTP"}
        </button>
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Step 3 — New Password
────────────────────────────────────────────────────────── */
function StepNewPassword({ resetToken, onDone }) {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (data) =>
      api.post("/api/auth/reset-password", { resetToken, newPassword: data.newPassword }),
    onSuccess: onDone,
  });

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F6E8C] flex items-center justify-center mb-5 border border-teal-100">
          <Lock size={22} />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 mb-1.5 tracking-tight">
          Set a new password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
          Choose a strong password with at least 6 characters.
        </p>
      </div>

      {mutation.isError && (
        <div className="mb-5 text-xs sm:text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 font-medium">
          {mutation.error?.response?.data?.message || "Something went wrong. Please try again."}
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">New Password</label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Enter new password"
              className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] bg-white ${errors.newPassword ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                }`}
              {...register("newPassword", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPwd((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.newPassword && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] bg-white ${errors.confirmPassword ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                }`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (v) => v === watch("newPassword") || "Passwords do not match",
              })}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[#0F6E8C] text-white py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-[#0B5C74] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-center"
        >
          {mutation.isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Step 4 — Success
────────────────────────────────────────────────────────── */
function StepSuccess() {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-[420px] text-center">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#0F6E8C] flex items-center justify-center mx-auto mb-6 border border-teal-100">
        <CheckCircle2 size={32} />
      </div>
      <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">Password reset!</h2>
      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-normal">
        Your password has been reset successfully. You can now sign in with your new password.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="w-full bg-[#0F6E8C] text-white py-3 rounded-xl font-bold hover:bg-[#0B5C74] transition-all text-sm shadow-sm text-center"
      >
        Go to Login
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Main Component
────────────────────────────────────────────────────────── */
const STEPS = ["email", "otp", "password", "done"];

function ForgotPassword() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  // Step indicator
  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex bg-slate-50 font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[42%] relative bg-gradient-to-br from-[#0A2540] via-[#081E2E] to-[#0F6E8C] overflow-hidden">
        <img
          src={moon_light}
          alt=""
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-25 pointer-events-none"
        />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#8FB3AA]/15 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#0F6E8C]/20 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-14 w-full">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="w-11 h-11 rounded-xl object-cover ring-2 ring-[#8FB3AA]/40 shadow-sm" />
            <span className="text-white font-heading font-extrabold text-lg tracking-tight">Al-Mukhtar Institute</span>
          </div>

          <div className="py-8">
            <span className="inline-block text-[#8FB3AA] text-[11px] font-bold tracking-widest uppercase mb-3 font-mono">
              Account Recovery
            </span>
            <h1 className="font-heading text-3xl xl:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
              Regain access to your account
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm font-normal">
              Follow the simple steps to verify your identity and create a new password.
            </p>
          </div>

          {/* Progress steps */}
          <div className="space-y-3">
            {["Enter your email", "Verify OTP", "Set new password"].map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 transition-all ${i < stepIndex
                      ? "bg-[#8FB3AA] text-[#0A2540]"
                      : i === stepIndex
                        ? "bg-white text-[#0A2540]"
                        : "bg-white/10 border border-white/20 text-white/50"
                    }`}
                >
                  {i < stepIndex ? <CheckCircle2 size={13} /> : i + 1}
                </div>
                <span
                  className={`text-xs ${i <= stepIndex ? "text-white font-semibold" : "text-white/40 font-normal"
                    }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel (Starts from top on mobile with full screen height, centered on desktop) */}
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
          <div className="flex lg:hidden items-center gap-2.5 mb-6 self-start">
            <img src={Logo} alt="Logo" className="w-9 h-9 rounded-xl object-cover shadow-2xs" />
            <span className="font-heading font-extrabold text-base text-slate-900">Al-Mukhtar Institute</span>
          </div>

          {step === "email" && (
            <StepEmail
              onNext={(e) => {
                setEmail(e);
                setStep("otp");
              }}
            />
          )}
          {step === "otp" && (
            <StepOtp
              email={email}
              onNext={(token) => {
                setResetToken(token);
                setStep("password");
              }}
            />
          )}
          {step === "password" && (
            <StepNewPassword
              resetToken={resetToken}
              onDone={() => setStep("done")}
            />
          )}
          {step === "done" && <StepSuccess />}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
