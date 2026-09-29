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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "@/lib/navigation-adapter";
import ApiErrorState from "../components/ApiErrorState.jsx";

function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("applications"); // 'applications' | 'edit-profile' | 'security'
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
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

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
    mutationFn: (data) =>
      api.put("/api/auth/update-profile", data),
    onSuccess: (res) => {
      toast.success(res.data.message || "Profile updated successfully!");
      if (res.data.user) {
        login(res.data.user);
      }
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
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
      api.put(
        "/api/auth/change-password",
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      ),
    onSuccess: (res) => {
      toast.success(res.data.message || "Password updated successfully!");
      resetPasswordForm();
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
  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#070d18] text-slate-800 dark:text-slate-100 font-sans pb-16 transition-colors duration-200">
      {/* Top Banner & Header */}
      <section className="relative bg-gradient-to-br from-[#0A2540] via-[#081E2E] to-[#0F6E8C] overflow-hidden text-white pt-8 sm:pt-12 pb-20 sm:pb-24 border-b border-slate-800/40">
        <div className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 bg-[#8FB3AA]/15 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 sm:w-80 h-60 sm:h-80 bg-[#0F6E8C]/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
            
            {/* Left side: Avatar + User Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 sm:gap-6">
              
              {/* Profile Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-[#0F6E8C] to-[#0A2540] text-white flex items-center justify-center font-heading font-black text-2xl sm:text-3xl shadow-lg border border-white/20 ring-2 ring-[#8FB3AA]/50 ring-offset-4 ring-offset-[#0A2540] relative overflow-hidden">
                  <span className="relative z-10 text-white tracking-widest">{initials}</span>
                </div>
                {user?.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-[#0A2540] shadow-md" title="Verified Account">
                    <ShieldCheck size={14} className="text-white" />
                  </div>
                )}
              </div>

              {/* User Meta Information */}
              <div className="text-center sm:text-left w-full sm:w-auto">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
                  <h1 className="font-heading text-xl sm:text-2xl font-black text-white tracking-tight">
                    {user?.username}
                  </h1>

                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-[#8FB3AA] border border-white/15 shadow-2xs font-mono">
                    {user?.role || "Student"}
                  </span>

                  {user?.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono">
                      <CheckCircle2 size={12} className="text-emerald-400" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Email Address */}
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-xl mb-3 max-w-full truncate">
                  <Mail size={13} className="text-[#8FB3AA] shrink-0" />
                  <span className="font-mono text-slate-200 truncate">{user?.email}</span>
                </div>

                {/* Micro Stats Bar */}
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 max-w-sm sm:max-w-none mx-auto sm:mx-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/15 text-center sm:text-left">
                    <GraduationCap size={14} className="text-[#8FB3AA] shrink-0" />
                    <span className="text-[11px] sm:text-xs font-medium text-slate-200">
                      Applied: <strong className="text-white font-bold">{applications.length}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/15 text-center sm:text-left">
                    <Calendar size={14} className="text-[#8FB3AA] shrink-0" />
                    <span className="text-[11px] sm:text-xs font-medium text-slate-200">
                      Status: <strong className="text-emerald-400 font-bold">{user?.isVerified ? "Active" : "Pending"}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Logout Action Button */}
            <div className="shrink-0 self-center sm:self-auto pt-1 sm:pt-0">
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-rose-500/20 text-slate-200 hover:text-white border border-white/15 hover:border-rose-400/40 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-2xs active:scale-95 group cursor-pointer"
              >
                <LogOut size={14} className="text-slate-300 group-hover:text-rose-300 transition-transform group-hover:-translate-x-0.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
        <div className="bg-white dark:bg-[#0c1827] rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-slate-950/50 border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-colors duration-200">
          
          {/* Mobile-Friendly Navigation Tabs */}
          <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#091523] p-1.5 sm:p-2">
            <div className="grid grid-cols-3 gap-1 sm:flex sm:gap-2">
              <button
                onClick={() => setActiveTab("applications")}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "applications"
                    ? "bg-[#0F6E8C] text-white shadow-sm shadow-[#0F6E8C]/20"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/80"
                }`}
              >
                <BookOpen size={15} className="shrink-0" />
                <span className="truncate">Applications</span>
                {applications.length > 0 && (
                  <span
                    className={`hidden sm:inline text-xs px-2 py-0.2 rounded-full font-mono ${
                      activeTab === "applications"
                        ? "bg-white text-[#0F6E8C] font-bold"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {applications.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("edit-profile")}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "edit-profile"
                    ? "bg-[#0F6E8C] text-white shadow-sm shadow-[#0F6E8C]/20"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/80"
                }`}
              >
                <User size={15} className="shrink-0" />
                <span className="truncate">Edit Profile</span>
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "security"
                    ? "bg-[#0F6E8C] text-white shadow-sm shadow-[#0F6E8C]/20"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/80"
                }`}
              >
                <Lock size={15} className="shrink-0" />
                <span className="truncate">Security</span>
              </button>
            </div>
          </div>

          {/* Tab Content Body */}
          <div className="p-4 sm:p-8 lg:p-10">
            {/* ── TAB 1: APPLIED COURSES ────────────────────────────────────── */}
            {activeTab === "applications" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      My Applied Courses
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                      Track the status of your course applications submitted to Al-Mukhtar Institute.
                    </p>
                  </div>

                  <Link
                    to="/apply"
                    className="inline-flex items-center justify-center gap-2 bg-[#0F6E8C] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#0B5C74] active:scale-95 transition-all shadow-sm w-full sm:w-auto"
                  >
                    Apply for New Course
                    <ArrowRight size={15} />
                  </Link>
                </div>

                {applicationsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-36 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : applicationsError ? (
                  <ApiErrorState
                    title="Unable to load your applications"
                    message="We couldn't retrieve your enrolled and applied courses. Check your connection and click refresh."
                    onRetry={refetchApplications}
                  />
                ) : applications.length === 0 ? (
                  <div className="text-center py-12 sm:py-16 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-[#0F6E8C] dark:text-teal-400 flex items-center justify-center mx-auto mb-3 border border-teal-100 dark:border-teal-800/60">
                      <BookOpen size={24} />
                    </div>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                      No Course Applications Found
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5 font-normal">
                      You haven't submitted any course applications yet. Explore our available programs and begin your journey.
                    </p>
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-2 bg-[#0F6E8C] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#0B5C74] transition-all shadow-sm"
                    >
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {applications.map((app) => {
                      const status = app.status || "pending";
                      return (
                        <div
                          key={app._id}
                          className="bg-white dark:bg-[#0a1524] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 hover:shadow-md dark:hover:border-slate-700 transition-all duration-200"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3 sm:pb-4 mb-3 sm:mb-4">
                            <div>
                              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white capitalize">
                                  {app.course?.replace(/-/g, " ") || "Course Application"}
                                </h3>
                                <span className="text-[10px] sm:text-xs font-bold uppercase px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 text-[#0F6E8C] dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 font-mono">
                                  {app.shift} Shift
                                </span>
                              </div>
                              <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-normal">
                                <Calendar size={12} />
                                Applied on{" "}
                                {new Date(app.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>

                            {/* Status Badge */}
                            <div className="self-start sm:self-auto">
                              {status === "pending" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-mono">
                                  <Clock size={13} className="text-amber-500 dark:text-amber-400" />
                                  Pending Review
                                </span>
                              )}
                              {status === "approved" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-mono">
                                  <CheckCircle2 size={13} className="text-emerald-500 dark:text-emerald-400" />
                                  Approved
                                </span>
                              )}
                              {status === "rejected" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-mono">
                                  <XCircle size={13} className="text-rose-500 dark:text-rose-400" />
                                  Rejected
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Detail Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 text-xs bg-slate-50/80 dark:bg-[#070f1a] p-3 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 text-[#0F6E8C] dark:text-teal-400 border border-slate-100 dark:border-slate-700/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                                <User size={12} />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-semibold block">Applicant</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100 truncate block">{app.name}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 text-[#0F6E8C] dark:text-teal-400 border border-slate-100 dark:border-slate-700/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                                <Phone size={12} />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-semibold block">Mobile</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100 truncate block">{app.mobile}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 text-[#0F6E8C] dark:text-teal-400 border border-slate-100 dark:border-slate-700/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                                <MessageCircle size={12} />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-semibold block">WhatsApp</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100 truncate block">{app.whatsapp}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 text-[#0F6E8C] dark:text-teal-400 border border-slate-100 dark:border-slate-700/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                                <CreditCard size={12} />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-semibold block">CNIC</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100 truncate block">{app.cnic}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 text-[#0F6E8C] dark:text-teal-400 border border-slate-100 dark:border-slate-700/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                                <GraduationCap size={12} />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-semibold block">Education</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100 truncate block">{app.qualification}</span>
                              </div>
                            </div>

                            <div className="col-span-2 md:col-span-1 flex items-start gap-2">
                              <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 text-[#0F6E8C] dark:text-teal-400 border border-slate-100 dark:border-slate-700/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                                <MapPin size={12} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-semibold block">Address</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1 block">{app.address}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 2: EDIT PROFILE ───────────────────────────────────────── */}
            {activeTab === "edit-profile" && (
              <div className="max-w-xl mx-auto sm:mx-0">
                <div className="mb-5 sm:mb-6">
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Account Details
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                    Update your display username and registered email address.
                  </p>
                </div>

                <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4 sm:space-y-5">
                  {/* Username */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter username"
                        className={`w-full px-4 py-2.5 pl-11 rounded-xl border text-sm text-slate-900 dark:text-slate-100 outline-none transition-all focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] dark:focus:border-teal-400 ${
                          profileErrors.username
                            ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/30"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        }`}
                        {...registerProfile("username", {
                          required: "Username is required",
                          minLength: {
                            value: 5,
                            message: "Username must be at least 5 characters",
                          },
                          maxLength: {
                            value: 10,
                            message: "Username cannot exceed 10 characters",
                          },
                        })}
                      />
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                      />
                    </div>
                    {profileErrors.username && (
                      <p className="text-xs text-rose-500 dark:text-rose-400 mt-1.5 font-medium">
                        {profileErrors.username.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className={`w-full px-4 py-2.5 pl-11 rounded-xl border text-sm text-slate-900 dark:text-slate-100 outline-none transition-all focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] dark:focus:border-teal-400 ${
                          profileErrors.email
                            ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/30"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        }`}
                        {...registerProfile("email", {
                          required: "Email address is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email address",
                          },
                        })}
                      />
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                      />
                    </div>
                    {profileErrors.email && (
                      <p className="text-xs text-rose-500 dark:text-rose-400 mt-1.5 font-medium">
                        {profileErrors.email.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F6E8C] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0B5C74] active:scale-98 transition-all shadow-sm disabled:opacity-60 cursor-pointer"
                  >
                    <Save size={15} />
                    {updateProfileMutation.isPending
                      ? "Saving Changes..."
                      : "Save Profile"}
                  </button>
                </form>
              </div>
            )}

            {/* ── TAB 3: SECURITY & PASSWORD ────────────────────────────────── */}
            {activeTab === "security" && (
              <div className="max-w-xl mx-auto sm:mx-0">
                <div className="mb-5 sm:mb-6">
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Change Password
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                    Ensure your account stays secure by using a strong password.
                  </p>
                </div>

                <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4 sm:space-y-5">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        className={`w-full px-4 py-2.5 pl-11 pr-11 rounded-xl border text-sm text-slate-900 dark:text-slate-100 outline-none transition-all focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] dark:focus:border-teal-400 ${
                          passwordErrors.currentPassword
                            ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/30"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        }`}
                        {...registerPassword("currentPassword", {
                          required: "Current password is required",
                        })}
                      />
                      <KeyRound
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-xs text-rose-500 dark:text-rose-400 mt-1.5 font-medium">
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className={`w-full px-4 py-2.5 pl-11 pr-11 rounded-xl border text-sm text-slate-900 dark:text-slate-100 outline-none transition-all focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] dark:focus:border-teal-400 ${
                          passwordErrors.newPassword
                            ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/30"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        }`}
                        {...registerPassword("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      <Lock
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-xs text-rose-500 dark:text-rose-400 mt-1.5 font-medium">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        className={`w-full px-4 py-2.5 pl-11 pr-11 rounded-xl border text-sm text-slate-900 dark:text-slate-100 outline-none transition-all focus:ring-2 focus:ring-[#0F6E8C]/20 focus:border-[#0F6E8C] dark:focus:border-teal-400 ${
                          passwordErrors.confirmPassword
                            ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/30"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        }`}
                        {...registerPassword("confirmPassword", {
                          required: "Please confirm your new password",
                          validate: (val) =>
                            val === watch("newPassword") ||
                            "Passwords do not match",
                        })}
                      />
                      <Lock
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-xs text-rose-500 dark:text-rose-400 mt-1.5 font-medium">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F6E8C] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0B5C74] active:scale-98 transition-all shadow-sm disabled:opacity-60 cursor-pointer"
                  >
                    <Save size={15} />
                    {changePasswordMutation.isPending
                      ? "Updating Password..."
                      : "Update Password"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
