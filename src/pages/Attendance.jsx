import { useState, useMemo } from "react";
import Pagination from "@/components/shared/Pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceTable } from "@/features/attendance/AttendanceTable";
import { EditAttendanceSheet } from "@/features/attendance/EditAttendanceSheet";
import { useChangeAttendanceStatus } from "@/features/employees/hooks/useEmployeeAttendance";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { TableToolbar } from "@/features/attendance/TableToolbar";
import { AttendanceTableSkeleton } from "@/features/attendance/AttendanceTableSkeleton";
import { mapAttendanceRecord } from "@/features/attendance/utils";
import { useAttendance, useExportAttendance } from "@/features/attendance/hooks/useAttendance";
import { SendEmailModal } from "@/features/attendance/SendEmailModal";

export default function Attendance() {
  const today = new Date();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [year] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [status, setStatus] = useState("");

  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({ checkIn: "", checkOut: "", status: "" });
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [debouncedSetSearch] = useDebouncedCallback((value) => {
    setDebouncedSearch(value);
  }, 400);

  const { data, isLoading, isError, error, refetch } = useAttendance({
    year,
    month,
    page,
    limit,
    search: debouncedSearch,
    status,
  });

  const {
    exportAttendance,
    sendAttendanceEmail,
    isExportingPdf,
    isExportingExcel,
    isSendingEmail,
  } = useExportAttendance();

  const { changeStatus, isChanging } = useChangeAttendanceStatus();

  const rawRecords = data?.records ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // mapping فقط (من غير ترتيب)
  const records = useMemo(() => {
    return rawRecords.map(mapAttendanceRecord);
  }, [rawRecords]);

  const handleMonthChange = (value) => {
    setMonth(Number(value));
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
    debouncedSetSearch(value);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };


  const handleSaveEdit = () => {
    setEditingRecord(null);
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setEditForm({ checkIn: "", checkOut: "", status: "" });
  };

  const handleAttendanceStatusChange = async (attendanceId, newStatus) => {
    try {
      await changeStatus(attendanceId, newStatus);
      await refetch();
    } catch (error) {
      console.error("Failed to change status:", error);
    }
  };

  const handleExportExcel = () => {
    exportAttendance({ month, year, status, format: "excel" });
  };

  const handleExportPdf = () => {
    exportAttendance({ month, year, status, format: "pdf" });
  };

  const handleSendEmailSubmit = async (targetEmail) => {
    await sendAttendanceEmail({ to: targetEmail, month, year, status });
  };

  return (
    <>
      <Card className="border-border">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">
            تسجيل الحضور
          </CardTitle>

          <div className="w-full sm:w-auto">
            <TableToolbar
              searchValue={search}
              onSearchChange={handleSearchChange}
              monthValue={month}
              onMonthChange={handleMonthChange}
              statusValue={status}
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
            <AttendanceTableSkeleton rows={limit} />
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
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
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