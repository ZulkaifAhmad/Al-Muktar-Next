"use client";

import VerifyEmail from "@/pages_migrated/Verify-email";
import { GuestRoute } from "@/components/ProtectedRoute";

export default function VerifyEmailPage() {
  return (
    <GuestRoute>
      <VerifyEmail />
    </GuestRoute>
  );
}
