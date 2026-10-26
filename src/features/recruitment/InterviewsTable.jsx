// @/features/recruitment/InterviewsTable.jsx
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import { Eye, Calendar } from "lucide-react";
import DataTable from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InterviewRowSkeleton } from "./InterviewsSkeletons";
import { getInitials } from "../companies/helpers";

function formatDateTime(date, startTime) {
  if (!date) return "—";
  try {
    const d = parseISO(date);
    const dateStr = format(d, "d MMM yyyy", { locale: arSA });
    return `${dateStr} - ${startTime?.substring(0, 5) || ""}`;
  } catch {
    return date;
  }
}

const STATUS_COLORS = {
  scheduled: "bg-blue-50 text-blue-600",
  completed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
  no_show: "bg-gray-100 text-gray-600",
};

export default function InterviewsTable({
  interviews = [],
  isLoading,
  isError,
  onView,
  onRetry,
  skeletonRows = 5,
}) {
  const columns = [
    {
      key: "applicant",
      header: "المتقدم",
      render: (int) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
            {getInitials(int.applicant_name)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground text-xs sm:text-sm truncate">
              {int.applicant_name}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              {int.position_title}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "stage",
      header: "المرحلة",
      render: (int) => (
        <span className="text-xs sm:text-sm text-foreground capitalize">
          {int.stage_name}
        </span>
      ),
    },
    {
      key: "datetime",
      header: "الموعد",
      render: (int) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
          <Calendar className="h-3.5 w-3.5" />
          {formatDateTime(int.interview_date, int.start_time)}
        </span>
      ),
    },
    {
      key: "interviewer",
      header: "المقابل",
      render: (int) => (
        <span className="text-xs text-muted-foreground">
          {int.interviewer_name || "غير محدد"}
        </span>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (int) => (
        <Badge variant="secondary" className={`rounded-full text-[10px] ${STATUS_COLORS[int.status] || "bg-muted"}`}>
          {int.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      cellClassName: "text-left",
      render: (int) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(int)}
            className="h-8 gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
          >
            <Eye className="h-3.5 w-3.5" />
            عرض / تقييم
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={interviews}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyMessage="لا توجد مقابلات مجدولة"
      skeletonRows={skeletonRows}
      renderSkeletonRow={() => <InterviewRowSkeleton />}
      getRowKey={(int) => int.id}
    />
  );
}