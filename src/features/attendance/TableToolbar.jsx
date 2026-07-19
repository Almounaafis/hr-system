import { memo } from "react";
import { Search } from "lucide-react";
import { FormField, FormControl } from "@/components/ui/form-field";
import FormInput from "@/components/shared/forms/FormInput";
import { MONTH_OPTIONS } from "@/lib/constants";

export const TableToolbar = memo(function TableToolbar({
  searchValue,
  onSearchChange,
  monthValue,
  onMonthChange,
  statusValue,
  onStatusChange,
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
    </div>
  );
});
