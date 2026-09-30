"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "@/lib/navigation-adapter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminUsers } from "@/lib/queries";
import { useAuth } from "@/context/AuthContext";
import api from "../../lib/api.js";
import { toast } from "react-toastify";
import ApiErrorState from "../../components/ApiErrorState.jsx";
import {
  Search,
  Trash2,
  Users,
  Mail,
  Shield,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  UserPlus,
  Key,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Crown,
  Lock,
} from "lucide-react";

const PAGE_SIZE = 15;

function AdminUsers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState(null);

  const { user: currentUser } = useAuth();
  const isSuperAdmin =
    currentUser?.role === "superadmin" ||
    currentUser?.email === "admin@almukhtar.com" ||
    currentUser?.email === "admin@almukhtar.org";

  // Add Admin Modal State
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const queryClient = useQueryClient();
  const {
    data: users = [],
    isLoading,
    isError,
    refetch: refetchAdminUsers,
  } = useAdminUsers();

  // Auto-open modal if navigated with ?action=add-admin
  useEffect(() => {
    if (searchParams.get("action") === "add-admin") {
      setShowAddAdminModal(true);
      searchParams.delete("action");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAdminPassword(pwd);
  };

  const copyPasswordToClipboard = () => {
    if (!adminPassword) return;
    navigator.clipboard.writeText(adminPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2500);
  };

  const createAdminMutation = useMutation({
    mutationFn: (data) => api.post("/api/admin/create-admin", data),
    onSuccess: (res) => {
      toast.success(res.data?.message || "Admin created successfully!");
      setShowAddAdminModal(false);
      setAdminUsername("");
      setAdminEmail("");
      setAdminPassword("");
      setFormError("");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["user-count"] });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Failed to create admin.";
      setFormError(msg);
      toast.error(msg);
    },
  });

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    setFormError("");
    if (!adminUsername.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      setFormError("All fields are required.");
      return;
    }
    if (adminUsername.trim().length < 3) {
      setFormError("Username must be at least 3 characters.");
      return;
    }
    if (adminPassword.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    createAdminMutation.mutate({
      username: adminUsername.trim(),
      email: adminEmail.trim().toLowerCase(),
      password: adminPassword,
    });
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/admin/users/${id}`),
    onSuccess: (res) => {
      toast.success(res.data?.message || "User deleted successfully");
      setUserToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["user-count"] });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to delete user. Only Super Admin has this permission."
      );
    },
  });

  const handleDeleteClick = (targetUser) => {
    if (!isSuperAdmin) {
      toast.warning("Access Restricted: Only Super Administrators have permission to delete users or administrators.");
      return;
    }
    if (targetUser._id === currentUser?.id || targetUser._id === currentUser?._id) {
      toast.info("You cannot delete your own active administrator account.");
      return;
    }
    setUserToDelete(targetUser);
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "superadmin" && u.role === "superadmin") ||
        (roleFilter === "admin" && u.role === "admin") ||
        (roleFilter === "user" && u.role === "user");
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    setPage(1);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            User Accounts &amp; Administrators
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Directory of registered students and administrators with role-based authority.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Super Admin / Admin Status Badge */}
          {isSuperAdmin ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-xs font-bold font-mono shadow-2xs">
              <Crown size={13} className="text-purple-600 dark:text-purple-400" />
              <span>Super Administrator</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium font-mono">
              <Shield size={13} className="text-slate-500 dark:text-slate-400" />
              <span>Standard Admin</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setFormError("");
              setShowAddAdminModal(true);
            }}
            className="inline-flex items-center gap-1.5 bg-[#0F6E8C] hover:bg-[#0B5C74] active:bg-[#084557] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <UserPlus size={14} />
            <span>Add New Admin</span>
          </button>
          
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <Users size={14} />
            <span>{users.length} Total</span>
          </div>
        </div>
      </div>

      {/* Security Privilege Notice */}
      {!isSuperAdmin && (
        <div className="flex items-center gap-2.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 px-3.5 py-2.5 rounded-xl text-xs">
          <Lock size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Role Notice:</strong> Standard administrators can view records and add new admins. Only the <strong>Super Administrator</strong> has permissions to delete user and admin accounts.
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex items-center gap-2 bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 sm:py-2 min-h-[46px] sm:min-h-[38px] flex-1 shadow-2xs focus-within:border-[#0F6E8C] dark:focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-[#0F6E8C]/15 transition-all">
          <Search size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={handleSearchChange}
            className="text-xs sm:text-sm outline-none w-full placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100 bg-transparent"
          />
        </div>
        <select
          value={roleFilter}
          onChange={handleRoleChange}
          className="border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 sm:py-2 min-h-[46px] sm:min-h-[38px] text-xs sm:text-sm bg-white dark:bg-slate-800 focus:outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 text-slate-700 dark:text-slate-200 shadow-2xs sm:w-48 cursor-pointer transition-all"
        >
          <option value="all">All Roles</option>
          <option value="superadmin">Super Administrators</option>
          <option value="admin">Administrators</option>
          <option value="user">Students / Users</option>
        </select>
      </div>

      {/* Table & Mobile Card List */}
      <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#0F6E8C] dark:text-teal-400">
              <Loader2 className="animate-spin" size={14} />
              <span>Loading user directory...</span>
            </div>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl gap-4 animate-pulse">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-28" />
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-44" />
                  </div>
                </div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-14" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6">
            <ApiErrorState
              title="Unable to load user accounts"
              message="Failed to retrieve registered users from the server."
              onRetry={refetchAdminUsers}
            />
          </div>
        ) : (
          <>
            {/* Mobile Card View (<768px) */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/70">
              {paginated.map((user) => {
                const isUserRowSuper = user.role === "superadmin";
                const isSelf = user._id === currentUser?.id || user._id === currentUser?._id;

                return (
                  <div key={user._id} className="p-3.5 space-y-2 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                            isUserRowSuper
                              ? "bg-purple-600"
                              : user.role === "admin"
                              ? "bg-[#0F6E8C]"
                              : "bg-slate-600"
                          }`}
                        >
                          {user.username?.slice(0, 2).toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.username}</h4>
                            {isSelf && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                            <Mail size={11} className="text-slate-400 dark:text-slate-500 shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </p>
                        </div>
                      </div>

                      {/* Mobile Delete Button */}
                      {!isSelf && (
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                            isSuperAdmin
                              ? "text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                              : "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                          }`}
                          title={isSuperAdmin ? "Delete account" : "Only Super Admin can delete"}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        {isUserRowSuper ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                            <Crown size={9} />
                            Super Admin
                          </span>
                        ) : user.role === "admin" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                            <Shield size={9} />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            User
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            user.isVerified
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                              : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                          }`}
                        >
                          {user.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </div>

                      <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-mono">
                        <Calendar size={11} />
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
              {paginated.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
                  No users found.
                </div>
              )}
            </div>

            {/* Desktop Table (>=768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-[#0a1420] border-b border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                    <th className="py-2.5 px-3.5">User</th>
                    <th className="py-2.5 px-3">Email Address</th>
                    <th className="py-2.5 px-3">Role &amp; Authority</th>
                    <th className="py-2.5 px-3">Verification</th>
                    <th className="py-2.5 px-3">Registered</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  {paginated.map((user) => {
                    const isUserRowSuper = user.role === "superadmin";
                    const isSelf = user._id === currentUser?.id || user._id === currentUser?._id;

                    return (
                      <tr
                        key={user._id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-lg text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow-2xs ${
                                isUserRowSuper
                                  ? "bg-purple-600"
                                  : user.role === "admin"
                                  ? "bg-[#0F6E8C]"
                                  : "bg-slate-600"
                              }`}
                            >
                              {user.username?.slice(0, 2).toUpperCase() || "U"}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-900 dark:text-white text-xs">{user.username}</span>
                              {isSelf && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Mail size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
                            <span className="truncate max-w-xs">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {isUserRowSuper ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                              <Crown size={10} className="text-purple-600 dark:text-purple-400" />
                              Super Admin
                            </span>
                          ) : user.role === "admin" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                              <Shield size={10} className="text-blue-600 dark:text-blue-400" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              User
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              user.isVerified
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
                                : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60"
                            }`}
                          >
                            {user.isVerified ? "Verified" : "Unverified"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          {isSelf ? (
                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                              Current
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(user)}
                              className={`p-1 rounded-md transition-colors ${
                                isSuperAdmin
                                  ? "text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                  : "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                              }`}
                              title={
                                isSuperAdmin
                                  ? `Delete ${user.username}`
                                  : "Only Super Admin can delete user/admin accounts"
                              }
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#0F6E8C] dark:hover:border-teal-400 hover:text-[#0F6E8C] dark:hover:text-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-mono px-2">
              {safePage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#0F6E8C] dark:hover:border-teal-400 hover:text-[#0F6E8C] dark:hover:text-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Add New Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0c1827] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-200 font-sans">
            <button
              type="button"
              onClick={() => setShowAddAdminModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-[#0F6E8C] dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/60 flex items-center justify-center shrink-0">
                <UserPlus size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                  Add New Administrator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Provision an administrative account with management access.
                </p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Admin Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. admin_usman"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-4 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/90 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Official Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. usman@almukhtar.org"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/90 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 transition-all"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                    Initial Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] text-[#0F6E8C] dark:text-teal-400 hover:text-[#0B5C74] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles size={12} />
                    <span>Generate Strong</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-4 pr-20 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/90 font-mono placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 transition-all"
                    required
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {adminPassword && (
                      <button
                        type="button"
                        onClick={copyPasswordToClipboard}
                        className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded transition-colors"
                        title="Copy password"
                      >
                        {copiedPassword ? (
                          <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                {copiedPassword && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    Password copied to clipboard! Save it securely before creating.
                  </p>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  disabled={createAdminMutation.isPending}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAdminMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0F6E8C] hover:bg-[#0B5C74] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                >
                  {createAdminMutation.isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Creating Admin...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      <span>Create Administrator</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal Dialog for Account Deletion (Super Admin Only) */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0c1827] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setUserToDelete(null)}
              disabled={deleteMutation.isPending}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 border border-rose-100 dark:border-rose-900/60">
              <Trash2 size={22} />
            </div>

            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                <Crown size={12} />
                <span>Super Admin Deletion Authority</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                Confirm Account Deletion
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold text-slate-900 dark:text-white">"{userToDelete.username}"</span> (
              {userToDelete.email}) with role <strong className="capitalize text-slate-900 dark:text-white">{userToDelete.role}</strong>?
            </p>

            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl p-3 flex items-start gap-2.5 mb-5">
              <AlertTriangle size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-rose-800 dark:text-rose-300 leading-relaxed font-medium">
                Warning: This action is permanent. All profiles and credentials associated with this user will be removed from the system.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(userToDelete._id)}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={13} />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
