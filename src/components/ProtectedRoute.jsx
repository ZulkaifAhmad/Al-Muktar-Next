"use client";

import React from "react";
import { Navigate, useLocation } from "@/lib/navigation-adapter";
import { useAuth } from "./AuthContext.jsx";

/** Shows a centered spinner while auth is being loaded */
function AuthLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-teal-200 border-t-[#0F6E8C] rounded-full animate-spin" />
    </div>
  );
}

/**
 * GuestRoute — only accessible when NOT logged in.
 * Logged-in users are redirected to "/" (home).
 */
export function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoader />;
  if (user) return <Navigate to="/" replace />;
  return children;
}

/**
 * PrivateRoute — only accessible when logged in.
 * Unauthenticated users are redirected to "/login".
 */
export function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <AuthLoader />;
  if (!user) {
    const fullRedirect = location.pathname + (location.search || "");
    return <Navigate to={`/login?redirect=${encodeURIComponent(fullRedirect)}`} replace />;
  }
  return children;
}

/**
 * AdminRoute — only accessible when logged in AND role === "admin".
 * Non-admins are redirected to "/".
 */
export function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin" && user.role !== "superadmin") return <Navigate to="/" replace />;
  return children;
}
