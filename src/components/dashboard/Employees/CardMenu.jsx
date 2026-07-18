import { useRef, useState } from "react";
import { CircleSlash, Edit, FileSliders, Focus, Mail, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useClickOutside } from "./utils";
import { useCrud } from "@/hooks/useCrud";

// ─── Constants ───────────────────────────────────────────────────────────────

function useMenuItems({ onOpen, onEdit, onDelete, onResendInvite, onSchedule, navigate , id }) {
  return [
    { label: "عرض التفاصيل", icon: Focus, onClick: onOpen },
    {
      label: "عرض سجل الحضور",
      icon: FileSliders,
      onClick: () => navigate(`/employee/attendance/${id}`),
    },
    { label: "تعديل", icon: Edit, onClick: onEdit },
    { label: "تعيين مواعيد عمل مخصصة", icon: FileSliders, onClick: onSchedule },
    { label: "إعادة إرسال الدعوة", icon: Mail, onClick: onResendInvite },
    { label: "حذف", icon: CircleSlash, onClick: onDelete, danger: true },
  ];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function MenuItem({ label, icon: Icon, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick ?? undefined}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-${danger ? "destructive/10" : "muted"} text-${danger ? "destructive" : "foreground"}`}
    >
      <Icon className={`h-3.5 w-3.5 ${danger ? "rotate-45" : ""}`} />
      {label}
    </button>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function CardMenu({ onEdit, onDelete, onOpen, onSchedule, employee }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useClickOutside(ref, () => setOpen(false), open);

  const { createItem: resendInvite } = useCrud({
    endpoint: `/employees/${employee?.id}/resend-invite`,
    enabled: false,
  });

  const close = () => setOpen(false);

  const withClose = (fn) => () => { fn?.(); close(); };

  const handleResendInvite = async () => {
    if (!employee?.email) return toast.error("البريد الإلكتروني غير متوفر");

    try {
      await resendInvite({ endpoint: `/employees/${employee.id}/resend-invite` });
    } catch {
      // useCrud handles error toasts internally
    } finally {
      close();
    }
  };

const menuItems = useMenuItems({
    onOpen:          withClose(onOpen),
    onEdit:          withClose(onEdit),
    onDelete:        withClose(onDelete),
    onResendInvite:  handleResendInvite,
    onSchedule:      withClose(onSchedule),
    navigate,
    id: employee?.id,
  });
 

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 z-20 mt-1 w-54 rounded-xl border border-border bg-card p-1.5 shadow-lg"
        >
          {menuItems.map(({ label, icon, onClick, danger }) => (
            <MenuItem
              key={label}
              label={label}
              icon={icon}
              onClick={onClick}
              danger={danger}
            />
          ))}
        </div>
      )}
    </div>
  );
}