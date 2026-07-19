import { memo } from "react";
import { MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const TodayActivityChart = memo(function TodayActivityChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={48}
          outerRadius={68}
          paddingAngle={3}
          startAngle={90}
          endAngle={-270}
          stroke="none"
          label={({ value }) => `${value}%`}
          labelLine={false}
          labelStyle={{
            fontSize: "14px",
            fontWeight: "700",
            fill: "#374151",
          }}
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
});

const TodayActivitySkeleton = memo(function TodayActivitySkeleton() {
  return (
    <>
      <div className="flex items-center justify-center py-2">
        {/* دائرة بتحاكي شكل الـ Pie Chart */}
        <div className="w-[136px] h-[136px] rounded-full border-[16px] border-muted animate-pulse" />
      </div>
      <div className="flex flex-col gap-2.5 mt-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-muted animate-pulse" />
            <span className="h-3 w-24 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </>
  );
});

const TodayActivityCard = memo(function TodayActivityCard({ data, isLoading }) {
  return (
    <Card className="border-border col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
        <CardTitle className="text-2xl font-semibold text-foreground">نشاط اليوم</CardTitle>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {isLoading ? (
          <TodayActivitySkeleton />
        ) : (
          <>
            <div className="relative flex items-center justify-center">
              <TodayActivityChart data={data} />
            </div>
            <div className="flex flex-col gap-2.5 mt-3">
              {data.map((item) => (
                <div key={item.key} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-foreground">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ background: item.color }}
                    />
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
});

export default TodayActivityCard;