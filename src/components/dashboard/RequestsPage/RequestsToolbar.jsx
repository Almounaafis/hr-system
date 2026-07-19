import { Search } from "lucide-react";
import { FormField, FormControl } from "@/components/ui/form-field";
import { FilterDropdown } from "@/components/dashboard/RequestsPage/FilterDropdown";
import { COLUMN_CONFIG, STATUS_LABELS } from "@/components/dashboard/RequestsPage/lib/constants";
import { DatePicker } from "@/shared/forms/DatePicker";

export const RequestsToolbar = ({
  searchQuery,
  setSearchQuery,
  filterDate,
  setFilterDate,
  filterType,
  setFilterType,
  filterDepartment,
  setFilterDepartment,
  filterStatus,
  setFilterStatus,
  allDepartments,
}) => {

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <FormField name="search" className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <FormControl
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث"
            className="pr-10 rounded-lg w-48"
          />
        </FormField>
        <DatePicker
          value={filterDate}
          onChange={setFilterDate}
          placeholder="اختر التاريخ"
        />
        <FilterDropdown
          label="نوع الطلب"
          value={filterType}
          onChange={setFilterType}
          options={[
            { value: "vacation", label: COLUMN_CONFIG.leave.label },
            { value: "advance", label: COLUMN_CONFIG.advance.label },
            { value: "bonus", label: COLUMN_CONFIG.reward.label },
            { value: "salary_increase", label: COLUMN_CONFIG.salaryIncrease.label },
            { value: "remote_work", label: COLUMN_CONFIG.remoteWork.label },
            { value: "permission", label: COLUMN_CONFIG.permission.label },
          ]}
        />
        <FilterDropdown
          label="القسم"
          value={filterDepartment}
          onChange={setFilterDepartment}
          options={allDepartments.map((d) => ({ value: d, label: d }))}
        />
        <FilterDropdown
          label="الحالة"
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: "pending", label: STATUS_LABELS.pending },
            { value: "approved", label: STATUS_LABELS.approved },
            { value: "rejected", label: STATUS_LABELS.rejected },
            { value: "cancelled", label: STATUS_LABELS.cancelled },
          ]}
        />
      </div>
    </div>
  );
};
