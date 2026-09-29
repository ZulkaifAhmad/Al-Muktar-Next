"use client";

import Signup from "@/pages_migrated/Sign-up";
import { GuestRoute } from "@/components/ProtectedRoute";

export default function RegisterPage() {
  return (
    <GuestRoute>
      <Signup />
    </GuestRoute>
  );
}
