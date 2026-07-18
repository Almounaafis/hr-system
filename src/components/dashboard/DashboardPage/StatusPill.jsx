import { cn } from "@/lib/utils";

const BADGE_STYLES = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  approved: "bg-green-50 text-green-700 border border-green-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
  cancelled: "bg-gray-100 text-gray-600 border border-gray-200",
  default: "bg-gray-50 text-gray-600 border border-gray-200",
};

export function RequestBadge({ type, children, className }) {
  const style = BADGE_STYLES[type] ?? BADGE_STYLES.default;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap",
        style,
        className
      )}
    >
      {children}
    </span>
  );
}