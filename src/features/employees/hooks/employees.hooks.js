import { useMemo, useState, useEffect } from "react";
import { useCrud } from "@/hooks/useCrud";
import { PAGE_SIZE } from "@/features/employees/mockData";

export const mapEmployeeFromApi = (emp) => ({
  id:             emp.id,
  name:           emp.name,
  email:          emp.email,
  phone:          emp.phone,
  position:       emp.job_title       ?? "",
  department:     emp.department      ?? "",
  branch:         emp.branch          ?? "",
  status:         emp.is_active ? "active" : "inactive",
  joinDate:       emp.hire_date       ?? new Date(),
  photo:          emp.profile_image_url ?? null,
  avatar:         emp.name?.charAt(0).toUpperCase() ?? "E",
  avatarBg:       "bg-blue-100",
  avatarColor:    "text-blue-600",
  nationalId:     emp.national_id     ?? "",
  dateOfBirth:    emp.birth_date      ?? "",
  directManager:  emp.direct_manager  ?? "",
  employmentType: emp.employment_type ?? "",
  employeeCode:   emp.employee_code   ?? emp.employeeCode ?? emp.id,
});
export function useEmployeeEditData(editingId) {
  const { data, isLoading, refetch } = useCrud({
    queryKey: ["employee-detail", editingId],
    endpoint: editingId ? `/employees/${editingId}` : null,
    enabled: !!editingId,
    staleTime: 0,
  });

  useEffect(() => {
    if (editingId) {
      refetch();
    }
  }, [editingId, refetch]);

  const editForm = useMemo(() => {
    const actualData = data?.data ?? data;
    return actualData ? mapApiToEditForm(actualData) : null;
  }, [data]);
  return { editForm, isLoading };
}
const buildEmployeesQuery = ({ page, limit, search, department }) => {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("limit", limit);
  if (search)                         params.set("search", search);
  if (department && department !== "الكل") params.set("department", department);
  return params.toString();
};
const mapFormDataToApi = (formData) => ({
  name:             formData.name,
  email:            formData.email,
  phone:            formData.phone,
  address:          formData.address,
  job_title:        formData.jobTitle,
  branch:           formData.branch,
  department:       formData.department,
  employment_type:  formData.employmentType,
  direct_manager:   formData.directManager,
  national_id:      formData.nationalId,
  hire_date:        formData.dateOfAppointment || undefined,
  birth_date:       formData.dateOfBirth || undefined,
  salary:           formData.salary,
});

const mapApiToEditForm = (data) => ({
  id:               data.id,
  name:             data.name,
  email:            data.email,
  phone:            data.phone,
  address:          data.address,
  jobTitle:         data.job_title       ?? "",
  branch:           data.branch          ?? "",
  department:       data.department      ?? "",
  employmentType:   data.employment_type ?? "",
  directManager:    data.direct_manager  ?? "",
  nationalId:       data.national_id     ?? "",
  salary:           data.salary          ?? "",
  dateOfAppointment: data.hire_date  ? new Date(data.hire_date)  : null,
  dateOfBirth:       data.birth_date ? new Date(data.birth_date) : null,
});

const buildFormData = (body, documents = []) => {
  const fd = new FormData();
  Object.entries(body).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") fd.append(k, v);
  });
  documents.forEach((doc) => fd.append("documents", doc.file));
  return fd;
};

const extractNames = (list) =>
  list.map((item) => (typeof item === "string" ? item : item?.name ?? item?.title ?? ""));

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useEmployeesData({ onMutationSuccess }) {
  const [filters, setFilters] = useState({
    page: 1,
    limit: PAGE_SIZE,
    search: "",
    department: "الكل",
    status: "all",
  });

  const queryString = useMemo(() => buildEmployeesQuery(filters), [filters]);

  const crud = useCrud({
    queryKey:       ["employees", queryString],
    endpoint:       `/employees?${queryString}`,
    useJsonPayload: true,
    onSuccess:      onMutationSuccess,
    keepPreviousData: true, // ← يمنع فلاش اللودر أثناء تغيير البحث/الفلتر/الصفحة
  });

  const { data: rawDepartments = [] } = useCrud({ queryKey: "departments", endpoint: "/departments" });
  const { data: rawBranches    = [] } = useCrud({ queryKey: "branches",    endpoint: "/branches"    });

  const apiResponse  = crud.data;
  const rawEmployees = useMemo(() => apiResponse?.employees ?? (Array.isArray(apiResponse) ? apiResponse : []), [apiResponse]);
  const pagination   = apiResponse?.pagination ?? null;

  const employees   = useMemo(() => rawEmployees.map(mapEmployeeFromApi), [rawEmployees]);
  const departments = useMemo(() => extractNames(rawDepartments), [rawDepartments]);
  const branches    = useMemo(() => extractNames(rawBranches),    [rawBranches]);

  const setSearch     = (search)     => setFilters((f) => ({ ...f, search,     page: 1 }));
  const setDepartment = (department) => setFilters((f) => ({ ...f, department, page: 1 }));
  const setStatus     = (status)     => setFilters((f) => ({ ...f, status,     page: 1 }));
  const setPage       = (page)       => setFilters((f) => ({ ...f, page }));

  return {
    ...crud,
    isLoading: crud.isLoading && !apiResponse,
    employees, departments, branches, pagination,
    filters, setSearch, setDepartment, setStatus, setPage,
  };
}
export function useEmployeeFilters({ employees, pagination, filters, setDepartment, setStatus, setPage }) {
  const filteredByStatus = useMemo(() => {
    if (filters.status === "all") return employees;
    return employees.filter((e) => e.status === filters.status);
  }, [employees, filters.status]);

  return {
    pageEmployees:  filteredByStatus,
    totalPages:     pagination?.pages ?? 1,
    currentPage:    pagination?.page  ?? filters.page,
    totalRecords:   pagination?.total ?? filteredByStatus.length,
    selectedDepartment: filters.department,
    selectedStatus:     filters.status,
    onDepartmentChange: setDepartment,
    onStatusChange:     setStatus,
    onPageChange:       setPage,
  };
}


export function useEmployeeActions({ createItem, updateItem, deleteItem, setSearch }) {
  // شيل getEditData و fetchEmployee بالكامل من هنا، مش محتاجينهم تاني

  const submitEmployee = async (formData, editingEmployee) => {
    const body = mapFormDataToApi(formData);
    const fd   = buildFormData(body, formData.documents);

    if (editingEmployee) {
      await updateItem({ endpoint: "/employees", id: editingEmployee.id, body: fd, method: "put", useJsonPayload: false });
    } else {
      await createItem({ endpoint: "/employees", body: fd, useJsonPayload: false });
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الموظف؟")) return false;
    await deleteItem(`/employees/${id}`);
    return true;
  };


  const searchByEmail = (email) => setSearch(email);

  const bulkInvite = async (selectedIds) => {
    if (!selectedIds.size) return;
    if (!window.confirm(`هل أنت متأكد من إرسال دعوة إلى ${selectedIds.size} موظف؟`)) return;

    await Promise.allSettled(
      [...selectedIds].map((id) => createItem({ endpoint: `/employees/${id}/resend-invite` }))
    );
  };

  const bulkDelete = async (selectedIds) => {
    if (!selectedIds.size) return;
    if (!window.confirm(`هل أنت متأكد من حذف ${selectedIds.size} موظف؟`)) return;

    await Promise.allSettled(
      [...selectedIds].map((id) => deleteItem(`/employees/${id}`))
    );
  };

  return { submitEmployee, deleteEmployee, searchByEmail, bulkInvite, bulkDelete };
}