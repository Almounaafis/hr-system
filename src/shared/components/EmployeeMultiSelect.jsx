import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function EmployeeMultiSelect({ employees, value = [], onChange, placeholder, onSearchChange, searchValue = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    if (onSearchChange) {
      onSearchChange(newValue);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (id) => {
    const next = value.includes(id) ? value.filter((v) => v !== id) : [...value, id];
    onChange(next);
  };

const label =
  value.length === 0
    ? placeholder
    : `تم اختيار (${value.length})`;

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-background px-3 py-2.5 text-right text-base text-gray-700 hover:border-gray-300 focus:outline-none focus:border-primary shadow-sm"
      >
        <span className={value.length === 0 ? "text-gray-400" : "font-semibold text-gray-900"}>{label}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 left-0 z-30 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-gray-100 bg-background p-1.5 shadow-lg">
          <div className="px-2 pb-2">
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="بحث..."
              className="w-full rounded-lg border border-gray-200 bg-background px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none"
            />
          </div>
          {filteredEmployees.map((emp) => {
            const isChecked = value.includes(emp.id);
            return (
              <button
                key={emp.id}
                type="button"
                onClick={() => toggle(emp.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  isChecked ? "bg-primary/5 font-semibold text-primary" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-100 flex-shrink-0">
                    {emp.photo ? (
                      <img
                        src={emp.photo}
                        alt={emp.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className={`flex h-full w-full items-center justify-center text-xs font-semibold ${emp.avatarBg || "bg-gray-100"} ${emp.avatarColor || "text-gray-600"}`}
                      >
                        {emp.avatar || emp.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{emp.name}</p>
                    <p className="text-xs text-gray-500">{emp.position}</p>
                  </div>
                </div>
                {isChecked && <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
