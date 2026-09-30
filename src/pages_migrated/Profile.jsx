"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import api from "@/lib/api";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Calendar,
  Phone,
  MessageCircle,
  MapPin,
  CreditCard,
  GraduationCap,
  Save,
  KeyRound,
  ArrowRight,
  LogOut,
  Camera,
  Edit2,
  ChevronRight,
  Info,
  Sparkles,
  X,
  FileText,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "@/lib/navigation-adapter";
import ApiErrorState from "../components/ApiErrorState.jsx";

function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 1. Fetch user's applied courses
  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isError: applicationsError,
    refetch: refetchApplications,
  } = useQuery({
    queryKey: ["myApplications"],
    queryFn: async () => {
      const res = await api.get("/api/applications/my-applications");
      return res.data.applications || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  // 2. React Hook Form for Profile Updates (Username / Email)
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfileForm,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  // Reset default values when user loads or modal opens
  React.useEffect(() => {
    if (user) {
      resetProfileForm({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user, resetProfileForm]);

  // 3. React Hook Form for Password Change
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    watch,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Mutation for updating profile info
  const updateProfileMutation = useMutation({
    mutationFn: (data) => api.put("/api/auth/update-profile", data),
    onSuccess: (res) => {
      toast.success(res.data.message || "Profile updated successfully!");
      if (res.data.user) {
        login(res.data.user);
      }
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setEditProfileModalOpen(false);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to update profile. Try again."
      );
    },
  });

  // Mutation for updating password
  const changePasswordMutation = useMutation({
    mutationFn: (data) =>
      api.put("/api/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: (res) => {
      toast.success(res.data.message || "Password updated successfully!");
      resetPasswordForm();
      setPasswordModalOpen(false);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to change password. Try again."
      );
    },
  });

  const onUpdateProfile = (data) => {
    updateProfileMutation.mutate(data);
  };

  const onChangePassword = (data) => {
    changePasswordMutation.mutate(data);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const applications = applicationsData || [];
  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : "AM";

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#070d18] text-slate-800 dark:text-slate-100 font-sans pb-16 transition-colors duration-200">
      
      {/* ── TOP HEADER / BANNER (Fully Responsive for Mobile & Laptop) ── */}
      <section className="bg-white dark:bg-[#0c1827] border-b border-slate-200/80 dark:border-slate-800 pt-5 sm:pt-6 pb-4 sm:pb-5 px-3.5 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-2xl bg-gradient-to-tr from-[#0F6E8C] to-[#0A2540] text-white flex items-center justify-center font-heading font-black text-xl sm:text-2xl lg:text-3xl shadow-md border-2 border-white dark:border-slate-800 ring-2 ring-[#0F6E8C]/30 shrink-0 select-none">
              <span>{initials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-white font-heading truncate">
                  {user?.username || "Student"}
                </h1>
                {user?.isVerified && (
                  <CheckCircle2 size={16} className="text-[#0F6E8C] dark:text-teal-400 shrink-0" />
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                {user?.email}
              </p>
              <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-[#0F6E8C]/10 text-[#0F6E8C] dark:text-teal-300 text-[9.5px] sm:text-[10px] font-bold font-mono uppercase tracking-wider">
                  {user?.role || "Student"}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[9.5px] sm:text-[10px] font-bold font-mono">
                  {user?.isVerified ? "Verified Account" : "Pending Verification"}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <Link
              to="/apply"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-[#0F6E8C] hover:bg-[#0B5C74] active:scale-[0.98] text-white text-xs font-bold transition-all cursor-pointer shadow-xs text-center"
            >
              <BookOpen size={14} />
              <span>Apply for Course</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TWO-COLUMN LAYOUT ON LAPTOP / DESKTOP (CLEAN STREAMLINED ON MOBILE) ── */}
      <main className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-start">
          
          {/* ── LEFT COLUMN: PROFILE DETAILS & SECURITY ── */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            
            {/* GROUP 1: PERSONAL DETAILS (Single Edit Option + Name & Email) */}
            <div className="bg-white dark:bg-[#0c1827] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
              
              {/* Single Dedicated Edit Profile Action */}
              <div
                onClick={() => setEditProfileModalOpen(true)}
                className="flex items-center gap-3 p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 active:bg-slate-100/80 dark:active:bg-slate-800/70 transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-[#0F6E8C] dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Edit2 size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                    Edit Profile Details
                  </p>
                  <p className="text-[10.5px] sm:text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    Update your username and email address
                  </p>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </div>

              {/* Name Display Row */}
              <div className="flex items-center gap-3 p-3.5 sm:p-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <User size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase font-mono tracking-wider block">
                    Name
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {user?.username}
                  </p>
                  <p className="text-[10.5px] sm:text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    Visible to academy instructors and students.
                  </p>
                </div>
              </div>

              {/* Email Display Row */}
              <div className="flex items-center gap-3 p-3.5 sm:p-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Mail size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase font-mono tracking-wider block">
                    Email Address
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate font-mono">
                    {user?.email}
                  </p>
                  <p className="text-[10.5px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 truncate">
                    Verified Account Email
                  </p>
                </div>
              </div>

            </div>

            {/* GROUP 2: SECURITY & ACCOUNT ACTIONS */}
            <div className="bg-white dark:bg-[#0c1827] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
              
              {/* Change Password */}
              <div
                onClick={() => setPasswordModalOpen(true)}
                className="flex items-center gap-3 p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 active:bg-slate-100/80 dark:active:bg-slate-800/70 transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <KeyRound size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                    Change Password
                  </p>
                  <p className="text-[10.5px] sm:text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    Update your login password and credentials
                  </p>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </div>

              {/* Log Out Option */}
              <div
                onClick={handleLogout}
                className="flex items-center gap-3 p-3.5 sm:p-4 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 active:bg-rose-100/60 dark:active:bg-rose-950/50 transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <LogOut size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 truncate">
                    Sign Out
                  </p>
                  <p className="text-[10.5px] sm:text-[11px] text-slate-400 truncate">
                    Safely log out of your session on this device.
                  </p>
                </div>
                <ChevronRight size={16} className="text-rose-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </div>

            </div>

          </div>

          {/* ── RIGHT COLUMN: COURSE APPLICATIONS & ENROLLMENTS ── */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            
            <div className="bg-white dark:bg-[#0c1827] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
              <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white font-heading truncate">
                      My Course Applications
                    </h2>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
                      {applications.length} submitted {applications.length === 1 ? "application" : "applications"}
                    </p>
                  </div>
                </div>

                <Link
                  to="/apply"
                  className="text-[11.5px] sm:text-xs font-bold text-[#0F6E8C] dark:text-teal-400 hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  <span>New Apply</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              {applicationsLoading ? (
                <div className="p-4 sm:p-5 space-y-3 animate-pulse">
                  <div className="h-14 sm:h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                  <div className="h-14 sm:h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                </div>
              ) : applicationsError ? (
                <div className="p-4 sm:p-5">
                  <ApiErrorState
                    title="Unable to load applications"
                    message="Please refresh to try again."
                    onRetry={refetchApplications}
                  />
                </div>
              ) : applications.length === 0 ? (
                <div className="p-6 sm:p-8 text-center space-y-3">
                  <GraduationCap size={36} className="text-slate-300 dark:text-slate-600 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      No course applications yet
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      Explore our academic curriculum and apply for Islamic scholarship and classical language programs.
                    </p>
                  </div>
                  <div className="pt-1">
                    <Link
                      to="/apply"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <span>Apply for a Course</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {applications.map((app) => {
                    const status = app.status || "pending";
                    return (
                      <div
                        key={app._id}
                        onClick={() => setSelectedApplication(app)}
                        className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 active:bg-slate-100/70 dark:active:bg-slate-800/60 transition-colors cursor-pointer group"
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white capitalize truncate">
                              {app.course?.replace(/-/g, " ") || "Course Application"}
                            </h3>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                              {app.shift}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 text-[11px] text-slate-400 font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              {new Date(app.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <span>•</span>
                            <span>CNIC: {app.cnic || "Provided"}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60">
                          {status === "approved" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-mono">
                              Approved
                            </span>
                          )}
                          {status === "rejected" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-mono">
                              Rejected
                            </span>
                          )}
                          {status === "pending" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-mono">
                              Pending
                            </span>
                          )}
                          <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Admissions Helpdesk Notice */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/50 flex items-start gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-100/80 dark:bg-teal-900/60 text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                <Info size={16} />
              </div>
              <div className="text-[11.5px] sm:text-xs space-y-0.5 sm:space-y-1">
                <p className="font-bold text-slate-900 dark:text-white font-heading">
                  Admissions Verification Notice
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Application review and verification takes 1-2 business days. For urgent status verification, please contact administration.
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* ── MODAL 1: WHATSAPP-STYLE EDIT PROFILE (Name & Email) ── */}
      {editProfileModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setEditProfileModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Edit Profile Details
              </h2>
              <button
                type="button"
                onClick={() => setEditProfileModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm text-slate-900 dark:text-slate-100 outline-none transition-all focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] dark:focus:border-teal-400 ${
                    profileErrors.username
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90"
                  }`}
                  {...registerProfile("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    maxLength: {
                      value: 25,
                      message: "Username cannot exceed 25 characters",
                    },
                  })}
                />
                {profileErrors.username && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">
                    {profileErrors.username.message}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  This is not your username or pin. This name will be visible to your instructors.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm text-slate-900 dark:text-slate-100 outline-none transition-all focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] dark:focus:border-teal-400 ${
                    profileErrors.email
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90"
                  }`}
                  {...registerProfile("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                {profileErrors.email && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">
                    {profileErrors.email.message}
                  </p>
                )}
              </div>

              {/* 2 Buttons in a Single Row */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditProfileModalOpen(false)}
                  className="w-full py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0F6E8C] text-white text-xs font-bold hover:bg-[#0B5C74] transition-all disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  <Save size={13} />
                  <span>{updateProfileMutation.isPending ? "Saving..." : "Save"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: CHANGE PASSWORD ── */}
      {passwordModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPasswordModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Change Password
              </h2>
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-3.5">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C]"
                    {...registerPassword("currentPassword", {
                      required: "Current password is required",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-xs text-rose-500 mt-1">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full px-3.5 py-2 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C]"
                    {...registerPassword("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-xs text-rose-500 mt-1">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="w-full px-3.5 py-2 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C]"
                    {...registerPassword("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (val) =>
                        val === watch("newPassword") || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-rose-500 mt-1">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>

              {/* 2 Buttons in a Single Row */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="w-full py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0F6E8C] text-white text-xs font-bold hover:bg-[#0B5C74] transition-all disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  <KeyRound size={13} />
                  <span>{changePasswordMutation.isPending ? "Updating..." : "Update"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: APPLICATION DETAILS POPUP (Wider on Laptop, Fixed Sticky Header on Mobile) ── */}
      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Sticky Header for Mobile & Laptop */}
            <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#0c1827]/95 backdrop-blur-md px-5 sm:px-7 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0 pr-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-[#0F6E8C] dark:text-teal-300 flex items-center justify-center shrink-0">
                  <GraduationCap size={17} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Course Application
                  </span>
                  <h2 className="font-heading text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-white capitalize truncate">
                    {selectedApplication.course?.replace(/-/g, " ") || "Application Details"}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                aria-label="Close popup"
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body with Clean 2-Column Responsive Layout */}
            <div className="p-5 sm:p-7 overflow-y-auto custom-scrollbar flex-1 space-y-4 sm:space-y-5">
              
              {/* Status & Timestamp Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Application Status:</span>
                  {selectedApplication.status === "approved" ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono">Approved</span>
                  ) : selectedApplication.status === "rejected" ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono">Rejected</span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono">Pending Review</span>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Applied: {new Date(selectedApplication.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>

              {/* Specifications in 2 Columns on Laptop Screen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 divide-y md:divide-y-0 divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                <div className="pt-2 md:pt-0 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Applicant Name</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">{selectedApplication.name}</span>
                </div>

                <div className="pt-2 md:pt-0 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Academic Shift</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right uppercase font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{selectedApplication.shift}</span>
                </div>

                <div className="pt-2 md:pt-0 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Mobile Phone</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right font-mono">{selectedApplication.mobile}</span>
                </div>

                <div className="pt-2 md:pt-0 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">WhatsApp Number</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right font-mono">{selectedApplication.whatsapp || selectedApplication.mobile}</span>
                </div>

                <div className="pt-2 md:pt-0 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">CNIC / ID Card</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right font-mono">{selectedApplication.cnic}</span>
                </div>

                <div className="pt-2 md:pt-0 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Prior Qualification</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">{selectedApplication.qualification}</span>
                </div>

                <div className="pt-2 md:pt-0 flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-2 md:col-span-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Residential Address</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right max-w-lg">{selectedApplication.address}</span>
                </div>
              </div>

            </div>

            {/* Fixed Sticky Footer with 2 Paired Buttons */}
            <div className="sticky bottom-0 z-20 bg-white/95 dark:bg-[#0c1827]/95 backdrop-blur-md px-5 sm:px-7 py-3.5 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedApplication(null)}
                  className="w-full py-2.5 px-3 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer text-center"
                >
                  Close
                </button>
                <Link
                  to="/courses"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-xs font-bold transition-all text-center shadow-xs"
                >
                  <span>Explore Courses</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;
