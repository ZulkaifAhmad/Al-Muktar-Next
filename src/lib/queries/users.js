import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const userKeys = {
  all: ["admin-users"],
  count: ["user-count"],
};

export function useAdminUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const res = await api.get("/api/admin/users");
      return res.data?.users || [];
    },
    staleTime: 30 * 1000,
  });
}

export function useUserCount() {
  return useQuery({
    queryKey: userKeys.count,
    queryFn: async () => {
      const res = await api.get("/api/admin/users/count");
      return res.data?.total || 0;
    },
    staleTime: 60 * 1000,
  });
}

export function useUserMutations() {
  const queryClient = useQueryClient();

  const updateUserRole = useMutation({
    mutationFn: ({ id, role }) => api.put(`/api/admin/users/${id}`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.count });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id) => api.delete(`/api/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.count });
    },
  });

  return { updateUserRole, deleteUser };
}
