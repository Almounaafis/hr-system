// @/features/recruitment/InterviewsPage.jsx
import { useState } from "react";
import { FilterDropdown } from "@/features/requests/FilterDropdown";
import { DateInput } from "@/components/ui/date-input";
import { useInterviews } from "@/features/recruitment/hooks/useInterviews";
import InterviewsTable from "../features/recruitment/InterviewsTable";
import InterviewDetailSheet from "../features/recruitment/InterviewDetailSheet";


export default function InterviewsPage() {
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { interviews, isLoading, isError, refetch } = useInterviews({
    status: status !== "all" ? status : undefined,
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
  });

  const [selectedInterview, setSelectedInterview] = useState(null);

  return (
    <div dir="rtl" className="space-y-6 p-2 sm:p-1">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">جدول المقابلات</h1>
        <p className="text-sm text-muted-foreground mt-1">إدارة وتقييم المقابلات المجدولة.</p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">المقابلات</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
              {isLoading || isError ? "—" : interviews.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <DateInput
              placeholder="من تاريخ"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="w-auto"
            />
            <DateInput
              placeholder="إلى تاريخ"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="w-auto"
            />
            <FilterDropdown
              label="الحالة"
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "كل الحالات" },
                { value: "scheduled", label: "مجدولة" },
                { value: "completed", label: "مكتملة" },
                { value: "cancelled", label: "ملغاة" },
              ]}
            />
          </div>
        </div>

        <InterviewsTable
          interviews={interviews}
          isLoading={isLoading}
          isError={isError}
          onView={setSelectedInterview}
          onRetry={refetch}
          skeletonRows={5}
        />
      </div>

      <InterviewDetailSheet
        interview={selectedInterview}
        onClose={() => setSelectedInterview(null)}
      />
    </div>
  );
}