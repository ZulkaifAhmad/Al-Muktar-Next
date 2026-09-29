"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  useApplicationStats,
  useUserCount,
  useAdminBlogs,
  useCourses,
  useTeachers,
  useStudents,
  useApplications,
} from "@/lib/queries";
import {
  BookOpen,
  Users,
  Newspaper,
  Plus,
  TrendingUp,
  GraduationCap,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Bell,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ApiErrorState from "../../components/ApiErrorState.jsx";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COURSE_LABELS = {
  "quran-tajweed-course": "Quran Recitation & Tajweed",
  "islamic-studies-fundamentals": "Islamic Studies Fundamentals",
  "arabic-language": "Arabic Language",
  "hifz-program": "Hifz Program",
};

function Dashboard() {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: statsData, isLoading, refetch: refetchApplicationStats } = useApplicationStats();
  const { data: userCountData = 0, refetch: refetchUserCount } = useUserCount();
  const { data: adminBlogs = [], refetch: refetchAdminBlogs } = useAdminBlogs();
  const { data: courses = [], refetch: refetchCourses } = useCourses();
  const { data: teachers = [], refetch: refetchTeachers } = useTeachers();
  const { data: students = [], refetch: refetchStudents } = useStudents();
  const { data: applications = [], refetch: refetchApplications } = useApplications();

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      refetchApplicationStats?.(),
      refetchUserCount?.(),
      refetchAdminBlogs?.(),
      refetchCourses?.(),
      refetchApplications?.(),
      refetchTeachers?.(),
      refetchStudents?.(),
    ]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const blogCount = adminBlogs.length;
  const courseCount = courses.length;

  const stats = [
    {
      label: "Applications Received",
      value: isLoading ? "—" : statsData?.stats?.total ?? 0,
      meta: `${statsData?.stats?.pending ?? 0} pending review`,
      icon: GraduationCap,
      to: "/admin/applies",
      color: "text-[#0F6E8C] dark:text-teal-300",
      bg: "bg-[#0F6E8C]/10 dark:bg-[#0F6E8C]/20",
    },
    {
      label: "Approved Students",
      value: isLoading ? "—" : statsData?.stats?.approved ?? 0,
      meta: `${statsData?.stats?.rejected ?? 0} declined`,
      icon: BookOpen,
      to: "/admin/applies",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      label: "Registered Users",
      value: userCountData ?? "—",
      meta: "Active student accounts",
      icon: Users,
      to: "/admin/users",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/50",
    },
    {
      label: "Published Articles",
      value: blogCount ?? "—",
      meta: `${courseCount ?? 0} active courses`,
      icon: Newspaper,
      to: "/admin/blog-post",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/50",
    },
  ];

  const trendData = statsData?.trend?.length
    ? statsData.trend
    : [{ day: "—", applications: 0 }];

  const recentApps = statsData?.recent ?? [];

  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-10 bg-slate-200/80 dark:bg-slate-800/80 rounded-lg w-1/3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 bg-white dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 rounded-xl h-64" />
          <div className="lg:col-span-4 bg-white dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 rounded-xl h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Welcome back, <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.username || "Admin"}</span>. Monitor academy applications, courses, and institutional metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0c1827] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            title="Refresh All Metrics"
          >
            <RefreshCw size={12} className={`text-[#0F6E8C] dark:text-teal-400 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-mono bg-white dark:bg-[#0c1827] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Al-Mukhtar Console</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stats.map((stat, i) => (
          <Link
            key={i}
            to={stat.to}
            className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800/90 rounded-xl p-3.5 hover:border-slate-300 dark:hover:border-teal-500/50 hover:shadow-xs transition-all group relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                  {stat.value}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">{stat.meta}</p>
              </div>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                <stat.icon size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Chips */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 rounded-xl p-2.5">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono px-2">
          Quick Actions:
        </span>
        <Link
          to="/admin/course-post"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#0F6E8C]/10 dark:hover:bg-[#0F6E8C]/25 text-slate-700 dark:text-slate-300 hover:text-[#0F6E8C] dark:hover:text-teal-300 text-xs font-medium transition-colors"
        >
          <Plus size={13} />
          <span>New Course</span>
        </Link>
        <Link
          to="/admin/blog-post"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#0F6E8C]/10 dark:hover:bg-[#0F6E8C]/25 text-slate-700 dark:text-slate-300 hover:text-[#0F6E8C] dark:hover:text-teal-300 text-xs font-medium transition-colors"
        >
          <Plus size={13} />
          <span>New Article</span>
        </Link>
        <Link
          to="/admin/applies"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#0F6E8C]/10 dark:hover:bg-[#0F6E8C]/25 text-slate-700 dark:text-slate-300 hover:text-[#0F6E8C] dark:hover:text-teal-300 text-xs font-medium transition-colors"
        >
          <GraduationCap size={13} />
          <span>Applications</span>
        </Link>
        <Link
          to="/admin/notifications"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#0F6E8C]/10 dark:hover:bg-[#0F6E8C]/25 text-slate-700 dark:text-slate-300 hover:text-[#0F6E8C] dark:hover:text-teal-300 text-xs font-medium transition-colors"
        >
          <Bell size={13} />
          <span>Website Popups</span>
        </Link>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#0F6E8C]/10 dark:hover:bg-[#0F6E8C]/25 text-slate-700 dark:text-slate-300 hover:text-[#0F6E8C] dark:hover:text-teal-300 text-xs font-medium transition-colors"
        >
          <Users size={13} />
          <span>User Directory</span>
        </Link>
      </div>

      {/* Main Grid: Trend Chart & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Trend Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#0F6E8C] dark:text-teal-400" />
              <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                Weekly Applications Activity (Last 7 Days)
              </h2>
            </div>
            <span className="text-[10px] text-[#0F6E8C] dark:text-teal-300 font-mono bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 px-2 py-0.5 rounded-full font-semibold">
              Weekly Overview
            </span>
          </div>

          <div className="h-52 -ml-3 sm:ml-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b822" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #334155",
                    backgroundColor: "#0c1827",
                    color: "#f8fafc",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                    fontSize: 11,
                  }}
                  itemStyle={{ color: "#38bdf8" }}
                  labelStyle={{ color: "#f1f5f9", fontWeight: "bold" }}
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#0F6E8C"
                  strokeWidth={2.5}
                  dot={{ fill: "#0F6E8C", r: 3 }}
                  activeDot={{ r: 6, fill: "#38bdf8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Applications (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                Recent Applications
              </h2>
              <Link
                to="/admin/applies"
                className="text-[11px] text-[#0F6E8C] dark:text-teal-400 font-semibold hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentApps.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">No recent submissions.</p>
              ) : (
                recentApps.slice(0, 5).map((app, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-100/70 dark:border-slate-800/60 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{app.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {COURSE_LABELS[app.course] || app.course}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono shrink-0">
                      {new Date(app.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Pending: <strong className="text-amber-600 dark:text-amber-400">{statsData?.stats?.pending ?? 0}</strong></span>
            <span>Approved: <strong className="text-emerald-600 dark:text-emerald-400">{statsData?.stats?.approved ?? 0}</strong></span>
          </div>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800/90 rounded-xl p-4 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono mb-2">
            Academy Catalogue
          </p>
          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-300">Active Courses</span>
            <span className="font-semibold text-slate-900 dark:text-white">{courseCount ?? 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-300">Published Articles</span>
            <span className="font-semibold text-slate-900 dark:text-white">{blogCount ?? 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-300">Faculty Members</span>
            <span className="font-semibold text-slate-900 dark:text-white">{teachers.length ?? 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-300">Alumni Showcases</span>
            <span className="font-semibold text-slate-900 dark:text-white">{students.length ?? 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-600 dark:text-slate-300">Registered Accounts</span>
            <span className="font-semibold text-slate-900 dark:text-white">{userCountData ?? 0}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800/90 rounded-xl p-4 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono mb-2">
            Admissions Status
          </p>
          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-300">Total Applicants</span>
            <span className="font-semibold text-slate-900 dark:text-white">{statsData?.stats?.total ?? 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-300">Approved</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{statsData?.stats?.approved ?? 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-600 dark:text-slate-300">Rejected</span>
            <span className="font-semibold text-rose-500 dark:text-rose-400">{statsData?.stats?.rejected ?? 0}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono mb-1.5">
              System Health
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Database Connected</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              API, authentication, and database services are running smoothly.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/admin/applies"
              className="text-xs font-semibold text-[#0F6E8C] dark:text-teal-400 inline-flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              <span>Manage Candidates</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;