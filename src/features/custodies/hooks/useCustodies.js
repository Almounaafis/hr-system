// @/features/custodies/hooks/useCustodies.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { handleError, handleSuccess } from "@/lib/errorHandlers";

// ─── 1. List Custodies ───────────────────────────────────────────────────────
export function useCustodies(params) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["custodies", params],
    queryFn: async () => {
      const res = await api.get("/custodies", { params });
      return res.data;
    },
    keepPreviousData: true,
  });
  return { 
    custodies: data?.data?.custodies || [], 
    total: data?.data?.total || 0,
    isLoading, isError, refetch 
  };
}

// ─── 2. Stats ────────────────────────────────────────────────────────────────
export function useCustodyStats() {
  const { data, isLoading } = useQuery({
    queryKey: ["custodies-stats"],
    queryFn: async () => {
      const res = await api.get("/custodies/stats");
      return res.data;
    },
  });
  return { stats: data?.data || {}, isLoading };
}

// ─── 3. Single Custody Details ───────────────────────────────────────────────
export function useCustody(id) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["custody", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/custodies/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
  return { custody: data?.data || null, isLoading, refetch };
}

// ─── 4. User/Trainee Custodies ───────────────────────────────────────────────
export function useUserCustodies(userId) {
  const { data, isLoading } = useQuery({
    queryKey: ["custodies-user", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await api.get(`/custodies/employee/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });
  return { userCustodies: data?.data || [], isLoading };
}

export function useTraineeCustodies(traineeId) {
  const { data, isLoading } = useQuery({
    queryKey: ["custodies-trainee", traineeId],
    queryFn: async () => {
      if (!traineeId) return [];
      const res = await api.get(`/custodies/trainee/${traineeId}`);
      return res.data;
    },
    enabled: !!traineeId,
  });
  return { traineeCustodies: data?.data || [], isLoading };
}

// ─── 5. Mutations (CRUD & Actions) ───────────────────────────────────────────
export function useCreateCustody() {
  const queryClient = useQueryClient();
  const { mutateAsync: createCustody, isPending: isCreating } = useMutation({
    mutationFn: async (payload) => {
      const cleanData = { ...payload };
      if (cleanData.cost !== undefined && cleanData.cost !== "") {
        cleanData.cost = Number(cleanData.cost);
      } else if (cleanData.cost === "") {
        delete cleanData.cost;
      }
      const res = await api.post("/custodies", cleanData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: (res) => {
      handleSuccess(res, "تم إضافة العهدة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["custodies"] });
      queryClient.invalidateQueries({ queryKey: ["custodies-stats"] });
    },
    onError: handleError,
  });
  return { createCustody, isCreating };
}

export function useUpdateCustody() {
  const queryClient = useQueryClient();
  const { mutateAsync: updateCustody, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }) => {
      const cleanData = { ...data };
      if (cleanData.cost !== undefined && cleanData.cost !== "") {
        cleanData.cost = Number(cleanData.cost);
      } else if (cleanData.cost === "") {
        delete cleanData.cost;
      }
      const res = await api.put(`/custodies/${id}`, cleanData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: (res, vars) => {
      handleSuccess(res, "تم تحديث العهدة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["custodies"] });
      queryClient.invalidateQueries({ queryKey: ["custody", vars.id] });
    },
    onError: handleError,
  });
  return { updateCustody, isUpdating };
}

export function useDeleteCustody() {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteCustody, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/custodies/${id}`);
      return res.data;
    },
    onSuccess: (res) => {
      handleSuccess(res, "تم حذف العهدة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["custodies"] });
      queryClient.invalidateQueries({ queryKey: ["custodies-stats"] });
    },
    onError: handleError,
  });
  return { deleteCustody, isDeleting };
}

// ─── 6. Actions (Assign, Return, Transfer) ───────────────────────────────────
export function useAssignCustody() {
  const queryClient = useQueryClient();
  const { mutateAsync: assignCustody, isPending: isAssigning } = useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await api.post(`/custodies/${id}/assign`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (res, vars) => {
      handleSuccess(res, "تم تعيين العهدة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["custodies"] });
      queryClient.invalidateQueries({ queryKey: ["custody", vars.id] });
      queryClient.invalidateQueries({ queryKey: ["custodies-stats"] });
    },
    onError: handleError,
  });
  return { assignCustody, isAssigning };
}

export function useReturnCustody() {
  const queryClient = useQueryClient();
  const { mutateAsync: returnCustody, isPending: isReturning } = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.post(`/custodies/${id}/return`, data, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: (res, vars) => {
      handleSuccess(res, "تم إرجاع العهدة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["custodies"] });
      queryClient.invalidateQueries({ queryKey: ["custody", vars.id] });
      queryClient.invalidateQueries({ queryKey: ["custodies-stats"] });
    },
    onError: handleError,
  });
  return { returnCustody, isReturning };
}

export function useTransferCustody() {
  const queryClient = useQueryClient();
  const { mutateAsync: transferCustody, isPending: isTransferring } = useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await api.post(`/custodies/${id}/transfer`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (res, vars) => {
      handleSuccess(res, "تم نقل العهدة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["custodies"] });
      queryClient.invalidateQueries({ queryKey: ["custody", vars.id] });
    },
    onError: handleError,
  });
  return { transferCustody, isTransferring };
}