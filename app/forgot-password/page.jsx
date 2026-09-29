"use client";

import ForgotPassword from "@/pages_migrated/ForgotPassword";
import { GuestRoute } from "@/components/ProtectedRoute";

export default function ForgotPasswordPage() {
  return (
    <GuestRoute>
      <ForgotPassword />
    </GuestRoute>
  );
}
