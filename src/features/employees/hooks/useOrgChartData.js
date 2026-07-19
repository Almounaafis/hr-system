import { useCrud } from "@/hooks/useCrud";
import { useMemo } from "react";

const DEFAULT_COLOR = "blue";

export function useOrgChartData() {
  const {
    data: structures,
    isLoading,
    isRefetching,
    createItem,
    creating,
    updateItem,
    updating,
    deleteItem,
    deleting,
  } = useCrud({
    queryKey: "organizational-structure",
    endpoint: "/organizational-structure",
  });

  // تحويل الـ response لشكل يفهمه الـ OrgChart
  const departments = useMemo(() => {
    if (!Array.isArray(structures)) return [];

    return structures.map((s) => ({
      id: s.id,
      name: s.department,
      colorId: s.color || DEFAULT_COLOR,
      headEmployeeId: s.head_employee_id || "",
      // نضيف الـ head كأول عضو (مع علامة isHead) بعده باقي الموظفين
      members: [
        ...(s.head
          ? [
              {
                id: s.head.id,
                name: s.head.name,
                title: s.head.job_title,
                photo: s.head.profile_image_url,
                isHead: true,
              },
            ]
          : []),
        ...(s.employees || []).map((e) => ({
          id: e.id,
          name: e.name,
          title: e.job_title,
          photo: e.profile_image_url,
        })),
      ],
    }));
  }, [structures]);

  // إضافة/تحديث قسم -> POST /organizational-structure
  const addOrUpdateDepartment = ({ department, headEmployeeId, employeeIds, color }) =>
    createItem({
      useJsonPayload: true,
      body: {
        department,
        head_employee_id: headEmployeeId || undefined,
        employee_ids: employeeIds || [],
        color,
      },
    });

  // تغيير رئيس القسم -> PATCH /organizational-structure/:id/head
  const changeDepartmentHead = (departmentStructureId, headEmployeeId) =>
    updateItem({
      endpoint: `/organizational-structure/${departmentStructureId}/head`,
      skipId: true,
      method: "patch",
      useJsonPayload: true,
      body: { head_employee_id: headEmployeeId },
    });

  // حذف موظف من قسم -> DELETE /organizational-structure/:id/employees/:employeeId
  const removeEmployeeFromDepartment = (departmentStructureId, employeeId) =>
    deleteItem(`/organizational-structure/${departmentStructureId}/employees/${employeeId}`);

  return {
    departments,
    isLoading: isLoading || isRefetching,
    addOrUpdateDepartment,
    creating,
    changeDepartmentHead,
    updating,
    removeEmployeeFromDepartment,
    deleting,
  };
}
