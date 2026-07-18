import { useCrud } from "@/hooks/useCrud";

export function useScheduleHistory(employeeId) {
  return useCrud({
    queryKey: ["schedule-history", employeeId],
    endpoint: employeeId ? `/schedules/${employeeId}/history` : null,
    enabled: !!employeeId,
  });
}