"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "@/lib/navigation-adapter";
import api from "@/lib/api";
import { Mail, ArrowLeft } from "lucide-react";
import { Logo, moon_light } from "../assets/assets.js";


function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const redirectUrl = searchParams.get("redirect") || "";

  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp0: "",
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
    },
  });

  // Verify OTP mutation
  const verifyMutation = useMutation({
    mutationFn: (data) => api.post("/api/auth/verify-email", data),
    onSuccess: () => {
      const redirectQuery = redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : "";
      navigate(`/login${redirectQuery}`);
    },
    onError: (error) => {
      console.error("Verification failed:", error?.response?.data?.message);
    },
  });

  // Resend OTP mutation
  const resendMutation = useMutation({
    mutationFn: () => api.post("/api/auth/resend-otp", { email }),
    onSuccess: () => {
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
  });

  const onSubmit = (data) => {
    const otp = Object.values(data).join("");
    verifyMutation.mutate({ email, otp });
  };

  // Handle auto-focus between OTP boxes
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits

    setValue(`otp${index}`, value);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !getValues(`otp${index}`) && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasted)) return;

    pasted.split("").forEach((digit, i) => {
      setValue(`otp${i}`, digit);
    });
    inputRefs.current[5]?.focus();
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex bg-slate-50 font-sans">

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
            <img
              src={Logo}
              alt="Madrasa Logo"
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-[#8FB3AA]/40 shadow-sm"
            />
            <span className="text-white font-heading font-extrabold text-lg tracking-tight">
              Al-Mukhtar Institute
            </span>
          </div>

          <div className="py-8">
            <span className="inline-block text-[#8FB3AA] text-[11px] font-bold tracking-widest uppercase mb-3 font-mono">
              Almost There
            </span>
            <h1 className="font-heading text-3xl xl:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
              One last step to confirm your account
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm font-normal">
              Verifying your email keeps your account secure and ensures you receive timely course notifications.
            </p>
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

          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F6E8C] flex items-center justify-center mb-6 border border-teal-100">
            <Mail size={22} />
          </div>

          <div className="mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 mb-1.5 tracking-tight">
              Verify your email
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              We've sent a 6-digit verification code to{" "}
              <span className="font-semibold text-slate-800">{email}</span>.
              Enter it below to confirm your account.
            </p>
          </div>

          {verifyMutation.isError && (
            <div className="mb-6 text-xs sm:text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 font-medium">
              {verifyMutation.error?.response?.data?.message ||
                "Invalid or expired code. Please try again."}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* OTP Boxes */}
            <div className="flex items-center justify-between gap-2 mb-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                  {...register(`otp${index}`, {
                    required: true,
                    pattern: /^\d$/,
                  })}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-11 h-13 sm:w-14 sm:h-15 text-center text-xl font-bold rounded-xl border text-slate-900 outline-none transition-all focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] bg-white ${errors[`otp${index}`] ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                    }`}
                />
              ))}
            </div>
            {Object.keys(errors).length > 0 && (
              <p className="text-xs text-rose-500 mt-1.5 mb-4 font-medium">
                Please enter all 6 digits
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={verifyMutation.isPending}
              className="w-full bg-[#0F6E8C] text-white py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-[#0B5C74] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-6 text-center"
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          {/* Resend */}
          <p className="text-xs sm:text-sm text-center text-slate-500 mt-6">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={() => resendMutation.mutate()}
              disabled={resendCooldown > 0 || resendMutation.isPending}
              className="text-[#0F6E8C] font-bold hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : resendMutation.isPending
                  ? "Sending..."
                  : "Resend code"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;