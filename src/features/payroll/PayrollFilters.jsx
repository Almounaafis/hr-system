import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/forms/FormInput";

const ALL_MONTHS = [
  { value: "january", label: "يناير" },
  { value: "february", label: "فبراير" },
  { value: "march", label: "مارس" },
  { value: "april", label: "أبريل" },
  { value: "may", label: "مايو" },
  { value: "june", label: "يونيو" },
  { value: "july", label: "يوليو" },
  { value: "august", label: "أغسطس" },
  { value: "september", label: "سبتمبر" },
  { value: "october", label: "أكتوبر" },
  { value: "november", label: "نوفمبر" },
  { value: "december", label: "ديسمبر" },
];

export function PayrollFilters({
  searchQuery,
  setSearchQuery,
  filterDate,
  setFilterDate,
  selectedCount,
  onAddDeduction,
  onAddAllowance,
}) {
  // من يناير لحد الشهر الحالي بس (مثلاً لو دلوقتي يوليو، بيرجع أول 7 شهور)
  const monthOptions = useMemo(() => {
    const currentMonthIndex = new Date().getMonth(); // 0 = يناير ... 6 = يوليو
    return ALL_MONTHS.slice(0, currentMonthIndex + 1);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4 justify-between">
      <FormInput
        name="search"
        type="text"
        placeholder="بحث"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 min-w-[200px] rounded-xl border-gray-200"
      />

      <FormInput
        name="filterDate"
        type="select"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="w-[140px] rounded-xl border-gray-200 focus:bg-primary/5 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
        options={monthOptions}
      />


      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            تم تحديد {selectedCount} موظف
          </span>
          <Button size="sm" variant="outline" onClick={onAddDeduction}>
            إضافة خصم
          </Button>
          <Button size="sm" onClick={onAddAllowance}>
            إضافة مكافأة
          </Button>
        </div>
      )}
    </div>
  );
}