"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  User,
  Users,
  MessageCircle,
  Phone,
  Clock,
  GraduationCap,
  MapPin,
  CreditCard,
  Calendar,
  BookOpen,
  CheckCircle2,
  Send,
  ClipboardList,
  ShieldCheck,
  PhoneCall,
  LogIn,
  Lock,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "@/lib/navigation-adapter";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/lib/queries";
import ApiErrorState from "../components/ApiErrorState.jsx";

const qualificationOptions = [
  "Primary",
  "Middle",
  "Matric",
  "Intermediate",
  "Bachelors",
  "Masters",
  "Other",
];

const admissionSteps = [
  {
    title: "Fill the application form",
    text: "Provide your personal details and select the course and shift you'd like to join.",
  },
  {
    title: "Verification call",
    text: "Our admissions team will contact you on WhatsApp or phone within 1–2 working days.",
  },
  {
    title: "Confirmation & enrollment",
    text: "Once verified, you'll receive your enrollment confirmation and orientation details.",
  },
];

function Apply() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: courses = [],
    isLoading: coursesLoading,
    isError: coursesError,
    refetch: refetchCourses,
  } = useCourses();

  const searchParams = new URLSearchParams(location.search);
  const targetCourseParam = searchParams.get("course");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      course: "",
    },
  });

  // Pre-select the course when arriving with ?course= query param
  useEffect(() => {
    if (!targetCourseParam) return;
    const rawTarget = decodeURIComponent(targetCourseParam).trim();
    if (!rawTarget) return;

    if (courses && courses.length > 0) {
      const lower = rawTarget.toLowerCase();
      const cleanTarget = lower.replace(/[^a-z0-9]/g, "");

      const matched = courses.find((c) => {
        const titleLower = (c.title || "").trim().toLowerCase();
        const slugLower = (c.slug || "").trim().toLowerCase();
        const idStr = (c._id || "").toString();

        const cleanTitle = titleLower.replace(/[^a-z0-9]/g, "");
        const cleanSlug = slugLower.replace(/[^a-z0-9]/g, "");

        return (
          titleLower === lower ||
          slugLower === lower ||
          idStr === rawTarget ||
          (cleanTarget && (cleanSlug === cleanTarget || cleanTitle === cleanTarget)) ||
          (cleanTarget.length > 3 && (cleanTitle.includes(cleanTarget) || cleanTarget.includes(cleanTitle)))
        );
      });

      if (matched) {
        setValue("course", matched.slug || matched.title, { shouldValidate: true });
      } else {
        setValue("course", rawTarget, { shouldValidate: false });
      }
    }
  }, [targetCourseParam, courses, setValue]);

  const submitMutation = useMutation({
    mutationFn: (data) => api.post("/api/applications", data),
    onSuccess: (res) => {
      setSubmitted(true);
      reset();
      window.scrollTo({ top: 0, behavior: "smooth" });

      // 1. Immediately inject the new application into TanStack Query cache for instant response
      if (res.data?.application) {
        queryClient.setQueryData(["myApplications"], (old) => {
          const prev = Array.isArray(old) ? old : [];
          return [res.data.application, ...prev.filter((a) => a._id !== res.data.application._id)];
        });
      }

      // 2. Trigger fresh background sync for profile and admin queries
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
      queryClient.refetchQueries({ queryKey: ["myApplications"], type: "active" });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application-stats"] });
      queryClient.invalidateQueries({ queryKey: ["applicationStats"] });
    },
  });

  const onSubmit = (data) => {
    submitMutation.mutate(data);
  };

  // ── Auth Guard ──────────────────────────────────────────────────────────────
  if (!loading && !user) {
    return (
      <div className="bg-white font-sans text-slate-800 min-h-screen">
        {/* Clean Hero */}
        <section className="pt-10 sm:pt-16 pb-10 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-center space-y-3.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-[10px] sm:text-[11px] font-bold text-[#0F6E8C] font-mono tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E8C] animate-pulse" />
              <span>ONLINE ADMISSION PORTAL</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Apply for Admission
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-normal">
              Sign in to submit your enrollment request for upcoming academic terms at Al-Mukhtar Institute.
            </p>
          </div>
        </section>

        {/* Login Gate */}
        <section className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-10 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0F6E8C] flex items-center justify-center mx-auto mb-5 border border-teal-100">
              <Lock size={26} />
            </div>
            <h2 className="font-heading text-2xl font-bold text-slate-900 mb-2.5 tracking-tight">
              Sign in to Apply
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 max-w-md mx-auto">
              You need to be logged in to submit a course application. Please sign in or create an account to continue.
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-3">
              <Link
                to={`/login?redirect=${encodeURIComponent(location.pathname + (location.search || ""))}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#0F6E8C] text-white font-bold px-3 sm:px-6 py-2.5 rounded-xl hover:bg-[#0B5C74] active:scale-[0.98] transition-all shadow-xs text-xs sm:text-sm text-center"
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </Link>
              <Link
                to={`/signup?redirect=${encodeURIComponent(location.pathname + (location.search || ""))}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 border border-slate-300 text-slate-700 font-bold px-3 sm:px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-all text-xs sm:text-sm text-center"
              >
                <span>Create Account</span>
              </Link>
            </div>
            <p className="mt-6 text-xs text-slate-400">
              Looking for available programs?{" "}
              <Link to="/courses" className="text-[#0F6E8C] font-semibold hover:underline">
                Browse our courses
              </Link>
            </p>
          </div>
        </section>
      </div>
    );
  }

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-[#0F6E8C] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white font-sans text-slate-800 min-h-screen">
      {/* Clean Hero Section */}
      <section className="pt-8 sm:pt-10 pb-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-center space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-[10px] sm:text-[11px] font-bold text-[#0F6E8C] font-mono tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E8C] animate-pulse" />
            <span>ONLINE ADMISSION PORTAL</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Apply for Course Admission
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed break-normal hyphens-none font-normal">
            Fill out the form below to apply for admission at Al-Mukhtar Institute. Our admissions team will review your application and reach out to confirm your enrollment.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {submitted ? (
          <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-7 sm:p-11 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#0F6E8C] flex items-center justify-center mx-auto mb-5 border border-teal-100 shadow-2xs">
                <CheckCircle2 size={34} />
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold font-mono uppercase tracking-wider mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Application Received</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                Application Submitted Successfully!
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto mb-7 font-normal">
                Thank you for applying to Al-Mukhtar Institute. Our admissions department will review your application details and contact you via WhatsApp or phone within <strong>1–2 working days</strong> for verification and enrollment details.
              </p>

              {/* What Happens Next card */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 sm:p-5 text-left mb-8 space-y-3">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                  Next Steps
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-[#0F6E8C] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <span>Admissions team verifies your submitted profile and credentials.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-[#0F6E8C] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <span>You'll receive a confirmation call/message with schedule and fee instructions.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-[#0F6E8C] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <span>Orientation and batch commencement at the institute.</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#0F6E8C] hover:bg-[#0B5C74] text-white font-bold px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all text-xs sm:text-sm shadow-xs cursor-pointer active:scale-95 text-center"
                >
                  <span>Apply Again</span>
                </button>
                <Link
                  to="/profile"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 font-bold px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all text-xs sm:text-sm cursor-pointer text-center"
                >
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/courses"
                  className="col-span-2 sm:col-span-1 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all text-xs sm:text-sm cursor-pointer text-center"
                >
                  <span>Explore Courses</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-8">
              {submitMutation.isError && (
                <div className="mb-6 text-xs sm:text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 font-medium">
                  {submitMutation.error?.response?.data?.message || "Failed to submit application. Please try again."}
                </div>
              )}
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0F6E8C] flex items-center justify-center border border-teal-100">
                    <ClipboardList size={17} />
                  </div>
                  <div>
                    <h2 className="font-heading text-base font-bold text-slate-900">
                      Applicant Information
                    </h2>
                    <p className="text-xs text-slate-500 font-mono">Please fill in accurate information for institutional enrollment</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
                  <div className="sm:col-span-1">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                      <User size={13} className="text-[#0F6E8C]" />
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ahmed Raza"
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] transition-colors ${
                        errors.name ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                      }`}
                      {...register("name", {
                        required: "Full name is required",
                        pattern: {
                          value: /^[A-Za-z\s]{3,50}$/,
                          message: "Enter a valid name (letters only)",
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-500 mt-1.5 font-medium">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                      <Users size={13} className="text-[#0F6E8C]" />
                      Father's Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Muhammad Raza"
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] transition-colors ${
                        errors.fatherName ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                      }`}
                      {...register("fatherName", {
                        required: "Father's name is required",
                        pattern: {
                          value: /^[A-Za-z\s]{3,50}$/,
                          message: "Enter a valid name (letters only)",
                        },
                      })}
                    />
                    {errors.fatherName && (
                      <p className="text-xs text-rose-500 mt-1.5 font-medium">
                        {errors.fatherName.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                      <MessageCircle size={13} className="text-[#0F6E8C]" />
                      WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="03XXXXXXXXX"
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] transition-colors ${
                        errors.whatsapp ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                      }`}
                      {...register("whatsapp", {
                        required: "WhatsApp number is required",
                        pattern: {
                          value: /^03[0-9]{9}$/,
                          message: "Enter a valid number (e.g. 03001234567)",
                        },
                      })}
                    />
                    {errors.whatsapp && (
                      <p className="text-xs text-rose-500 mt-1.5 font-medium">
                        {errors.whatsapp.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                      <Phone size={13} className="text-[#0F6E8C]" />
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="03XXXXXXXXX"
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] transition-colors ${
                        errors.mobile ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                      }`}
                      {...register("mobile", {
                        required: "Mobile number is required",
                        pattern: {
                          value: /^03[0-9]{9}$/,
                          message: "Enter a valid number (e.g. 03001234567)",
                        },
                      })}
                    />
                    {errors.mobile && (
                      <p className="text-xs text-rose-500 mt-1.5 font-medium">
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                      <BookOpen size={13} className="text-[#0F6E8C]" />
                      Select Course <span className="text-rose-500">*</span>
                    </label>
                    <select
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] transition-colors ${
                        errors.course ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                      }`}
                      {...register("course", {
                        required: "Please select a course",
                      })}
                    >
                      <option value="" disabled>
                        {coursesLoading ? "Loading courses..." : coursesError ? "Unable to load courses" : "Choose a course"}
                      </option>
                      {!coursesLoading && !coursesError && courses?.length > 0 ? (
                        courses.map((course) => (
                          <option key={course._id} value={course.slug || course.title}>
                            {course.title}
                          </option>
                        ))
                      ) : null}
                    </select>
                    {coursesError && (
                      <div className="mt-2">
                        <ApiErrorState
                          variant="inline"
                          title="Unable to load courses"
                          onRetry={refetchCourses}
                        />
                      </div>
                    )}
                    {errors.course && (
                      <p className="text-xs text-rose-500 mt-1.5 font-medium">
                        {errors.course.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                      <Clock size={13} className="text-[#0F6E8C]" />
                      Preferred Shift <span className="text-rose-500">*</span>
                    </label>
                    <select
                      defaultValue=""
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] transition-colors ${
                        errors.shift ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                      }`}
                      {...register("shift", {
                        required: "Please select a shift",
                      })}
                    >
                      <option value="" disabled>
                        Choose a shift
                      </option>
                      <option value="morning">Morning Shift</option>
                      <option value="evening">Evening Shift</option>
                    </select>
                    {errors.shift && (
                      <p className="text-xs text-rose-500 mt-1.5 font-medium">
                        {errors.shift.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                      <GraduationCap size={13} className="text-[#0F6E8C]" />
                      Qualification <span className="text-rose-500">*</span>
                    </label>
                    <select
                      defaultValue=""
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] transition-colors ${
                        errors.qualification ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                      }`}
                      {...register("qualification", {
                        required: "Please select your qualification",
                      })}
                    >
                      <option value="" disabled>
                        Choose your qualification
                      </option>
                      {qualificationOptions.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                    {errors.qualification && (
                      <p className="text-xs text-rose-500 mt-1.5 font-medium">
                        {errors.qualification.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                      <Calendar size={13} className="text-[#0F6E8C]" />
                      Age <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 18"
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] transition-colors ${
                        errors.age ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                      }`}
                      {...register("age", {
                        required: "Age is required",
                        valueAsNumber: true,
                        min: { value: 4, message: "Age must be at least 4" },
                        max: {
                          value: 70,
                          message: "Age must be 70 or below",
                        },
                      })}
                    />
                    {errors.age && (
                      <p className="text-xs text-rose-500 mt-1.5 font-medium">
                        {errors.age.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                      <CreditCard size={13} className="text-[#0F6E8C]" />
                      CNIC / B-Form Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="XXXXX-XXXXXXX-X"
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] transition-colors ${
                        errors.cnic ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                      }`}
                      {...register("cnic", {
                        required: "CNIC / B-Form number is required",
                        pattern: {
                          value: /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/,
                          message: "Enter a valid CNIC (e.g. 12345-1234567-1)",
                        },
                      })}
                    />
                    {errors.cnic && (
                      <p className="text-xs text-rose-500 mt-1.5 font-medium">
                        {errors.cnic.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                      <MapPin size={13} className="text-[#0F6E8C]" />
                      Residential Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="House #, Street, Area, City"
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] transition-colors ${
                        errors.address ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                      }`}
                      {...register("address", {
                        required: "Address is required",
                        minLength: {
                          value: 8,
                          message: "Please provide a complete address",
                        },
                      })}
                    />
                    {errors.address && (
                      <p className="text-xs text-rose-500 mt-1.5 font-medium">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F6E8C] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#0B5C74] active:scale-[0.98] transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed text-xs sm:text-sm cursor-pointer"
                  >
                    {submitMutation.isPending ? "Submitting Application..." : "Submit Application"}
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
                <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 mb-4">
                  Admission Process
                </h3>
                <div className="space-y-4">
                  {admissionSteps.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0F6E8C] text-white flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-2xs">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5">
                          {step.title}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0F6E8C] flex items-center justify-center mb-3 border border-teal-100">
                  <ShieldCheck size={16} />
                </div>
                <h3 className="font-heading text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Your information is protected
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Details submitted here are used strictly for academic enrollment and verification.
                </p>
              </div>

              <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-slate-800 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center mb-3 border border-white/15">
                  <PhoneCall size={16} className="text-[#8FB3AA]" />
                </div>
                <h3 className="font-heading text-xs sm:text-sm font-bold mb-1">
                  Need Help Applying?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3 font-normal">
                  Call or WhatsApp our admissions office during working hours.
                </p>

                <a
                  href="tel:+923001234567"
                  className="text-xs sm:text-sm font-bold text-[#8FB3AA] hover:text-white transition-colors font-mono"
                >
                  +92 300 1234567
                </a>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Apply;