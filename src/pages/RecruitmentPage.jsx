// @/features/recruitment/RecruitmentPage.jsx
import { useState } from "react";
import { Plus, Search, Briefcase, FileText, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormControl } from "@/components/ui/form-field";
import Pagination from "@/components/shared/Pagination";
import { FilterDropdown } from "@/features/requests/FilterDropdown";
import { DateInput } from "@/components/ui/date-input";
import logger from "@/lib/logger";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

// --- Hooks ---
import { usePositions } from "@/features/recruitment/hooks/usePositions";
import { useApplications } from "@/features/recruitment/hooks/useApplications";
import { useInterviews } from "@/features/recruitment/hooks/useInterviews";

// --- Components ---
import PositionsTable from "@/features/recruitment/PositionsTable";
import PositionModal from "@/features/recruitment/PositionModal";
import ApplyPositionModal from "@/features/recruitment/ApplyPositionModal";
import ApplicationsTable from "@/features/recruitment/ApplicationsTable";
import ApplicationDetailSheet from "@/features/recruitment/ApplicationDetailSheet";
import InterviewsTable from "@/features/recruitment/InterviewsTable";
import InterviewDetailSheet from "@/features/recruitment/InterviewDetailSheet";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

export default function RecruitmentPage() {
  // ─── Active Tab State ────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("positions"); // 'positions' | 'applications' | 'interviews'

  // ─── Shared Filters / Pagination State ───────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [debounce] = useDebouncedCallback((val) => {
    setDebouncedSearch(val);
    setCurrentPage(1);
  }, 500);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debounce(e.target.value);
  };

  // Tab-specific Filters
  const [filterPosition, setFilterPosition] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setDebouncedSearch("");
    setFilterPosition("all");
    setFilterStatus("all");
    setFilterFromDate("");
    setFilterToDate("");
    setCurrentPage(1);
  };

  // ─── 1. Positions Data & Actions ─────────────────────────────────────────────
  const { 
    positions, 
    isLoading: isLoadingPositions, 
    isError: isErrorPositions, 
    refetch: refetchPositions, 
    createPosition, 
    updatePosition, 
    deletePosition, 
    creating, 
    updating, 
    deleting 
  } = usePositions();

  const filteredPositions = positions.filter(p => 
    p.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
    p.department?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [applyPositionId, setApplyPositionId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSavePosition = async (values) => {
    try {
      const processedData = {
        ...values,
        custom_fields: values.custom_fields?.map(f => ({
          ...f,
          options: typeof f.options_text === "string" 
            ? f.options_text.split(",").map(s => s.trim()).filter(Boolean) 
            : f.options || []
        }))
      };
      if (editingPosition) {
        await updatePosition(editingPosition.id, processedData);
      } else {
        await createPosition(processedData);
      }
      setIsPositionModalOpen(false);
    } catch (error) {
      logger.error("Error saving position:", error);
    }
  };

  // ─── 2. Applications Data & Actions ──────────────────────────────────────────
  const { 
    applications, 
    pagination: appPagination, 
    isLoading: isLoadingApps, 
    isError: isErrorApps, 
    refetch: refetchApps 
  } = useApplications({
    position_id: filterPosition !== "all" ? filterPosition : undefined,
    status: filterStatus !== "all" ? filterStatus : undefined,
    search: debouncedSearch || undefined,
    page: currentPage,
    limit,
  });

  const [selectedAppId, setSelectedAppId] = useState(null);

  const positionOptions = [
    { value: "all", label: "كل الوظائف" },
    ...positions.map(p => ({ value: p.id, label: p.title }))
  ];

  // ─── 3. Interviews Data & Actions ────────────────────────────────────────────
  const { 
    interviews, 
    isLoading: isLoadingInterviews, 
    isError: isErrorInterviews, 
    refetch: refetchInterviews 
  } = useInterviews({
    status: filterStatus !== "all" ? filterStatus : undefined,
    from_date: filterFromDate || undefined,
    to_date: filterToDate || undefined,
    search: debouncedSearch || undefined,
  });

  const [selectedInterview, setSelectedInterview] = useState(null);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" className="space-y-6 p-2 sm:p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">إدارة التوظيف</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إدارة الوظائف، طلبات المتقدمين، وجدولة المقابلات.
          </p>
        </div>
        
        {/* Main Action Button (Dynamic) */}
        {activeTab === "positions" && (
          <Button onClick={() => { setEditingPosition(null); setIsPositionModalOpen(true); }} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> إضافة وظيفة
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => handleTabChange("positions")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === "positions" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Briefcase className="h-4 w-4" /> الوظائف
        </button>
        <button
          onClick={() => handleTabChange("applications")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === "applications" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <FileText className="h-4 w-4" /> طلبات التوظيف
        </button>
        <button
          onClick={() => handleTabChange("interviews")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === "interviews" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <CalendarDays className="h-4 w-4" /> المقابلات
        </button>
      </div>

      {/* Content */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-6">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              {activeTab === "positions" && "قائمة الوظائف"}
              {activeTab === "applications" && "الطلبات"}
              {activeTab === "interviews" && "المقابلات"}
            </h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
              {activeTab === "positions" && (isLoadingPositions ? "—" : filteredPositions.length)}
              {activeTab === "applications" && (isLoadingApps ? "—" : appPagination.total)}
              {activeTab === "interviews" && (isLoadingInterviews ? "—" : interviews.length)}
            </span>
          </div>

          {/* Filters (Dynamic per Tab) */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            
            {/* Common Search Input (Except for Interviews sometimes, but we can keep it) */}
            <FormField name="search" className="relative flex-1 min-w-[200px] sm:w-56">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <FormControl
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={activeTab === "interviews" ? "بحث..." : "بحث بالاسم أو القسم..."}
                className="pr-10 rounded-lg bg-background"
              />
            </FormField>

            {/* Applications specific filters */}
            {activeTab === "applications" && (
              <>
                <FilterDropdown
                  label="الوظيفة"
                  value={filterPosition}
                  onChange={(val) => { setFilterPosition(val); setCurrentPage(1); }}
                  options={positionOptions}
                />
                <FilterDropdown
                  label="الحالة"
                  value={filterStatus}
                  onChange={(val) => { setFilterStatus(val); setCurrentPage(1); }}
                  options={[
                    { value: "all", label: "كل الحالات" },
                    { value: "applied", label: "جديد" },
                    { value: "accepted", label: "مقبول" },
                    { value: "rejected", label: "مرفوض" },
                  ]}
                />
              </>
            )}

            {/* Interviews specific filters */}
            {activeTab === "interviews" && (
              <>
                <DateInput
                  placeholder="من تاريخ"
                  value={filterFromDate}
                  onChange={e => { setFilterFromDate(e.target.value); setCurrentPage(1); }}
                  className="w-auto"
                />
                <DateInput
                  placeholder="إلى تاريخ"
                  value={filterToDate}
                  onChange={e => { setFilterToDate(e.target.value); setCurrentPage(1); }}
                  className="w-auto"
                />
                <FilterDropdown
                  label="الحالة"
                  value={filterStatus}
                  onChange={(val) => { setFilterStatus(val); setCurrentPage(1); }}
                  options={[
                    { value: "all", label: "كل الحالات" },
                    { value: "scheduled", label: "مجدولة" },
                    { value: "completed", label: "مكتملة" },
                    { value: "cancelled", label: "ملغاة" },
                  ]}
                />
              </>
            )}
          </div>
        </div>

        {/* Tables Area */}
        {activeTab === "positions" && (
          <PositionsTable
            positions={filteredPositions}
            isLoading={isLoadingPositions}
            isError={isErrorPositions}
            onEdit={(pos) => { setEditingPosition(pos); setIsPositionModalOpen(true); }}
            onDelete={setDeleteTarget}
            onView={(pos) => setApplyPositionId(pos.id)}
            onRetry={refetchPositions}
            skeletonRows={limit}
          />
        )}

        {activeTab === "applications" && (
          <>
            <ApplicationsTable
              applications={applications}
              isLoading={isLoadingApps}
              isError={isErrorApps}
              onView={(id) => setSelectedAppId(id)}
              onRetry={refetchApps}
              skeletonRows={limit}
            />
            {appPagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center sm:justify-end">
                <Pagination
                  currentPage={currentPage}
                  totalPages={appPagination.totalPages}
                  totalRecords={appPagination.total}
                  pageSize={limit}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}

        {activeTab === "interviews" && (
          <InterviewsTable
            interviews={interviews}
            isLoading={isLoadingInterviews}
            isError={isErrorInterviews}
            onView={setSelectedInterview}
            onRetry={refetchInterviews}
            skeletonRows={limit}
          />
        )}
      </div>

      {/* ─── Modals & Sheets ─────────────────────────────────────────────────── */}

      {/* Position Modal */}
      <PositionModal
        open={isPositionModalOpen}
        onClose={() => setIsPositionModalOpen(false)}
        onSubmit={handleSavePosition}
        editingPosition={editingPosition}
        submitting={creating || updating}
      />

      {/* Apply Public Modal */}
      <ApplyPositionModal
        open={!!applyPositionId}
        onClose={() => setApplyPositionId(null)}
        positionId={applyPositionId}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deletePosition(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="حذف الوظيفة"
        description={`هل أنت متأكد من حذف وظيفة "${deleteTarget?.title}"؟`}
        confirmText="حذف"
        isLoading={deleting}
      />

      {/* Application Details Sheet */}
      <ApplicationDetailSheet
        applicationId={selectedAppId}
        onClose={() => setSelectedAppId(null)}
      />

      {/* Interview Details Sheet */}
      <InterviewDetailSheet
        interview={selectedInterview}
        onClose={() => setSelectedInterview(null)}
      />
    </div>
  );
}