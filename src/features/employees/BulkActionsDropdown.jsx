import { useState, useRef } from "react";
import { MoreVertical, Calendar, Send, Trash2 } from "lucide-react";
import { useClickOutside } from "./utils";

export function BulkActionsDropdown({ onSchedule, onInvite, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  const options = [
    {
      value: "schedule",
      label: "تعيين مواعيد عمل مخصصة",
      icon: <Calendar className="h-5 w-5" />,
      onClick: () => {
        onSchedule?.();
        setOpen(false);
      },
    },
    {
      value: "invite",
      label: "إرسال دعوة أو إشعار",
      icon: <Send className="h-5 w-5" />,
      onClick: () => {
        onInvite?.();
        setOpen(false);
      },
    },
    {
      value: "delete",
      label: "حذف",
      icon: <Trash2 className="h-5 w-5 text-destructive" />,
      onClick: () => {
        onDelete?.();
        setOpen(false);
      },
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-background border border-border px-2.5 py-2.5 rounded-md transition-colors"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1.5 w-56 rounded-xl border border-border bg-card p-1.5 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={opt.onClick}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                opt.value === "delete"
                  ? "text-destructive hover:bg-destructive/10"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
