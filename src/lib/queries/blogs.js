import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const blogKeys = {
  all: ["blogs"],
  adminAll: ["admin-blogs"],
  detail: (slugOrId) => ["blogs", slugOrId],
};

export function useBlogs() {
  return useQuery({
    queryKey: blogKeys.all,
    queryFn: async () => {
      const res = await api.get("/api/blogs");
      return res.data?.blogs || [];
    },
    staleTime: 30 * 1000,
  });
}

export function useAdminBlogs() {
  return useQuery({
    queryKey: blogKeys.adminAll,
    queryFn: async () => {
      const res = await api.get("/api/blogs/admin/all");
      return res.data?.blogs || [];
    },
    staleTime: 30 * 1000,
  });
}

export function useBlog(slugOrId) {
  return useQuery({
    queryKey: blogKeys.detail(slugOrId),
    queryFn: async () => {
      if (!slugOrId) return null;
      const res = await api.get(`/api/blogs/${slugOrId}`);
      return res.data?.blog || null;
    },
    enabled: Boolean(slugOrId),
    staleTime: 30 * 1000,
  });
}

export function useBlogMutations() {
  const queryClient = useQueryClient();

  const createBlog = useMutation({
    mutationFn: (data) => api.post("/api/blogs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.adminAll });
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
    },
  });

  const updateBlog = useMutation({
    mutationFn: ({ id, data }) => api.put(`/api/blogs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.adminAll });
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
    },
  });

  const deleteBlog = useMutation({
    mutationFn: (id) => api.delete(`/api/blogs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.adminAll });
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
    },
  });

  return { createBlog, updateBlog, deleteBlog };
}
