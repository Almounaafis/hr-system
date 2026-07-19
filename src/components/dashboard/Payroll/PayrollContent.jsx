import { PayrollTable } from "./PayrollTable";
import Pagination from "@/shared/components/Pagination";

export function PayrollContent({ filteredEmployees, currentPage, totalPages, setCurrentPage, onAddDeduction, onAddAllowance, onViewDetails, selectedEmployeeIds, setSelectedEmployeeIds, isLoading }) {
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
