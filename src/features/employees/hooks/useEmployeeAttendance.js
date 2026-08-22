import { useState } from "react";
import { useCrud } from "@/hooks/useCrud";
import api from "@/lib/axios";
import toast from "react-hot-toast";

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
    select: (data) => {
      // Handle both old format (with records/stats) and new format (direct array)
      const responseData = data?.data || data;
      if (Array.isArray(responseData)) {
        return { records: responseData, stats: null };
      }
      return responseData;
    },
  });

  // Fetch employee data separately
  const { data: employeeData, isLoading: employeeLoading } = useCrud({
    queryKey: ["employee", employeeId],
    endpoint: employeeId ? `/employees/${employeeId}` : null,
    enabled: !!employeeId,
  });

  const employee = employeeData?.data ?? employeeData ?? {};

  return {
    ...crud,
    data: crud.data,
    employee,
    employeeLoading,
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

/**
 * Hook to export single employee attendance (PDF, Excel) and send to email
 */
export function useExportEmployeeAttendance() {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const exportEmployeeAttendance = async ({ employeeId, month, year, format }) => {
    try {
      format === 'pdf' ? setIsExportingPdf(true) : setIsExportingExcel(true);
      const params = {};
      if (month) params.month = String(month);
      if (year) params.year = String(year);
      if (format) params.format = String(format);

      const response = await api.get(`/attendance/employee/${employeeId}/export`, {
        params,
        responseType: 'blob',
      });

      const ext = format === 'excel' ? 'xlsx' : 'pdf';
      const filename = `employee_attendance_${month || 'all'}_${year || ''}.${ext}`;
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('تم تصدير سجل حضور الموظف بنجاح');
    } catch (error) {
      console.error('Error exporting employee attendance:', error);
      toast.error('حدث خطأ أثناء تصدير سجل حضور الموظف');
    } finally {
      format === 'pdf' ? setIsExportingPdf(false) : setIsExportingExcel(false);
    }
  };

  const sendEmployeeAttendanceEmail = async ({ employeeId, to, month, year }) => {
    try {
      setIsSendingEmail(true);
      const params = { to };
      if (month) params.month = String(month);
      if (year) params.year = String(year);

      await api.post(`/attendance/employee/${employeeId}/email`, null, { params });
      toast.success('تم إرسال سجل حضور الموظف إلى البريد الإلكتروني بنجاح');
    } catch (error) {
      console.error('Error sending employee attendance email:', error);
      toast.error('حدث خطأ أثناء إرسال البريد الإلكتروني');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return {
    exportEmployeeAttendance,
    sendEmployeeAttendanceEmail,
    isExportingPdf,
    isExportingExcel,
    isSendingEmail,
  };
}
