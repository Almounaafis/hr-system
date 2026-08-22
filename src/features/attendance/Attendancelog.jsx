import { useState } from "react";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import TableShared from "@/components/shared/TableShared";
import { StatusDropdown } from "@/components/shared/StatusDropdown";
import {
  useEmployeeAttendance,
  useChangeAttendanceStatus,
  useExportEmployeeAttendance,
} from "@/features/employees/hooks/useEmployeeAttendance";
import { FormInput } from "@/components/shared/forms/FormInput";
import { Button } from "@/components/ui/button";
import { SendEmailModal } from "@/features/attendance/SendEmailModal";
import { statusLabels, statusOptions } from "@/lib/constants";
import { FileSpreadsheet, FileText, Mail, Loader2 } from "lucide-react";

function formatDate(value) {
  if (!value || value === "—") return "—";
  try {
    let d = typeof value === "string" ? parseISO(value) : new Date(value);
    if (isNaN(d?.getTime?.())) {
      d = new Date(value);
    }
    if (isNaN(d?.getTime?.())) return value;
    return format(d, "d MMM yyyy", { locale: arSA });
  } catch  {
    return value || "—";
  }
}

function formatTime(value) {
  if (!value || value === "—") return "—";
  try {
    if (typeof value === "string" && !value.includes("-") && !value.includes("T")) {
      return value;
    }
    let d = typeof value === "string" ? parseISO(value) : new Date(value);
    if (isNaN(d?.getTime?.())) {
      d = new Date(value);
    }
    if (isNaN(d?.getTime?.())) return value;
    return format(d, "HH:mm", { locale: arSA });
  } catch  {
    return value || "—";
  }
}

export function Attendancelog({ employeeId, month }) {
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const { data: attendanceData, isLoading, isError, refetch } = useEmployeeAttendance(
    employeeId,
    {
      month,
      week: selectedWeek || undefined,
      status: selectedStatus || undefined
    }
  );

  const { changeStatus, isChanging } = useChangeAttendanceStatus();

  const {
    exportEmployeeAttendance,
    sendEmployeeAttendanceEmail,
    isExportingPdf,
    isExportingExcel,
    isSendingEmail,
  } = useExportEmployeeAttendance();

  const records = attendanceData?.records || [];

  const handleStatusChange = async (attendanceId, newStatus) => {
    try {
      await changeStatus(attendanceId, newStatus);
      refetch();
    } catch (error) {
      console.error("Failed to change status:", error);
    }
  };

  const handleExportExcel = () => {
    exportEmployeeAttendance({ employeeId, month, year: currentYear, format: "excel" });
  };

  const handleExportPdf = () => {
    exportEmployeeAttendance({ employeeId, month, year: currentYear, format: "pdf" });
  };

  const handleSendEmailSubmit = async (email) => {
    await sendEmployeeAttendanceEmail({ employeeId, to: email, month, year: currentYear });
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900">سجل الحضور التفصيلي</h2>
        <div className="flex items-center gap-2 flex-wrap">
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
            className="min-w-[140px]"
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
            className="min-w-[140px]"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="h-10 px-3 text-xs font-medium rounded-xl flex items-center gap-1.5 border-border bg-white hover:bg-accent"
          >
            {isExportingExcel ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" />
            )}
            <span>Excel</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="h-10 px-3 text-xs font-medium rounded-xl flex items-center gap-1.5 border-border bg-white hover:bg-accent"
          >
            {isExportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-red-500" />
            )}
            <span>PDF</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEmailModalOpen(true)}
            disabled={isSendingEmail}
            className="h-10 px-3 text-xs font-medium rounded-xl flex items-center gap-1.5 border-border bg-white hover:bg-accent text-foreground"
          >
            {isSendingEmail ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Mail className="w-3.5 h-3.5 text-primary" />
            )}
            <span>إرسال إيميل</span>
          </Button>
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

      <SendEmailModal
        open={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        title="إرسال سجل حضور الموظف"
        onSend={handleSendEmailSubmit}
        isLoading={isSendingEmail}
      />
    </div>
  );
}