import { memo } from "react";
import { Search, FileSpreadsheet, FileText, Mail, Loader2 } from "lucide-react";
import { FormField, FormControl } from "@/components/ui/form-field";
import FormInput from "@/components/shared/forms/FormInput";
import { Button } from "@/components/ui/button";
import { MONTH_OPTIONS } from "@/lib/constants";

export const TableToolbar = memo(function TableToolbar({
  searchValue,
  onSearchChange,
  monthValue,
  onMonthChange,
  statusValue,
  onStatusChange,
  onExportExcel,
  onExportPdf,
  onSendEmail,
  isExportingExcel,
  isExportingPdf,
  isSendingEmail,
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <FormField name="search" className="relative flex-1 min-w-[160px] max-w-xs">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground z-10" />
        <FormControl
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="بحث"
          className="text-xs border border-border rounded-lg pl-3 pr-9 py-2 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </FormField>

      <FormInput
        name="month"
        type="select"
        value={String(monthValue)}
        onChange={(e) => onMonthChange(e.target.value)}
        options={MONTH_OPTIONS}
        placeholder="اختر الشهر"
        className="min-w-[150px] bg-white"
      />

      <FormInput
        name="attendance_status"
        type="select"
        value={statusValue || "all"}
        onChange={(e) => {
          const newStatus = e.target.value === "all" ? "" : e.target.value;
          onStatusChange(newStatus);
        }}
        options={[
          { value: "all", label: "كل الحالات" },
          { value: "present", label: "حاضر" },
          { value: "late", label: "متأخر" },
          { value: "absent", label: "غياب" },
          { value: "remote", label: "عمل عن بعد" },
          { value: "vacation", label: "إجازة" },
          { value: "permission", label: "إذن" },
        ]}
        placeholder="كل الحالات"
        className="min-w-[150px]"
      />

      {onExportExcel && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onExportExcel}
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
      )}

      {onExportPdf && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onExportPdf}
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
      )}

      {onSendEmail && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSendEmail}
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
      )}
    </div>
  );
});
