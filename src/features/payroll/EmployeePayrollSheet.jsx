import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FileText } from "lucide-react";
import { PayrollDetails } from "./PayrollDetails";

export function EmployeePayrollSheet({ open, onOpenChange, selectedEmployee, month, year, onUpdateSalary, isUpdatingSalary }) {
  const imgBase =
    import.meta.env.VITE_API_BASE_URL ??
    import.meta.env.VITE_API_URL?.replace("/api", "") ??
    "";

  const row = selectedEmployee ?? {};
  const emp = row.employee ?? {};

  const profileSrc = emp.profile_image_url
    ? `${imgBase}${emp.profile_image_url}`
    : `https://i.pravatar.cc/150?u=${emp.id}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="left">
      <SheetContent className="!max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-500" />
            تفاصيل الراتب
          </SheetTitle>
        </SheetHeader>

        {selectedEmployee && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <img
                src={profileSrc}
                alt={emp.name}
                className="h-16 w-16 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src = `https://i.pravatar.cc/150?u=${emp.id}`;
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-primary truncate">
                  {emp.name ?? "—"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {emp.department ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  كود الموظف: {emp.employee_code ?? "—"}
                </p>
              </div>
            </div>
            <PayrollDetails employee={selectedEmployee} initialMonth={month} initialYear={year} onUpdateSalary={onUpdateSalary} isUpdatingSalary={isUpdatingSalary} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}