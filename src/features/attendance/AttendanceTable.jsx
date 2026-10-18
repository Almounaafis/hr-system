// @/features/attendance/AttendanceTable.jsx
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import DataTable from "@/components/shared/DataTable";
import { StatusDropdown } from "@/components/shared/StatusDropdown";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { isLateCheckIn } from "./utils";
import { cn } from "@/lib/utils";
import { ChevronLeft, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import { RegistrationDetailsDialog } from "./RegistrationDetailsDialog";
import { AttendanceRowSkeleton } from "./AttendanceTableSkeleton";

function formatDate(value) {
  if (!value || value === "—") return "—";
  try {
    let d = typeof value === "string" ? parseISO(value) : new Date(value);
    if (isNaN(d?.getTime?.())) d = new Date(value);
    if (isNaN(d?.getTime?.())) return value;
    return format(d, "d MMM yyyy", { locale: arSA });
  } catch {
    return value || "—";
  }
}

export function AttendanceTable({
  data,
  onStatusChange,
  isChangingStatus,
  isLoading = false,
  isError = false,
  errorMessage = "حدث خطأ أثناء تحميل البيانات",
  onRetry,
  skeletonRows = 10,
}) {
  const [selectedDetailsRecord, setSelectedDetailsRecord] = useState(null);

  const columns = [
    {
      key: "select",
      header: "",
      cellClassName: "py-3 px-2 w-8",
      render: (record) => (
        <Checkbox
          className="rounded border-gray-300"
          aria-label={`تحديد ${record.name}`}
        />
      ),
    },
    {
      key: "employee",
      header: "الموظف",
      cellClassName: "py-3 px-2",
      render: (record) => (
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0",
              record.avatarBg,
              record.avatarColor
            )}
          >
            {record.photo ? (
              <img
                src={record.photo}
                alt={record.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              record.avatar
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-800 whitespace-nowrap">
              {record.name}
            </span>
            <span className="text-xs text-gray-400">{record.employeeCode}</span>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      header: "القسم",
      cellClassName: "py-3 px-2",
      render: (record) => (
        <Badge
          variant="secondary"
          className="rounded-md font-normal text-xs bg-gray-100 text-gray-700"
        >
          {record.department}
        </Badge>
      ),
    },
    {
      key: "date",
      header: "التاريخ",
      cellClassName: "py-3 px-2 text-sm text-gray-700 whitespace-nowrap",
      render: (record) => formatDate(record.date),
    },
    {
      key: "checkIn",
      header: "الحضور",
      cellClassName: "py-3 px-2 text-sm",
      render: (record) => {
        if (!record.checkIn || record.checkIn === "—") {
          return <span className="text-gray-400">—</span>;
        }
        const late = isLateCheckIn(record.checkIn);
        return (
          <span className={late ? "text-red-500 font-medium" : "text-gray-800"}>
            {record.checkIn}
          </span>
        );
      },
    },
    {
      key: "checkOut",
      header: "الانصراف",
      cellClassName: "py-3 px-2 text-sm text-gray-800",
      render: (record) => record.checkOut,
    },
    {
      key: "registrationMethod",
      header: "طريقة التسجيل",
      cellClassName: "py-3 px-2 text-sm text-gray-800 whitespace-nowrap",
      render: (record) => {
        const isOffNetwork = record.registrationMethod === "خارج الشبكة";
        if (!record.registrationMethod || record.registrationMethod === "—") {
          return <span className="text-gray-400">—</span>;
        }
        return (
          <button
            onClick={() => {
              if (isOffNetwork) setSelectedDetailsRecord(record);
            }}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              isOffNetwork
                ? "bg-[#FFF7F0] text-[#C0741F] hover:bg-[#FFEBD6] cursor-pointer"
                : "bg-[#ECFDED] text-[#1E9550] cursor-default"
            )}
          >
            {isOffNetwork ? (
              <WifiOff className="w-4 h-4" />
            ) : (
              <Wifi className="w-4 h-4" />
            )}
            <span>{record.registrationMethod}</span>
            {isOffNetwork && (
              <ChevronLeft className="w-3.5 h-3.5 opacity-70" />
            )}
          </button>
        );
      },
    },
    {
      key: "hoursWorked",
      header: "ساعات العمل",
      cellClassName: "py-3 px-2 text-sm text-gray-600 whitespace-nowrap",
      render: (record) =>
        record.hoursWorked && record.hoursWorked !== "—"
          ? `${record.hoursWorked} ساعات`
          : "—",
    },
    {
      key: "status",
      header: "الحالة",
      cellClassName: "py-3 px-2",
      render: (record) => (
        <StatusDropdown
          value={record.status}
          onChange={(newStatus) => onStatusChange?.(record.id, newStatus)}
          disabled={isChangingStatus}
        />
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        onRetry={onRetry}
        emptyMessage="لا توجد بيانات حضور مطابقة"
        skeletonRows={skeletonRows}
        renderSkeletonRow={() => <AttendanceRowSkeleton />}
        getRowKey={(record) => record.id}
        wrapperClassName="w-full overflow-x-auto rounded-lg"
        tableClassName="w-full text-sm text-right"
      />

      <RegistrationDetailsDialog
        isOpen={!!selectedDetailsRecord}
        onClose={() => setSelectedDetailsRecord(null)}
        record={selectedDetailsRecord}
      />
    </>
  );
}