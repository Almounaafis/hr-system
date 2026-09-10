import { useState, useMemo, useCallback } from 'react';
import Pagination from '@/components/shared/Pagination';
import logger from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceTable } from '@/features/attendance/AttendanceTable';
import { EditAttendanceSheet } from '@/features/attendance/EditAttendanceSheet';
import { useChangeAttendanceStatus } from '@/features/employees/hooks/useEmployeeAttendance';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { TableToolbar } from '@/features/attendance/TableToolbar';
import { AttendanceTableSkeleton } from '@/features/attendance/AttendanceTableSkeleton';
import { mapAttendanceRecord } from '@/features/attendance/utils';
import { useAttendance, useExportAttendance } from '@/features/attendance/hooks/useAttendance';
import { SendEmailModal } from '@/features/attendance/SendEmailModal';

export default function Attendance() {
  const today = new Date();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedStatus, setSelectedStatus] = useState('');

  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({ checkIn: '', checkOut: '', status: '' });
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const handleDebouncedSearch = useDebouncedCallback((value) => {
    setDebouncedSearchQuery(value);
  }, 400);

  const { data, isLoading, isError, error, refetch } = useAttendance({
    year: selectedYear,
    month: selectedMonth,
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchQuery,
    status: selectedStatus,
  });

  const {
    exportAttendance,
    sendAttendanceEmail,
    isExportingPdf,
    isExportingExcel,
    isSendingEmail,
  } = useExportAttendance();

  const { changeStatus, isChanging } = useChangeAttendanceStatus();

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // mapping فقط (من غير ترتيب)
  const records = useMemo(() => {
    const rawRecords = data?.records ?? [];
    return rawRecords.map(mapAttendanceRecord);
  }, [data?.records]);

  const handleMonthChange = useCallback(
    (value) => {
      setSelectedMonth(Number(value));
      setCurrentPage(1);
    },
    [setSelectedMonth, setCurrentPage]
  );

  const handleSearchChange = useCallback(
    (value) => {
      setSearchQuery(value);
      setCurrentPage(1);
      handleDebouncedSearch(value);
    },
    [setSearchQuery, setCurrentPage, handleDebouncedSearch]
  );

  const handleStatusChange = useCallback(
    (value) => {
      setSelectedStatus(value);
      setCurrentPage(1);
    },
    [setSelectedStatus, setCurrentPage]
  );

  const handleSaveEdit = useCallback(() => {
    setEditingRecord(null);
  }, [setEditingRecord]);

  const handleCancelEdit = useCallback(() => {
    setEditingRecord(null);
    setEditForm({ checkIn: '', checkOut: '', status: '' });
  }, [setEditingRecord, setEditForm]);

  const handleAttendanceStatusChange = useCallback(
    async (attendanceId, newStatus) => {
      try {
        await changeStatus(attendanceId, newStatus);
        await refetch();
      } catch (error) {
        logger.error('Failed to change status:', error);
      }
    },
    [changeStatus, refetch]
  );

  const handleExportExcel = useCallback(() => {
    exportAttendance({
      month: selectedMonth,
      year: selectedYear,
      status: selectedStatus,
      format: 'excel',
    });
  }, [exportAttendance, selectedMonth, selectedYear, selectedStatus]);

  const handleExportPdf = useCallback(() => {
    exportAttendance({
      month: selectedMonth,
      year: selectedYear,
      status: selectedStatus,
      format: 'pdf',
    });
  }, [exportAttendance, selectedMonth, selectedYear, selectedStatus]);

  const handleSendEmailSubmit = useCallback(
    async (targetEmail) => {
      await sendAttendanceEmail({
        to: targetEmail,
        month: selectedMonth,
        year: selectedYear,
        status: selectedStatus,
      });
    },
    [sendAttendanceEmail, selectedMonth, selectedYear, selectedStatus]
  );

  return (
    <>
      <Card className="border-border">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">
            تسجيل الحضور
          </CardTitle>

          <div className="w-full sm:w-auto">
            <TableToolbar
              searchValue={searchQuery}
              onSearchChange={handleSearchChange}
              monthValue={selectedMonth}
              onMonthChange={handleMonthChange}
              statusValue={selectedStatus}
              onStatusChange={handleStatusChange}
              onExportExcel={handleExportExcel}
              onExportPdf={handleExportPdf}
              onSendEmail={() => setIsEmailModalOpen(true)}
              isExportingExcel={isExportingExcel}
              isExportingPdf={isExportingPdf}
              isSendingEmail={isSendingEmail}
              className="w-full sm:w-auto"
            />
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4">
          {isError && (
            <div className="text-sm text-red-500 py-4 text-center">
              حدث خطأ أثناء تحميل البيانات: {error?.message}
            </div>
          )}

          {isLoading ? (
            <AttendanceTableSkeleton rows={pageSize} />
          ) : records.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">
              لا توجد بيانات حضور مطابقة
            </div>
          ) : (
            <AttendanceTable
              data={records}
              onStatusChange={handleAttendanceStatusChange}
              isChangingStatus={isChanging}
            />
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <EditAttendanceSheet
        open={!!editingRecord}
        onOpenChange={handleCancelEdit}
        editingRecord={editingRecord}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />

      <SendEmailModal
        open={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        title="إرسال سجل الحضور العام"
        onSend={handleSendEmailSubmit}
        isLoading={isSendingEmail}
      />
    </>
  );
}
