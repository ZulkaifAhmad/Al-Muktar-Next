import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const applicationKeys = {
  all: ["applications"],
  stats: ["application-stats"],
  detail: (id) => ["applications", id],
};

export function useApplications() {
  return useQuery({
    queryKey: applicationKeys.all,
    queryFn: async () => {
      const res = await api.get("/api/applications");
      return res.data?.applications || [];
    },
    staleTime: 30 * 1000,
  });
}

export function useApplicationStats() {
  return useQuery({
    queryKey: applicationKeys.stats,
    queryFn: async () => {
      const res = await api.get("/api/applications/stats");
      return res.data?.stats || null;
    },
    staleTime: 60 * 1000,
  });
}

export function useApplicationMutations() {
  const queryClient = useQueryClient();

  const updateApplicationStatus = useMutation({
    mutationFn: ({ id, status, remarks }) =>
      api.patch(`/api/applications/${id}/status`, { status, remarks }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      queryClient.invalidateQueries({ queryKey: applicationKeys.stats });
    },
  });

  const deleteApplication = useMutation({
    mutationFn: (id) => api.delete(`/api/applications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      queryClient.invalidateQueries({ queryKey: applicationKeys.stats });
    },
  });

  return { updateApplicationStatus, deleteApplication };
}
