// @/features/trainees/TraineesTable.jsx
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import { Eye, Phone } from "lucide-react";
import DataTable from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "../companies/helpers";

function formatDate(value) {
  if (!value) return "—";
  try { return format(parseISO(value), "d MMM yyyy", { locale: arSA }); } 
  catch { return value; }
}

export default function TraineesTable({ trainees = [], isLoading, isError, onView, onRetry, skeletonRows = 10 }) {
  const columns = [
    {
      key: "name",
      header: "المتدرب",
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
            {getInitials(t.full_name)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground text-xs sm:text-sm truncate">{t.full_name}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{t.position || "—"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "التواصل",
      render: (t) => (
        <div className="space-y-1 text-xs text-muted-foreground">
          {t.phone && <span className="flex items-center gap-1.5" dir="ltr"><Phone className="h-3 w-3" /> {t.phone}</span>}
          <span>{t.email || "—"}</span>
        </div>
      ),
    },
    {
      key: "duration",
      header: "فترة التدريب",
      render: (t) => (
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          <p>{formatDate(t.start_date)}</p>
          <p>{formatDate(t.end_date)}</p>
        </div>
      ),
    },
    {
      key: "stipend",
      header: "المكافأة",
      render: (t) => <span className="text-xs font-medium">{t.monthly_stipend ? `${t.monthly_stipend} EGP` : "—"}</span>,
    },
    {
      key: "status",
      header: "الحالة",
      render: (t) => (
        <Badge variant="secondary" className={`rounded-full text-[10px] ${t.status === "converted_to_employee" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
          {t.status === "converted_to_employee" ? "موظف" : "متدرب"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      cellClassName: "text-left",
      render: (t) => (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => onView(t.id)} className="h-8 gap-1.5 text-primary">
            <Eye className="h-3.5 w-3.5" /> عرض
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={trainees}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyMessage="لا يوجد متدربين مسجلين"
      skeletonRows={skeletonRows}
      getRowKey={(t) => t.id}
    />
  );
}