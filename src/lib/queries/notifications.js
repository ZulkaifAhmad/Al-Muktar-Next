import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const notificationKeys = {
  all: ["notifications"],
  active: ["notifications", "active"],
  listAll: ["notifications", "all"],
  adminAll: ["admin-notifications"],
};

export function useActiveNotifications() {
  return useQuery({
    queryKey: notificationKeys.active,
    queryFn: async () => {
      const res = await api.get("/api/notifications/active");
      return res.data?.notifications || [];
    },
    staleTime: 30 * 1000,
  });
}

export function useAllNotifications() {
  return useQuery({
    queryKey: notificationKeys.listAll,
    queryFn: async () => {
      const res = await api.get("/api/notifications/all");
      return res.data?.notifications || [];
    },
    staleTime: 30 * 1000,
  });
}

export function useAdminNotifications() {
  return useQuery({
    queryKey: notificationKeys.adminAll,
    queryFn: async () => {
      const res = await api.get("/api/notifications");
      return res.data?.notifications || [];
    },
    staleTime: 30 * 1000,
  });
}

export function useNotificationMutations() {
  const queryClient = useQueryClient();

  const createNotification = useMutation({
    mutationFn: (data) => api.post("/api/notifications", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationKeys.adminAll });
    },
  });

  const updateNotification = useMutation({
    mutationFn: ({ id, data }) => api.put(`/api/notifications/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationKeys.adminAll });
    },
  });

  const toggleNotification = useMutation({
    mutationFn: (id) => api.patch(`/api/notifications/${id}/toggle`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationKeys.adminAll });
    },
  });

  const deleteNotification = useMutation({
    mutationFn: (id) => api.delete(`/api/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationKeys.adminAll });
    },
  });

  return { createNotification, updateNotification, toggleNotification, deleteNotification };
}
