// @/features/recruitment/PositionsTable.jsx
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import { MoreVertical, Pencil, Trash2, Eye } from "lucide-react";
import DataTable from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { PositionRowSkeleton } from "./PositionsSkeletons";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
 
// Inline Kebab Menu for Positions
function PositionActionsMenu({ position, onEdit, onDelete, onView }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      let top = rect.bottom + 4;
      let left = rect.right - 140;
      if (top + 120 > window.innerHeight) top = rect.top - 120;
      if (left < 8) left = 8;
      setCoords({ top, left });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const click = (e) => {
      if (!menuRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left }}
          className="z-[9999] min-w-[140px] rounded-xl border border-border bg-card shadow-lg py-1"
        >
          <button
            onClick={() => { setOpen(false); onView(position); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <Eye className="h-3.5 w-3.5 text-muted-foreground" /> عرض / التقديم
          </button>
          <button
            onClick={() => { setOpen(false); onEdit(position); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" /> تعديل
          </button>
          <div className="my-1 h-px bg-border" />
          <button
            onClick={() => { setOpen(false); onDelete(position); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> حذف
          </button>
        </div>,
        document.body
      )}
    </>
  );
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return format(parseISO(value), "d MMM yyyy", { locale: arSA });
  } catch {
    return value;
  }
}

export default function PositionsTable({
  positions = [],
  isLoading,
  isError,
  onEdit,
  onDelete,
  onView,
  onRetry,
  skeletonRows = 5,
}) {
  const columns = [
    {
      key: "title",
      header: "المسمى الوظيفي",
      render: (pos) => (
        <span className="font-semibold text-foreground text-sm">
          {pos.title}
        </span>
      ),
    },
    {
      key: "department",
      header: "القسم",
      render: (pos) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-foreground">
          {pos.department || "—"}
        </span>
      ),
    },
    {
      key: "description",
      header: "الوصف",
      render: (pos) => (
        <div className="max-w-[180px] sm:max-w-[260px] truncate" title={pos.description}>
          <span className="text-xs text-muted-foreground">
            {pos.description || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (pos) => (
        <Badge
          variant="secondary"
          className={`rounded-full text-[10px] ${
            pos.status === "open" ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"
          }`}
        >
          {pos.status === "open" ? "مفتوح" : "مغلق"}
        </Badge>
      ),
    },
    {
      key: "custom_fields",
      header: "الحقول المخصصة",
      render: (pos) => (
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs text-muted-foreground">
          {pos.custom_fields?.length || 0}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "تاريخ النشر",
      render: (pos) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(pos.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      cellClassName: "text-left",
      render: (pos) => (
        <div className="flex justify-end">
          <PositionActionsMenu
            position={pos}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={positions}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyMessage="لا توجد وظائف مضافة"
      skeletonRows={skeletonRows}
      renderSkeletonRow={() => <PositionRowSkeleton />}
      getRowKey={(pos) => pos.id}
    />
  );
}