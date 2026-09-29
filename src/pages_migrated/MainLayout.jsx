"use client";

import React from 'react'
import { Outlet } from "@/lib/navigation-adapter"
import Footer from '../components/NavFoot/Footer.jsx'
import Navbar from '../components/NavFoot/Navbar.jsx'
import ScrollToTop from '../components/ScrollToTop.jsx'
import NotificationModal from '../components/NotificationModal.jsx'
import { useActiveNotifications } from "@/lib/queries"

function MainLayout() {
  const { data: activeNotifications = [] } = useActiveNotifications();
  const activeNotification = activeNotifications[0] || null;

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-clip">
      {/* Website blur modal popup when notifications are active */}
      {activeNotifications.length > 0 && (
        <NotificationModal
          notifications={activeNotifications}
          notification={activeNotification}
        />
      )}
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout