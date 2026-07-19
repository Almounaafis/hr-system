import { useCrud } from "@/hooks/useCrud";
import { useMemo } from "react";

/**
 * Hook to fetch departments list for shift assignment
 * @param {Object} options - Options for fetching departments
 * @param {string} options.search - Search query for filtering departments
 * @returns {Object} Query result with departments data
 */
export function useDepartments({ search = "" } = {}) {
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    return params.toString();
  }, [search]);

  const crud = useCrud({
    queryKey: ["departments-list", queryString],
    endpoint: `/departments${queryString ? `?${queryString}` : ""}`,
    enabled: true,
    staleTime: 300000, // 5 minutes
    select: (data) => {
      // Handle different API response structures
      const departments = data?.data || data?.departments || (Array.isArray(data) ? data : []);
      return departments.map((dept) => {
        // Handle both string responses and object responses
        if (typeof dept === 'string') {
          return {
            id: dept,
            name: dept,
          };
        }
        return {
          id: dept.id,
          name: dept.name,
        };
      });
    },
  });

  return {
    ...crud,
    departments: crud.data,
  };
}
