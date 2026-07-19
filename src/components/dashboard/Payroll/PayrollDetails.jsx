import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Send, Download, Loader2, Edit2, Check, X } from "lucide-react";
import { SalaryBreakdownCard } from "./SalaryBreakdownCard";
import toast from "react-hot-toast";
import { useEmployeePayrollDetails, useDownloadPayrollSlip, useSendPayrollSlip } from "@/components/dashboard/Payroll/hooks/usePayroll";
import FormInput from "@/shared/forms/FormInput";
import { MONTH_OPTIONS } from "@/lib/constants";

function getYearOptions(currentYear, span = 5) {
  return Array.from({ length: span }, (_, i) => {
    const y = currentYear - i;
    return { value: String(y), label: String(y) };
  });
}

export function PayrollDetails({ employee, initialMonth, initialYear, className, onUpdateSalary, isUpdatingSalary }) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [selectedMonth, setSelectedMonth] = useState(initialMonth ?? currentMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear ?? currentYear);
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [editedSalary, setEditedSalary] = useState("");

  const yearOptions = useMemo(() => getYearOptions(currentYear), [currentYear]);

  const maxMonth = Number(selectedYear) === currentYear ? currentMonth : 12;

  const monthOptions = useMemo(
    () => MONTH_OPTIONS.slice(0, maxMonth),
    [maxMonth]
  );

  const effectiveMonth = Math.min(Number(selectedMonth), maxMonth);

  const employeeUserId = employee?.employee?.id ?? employee?.user_id ?? employee?.id;

  const { details, isLoading } = useEmployeePayrollDetails({
    employeeId: employeeUserId,
    month: effectiveMonth,
    year: selectedYear,
  });

  const { downloadPayrollSlip, isDownloading } = useDownloadPayrollSlip();
  const { sendPayrollSlip, isSending } = useSendPayrollSlip();

  const d = details ?? {};
  const lineItems = d.line_items ?? [];

  const deductionItems = lineItems
    .filter((item) => item.item_type === "deduction")
    .map((item) => ({
      reason: item.label,
      amount: item.amount,
      category: item.category,
      quantity: item.quantity,
    }));

  const basicSalaryItem = lineItems.find(
    (item) => item.item_type === "earning" && item.category === "basic_salary"
  );
  const basicSalary = basicSalaryItem
    ? basicSalaryItem.amount
    : (d.basic_salary ?? employee?.basic_salary ?? 0);

  const earningItems = lineItems
    .filter((item) => item.item_type === "earning" && item.category !== "basic_salary")
    .map((item) => ({
      reason: item.label,
      amount: item.amount,
      category: item.category,
      quantity: item.quantity,
    }));

  const breakdown = {
    basic: basicSalary,
    total_earnings: d.total_earnings ? Number(d.total_earnings) : 0,
    total_deductions: d.total_deductions ? Number(d.total_deductions) : 0,
    net: d.net_salary ? Number(d.net_salary) : 0,
    deduction_items: deductionItems.length > 0 ? deductionItems : null,
    bonus_items: earningItems.length > 0 ? earningItems : null,
  };

  const payrollId = details?.id;
  const isFinalized = d.status === "finalized";

  const handleEditSalary = () => {
    setEditedSalary(String(basicSalary));
    setIsEditingSalary(true);
  };

  const handleSaveSalary = async () => {
    if (!onUpdateSalary) return;
    await onUpdateSalary(employee?.user_id, editedSalary);
    setIsEditingSalary(false);
  };

  const handleCancelSalary = () => {
    setIsEditingSalary(false);
    setEditedSalary("");
  };
  const handleSend = () => {
    if (!payrollId) {
      toast.error("لا يمكن العثور على معرف كشف الراتب");
      return;
    }
    sendPayrollSlip(payrollId);
  };

  const handleDownload = () => {
    if (!payrollId) {
      toast.error("لا يمكن العثور على معرف كشف الراتب");
      return;
    }
    downloadPayrollSlip(payrollId);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <FormInput
          name="selectedMonth"
          type="select"
          value={String(effectiveMonth)}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="w-[140px] rounded-xl border-gray-200 focus:bg-primary/5 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
          options={monthOptions}
        />
        <FormInput
          name="selectedYear"
          type="select"
          value={String(selectedYear)}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="w-[110px] rounded-xl border-gray-200 focus:bg-primary/5 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
          options={yearOptions}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10 gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">جاري تحميل التفاصيل...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground mb-1">الراتب الأساسي</p>
              {isEditingSalary ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editedSalary}
                    onChange={(e) => setEditedSalary(e.target.value)}
                    className="w-32 px-3 py-2 border rounded-lg"
                    disabled={isUpdatingSalary}
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveSalary}
                    disabled={isUpdatingSalary}
                    className="h-8 px-2"
                  >
                    {isUpdatingSalary ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelSalary}
                    disabled={isUpdatingSalary}
                    className="h-8 px-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-primary">{basicSalary.toLocaleString()} ج.م</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleEditSalary}
                    disabled={isFinalized}
                    className="h-8 w-8 p-0"
                    title={isFinalized ? "لا يمكن تعديل الراتب بعد استلامه" : "تعديل الراتب"}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {isFinalized && (
                <p className="text-xs text-muted-foreground mt-1">
                  تم استلام الراتب - التعديلات تنطبق على الأشهر القادمة فقط
                </p>
              )}
            </div>
          </div>
          <SalaryBreakdownCard breakdown={breakdown} className={className} />
        </>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          className="flex-1 flex h-12 items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white"
          onClick={handleSend}
          disabled={isSending}
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          ارسال الكشف للموظف
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-12 flex items-center justify-center gap-2"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          تحميل PDF
        </Button>
      </div>
    </div>
  );
}
