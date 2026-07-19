export function StatusBadge({ status }) {
  const styles = {
    active: "bg-[#ECFDED] text-[#26BF66]",
    "on-leave": "bg-[#FFF3E0] text-[#E65100]",
    inactive: "bg-[#ffe7e7] text-[#f60808]",
  };
  const labels = {
    active: "نشط",
    "on-leave": "في إجازة",
    inactive: "غير نشط",
  };
  return (
    <span className={`rounded-md px-2.5 py-1 text-md font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
