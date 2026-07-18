import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import FormInput from "@/shared/forms/FormInput";
import { Info } from "lucide-react";
import { useGeneratePayroll } from "@/hooks/usePayroll";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useCrud } from "@/hooks/useCrud";
import { MONTH_OPTIONS } from "@/lib/constants";

 
export function CreatePayrollDialog({ open, onOpenChange }) {
  const { generatePayroll, isGenerating } = useGeneratePayroll();
  const { data: departments = [], isLoading: isLoadingDepartments } = useCrud({ queryKey: "departments", endpoint: "/departments" });
  const { data: branches    = [], isLoading: isLoadingBranches } = useCrud({ queryKey: "branches",    endpoint: "/branches"    });

  // Dynamic years: current year and previous 3 years
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 4; i++) {
      const year = currentYear - i;
      years.push({ value: year, label: String(year) });
    }
    return years;
  }, []);

  // Dynamic months: from January to current month
  const monthOptions = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    return MONTH_OPTIONS.slice(0, currentMonth);
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(monthOptions[monthOptions.length - 1]?.value || 7);
  const [selectedYear, setSelectedYear] = useState(yearOptions[0]?.value || new Date().getFullYear());
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const handleSubmit = async () => {
    if (!selectedMonth || !selectedYear) {
      toast.error("يرجى اختيار الشهر والسنة");
      return;
    }

    const payload = {
      month: selectedMonth,
      year: selectedYear,
    };

    // Only add department if not "all" (optional field)
    if (selectedDepartment && selectedDepartment !== "all") {
      payload.department = selectedDepartment;
    }

    try {
      await generatePayroll(payload);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to generate payroll:", error);
    }
  };

const departmentOptions = useMemo(
  () => (departments ?? []).map((dept) => ({ value: dept, label: dept })),
  [departments]
);

const branchOptions = useMemo(
  () => (branches ?? []).map((branch) => ({ value: branch, label: branch })),
  [branches]
);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-md md:text-xl font-bold">انشاء كشف رواتب</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <FormInput
            name="year"
            type="select"
            label="السنة"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-[12px] md:text-md"
            options={yearOptions}
          />

          <FormInput
            name="month"
            type="select"
            label="الشهر"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="text-[12px] md:text-md"
            options={monthOptions}
          />

          <FormInput
            name="department"
            type="select"
            label="القسم (اختياري)"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="text-[12px] md:text-md"
            options={departmentOptions}
            disabled={isLoadingDepartments}
          />

          <FormInput
            name="branch"
            type="select"
            label="الفرع"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="text-[12px] md:text-md"
            options={branchOptions}
            disabled={isLoadingBranches}
          />

          <div className="flex items-start gap-2 p-2 md:p-3 bg-blue-50 rounded-md  md:rounded-lg">
            <Info className=" h-3 md:h-5  w-3 md:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] md:text-sm text-blue-700">سيتم تطبيق نظام الخصومات المحدد في اعدادات الرواتب</p>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-white text-[12px] md:text-md py-2"
            onClick={handleSubmit}
            disabled={isGenerating}
          >
            {isGenerating ? "جاري الإنشاء..." : "إنشاء"}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 text-[12px] md:text-md py-2"
            disabled={isGenerating}
          >
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
