import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function DepartmentMultiSelect({ options = [], value = [], onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (dept) => {
    const next = value.includes(dept) ? value.filter((v) => v !== dept) : [...value, dept];
    onChange(next);
  };

  const label =
    value.length === 0
      ? placeholder
      : `${value.length} قسم${value.length > 1 ? "ا" : ""} مختار`;

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-background px-3 py-2.5 text-right text-base text-gray-700 hover:border-gray-300 focus:outline-none focus:border-primary  "
      >
        <span className={value.length === 0 ? "text-gray-400" : "font-semibold text-gray-900"}>{label}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 space-y-1 left-0 z-30 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-gray-100 bg-background p-1.5 shadow-lg">
          {options.map((dept) => {
            const isChecked = value.includes(dept);
            return (
              <button
                key={dept}
                type="button"
                onClick={() => toggle(dept)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  isChecked ? "bg-primary/5 font-semibold text-primary" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{dept}</span>
                {isChecked && <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
