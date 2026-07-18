// ─── EmployeesGrid.jsx ────────────────────────────────────────────────────────
import EmployeeCard from "@/components/dashboard/Employees/EmployeeCard";
import { Loader2 } from "lucide-react";

export default function EmployeesGrid({ employees, isLoading, selectedIds, onToggleSelect, onOpen, onEdit, onDelete, onSchedule }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 sm:py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!employees.length) {
    return (
      <p className="py-12 sm:py-16 text-center text-xs sm:text-sm text-muted-foreground">
        لا توجد نتائج مطابقة للبحث
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {employees.map((emp) => (
        <EmployeeCard
          key={emp.id}
          employee={emp}
          selected={selectedIds.has(emp.id)}
          onToggleSelect={onToggleSelect}
          onOpen={() => onOpen(emp.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onSchedule={onSchedule}
        />
      ))}
    </div>
  );
}