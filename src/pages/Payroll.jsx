import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { PayrollHeader } from "@/components/dashboard/Payroll/PayrollHeader";
import { PayrollFilters } from "@/components/dashboard/Payroll/PayrollFilters";
import { PayrollKPIs } from "@/components/dashboard/Payroll/PayrollKPIs";
import { PayrollContent } from "@/components/dashboard/Payroll/PayrollContent";
import { CreatePayrollDialog } from "@/components/dashboard/Payroll/CreatePayrollDialog";
import { AddDeductionAllowanceDialog } from "@/components/dashboard/Payroll/AddDeductionAllowanceDialog";
import { EmployeePayrollSheet } from "@/components/dashboard/Payroll/EmployeePayrollSheet";
import {
  usePayrollDeductions,
  usePayrollBonuses,
  usePayrollList,
  useApproveSalaries,
  useEditSalaryProfile,
} from "@/components/dashboard/Payroll/hooks/usePayroll";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

// Month name to number mapping
const MONTH_NAME_TO_NUMBER = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

// Month number to name mapping (عكس الماب اللي فوق، عشان نجيب اسم الشهر الحالي)
const MONTH_NUMBER_TO_NAME = Object.fromEntries(
  Object.entries(MONTH_NAME_TO_NUMBER).map(([name, num]) => [num, name])
);

// Month number to Arabic label mapping
const MONTH_NUMBER_TO_LABEL = {
  1: "يناير",
  2: "فبراير",
  3: "مارس",
  4: "أبريل",
  5: "مايو",
  6: "يونيو",
  7: "يوليو",
  8: "أغسطس",
  9: "سبتمبر",
  10: "أكتوبر",
  11: "نوفمبر",
  12: "ديسمبر",
};

