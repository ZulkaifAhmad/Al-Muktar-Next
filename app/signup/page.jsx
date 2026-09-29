"use client";

import Signup from "@/pages_migrated/Sign-up";
import { GuestRoute } from "@/components/ProtectedRoute";

export default function SignupPage() {
  return (
    <GuestRoute>
      <Signup />
    </GuestRoute>
  );
}
