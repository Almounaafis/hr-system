import KPICard from "@/components/dashboard/DashboardPage/KPICard";
import TodayActivityCard from "@/components/dashboard/DashboardPage/TodayActivity";
import LatestRequestsCard from "@/components/dashboard/DashboardPage/LatestRequests";
import Attendance from "./Attendance";
import { useCrud } from "@/hooks/useCrud";
import { transformKPIs, transformTodayActivity } from "@/components/dashboard/DashboardPage/transformKPIs";


export default function Dashboard({ onViewRequests }) {
  const { data: requestsRes, isLoading: isLoadingRequests } = useCrud({
    queryKey: "requests",
    endpoint: "/requests",
  });

  // ✅ select بيوصلنا مباشرة لـ stats بدل ما نفكها كل مرة تحت
  const { data: attendanceStats, isLoading: isLoadingAttendance } = useCrud({
    queryKey: ["attendance-summary"],
    endpoint: "/attendance?page=1&limit=1",
    select: (data) => data?.data?.stats ?? {},
  });

  const kpis = attendanceStats ? transformKPIs(attendanceStats) : [];
  const todayActivity = attendanceStats ? transformTodayActivity(attendanceStats) : [];

  const isLoadingKPIs = isLoadingAttendance;

  return (
    <div className="space-y-4 p-1">
      <div className="grid gap-3 grid-cols-1 md:grid-cols-3 xl:grid-cols-5">
        {isLoadingKPIs
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-[92px] rounded-xl bg-muted animate-pulse"
              />
            ))
          : kpis.map((kpi, i) => <KPICard key={i} kpi={kpi} />)}
      </div>

      {/* Top Row: Today's Activity + Latest Requests */}
    <div className="grid gap-4 md:grid-cols-2">
        <LatestRequestsCard
          data={requestsRes?.data?.requests?.slice(0, 5) || []}
          onViewRequests={onViewRequests}
          isLoading={isLoadingRequests}
        />
        <TodayActivityCard data={todayActivity} isLoading={isLoadingAttendance} />
      </div>

      {/* Attendance Table */}
      <Attendance />
    </div>
  );
}