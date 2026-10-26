// @/features/recruitment/ApplicationsTable.jsx
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import { Eye } from "lucide-react";
import DataTable from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplicationRowSkeleton } from "./ApplicationsSkeletons";
import { getInitials } from "../companies/helpers";

function formatDate(value) {
  if (!value) return "—";
  try {
    return format(parseISO(value), "d MMM yyyy", { locale: arSA });
  } catch {
    return value;
  }
}

const STATUS_MAP = {
  applied: { label: "جديد", color: "bg-blue-50 text-blue-600" },
  accepted: { label: "مقبول", color: "bg-emerald-50 text-emerald-600" },
  rejected: { label: "مرفوض", color: "bg-red-50 text-red-600" },
  interviewing: { label: "مقابلة", color: "bg-amber-50 text-amber-600" },
};

export default function ApplicationsTable({
  applications = [],
  isLoading,
  isError,
  onView,
  onRetry,
  skeletonRows = 5,
}) {
  const columns = [
    /* ── Applicant ── */
    {
      key: "applicant",
      header: "المتقدم",
      render: (app) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
            {getInitials(app.full_name)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground text-xs sm:text-sm truncate">
              {app.full_name}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              {app.email}
            </p>
          </div>
        </div>
      ),
    },

    /* ── Position ── */
    {
      key: "position",
      header: "الوظيفة",
      render: (app) => (
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-foreground truncate">
            {app.position_title}
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
            {app.position_department}
          </p>
        </div>
      ),
    },

    /* ── Score ── */
    {
      key: "qualification_score",
      header: "الدرجة",
      cellClassName: "text-center",
      render: (app) => (
        <span className="inline-flex items-center justify-center h-6 w-8 rounded bg-muted text-xs font-semibold text-foreground">
          {app.qualification_score || 0}
        </span>
      ),
    },

    /* ── Status ── */
    {
      key: "status",
      header: "الحالة",
      render: (app) => {
        const s = STATUS_MAP[app.status] || { label: app.status, color: "bg-muted" };
        return (
          <Badge variant="secondary" className={`rounded-full text-[10px] ${s.color}`}>
            {s.label}
          </Badge>
        );
      },
    },

    /* ── Date ── */
    {
      key: "created_at",
      header: "تاريخ التقديم",
      render: (app) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(app.created_at)}
        </span>
      ),
    },

    /* ── Actions ── */
    {
      key: "actions",
      header: "الإجراءات",
      cellClassName: "text-left",
      render: (app) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(app.id)}
            className="h-8 gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
          >
            <Eye className="h-3.5 w-3.5" />
            عرض
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={applications}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyMessage="لا توجد طلبات توظيف مطابقة"
      skeletonRows={skeletonRows}
      renderSkeletonRow={() => <ApplicationRowSkeleton />}
      getRowKey={(app) => app.id}
    />
  );
}