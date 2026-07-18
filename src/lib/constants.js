export const COPANYTYPE = [
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Retail',
  'Manufacturing',
  'Services',
  'Government',
  'Nonprofit',
  'Other'
];

 export const MONTH_OPTIONS = [
   { value: "1", label: "يناير" },
   { value: "2", label: "فبراير" },
   { value: "3", label: "مارس" },
   { value: "4", label: "أبريل" },
   { value: "5", label: "مايو" },
   { value: "6", label: "يونيو" },
   { value: "7", label: "يوليو" },
   { value: "8", label: "أغسطس" },
   { value: "9", label: "سبتمبر" },
   { value: "10", label: "أكتوبر" },
   { value: "11", label: "نوفمبر" },
   { value: "12", label: "ديسمبر" },
 ];

export const statusLabels = {
  present: "حاضر",
  late: "متأخر",
  permission: "اذن",
  vacation: "اجازة",
  remote: "عمل عن بعد",
  absent: "غياب",
};

// Pill styling per status - light fill + colored border/text, matching the reference design
export const statusPillStyles = {
  present: "bg-emerald-50 border-emerald-200 text-emerald-600",
  late: "bg-orange-50 border-orange-200 text-orange-500",
  permission: "bg-sky-50 border-sky-200 text-sky-600",
  vacation: "bg-blue-50 border-blue-200 text-blue-600",
  remote: "bg-teal-50 border-teal-200 text-teal-600",
  absent: "bg-rose-50 border-rose-200 text-rose-500",
};

export const statusOptions = ["present", "late", "absent", "remote", "vacation", "permission"];
