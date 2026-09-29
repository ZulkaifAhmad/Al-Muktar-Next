"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

const AppContext = createContext({
  invalidateAll: () => {},
});

/**
 * AppProvider - Lightweight root context provider.
 * All API queries and mutations are decentralized into dedicated TanStack Query hooks in @/lib/queries/
 * and called only in the specific components/pages where required.
 */
export function AppProvider({ children }) {
  const queryClient = useQueryClient();

  const value = useMemo(
    () => ({
      invalidateAll: () => {
        queryClient.invalidateQueries();
      },
    }),
    [queryClient]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}

export default AppContext;
