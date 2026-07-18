import { useState } from "react";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import TableShared from "@/shared/components/TableShared";
import { StatusDropdown } from "@/shared/components/StatusDropdown";
import { useEmployeeAttendance } from "@/hooks/useEmployeeAttendance";
import { useChangeAttendanceStatus } from "@/hooks/useEmployeeAttendance";
import { FormInput } from "@/shared/forms/FormInput";
import { statusLabels, statusOptions } from "@/lib/constants";

function formatDate(value) {
  if (!value) return "—";
  return format(parseISO(value), "d MMM yyyy", { locale: arSA });
}

function formatTime(value) {
  if (!value) return "—";
  return format(parseISO(value), "HH:mm", { locale: arSA });
}

export function Attendancelog({ employeeId, month }) {
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const { data: attendanceData, isLoading, isError, refetch } = useEmployeeAttendance(
    employeeId,
    {
      month,
      week: selectedWeek || undefined,
      status: selectedStatus || undefined
    }
  );

  const { changeStatus, isChanging } = useChangeAttendanceStatus();

  const records = attendanceData?.records || [];

  const handleStatusChange = async (attendanceId, newStatus) => {
    try {
      await changeStatus(attendanceId, newStatus);
      refetch();
    } catch (error) {
      console.error("Failed to change status:", error);
    }
  };

  const columns = [
    {
      header: "التاريخ",
      cellClassName: "text-sm text-gray-700 font-medium",
      render: (row) => formatDate(row.attendance_date),
    },
    {
      header: "وقت الحضور",
      cellClassName: "text-sm text-gray-700 font-medium",
      render: (row) => formatTime(row.clock_in),
    },
    {
      header: "وقت الانصراف",
      cellClassName: "text-sm text-gray-700 font-medium",
      render: (row) => formatTime(row.clock_out),
    },
    {
      header: "ساعات العمل",
      cellClassName: "text-sm text-gray-700 font-medium",
      render: (row) => row.work_hours || "—",
    },
    {
      header: "الحالة",
      render: (row) => (
        <div className="flex items-center gap-2">
          <StatusDropdown
            value={row.status}
            onChange={(newStatus) => handleStatusChange(row.id, newStatus)}
            disabled={isChanging}
          />
        </div>
      ),
    },
    {
      header: "تأخير (دقيقة)",
      cellClassName: "text-sm text-gray-700 font-medium",
      render: (row) => row.late_minutes || 0,
    },
  ];

  return (
    <div className="bg-background rounded-2xl shadow-sm p-6 mt-6" dir="rtl">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900">سجل الحضور التفصيلي</h2>
        <div className="flex items-center gap-2">
          <FormInput
            name="week"
            type="select"
            value={selectedWeek || 'all'}
            onChange={(e) => {
              const newWeek = e.target.value === 'all' ? '' : e.target.value;
              setSelectedWeek(newWeek);
              refetch();
            }}
            options={[
              { value: 'all', label: 'كل الأسابيع' },
              { value: '1', label: 'الأسبوع الأول' },
              { value: '2', label: 'الأسبوع الثاني' },
              { value: '3', label: 'الأسبوع الثالث' },
              { value: '4', label: 'الأسبوع الرابع' },
              { value: '5', label: 'الأسبوع الخامس' },
            ]}
            placeholder="اختر الأسبوع"
            className="min-w-[150px]"
          />
          <FormInput
            name="attendance_status"
            type="select"
            value={selectedStatus || 'all'}
            onChange={(e) => {
              const newStatus = e.target.value === 'all' ? '' : e.target.value;
              setSelectedStatus(newStatus);
              refetch();
            }}
            options={[
              { value: 'all', label: 'كل الحالات' },
              ...statusOptions.map(status => ({ value: status, label: statusLabels[status] })),
            ]}
            placeholder="اختر الحالة"
            className="min-w-[150px]"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-center text-sm text-gray-400 py-10">جارٍ التحميل...</p>
      ) : isError ? (
        <p className="text-center text-sm text-red-400 py-10">حدث خطأ أثناء تحميل البيانات</p>
      ) : !records?.length ? (
        <p className="text-center text-sm text-gray-400 py-10">لا توجد بيانات مطابقة</p>
      ) : (
        <TableShared columns={columns} data={records} />
      )}
    </div>
  );
}