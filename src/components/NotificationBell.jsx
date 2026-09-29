"use client";

import React from "react";
import { Link, useLocation } from "@/lib/navigation-adapter";
import { Bell } from "lucide-react";
import { useAllNotifications } from "@/lib/queries";

function NotificationBell() {
  const location = useLocation();
  const isNotificationsPage = location.pathname === "/notifications";
  const { data: allNotifications = [] } = useAllNotifications();

  const activeCount = allNotifications.filter((n) => n.isActive).length;

  return (
    <Link
      to="/notifications"
      className={`relative p-2 rounded-full transition-colors duration-200 cursor-pointer flex items-center justify-center shrink-0 border-0 outline-none ${
        isNotificationsPage
          ? "bg-teal-50 dark:bg-slate-800 text-[#0F6E8C] dark:text-[#38BDF8]"
          : "text-slate-600 dark:text-slate-300 hover:text-[#0F6E8C] dark:hover:text-[#38BDF8] hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
      aria-label="View notifications and announcements"
      title="View announcements & notices"
    >
      <Bell size={20} />

      {/* Clean solid indicator dot without blinking animation */}
      {activeCount > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0F6E8C] dark:bg-[#38BDF8]" />
      )}
    </Link>
  );
}

export default NotificationBell;
