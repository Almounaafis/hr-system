import { useCrud } from "@/hooks/useCrud";

/**
 * Hook to fetch dashboard overview data using useCrud
 * @returns {Object} Query result with attendance stats, latest requests, and pending requests
 */
export function useDashboardOverview() {
  return useCrud({
    queryKey: ["dashboard", "overview"],
    endpoint: "/dashboard/overview",
    enabled: true,
    staleTime: 300000, // 5 minutes
    select: (data) => data?.data || data,
  });
}
