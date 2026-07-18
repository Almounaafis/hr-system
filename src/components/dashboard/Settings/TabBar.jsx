import { cn } from "@/lib/utils";
import { DollarSign, MapPin, Clock, Percent, CalendarDays } from "lucide-react";

const tabDefs = [
  { id: "payroll-cycle", label: "دورة الرواتب", icon: DollarSign },
  { id: "location", label: "إعدادات الموقع", icon: MapPin },
  { id: "work-hours", label: "ساعات العمل", icon: Clock },
  { id: "deductions", label: "الخصومات", icon: Percent },
  { id: "leave-balance", label: "الإجازات", icon: CalendarDays },
];

export function TabBar({ activeTab, onChange }) {
  return (
    <div className="flex gap-1 flex-wrap  border-b border-gray-100 pb-px -mx-1 px-1 mb-12">
      {tabDefs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-t-lg px-3.5 py-2.5 text-sm md:text-lg font-medium border-b-2 transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
