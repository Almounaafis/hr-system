// @/features/trainees/hooks/useTrainees.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { handleError, handleSuccess } from "@/lib/errorHandlers";

// ─── 1. List Trainees ────────────────────────────────────────────────────────
export function useTrainees(params) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["trainees", params],
    queryFn: async () => {
      const res = await api.get("/trainees", { params });
      return res.data;
    },
    keepPreviousData: true,
  });
  return { 
    trainees: data?.data?.trainees || [], 
    pagination: data?.data?.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 }, 
    isLoading, isError, refetch 
  };
}

// ─── 2. Single Trainee Detail ────────────────────────────────────────────────
export function useTrainee(id) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["trainee", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/trainees/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
  return { trainee: data?.data || null, isLoading, isError, refetch };
}

// ─── 3. Create Trainee ───────────────────────────────────────────────────────
export function useCreateTrainee() {
  const queryClient = useQueryClient();
  const { mutateAsync: createTrainee, isPending: isCreating } = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/trainees", payload);
      return res.data;
    },
    onSuccess: (res) => {
      handleSuccess(res, "تم إضافة المتدرب بنجاح");
      queryClient.invalidateQueries({ queryKey: ["trainees"] });
    },
    onError: handleError,
  });
  return { createTrainee, isCreating };
}

// ─── 4. Update Trainee ───────────────────────────────────────────────────────
export function useUpdateTrainee() {
  const queryClient = useQueryClient();
  const { mutateAsync: updateTrainee, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/trainees/${id}`, data);
      return res.data;
    },
    onSuccess: (res, vars) => {
      handleSuccess(res, "تم تحديث بيانات المتدرب");
      queryClient.invalidateQueries({ queryKey: ["trainees"] });
      queryClient.invalidateQueries({ queryKey: ["trainee", vars.id] });
    },
    onError: handleError,
  });
  return { updateTrainee, isUpdating };
}

// ─── 5. Graduate Trainee (Convert to Employee) ───────────────────────────────
export function useGraduateTrainee() {
  const queryClient = useQueryClient();
  const { mutateAsync: graduateTrainee, isPending: isGraduating } = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.post(`/trainees/${id}/graduate`, data);
      return res.data;
    },
    onSuccess: (res) => {
      handleSuccess(res, "تم تخرج المتدرب وتعيينه كموظف بنجاح");
      queryClient.invalidateQueries({ queryKey: ["trainees"] });
    },
    onError: handleError,
  });
  return { graduateTrainee, isGraduating };
}

// ─── 6. Trainee Attendance ───────────────────────────────────────────────────
export function useTraineeAttendance(traineeId) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["trainee-attendance", traineeId],
    queryFn: async () => {
      if (!traineeId) return [];
      const res = await api.get(`/trainees/${traineeId}/attendance`);
      return res.data;
    },
    enabled: !!traineeId,
  });
  return { attendance: data?.data || [], isLoading, refetch };
}

export function useRecordAttendance() {
  const queryClient = useQueryClient();
  const { mutateAsync: recordAttendance, isPending: isRecording } = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/trainees/attendance/record", payload);
      return res.data;
    },
    onSuccess: (res, vars) => {
      handleSuccess(res, "تم تسجيل الحضور بنجاح");
      queryClient.invalidateQueries({ queryKey: ["trainee-attendance", vars.trainee_id] });
    },
    onError: handleError,
  });
  return { recordAttendance, isRecording };
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();
  const { mutateAsync: updateAttendance, isPending: isUpdatingAttendance } = useMutation({
    mutationFn: async ({ id, data, traineeId }) => {
      const res = await api.put(`/trainees/attendance/${id}`, data);
      return res.data;
    },
    onSuccess: (res, vars) => {
      handleSuccess(res, "تم تحديث الحضور بنجاح");
      queryClient.invalidateQueries({ queryKey: ["trainee-attendance", vars.traineeId] });
    },
    onError: handleError,
  });
  return { updateAttendance, isUpdatingAttendance };
}