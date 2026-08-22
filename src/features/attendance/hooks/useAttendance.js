import { useState } from 'react';
import { useCrud } from '@/hooks/useCrud';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export function useAttendance(filters = {}) {
  const { year, month, page, limit, search, status } = filters;

  const queryParams = new URLSearchParams();
  if (year) queryParams.append('year', year);
  if (month) queryParams.append('month', month);
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);
  if (search) queryParams.append('search', search);
  if (status) queryParams.append('status', status);

  const queryString = queryParams.toString();
  const endpoint = `/attendance${queryString ? `?${queryString}` : ''}`;

  const crud = useCrud({
    queryKey: ["attendance", filters],
    endpoint,
    enabled: true,
    staleTime: 300000,
    select: (data) => {
      const responseData = data?.data || data;
      const records = responseData?.records ?? [];
      const total = responseData?.total ?? records.length;
      const currentLimit = limit || 10;
      const totalPages = Math.max(1, Math.ceil(total / currentLimit));

      return { records, total, totalPages };
    },
  });

  return { ...crud };
}

export function useExportAttendance() {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const exportAttendance = async ({ month, year, status, format }) => {
    try {
      format === 'pdf' ? setIsExportingPdf(true) : setIsExportingExcel(true);
      const params = {};
      if (month) params.month = String(month);
      if (year) params.year = String(year);
      if (status) params.status = String(status);
      if (format) params.format = String(format);

      const response = await api.get('/attendance/export', {
        params,
        responseType: 'blob',
      });

      const ext = format === 'excel' ? 'xlsx' : 'pdf';
      const filename = `attendance_${month || 'all'}_${year || ''}.${ext}`;
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('تم تصدير تقرير الحضور بنجاح');
    } catch (error) {
      console.error('Error exporting attendance:', error);
      toast.error('حدث خطأ أثناء تصدير ملف الحضور');
    } finally {
      format === 'pdf' ? setIsExportingPdf(false) : setIsExportingExcel(false);
    }
  };

  const sendAttendanceEmail = async ({ to, month, year, status }) => {
    try {
      setIsSendingEmail(true);
      const params = { to };
      if (month) params.month = String(month);
      if (year) params.year = String(year);
      if (status) params.status = String(status);

      await api.post('/attendance/email', null, { params });
      toast.success('تم إرسال سجل الحضور إلى البريد الإلكتروني بنجاح');
    } catch (error) {
      console.error('Error sending attendance email:', error);
      toast.error('حدث خطأ أثناء إرسال البريد الإلكتروني');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return {
    exportAttendance,
    sendAttendanceEmail,
    isExportingPdf,
    isExportingExcel,
    isSendingEmail,
  };
}