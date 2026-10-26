// @/features/recruitment/ApplicationsPage.jsx
import { useState } from "react";
import { Search } from "lucide-react";
import { FormField, FormControl } from "@/components/ui/form-field";
import { FilterDropdown } from "@/features/requests/FilterDropdown";
import Pagination from "@/components/shared/Pagination";
import { useApplications } from "@/features/recruitment/hooks/useApplications";
import { usePositions } from "@/features/recruitment/hooks/usePositions"; 
import ApplicationDetailSheet from "@/features/recruitment/ApplicationDetailSheet";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import ApplicationsTable from "@/features/recruitment/ApplicationsTable";

export default function ApplicationsPage() {
  // 1. State for filters & pagination
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // 2. Fetch Positions for the filter dropdown
  const { positions } = usePositions();
  const positionOptions = [
    { value: "all", label: "كل الوظائف" },
    ...positions.map(p => ({ value: p.id, label: p.title }))
  ];

  // 3. Debounce search
  const [debounce] = useDebouncedCallback((val) => {
    setDebouncedSearch(val);
    setCurrentPage(1);
  }, 500);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debounce(e.target.value);
  };

  // 4. Fetch Applications
  const { 
    applications, 
    pagination, 
    isLoading, 
    isError, 
    refetch 
  } = useApplications({
    position_id: selectedPosition !== "all" ? selectedPosition : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    search: debouncedSearch || undefined,
    page: currentPage,
    limit,
  });

  // 5. Selected Application for Details Sheet
  const [selectedAppId, setSelectedAppId] = useState(null);

  return (
    <div dir="rtl" className="space-y-6 p-2 sm:p-1">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">طلبات التوظيف</h1>
        <p className="text-sm text-muted-foreground mt-1">
          مراجعة وتقييم المتقدمين للوظائف الشاغرة.
        </p>
      </div>

      {/* Content */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-6">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">الطلبات</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
              {isLoading || isError ? "—" : pagination.total}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <FormField name="search" className="relative flex-1 min-w-[200px] sm:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <FormControl
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="بحث بالاسم أو الإيميل..."
                className="pr-10 rounded-lg bg-background"
              />
            </FormField>

            <FilterDropdown
              label="الوظيفة"
              value={selectedPosition}
              onChange={(val) => { setSelectedPosition(val); setCurrentPage(1); }}
              options={positionOptions}
            />

            <FilterDropdown
              label="الحالة"
              value={selectedStatus}
              onChange={(val) => { setSelectedStatus(val); setCurrentPage(1); }}
              options={[
                { value: "all", label: "كل الحالات" },
                { value: "applied", label: "جديد" },
                { value: "accepted", label: "مقبول" },
                { value: "rejected", label: "مرفوض" },
              ]}
            />
          </div>
        </div>

        {/* Table */}
        <ApplicationsTable
          applications={applications}
          isLoading={isLoading}
          isError={isError}
          onView={(id) => setSelectedAppId(id)}
          onRetry={refetch}
          skeletonRows={limit}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center sm:justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalRecords={pagination.total}
              pageSize={limit}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Details & Actions Sheet */}
      <ApplicationDetailSheet
        applicationId={selectedAppId}
        onClose={() => setSelectedAppId(null)}
      />
    </div>
  );
}