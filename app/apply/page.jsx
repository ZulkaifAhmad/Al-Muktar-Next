"use client";

import Apply from "@/pages_migrated/Apply";
import { PrivateRoute } from "@/components/ProtectedRoute";

export const dynamic = "force-dynamic";

export default function ApplyPage() {
  return (
    <PrivateRoute>
      <Apply />
    </PrivateRoute>
  );
}
