"use client";

import Login from "@/pages_migrated/Login";
import { GuestRoute } from "@/components/ProtectedRoute";

export default function LoginPage() {
  return (
    <GuestRoute>
      <Login />
    </GuestRoute>
  );
}
