import { useState, useRef, useEffect } from "react";
import { MoreVertical, MinusCircle, Award, FileText } from "lucide-react";

export function RowActionsMenu({ onAddDeduction, onAddAllowance, onViewDetails, status }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
        aria-label="خيارات الصف"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute left-0 z-20 mt-1 w-44 rounded-lg border border-border bg-card py-1 shadow-lg">
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-right text-sm text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              setOpen(false);
              onAddDeduction?.();
            }}
            disabled={status === "finalized"}
          >
            <MinusCircle className="h-3.5 w-3.5" />
            إضافة خصم
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-right text-sm text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              setOpen(false);
              onAddAllowance?.();
            }}
            disabled={status === "finalized"}
          >
            <Award className="h-3.5 w-3.5" />
            إضافة مكافأة
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-right text-sm text-foreground hover:bg-muted"
            onClick={() => {
              setOpen(false);
              onViewDetails?.();
            }}
          >
            <FileText className="h-3.5 w-3.5" />
            تفاصيل الراتب
          </button>
        </div>
      )}
    </div>
  );
}
