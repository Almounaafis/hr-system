import { cn } from "@/lib/utils";

export function Switch({ checked, onCheckedChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex  h-4 w-7 md:h-5 md:w-9 items-center rounded-full transition-colors shrink-0",
        checked ? "bg-primary" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "inline-block w-3 h-3 md:h-4 md:w-4 transform rounded-full bg-background shadow transition-transform",
          checked ? "-translate-x-0.5" : "-translate-x-4"
        )}
      />
    </button>
  );
}
