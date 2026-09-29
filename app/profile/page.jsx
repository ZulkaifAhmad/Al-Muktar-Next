"use client";

import Profile from "@/pages_migrated/Profile";
import { PrivateRoute } from "@/components/ProtectedRoute";

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  );
}
