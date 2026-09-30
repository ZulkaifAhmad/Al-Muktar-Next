"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./NavFoot/Navbar";
import Footer from "./NavFoot/Footer";
import ScrollToTop from "./ScrollToTop";
import NotificationModal from "./NotificationModal";
import SplashScreen from "./SplashScreen";
import { useActiveNotifications } from "@/lib/queries";

export default function MainLayoutShell({ children }) {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const { data: activeNotifications = [] } = useActiveNotifications();
  const activeNotification = activeNotifications[0] || null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const alreadyShown = sessionStorage.getItem("almukhtar_splash_shown");
      if (alreadyShown) {
        setIsReady(true);
      }
    }
  }, []);

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
        <SplashScreen onComplete={() => setIsReady(true)} />
        {isReady && (
          <>
            <ScrollToTop />
            <main className="flex-1 w-full">{children}</main>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="public-site min-h-screen flex flex-col w-full overflow-x-clip bg-white dark:bg-[#080f19]">
      <SplashScreen onComplete={() => setIsReady(true)} />
      {isReady && (
        <>
          {activeNotifications.length > 0 && (
            <NotificationModal
              notifications={activeNotifications}
              notification={activeNotification}
            />
          )}
          <ScrollToTop />
          <Navbar />
          <main className="flex-1 w-full animate-in fade-in duration-300">
            {children}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

