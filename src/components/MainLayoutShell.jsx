"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./NavFoot/Navbar";
import Footer from "./NavFoot/Footer";
import ScrollToTop from "./ScrollToTop";
import NotificationModal from "./NotificationModal";
import { useActiveNotifications } from "@/lib/queries";

export default function MainLayoutShell({ children }) {
  const pathname = usePathname();
  const { data: activeNotifications = [] } = useActiveNotifications();
  const activeNotification = activeNotifications[0] || null;

  const isAdminRoute = pathname?.startsWith("/admin");
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/register" ||
    pathname === "/auth" ||
    pathname === "/verify-email" ||
    pathname === "/forgot-password";

  if (isAdminRoute) {
    return <>{children}</>;
  }

  if (isAuthRoute) {
    return (
      <div className="public-site min-h-screen flex flex-col w-full">
        <ScrollToTop />
        <main className="flex-1 w-full">{children}</main>
      </div>
    );
  }

  return (
    <div className="public-site min-h-screen flex flex-col w-full overflow-x-clip">
      {activeNotifications.length > 0 && (
        <NotificationModal
          notifications={activeNotifications}
          notification={activeNotification}
        />
      )}
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
