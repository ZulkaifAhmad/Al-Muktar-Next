import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const studentKeys = {
  all: ["students"],
  detail: (id) => ["students", id],
};

export function useStudents() {
  return useQuery({
    queryKey: studentKeys.all,
    queryFn: async () => {
      const res = await api.get("/api/students");
      return res.data?.students || [];
    },
    staleTime: 30 * 1000,
  });
}

export function useStudentMutations() {
  const queryClient = useQueryClient();

  const createStudent = useMutation({
    mutationFn: (data) => api.post("/api/students", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });

  const updateStudent = useMutation({
    mutationFn: ({ id, data }) => api.put(`/api/students/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });

  const deleteStudent = useMutation({
    mutationFn: (id) => api.delete(`/api/students/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });

  return { createStudent, updateStudent, deleteStudent };
}
