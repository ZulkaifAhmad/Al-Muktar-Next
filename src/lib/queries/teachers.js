import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const teacherKeys = {
  all: ["teachers"],
  detail: (id) => ["teachers", id],
};

export function useTeachers() {
  return useQuery({
    queryKey: teacherKeys.all,
    queryFn: async () => {
      const res = await api.get("/api/teachers");
      return res.data?.teachers || [];
    },
    staleTime: 30 * 1000,
  });
}

export function useTeacherMutations() {
  const queryClient = useQueryClient();

  const createTeacher = useMutation({
    mutationFn: (data) => api.post("/api/teachers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
    },
  });

  const updateTeacher = useMutation({
    mutationFn: ({ id, data }) => api.put(`/api/teachers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
    },
  });

  const deleteTeacher = useMutation({
    mutationFn: (id) => api.delete(`/api/teachers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
    },
  });

  return { createTeacher, updateTeacher, deleteTeacher };
}
