import { cn } from "@/lib/utils";

function PillGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 whitespace-nowrap flex items-center justify-center gap-1.5 rounded-lg border px-8 py-3 text-lg font-medium transition-colors text-sm md:text-lg",
            value === opt.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-gray-200 text-muted-foreground hover:border-gray-300"
          )}
        >
          {opt.icon && <opt.icon className="w-4 h-4" />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default PillGroup;