import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const resultKeys = {
  all: ["results"],
  list: (filters) => ["results", "list", filters],
  meta: ["results", "meta"],
  detail: (id) => ["results", "detail", id],
};

export function usePublicResults(filters = {}) {
  return useQuery({
    queryKey: resultKeys.list({ ...filters, isReleased: true }),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("isReleased", "true");
      if (filters.courseName && filters.courseName !== "all") {
        params.set("courseName", filters.courseName);
      }
      if (filters.q?.trim()) {
        params.set("q", filters.q.trim());
      }
      const res = await api.get(`/api/results?${params.toString()}`);
      return res.data?.results || [];
    },
    staleTime: 60 * 1000,
  });
}

export function useResultsMeta() {
  return useQuery({
    queryKey: resultKeys.meta,
    queryFn: async () => {
      const res = await api.get("/api/results/meta");
      return res.data?.courses || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminResults(filters = {}) {
  return useQuery({
    queryKey: resultKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.q?.trim()) params.set("q", filters.q.trim());
      if (filters.courseName && filters.courseName !== "all") params.set("courseName", filters.courseName);
      if (filters.isReleased && filters.isReleased !== "all") params.set("isReleased", filters.isReleased);
      params.set("limit", "100");

      const res = await api.get(`/api/results?${params.toString()}`);
      return res.data || { results: [], total: 0 };
    },
    staleTime: 30 * 1000,
  });
}

export function useResultMutations() {
  const queryClient = useQueryClient();

  const createResult = useMutation({
    mutationFn: (data) => api.post("/api/results", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resultKeys.all });
    },
  });

  const updateResult = useMutation({
    mutationFn: ({ id, data }) => api.put(`/api/results/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resultKeys.all });
    },
  });

  const toggleRelease = useMutation({
    mutationFn: ({ id, isReleased }) =>
      api.patch(`/api/results/${id}/toggle-release`, { isReleased }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resultKeys.all });
    },
  });

  const deleteResult = useMutation({
    mutationFn: (id) => api.delete(`/api/results/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resultKeys.all });
    },
  });

  return { createResult, updateResult, toggleRelease, deleteResult };
}