export default function Payroll() {
  const { createDeductions, isCreating: isCreatingDeductions } = usePayrollDeductions();
  const { createBonuses, isCreating: isCreatingBonuses } = usePayrollBonuses();
  const { approveSalaries, isApproving } = useApproveSalaries();
  const { editSalaryProfile, isUpdating: isUpdatingSalary } = useEditSalaryProfile();

  // ── Dynamic "now" (الشهر والسنة الحاليين فعليًا) ─────────────────────────
  const now = useMemo(() => new Date(), []);
  const currentMonthNumber = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();

  // ── Header Year State ────────────────────────────────────────────────────
  const [headerYear, setHeaderYear] = useState(String(currentYear));

  // ── Table Filter State ────────────────────────────────────────────────────
  const [filterMonth, setFilterMonth] = useState(
    MONTH_NUMBER_TO_NAME[currentMonthNumber] ?? "january"
  );
  const [filterSort, setFilterSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  // ── Live Payroll Data ─────────────────────────────────────────────────────
  const selectedMonthNumber = MONTH_NAME_TO_NUMBER[filterMonth] ?? currentMonthNumber;
  const selectedYearNumber = parseInt(headerYear, 10) || currentYear;
  const [debouncedSetSearch] = useDebouncedCallback((value) => {
    setDebouncedSearch(value);
    setCurrentPage(1); // رجّع لأول صفحة كل ما السيرش يتغير
  }, 400);

  const handleSearchChange = (value) => {
    setSearchQuery(value); // فوري - للـ input نفسه
    debouncedSetSearch(value); // متأخر - للـ request
  };
  const { payrolls, isLoading: isLoadingPayrolls, isRefetching } = usePayrollList({
    month: selectedMonthNumber,
    year: selectedYearNumber,
    search: debouncedSearch,
  });

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil((payrolls?.length ?? 0) / ITEMS_PER_PAGE));
  const paginatedEmployees = payrolls.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ── Dialog / Sheet State ──────────────────────────────────────────────────
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // ── Deduction/Bonus Dialog State ──────────────────────────────────────────
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedEmployeeForAction, setSelectedEmployeeForAction] = useState(null);
  const [entries, setEntries] = useState([]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleOpenActionDialog = (type, employee) => {
    setActionType(type);
    setSelectedEmployeeForAction(employee);
    setEntries([]);
    // Don't modify selectedEmployeeIds - it's only for table checkbox selections
    // For single employee actions, use selectedEmployeeForAction
    setIsActionDialogOpen(true);
  };

  const handleCloseActionDialog = () => {
    setIsActionDialogOpen(false);
    setActionType(null);
    setSelectedEmployeeForAction(null);
    setEntries([]);
    // Don't clear selectedEmployeeIds - it's for table checkbox selections
  };

  const handleAddEntry = (data) => {
    setEntries([...entries, data]);
  };

  const handleRemoveEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmitActionDialog = async (formData) => {
    // Use selectedEmployeeForAction for single employee, selectedEmployeeIds for bulk
    const employeeIds = selectedEmployeeForAction?.user_id
      ? [selectedEmployeeForAction.user_id]
      : selectedEmployeeIds;

    if (employeeIds.length === 0) {
      toast.error("يرجى تحديد موظف واحد على الأقل");
      return;
    }

    const allEntries = [...entries];
    if (formData && formData.type && formData.amount && formData.reason) {
      allEntries.push(formData);
    }

    if (allEntries.length === 0) {
      toast.error("يرجى إضافة عنصر واحد على الأقل");
      return;
    }

    const payload = {
      employee_ids: employeeIds,
      month: selectedMonthNumber,
      year: selectedYearNumber,
      items: allEntries.map((e) => ({
        reason: e.reason,
        amount: Number(e.amount),
      })),
    };

    try {
      if (actionType === "deduction") {
        await createDeductions(payload);
      } else {
        await createBonuses(payload);
      }
      handleCloseActionDialog();
    } catch (error) {
      console.error("Failed to create payroll item:", error);
    }
  };

  const handleApproveSelected = async (employeeIds) => {
    if (!employeeIds?.length) {
      toast.error("يرجى تحديد موظف واحد على الأقل");
      return;
    }
    await approveSalaries({
      employee_ids: employeeIds,
      month: selectedMonthNumber,
      year: selectedYearNumber,
    });
  };

  const handleUpdateSalary = async (employeeId, basicSalary) => {
    try {
      await editSalaryProfile({
        employeeId,
        body: { basic_salary: Number(basicSalary) },
      });
      toast.success("تم تحديث الراتب الأساسي بنجاح");
    } catch (error) {
      console.error("Failed to update salary:", error);
      toast.error("فشل تحديث الراتب الأساسي");
    }
  };

  const monthLabel = MONTH_NUMBER_TO_LABEL[selectedMonthNumber] ?? MONTH_NUMBER_TO_LABEL[currentMonthNumber];

  return (
    <div className="space-y-6 p-1">
      <PayrollHeader
        headerMonth={headerYear}
        setHeaderMonth={setHeaderYear}
        onCreatePayroll={() => setIsCreateModalOpen(true)}
        exportMonth={selectedMonthNumber}
        exportYear={selectedYearNumber}
      />

      <PayrollKPIs
        month={selectedMonthNumber}
        year={selectedYearNumber}
      />

      <div className="bg-background rounded-2xl shadow-sm p-6">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mb-6 justify-between">
          <h2 className="text-lg font-bold text-foreground">
            كشف راتب {monthLabel} {headerYear}
          </h2>
          <PayrollFilters
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            filterDate={filterMonth}
            setFilterDate={setFilterMonth}
            filterSort={filterSort}
            setFilterSort={setFilterSort}
            selectedYear={selectedYearNumber}
            currentYear={currentYear}
            currentMonthNumber={currentMonthNumber}
            selectedCount={selectedEmployeeIds.length}
            onAddDeduction={() => handleOpenActionDialog("deduction", null)}
            onAddAllowance={() => handleOpenActionDialog("allowance", null)}
          />
        </div>
        <PayrollContent
          isLoading={isLoadingPayrolls || isRefetching}
          filteredEmployees={paginatedEmployees}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          onAddDeduction={(employee) => handleOpenActionDialog("deduction", employee)}
          onAddAllowance={(employee) => handleOpenActionDialog("allowance", employee)}
          selectedEmployeeIds={selectedEmployeeIds}
          setSelectedEmployeeIds={setSelectedEmployeeIds}
          onViewDetails={(employee) => setSelectedEmployee(employee)}
          onApprove={handleApproveSelected}
          isApproving={isApproving}
        />
      </div>

      <CreatePayrollDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <AddDeductionAllowanceDialog
        open={isActionDialogOpen}
        onOpenChange={handleCloseActionDialog}
        actionType={actionType}
        selectedEmployee={selectedEmployeeForAction}
        entries={entries}
        onAddEntry={handleAddEntry}
        onRemoveEntry={handleRemoveEntry}
        onSubmit={handleSubmitActionDialog}
        selectedMonth={selectedMonthNumber}
        selectedYear={selectedYearNumber}
        isCreating={actionType === "deduction" ? isCreatingDeductions : isCreatingBonuses}
      />

      <EmployeePayrollSheet
        open={!!selectedEmployee}
        onOpenChange={() => setSelectedEmployee(null)}
        selectedEmployee={selectedEmployee}
        month={selectedMonthNumber}
        year={selectedYearNumber}
        onUpdateSalary={handleUpdateSalary}
        isUpdatingSalary={isUpdatingSalary}
      />
    </div>
  );
}