"use client";

import Apply from "@/pages_migrated/Apply";
import { PrivateRoute } from "@/components/ProtectedRoute";

export default function ApplyPage() {
  return (
    <PrivateRoute>
      <Apply />
    </PrivateRoute>
  );
}
