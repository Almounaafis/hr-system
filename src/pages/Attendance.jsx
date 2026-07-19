import { useState, useMemo } from "react";
import Pagination from "@/shared/components/Pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceTable } from "@/components/dashboard/Attendance/AttendanceTable";
import { EditAttendanceSheet } from "@/components/dashboard/Attendance/EditAttendanceSheet";
import { useChangeAttendanceStatus } from "@/hooks/useEmployeeAttendance";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { TableToolbar } from "@/components/dashboard/Attendance/TableToolbar";
import { AttendanceTableSkeleton } from "@/components/dashboard/Attendance/AttendanceTableSkeleton";
import { mapAttendanceRecord } from "@/components/dashboard/Attendance/utils";
import { useAttendance } from "@/components/dashboard/Attendance/hooks/useAttendance";

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
    console.log("Saving edit for record:", editingRecord.id, editForm);
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
    </>
  );
}