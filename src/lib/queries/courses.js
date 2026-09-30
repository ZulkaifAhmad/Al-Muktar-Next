import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const courseKeys = {
  all: ["courses"],
  detail: (slugOrId) => ["courses", slugOrId],
};

export function useCourses() {
  return useQuery({
    queryKey: courseKeys.all,
    queryFn: async () => {
      const res = await api.get("/api/courses");
      return res.data?.courses || [];
    },
    staleTime: 30 * 1000,
  });
}

export function useCourse(slugOrId) {
  return useQuery({
    queryKey: courseKeys.detail(slugOrId),
    queryFn: async () => {
      if (!slugOrId) return null;
      const res = await api.get(`/api/courses/${slugOrId}`);
      return res.data?.course || null;
    },
    enabled: Boolean(slugOrId),
    staleTime: 30 * 1000,
  });
}

export function useCourseMutations() {
  const queryClient = useQueryClient();

  const createCourse = useMutation({
    mutationFn: (data) => api.post("/api/courses", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
    },
  });

  const updateCourse = useMutation({
    mutationFn: ({ id, data }) => api.put(`/api/courses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
    },
  });

  const deleteCourse = useMutation({
    mutationFn: (id) => api.delete(`/api/courses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
    },
  });

  return { createCourse, updateCourse, deleteCourse };
}
