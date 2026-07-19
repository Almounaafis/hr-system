import { useCrud } from "@/hooks/useCrud";

/**
 * Hook to fetch employee attendance data with filtering
 * @param {string} employeeId - The employee ID
 * @param {Object} filters - Optional filters (month, week, status)
 * @returns {Object} Query result with employee attendance data
 */
export function useEmployeeAttendance(employeeId, filters = {}) {
  const { month, week, status } = filters;
  
  // Build query parameters
  const queryParams = new URLSearchParams();
  if (month) queryParams.append('month', month);
  if (week) queryParams.append('week', week);
  if (status) queryParams.append('status', status);
  
  const queryString = queryParams.toString();
  const endpoint = employeeId 
    ? `/attendance/employee/${employeeId}${queryString ? `?${queryString}` : ''}`
    : '';

  const crud = useCrud({
    queryKey: ["employee-attendance", employeeId, filters],
    endpoint,
    enabled: !!employeeId,
    staleTime: 300000, // 5 minutes
    select: (data) => {
      // Handle both old format (with records/stats) and new format (direct array)
      const responseData = data?.data || data;
      if (Array.isArray(responseData)) {
        return { records: responseData, stats: null };
      }
      return responseData;
    },
  });

  return {
    ...crud,
    data: crud.data,
  };
}

/**
 * Hook to change attendance status
 * @returns {Object} Mutation functions for changing attendance status
 */
export function useChangeAttendanceStatus() {
  const crud = useCrud({
    endpoint: '',
    enabled: false,
    useJsonPayload: true,
  });

  const changeStatus = async (attendanceId, status) => {
    return crud.updateItem({
      endpoint: `/attendance/${attendanceId}/status`,
      body: { status },
      method: 'patch',
      skipId: true,
    });
  };

  return {
    changeStatus,
    isChanging: crud.updating,
  };
}
