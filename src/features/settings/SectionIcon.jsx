import { cn } from "@/lib/utils";

export function SectionIcon({ icon: Icon, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    green: "bg-green-50 text-green-600",
    indigo: "bg-indigo-50 text-indigo-600"
  };
  return (
    <div className={cn("w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center shrink-0", tones[tone])}>
      <Icon className="w-4 h-4 md:w-6 md:h-6" />
    </div>
  );
}
