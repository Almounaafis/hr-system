// @/features/custodies/CustodyTable.jsx
import DataTable from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2, Laptop, Smartphone, Package } from "lucide-react";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";

const CATEGORY_ICONS = { laptop: Laptop, phone: Smartphone, default: Package };
const STATUS_COLORS = {
  available: "bg-emerald-50 text-emerald-600 border border-emerald-200/50",
  assigned: "bg-blue-50 text-blue-600 border border-blue-200/50",
  maintenance: "bg-amber-50 text-amber-600 border border-amber-200/50",
  damaged: "bg-red-50 text-red-600 border border-red-200/50",
};

const STATUS_LABELS = {
  available: "متاح",
  assigned: "مُعين",
  maintenance: "صيانة",
  damaged: "تالف",
};

export default function CustodyTable({
  custodies = [],
  isLoading,
  isError,
  onView,
  onEdit,
  onDelete,
  onRetry,
  skeletonRows = 5,
}) {
  const columns = [
    {
      key: "name",
      header: "العهدة",
      render: (c) => {
        const Icon = CATEGORY_ICONS[c.category] || CATEGORY_ICONS.default;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-xs sm:text-sm">{c.name}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{c.brand} - {c.model}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "الحالة",
      render: (c) => (
        <Badge variant="secondary" className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[c.status] || "bg-muted"}`}>
          {STATUS_LABELS[c.status] || c.status}
        </Badge>
      ),
    },
    {
      key: "assigned_to",
      header: "مُعينة إلى",
      render: (c) => {
        const assign = c.current_assignment;
        if (!assign) return <span className="text-muted-foreground text-xs">—</span>;
        return (
          <div className="text-xs">
            <p className="font-medium text-foreground">{assign.employee_name || assign.trainee_name}</p>
            <p className="text-muted-foreground">{assign.assigned_to_type === "employee" ? "موظف" : "متدرب"}</p>
          </div>
        );
      },
    },
    {
      key: "date",
      header: "تاريخ الإضافة",
      render: (c) => (
        <span className="text-xs text-muted-foreground">
          {c.created_at ? format(parseISO(c.created_at), "d MMM yyyy", { locale: arSA }) : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      cellClassName: "text-left",
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5 flex-nowrap">
          {/* عرض */}
          <button
            type="button"
            onClick={() => onView?.(c.id)}
            title="عرض تفاصيل العهدة"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#4E9DA8] bg-[#4E9DA8]/10 hover:bg-[#4E9DA8]/20 transition-all duration-150 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>عرض</span>
          </button>

          {/* تعديل */}
          <button
            type="button"
            onClick={() => onEdit?.(c)}
            title="تعديل بيانات العهدة"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 transition-all duration-150 cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>تعديل</span>
          </button>

          {/* حذف */}
          <button
            type="button"
            onClick={() => onDelete?.(c)}
            title="حذف العهدة"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/50 transition-all duration-150 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>حذف</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={custodies}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyMessage="لا توجد عهد"
      skeletonRows={skeletonRows}
      getRowKey={(c) => c.id}
    />
  );
}