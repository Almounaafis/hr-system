// @/features/companies/RowActionsMenu.jsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Pencil, Trash2, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RowActionsMenu({ company, onEdit, onDelete, onInviteHr }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // Position the menu when opening (and on scroll / resize)
  useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const MENU_WIDTH = 180;
      const MENU_HEIGHT = 160; // approx
      const gap = 4;

      // Default: below the button, aligned to its left edge
      let top = rect.bottom + gap;
      let left = rect.left;

      // If it would overflow the viewport bottom, flip above
      if (top + MENU_HEIGHT > window.innerHeight) {
        top = rect.top - MENU_HEIGHT - gap;
      }

      // If it would overflow the right edge, align right
      if (left + MENU_WIDTH > window.innerWidth) {
        left = rect.right - MENU_WIDTH;
      }
      // If it would overflow the left edge, align left
      if (left < 8) left = 8;

      setCoords({ top, left });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  // Close on outside click / Esc
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (
        !menuRef.current?.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handle = (fn) => (e) => {
    e.stopPropagation();
    setOpen(false);
    fn?.(company);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="خيارات"
        className={cn(
          "p-1.5 rounded-md transition-colors",
          open
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ position: "fixed", top: coords.top, left: coords.left }}
            className="z-[9999] min-w-[180px] rounded-xl border border-border bg-card shadow-lg py-1"
          >
            <button
              type="button"
              role="menuitem"
              onClick={handle(onEdit)}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              تعديل
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handle(onInviteHr)}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              <UserPlus className="h-3.5 w-3.5 text-muted-foreground" />
              إضافة محاسب
            </button>

            <div className="my-1 h-px bg-border" />

            <button
              type="button"
              role="menuitem"
              onClick={handle(onDelete)}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              حذف
            </button>
          </div>,
          document.body
        )}
    </>
  );
}