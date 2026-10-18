import { PayrollTable } from "./PayrollTable";
import Pagination from "@/components/shared/Pagination";

export function PayrollContent({
  filteredEmployees,
  currentPage,
  totalPages,
  setCurrentPage,
  onAddDeduction,
  onAddAllowance,
  onViewDetails,
  selectedEmployeeIds,
  setSelectedEmployeeIds,
  isLoading,
  isError,
  onRetry,
}) {
  return (
    <>
      <PayrollTable
        data={filteredEmployees}
        onAddDeduction={onAddDeduction}
        onAddAllowance={onAddAllowance}
        onViewDetails={onViewDetails}
        selectedEmployeeIds={selectedEmployeeIds}
        setSelectedEmployeeIds={setSelectedEmployeeIds}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
      />

      {filteredEmployees.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}