import { cn } from "@/lib/utils";

 
function MultiPillGroup({ options, values, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = values.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            className={cn(
              "whitespace-nowrap flex items-center justify-center gap-1.5 rounded-lg border px-5 py-2.5 text-base font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "border-gray-200 text-muted-foreground hover:border-gray-300"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
export default MultiPillGroup;