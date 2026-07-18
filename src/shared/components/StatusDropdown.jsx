import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { statusLabels, statusOptions, statusPillStyles } from "@/lib/constants";

export function StatusDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleScrollOrResize() {
      updatePosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open, updatePosition]);

  const currentStyle = statusPillStyles[value] || statusPillStyles.present;

  const handleSelect = (status) => {
    setOpen(false);
    if (status !== value) {
      onChange(status);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${currentStyle}`}
      >
        {statusLabels[value] || value}
       <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
              minWidth: Math.max(menuPos.width, 130),
            }}
            className="z-[9999] rounded-2xl border border-gray-100 bg-white p-1.5 shadow-lg"
            dir="rtl"
          >
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleSelect(status)}
                className={`mb-1 flex w-full items-center justify-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold last:mb-0 ${statusPillStyles[status]}`}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
