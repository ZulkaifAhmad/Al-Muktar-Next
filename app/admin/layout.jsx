"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import AdminTopbar from "@/components/Admin/AdminTopbar";
import { AdminRoute } from "@/components/ProtectedRoute";

export default function AdminLayoutWrapper({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50/70 dark:bg-[#070d18] text-slate-800 dark:text-slate-100 transition-colors duration-200">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="lg:ml-60 flex flex-col min-h-screen">
          <AdminTopbar setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminRoute>
  );
}
