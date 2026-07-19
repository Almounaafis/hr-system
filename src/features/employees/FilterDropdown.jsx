import { useState, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useClickOutside } from "./utils";

// Renders as a static-label filter button (always shows `label`, never the
// selected value) with a dropdown panel — matches the mock, where the pill
// text never changes when a filter is applied.
export function FilterDropdown({ label, icon, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  const isActive = value !== options[0].value;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-3 text-sm transition-colors ${isActive
          ? "border-primary/30 bg-primary/5 text-primary"
          : "border-border bg-background text-muted-foreground hover:bg-muted"
          }`}
      >
        <span>{label}</span>
        {icon}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1.5 w-44 rounded-xl border border-border bg-card p-1.5 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${value === opt.value ? "bg-primary/5 font-medium text-primary" : "text-foreground hover:bg-muted"
                }`}
            >
              {opt.label}
              {value === opt.value && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
