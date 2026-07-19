import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KPICard({
  title,
  value,
  unit = "",
  icon: Icon,
  color = "blue",
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card className="border-0 shadow-sm bg-background">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 sm:pt-4 px-3 sm:px-4">
        
        {/* TITLE */}
        <CardTitle className="text-[11px] sm:text-xs font-medium text-muted-foreground leading-tight">
          {title}
        </CardTitle>

        {/* ICON */}
        <div
          className={cn(
            "p-2 sm:p-3 rounded-lg",
            colorClasses[color]
          )}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </CardHeader>

      <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
        <p className="flex items-end gap-1">
          
          {/* VALUE */}
          <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-none">
            {value}
          </span>

          {/* UNIT */}
          {unit && (
            <span className="text-sm sm:text-base lg:text-2xl font-semibold text-muted-foreground">
              {unit}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}