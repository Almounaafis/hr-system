import { memo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  CalendarCheck,
  Clock,
  XCircle,
  CalendarOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const KPI_COLOR_STYLES = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-600", icon: "text-green-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", icon: "text-orange-600" },
  red: { bg: "bg-red-50", text: "text-red-600", icon: "text-red-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", icon: "text-purple-600" },
};

const ICON_MAP = {
  Users,
  CalendarCheck,
  Clock,
  XCircle,
  CalendarOff,
};

const KPICard = memo(function KPICard({ kpi }) {
  const IconComponent = ICON_MAP[kpi.icon];
  const colorStyles = KPI_COLOR_STYLES[kpi.color] || KPI_COLOR_STYLES.blue;

  return (
    <Card className="border-border hover:shadow-md transition-shadow">
  <CardContent className="p-3 sm:p-4">
    <div className="flex items-start justify-between gap-3">
      
      {/* LEFT CONTENT */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] sm:text-xs text-muted-foreground mb-1 truncate">
          {kpi.title}
        </p>

        <p className="text-xl sm:text-2xl font-bold text-foreground">
          {kpi.value}
        </p>

        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-2">
          {kpi.changeType === "positive" && (
            <TrendingUp className="h-3 w-3 text-green-600 flex-shrink-0" />
          )}
          {kpi.changeType === "negative" && (
            <TrendingDown className="h-3 w-3 text-red-600 flex-shrink-0" />
          )}
          {kpi.changeType === "neutral" && (
            <Minus className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          )}

          <span
            className={`text-[11px] sm:text-xs font-medium ${
              kpi.changeType === "positive"
                ? "text-green-600"
                : kpi.changeType === "negative"
                ? "text-red-600"
                : "text-muted-foreground"
            }`}
          >
            {kpi.change}
          </span>

          <span className="text-[11px] sm:text-xs text-gray-400">
            من الشهر الماضي
          </span>
        </div>
      </div>

      {/* ICON */}
      <div
        className={`
          w-9 h-9 sm:w-10 sm:h-10
          rounded-lg
          flex items-center justify-center
          flex-shrink-0
          ${colorStyles.bg}
        `}
      >
        <IconComponent
          className={`h-4 w-4 sm:h-5 sm:w-5 ${colorStyles.icon}`}
        />
      </div>
    </div>
  </CardContent>
</Card>
  );
});

export default KPICard;
