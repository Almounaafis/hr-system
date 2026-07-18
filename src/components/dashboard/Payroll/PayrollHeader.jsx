import { Plus, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormInput from "@/shared/forms/FormInput";
import { useMemo } from "react";
import { useExportPayroll } from "@/hooks/usePayroll";

export function PayrollHeader({
  headerMonth,
  setHeaderMonth,
  onCreatePayroll,
  exportMonth,
  exportYear,
}) {
  // headerMonth is now actually the year (string like "2026")
  // setHeaderMonth is now setHeaderYear
  const { exportPayroll, isExportingPdf, isExportingExcel } = useExportPayroll();

  // Dynamic years: current year and previous 3 years
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 4; i++) {
      const year = currentYear - i;
      years.push({ value: String(year), label: String(year) });
    }
    return years;
  }, []);

  const handleExport = (format) => {
    if (!exportMonth || !exportYear) return;
    exportPayroll({ month: exportMonth, year: exportYear, format });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">

      {/* TITLE */}
      <h1 className="text-xl sm:text-2xl font-bold text-foreground">
        الرواتب
      </h1>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">

        {/* SELECT - YEARS ONLY */}
        <div className="w-full sm:w-[160px]">
          <FormInput
            name="headerYear"
            type="select"
            value={headerMonth}
            onChange={(e) => setHeaderMonth(e.target.value)}
            className="w-full rounded-xl border-border bg-background text-base"
            options={yearOptions}
          />
        </div>

        {/* EXPORT EXCEL */}
        <Button
          variant="outline"
          onClick={() => handleExport("excel")}
          disabled={isExportingExcel}
          className="w-full sm:w-auto h-10 px-4 text-sm font-medium rounded-xl flex items-center justify-center gap-2"
        >
          {isExportingExcel ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
          )}
          Excel
        </Button>

        {/* EXPORT PDF */}
        <Button
          variant="outline"
          onClick={() => handleExport("pdf")}
          disabled={isExportingPdf}
          className="w-full sm:w-auto h-10 px-4 text-sm font-medium rounded-xl flex items-center justify-center gap-2"
        >
          {isExportingPdf ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 text-red-500" />
          )}
          PDF
        </Button>

        {/* CREATE BUTTON */}
        <Button
          onClick={onCreatePayroll}
          className="w-full sm:w-auto bg-primary h-10 px-6 text-sm font-medium hover:bg-primary/90 text-white flex items-center justify-center gap-2 rounded-xl"
        >
          <Plus className="h-5 w-5" />
          انشاء كشف رواتب
        </Button>
      </div>
    </div>
  );
}