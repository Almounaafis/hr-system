// ─── Employees.jsx ───────────────────────────────────────────────────────────
import { useState } from "react";
import { Network, Plus, PlusCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/shared/Pagination";
import OrgChart from "@/features/employees/OrgChart";
import { statusFilters } from "@/features/employees/mockData";
import { TabButton } from "@/features/employees/TabButton";
import { FilterDropdown } from "@/features/employees/FilterDropdown";
import { BulkActionsDropdown } from "@/features/employees/BulkActionsDropdown";
import EmployeesGrid from "@/features/employees/EmployeesGrid";
import { EmployeeDetailSheet } from "@/features/employees/EmployeeDetailSheet";
import { AddEmployeeModal } from "@/features/employees/AddEmployeeModal";
import { CustomScheduleSheet } from "@/features/employees/CustomScheduleSheet";
import SearchInput from "@/features/employees/SearchInput";
 import {
  useEmployeesData,
  useEmployeeFilters,
  useEmployeeActions,
  useEmployeeEditData,
} from "@/features/employees/hooks/employees.hooks";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
export const SEARCH_DEBOUNCE_MS = 400;
export const EMPLOYEES_PAGE_SIZE = 6;
// ─── Main Component ───────────────────────────────────────────────────────────
export default function Employees() {
  const [mainTab, setMainTab] = useState("employees");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddOrgModal, setShowAddOrgModal] = useState(false);
  const [showCustomScheduleSheet, setShowCustomScheduleSheet] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { editForm, isLoading: loadingEditData } = useEmployeeEditData(editingId);

  // ─── Data ───────────────────────────────────────────────────────────────
const {
  employees, departments, branches, pagination, filters,
  setSearch, setDepartment, setStatus, setPage,
  createItem, updateItem, deleteItem, creating, updating,
  isLoading,  
} = useEmployeesData({
  onMutationSuccess: () => {
    setShowAddEmployeeModal(false);
    setEditingId(null);
  },
});

  // ─── Filters & Pagination ────────────────────────────────────────────────
  const {
    pageEmployees, totalPages, currentPage, totalRecords,
    selectedDepartment, selectedStatus,
    onDepartmentChange, onStatusChange, onPageChange,
  } = useEmployeeFilters({ employees, pagination, filters, setDepartment, setStatus, setPage });

  // ─── Actions ────────────────────────────────────────────────────────────
  const { submitEmployee, deleteEmployee, searchByEmail, bulkInvite, bulkDelete } =
    useEmployeeActions({ createItem, updateItem, deleteItem, setSearch });

  const [debouncedSearch] = useDebouncedCallback(searchByEmail, SEARCH_DEBOUNCE_MS);

  const departmentOptions = [
    { value: "الكل", label: "الكل" },
    ...departments.map((d) => ({ value: d, label: d })),
  ];

  // ─── Handlers ───────────────────────────────────────────────────────────
  const toggleSelect = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleEditEmployee = (employee) => {
    setEditingId(employee.id);
    setShowAddEmployeeModal(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setShowAddEmployeeModal(true);
  };

  const handleConfirm = (formData) => submitEmployee(formData, editForm);

  const handleDelete = async (id) => {
    const deleted = await deleteEmployee(id);
    if (deleted) setSelectedEmployee(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchEmail(value);
    debouncedSearch(value);
  };

  const handleCancelModal = () => {
    setShowAddEmployeeModal(false);
    setEditingId(null);
  };
  const handleScheduleEmployee = (employee) => {
    setSelectedIds(new Set([employee.id]));
    setShowCustomScheduleSheet(true);
  };
  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" className="space-y-4 sm:space-y-5 p-2 sm:p-1">

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row lg:items-center lg:justify-between gap-3">

        {/* TABS */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-8 w-full lg:w-auto">
          <TabButton active={mainTab === "employees"} icon={<Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />} onClick={() => setMainTab("employees")}>إدارة الموظفين</TabButton>
          <TabButton active={mainTab === "orgchart"} icon={<Network className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />} onClick={() => setMainTab("orgchart")}>الهيكل التنظيمي</TabButton>
        </div>

        {/* TOOLBAR */}
        {mainTab === "employees" && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
            <SearchInput value={searchEmail} onChange={handleSearchChange} placeholder="بحث بالبريد الإلكتروني" />
            <BulkActionsDropdown onSchedule={() => setShowCustomScheduleSheet(true)} onInvite={() => bulkInvite(selectedIds)} onDelete={() => bulkDelete(selectedIds)} />
            <FilterDropdown label="الأقسام" options={departmentOptions} value={selectedDepartment} onChange={onDepartmentChange} />
            <FilterDropdown label="تصنيف" options={statusFilters} value={selectedStatus} onChange={onStatusChange} />
            <Button className="gap-2 h-10 sm:h-auto px-4 sm:px-6 py-2 text-sm sm:text-lg rounded-xl w-full sm:w-auto" onClick={handleAddNew}>
              <Plus className="h-4 w-4" /> إضافة موظف
            </Button>
          </div>
        )}

        {mainTab === "orgchart" && (
          <Button className="gap-2 h-10 sm:h-auto px-4 sm:px-6 py-2 text-sm sm:text-lg rounded-xl w-full sm:w-auto bg-primary hover:bg-primary/90 text-white" onClick={() => setShowAddOrgModal(true)}>
            <PlusCircle className="h-5 w-5" /> اضافة عناصر
          </Button>
        )}
      </div>

      {/* CONTENT */}
      {mainTab === "orgchart" ? (
        <div className="overflow-x-auto">
           <OrgChart employees={employees} showAddModal={showAddOrgModal} setShowAddModal={setShowAddOrgModal} />
        </div>
      ) : (
        <>
        <EmployeesGrid
  employees={pageEmployees}
  isLoading={isLoading}
  selectedIds={selectedIds}
  onToggleSelect={toggleSelect}
  onOpen={setSelectedEmployee}
  onEdit={handleEditEmployee}
  onDelete={handleDelete}
  onSchedule={handleScheduleEmployee}
/>
          {totalRecords > 0 && (
            <div className="mt-4 flex justify-center sm:justify-end">
              <Pagination currentPage={currentPage} totalPages={totalPages} totalRecords={totalRecords} pageSize={EMPLOYEES_PAGE_SIZE} onPageChange={onPageChange} />
            </div>
          )}
        </>
      )}

      {/* MODALS */}
      <EmployeeDetailSheet selectedEmployee={selectedEmployee} onClose={() => setSelectedEmployee(null)} onDelete={handleDelete} onEdit={handleEditEmployee} />
      <AddEmployeeModal
        open={showAddEmployeeModal}
        onOpenChange={setShowAddEmployeeModal}
        editingEmployee={editForm}
        onConfirm={handleConfirm}
        onCancel={handleCancelModal}
        loading={creating || updating || (!!editingId && loadingEditData)}
        departmentsList={departments}
        branchesList={branches}
      />
      <CustomScheduleSheet open={showCustomScheduleSheet} onOpenChange={setShowCustomScheduleSheet} selectedIds={selectedIds} employees={employees} />
    </div>
  );
}