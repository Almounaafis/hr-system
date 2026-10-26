// @/features/recruitment/hooks/useApplications.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { handleError, handleSuccess } from "@/lib/errorHandlers";

// ─── 1. List Applications ────────────────────────────────────────────────────
export function useApplications(params) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["recruitment-applications", params],
    queryFn: async () => {
      const res = await api.get("/recruitment/applications", { params });
      return res.data;
    },
    keepPreviousData: true, // Prevents UI jump when switching pages
  });

  const applications = data?.data?.applications || [];
  const pagination = data?.data?.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 };

  return { applications, pagination, isLoading, isError, refetch };
}

// ─── 2. Single Application Detail ────────────────────────────────────────────
export function useApplication(id, { enabled = true } = {}) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["recruitment-application", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/recruitment/applications/${id}`);
      return res.data;
    },
    enabled: enabled && !!id,
  });

  const application = data?.data || null;
  return { application, isLoading, isError, refetch };
}

// ─── 3. Update Qualification Score ───────────────────────────────────────────
export function useQualifyApplication() {
  const queryClient = useQueryClient();

  const { mutateAsync: qualify, isPending: isQualifying } = useMutation({
    mutationFn: async ({ id, score }) => {
      const res = await api.patch(`/recruitment/applications/${id}/qualification`, { score }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    },
    onSuccess: (res, variables) => {
      handleSuccess(res, "تم تحديث الدرجة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["recruitment-applications"] });
      queryClient.invalidateQueries({ queryKey: ["recruitment-application", variables.id] });
    },
    onError: handleError,
  });

  return { qualify, isQualifying };
}

// ─── 4. Reject Application ───────────────────────────────────────────────────
export function useRejectApplication() {
  const queryClient = useQueryClient();

  const { mutateAsync: reject, isPending: isRejecting } = useMutation({
    mutationFn: async ({ id, rejection_reason }) => {
      const res = await api.post(`/recruitment/applications/${id}/reject`, { rejection_reason }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    },
    onSuccess: (res, variables) => {
      handleSuccess(res, "تم رفض الطلب بنجاح");
      queryClient.invalidateQueries({ queryKey: ["recruitment-applications"] });
      queryClient.invalidateQueries({ queryKey: ["recruitment-application", variables.id] });
    },
    onError: handleError,
  });

  return { reject, isRejecting };
}