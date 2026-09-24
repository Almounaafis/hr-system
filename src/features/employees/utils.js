import { useEffect } from "react";

export const arabicMonths = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export function formatJoinDate(dateValue) {
  if (!dateValue) return "";
  
  // If it's a Date object, convert to string
  if (dateValue instanceof Date) {
    dateValue = dateValue.toISOString();
  }

  // Handle both "YYYY-MM-DD" and full ISO timestamps "YYYY-MM-DDTHH:MM..."
  const dateString = typeof dateValue === 'string' ? dateValue.split("T")[0] : String(dateValue);
  
  const [y, m, d] = dateString.split("-").map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return "";
  
  return `${d} ${arabicMonths[m - 1]} ${y}`;
}

// Deterministic display id derived from the real employee id — there is no
// separate "employee code" field in the data model, so this is generated
// rather than invented per-record.
export function formatEmployeeId(id) {
  if (!id || id === "undefined" || id === "null") return "—";
  return `#EH${id}`;
}

export function useClickOutside(ref, onOutside, active) {
  useEffect(() => {
    if (!active) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [active, onOutside, ref]);
}
