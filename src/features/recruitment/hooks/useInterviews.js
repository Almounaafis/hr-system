// @/features/recruitment/hooks/useInterviews.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { handleError, handleSuccess } from "@/lib/errorHandlers";

// ─── 1. List Interviews ──────────────────────────────────────────────────────
export function useInterviews(params) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["recruitment-interviews", params],
    queryFn: async () => {
      const res = await api.get("/recruitment/interviews", { params });
      return res.data;
    },
    keepPreviousData: true,
  });

  const interviews = data?.data || [];
  return { interviews, isLoading, isError, refetch };
}

// ─── 2. Create Interview ─────────────────────────────────────────────────────
export function useCreateInterview() {
  const queryClient = useQueryClient();
  const { mutateAsync: createInterview, isPending: isCreating } = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/recruitment/interviews", payload);
      return res.data;
    },
    onSuccess: (res) => {
      handleSuccess(res, "تم جدولة المقابلة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["recruitment-interviews"] });
    },
    onError: handleError,
  });
  return { createInterview, isCreating };
}

// ─── 3. Evaluate Interview ───────────────────────────────────────────────────
export function useEvaluateInterview() {
  const queryClient = useQueryClient();
  const { mutateAsync: evaluateInterview, isPending: isEvaluating } = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/recruitment/interviews/${id}/evaluation`, data);
      return res.data;
    },
    onSuccess: (res) => {
      handleSuccess(res, "تم حفظ التقييم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["recruitment-interviews"] });
    },
    onError: handleError,
  });
  return { evaluateInterview, isEvaluating };
}

// ─── 4. Convert to Employee ──────────────────────────────────────────────────
export function useConvertToEmployee() {
  const queryClient = useQueryClient();
  const { mutateAsync: convertToEmployee, isPending: isConvertingEmployee } = useMutation({
    mutationFn: async ({ applicationId, data }) => {
      const res = await api.post(`/recruitment/applications/${applicationId}/convert-to-employee`, data);
      return res.data;
    },
    onSuccess: (res) => {
      handleSuccess(res, "تم تعيين المتقدم كموظف بنجاح");
      queryClient.invalidateQueries({ queryKey: ["recruitment-interviews"] });
      queryClient.invalidateQueries({ queryKey: ["recruitment-applications"] });
    },
    onError: handleError,
  });
  return { convertToEmployee, isConvertingEmployee };
}

// ─── 5. Convert to Trainee ───────────────────────────────────────────────────
export function useConvertToTrainee() {
  const queryClient = useQueryClient();
  const { mutateAsync: convertToTrainee, isPending: isConvertingTrainee } = useMutation({
    mutationFn: async ({ applicationId, data }) => {
      const res = await api.post(`/recruitment/applications/${applicationId}/convert-to-trainee`, data);
      return res.data;
    },
    onSuccess: (res) => {
      handleSuccess(res, "تم تعيين المتقدم كمتدرج بنجاح");
      queryClient.invalidateQueries({ queryKey: ["recruitment-interviews"] });
      queryClient.invalidateQueries({ queryKey: ["recruitment-applications"] });
    },
    onError: handleError,
  });
  return { convertToTrainee, isConvertingTrainee };
}