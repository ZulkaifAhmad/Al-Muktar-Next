"use client";

import React, { useState } from "react";
import { Outlet } from "@/lib/navigation-adapter";
import AdminSidebar from "../../components/Admin/AdminSidebar.jsx";
import AdminTopbar from "../../components/Admin/AdminTopbar.jsx";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070d18] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Fixed sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main area — offset by sidebar width on desktop */}
      <div className="lg:ml-60 flex flex-col min-h-screen">
        {/* Sticky topbar */}
        <AdminTopbar setSidebarOpen={setSidebarOpen} />

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;