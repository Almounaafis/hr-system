import { useCrud } from "@/hooks/useCrud";
import { useMemo } from "react";

/**
 * Hook to fetch employees list for shift assignment
 * @param {Object} options - Options for fetching employees
 * @param {string} options.search - Search query for filtering employees by name
 * @param {string} options.department - Department name to filter employees
 * @returns {Object} Query result with employees data
 */
export function useEmployeesList({ search = "", department = "" } = {}) {
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (department) params.set("department", department);
    return params.toString();
  }, [search, department]);

  const crud = useCrud({
    queryKey: ["employees-list", queryString],
    endpoint: `/employees${queryString ? `?${queryString}` : ""}`,
    enabled: true,
    staleTime: 300000, // 5 minutes
    select: (data) => {
      // Handle nested data structure: { data: { employees: [...] } }
      const employees = data?.data?.employees || data?.employees || (Array.isArray(data) ? data : []);
      return employees.map((emp) => ({
        id: emp.id,
        name: emp.name,
        position: emp.job_title || "",
        photo: emp.profile_image_url || null,
        avatar: emp.name?.charAt(0).toUpperCase() || "E",
        avatarBg: "bg-blue-100",
        avatarColor: "text-blue-600",
      }));
    },
  });

  return {
    ...crud,
    employees: crud.data,
  };
}
