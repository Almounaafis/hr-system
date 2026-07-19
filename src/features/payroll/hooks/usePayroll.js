import { useCrud } from "@/hooks/useCrud";
import { toast } from "react-hot-toast";
import { useState } from "react";

// ─── 1. List all payrolls (table data) ──────────────────────────────────────
export function usePayrollList({ month, year, search } = {}) {
  const params = new URLSearchParams();
  if (month) params.set("month", month);
  if (year) params.set("year", year);
  if (search) params.set("search", search);
  const endpoint = `/payroll?${params.toString()}`;

  const crud = useCrud({
    queryKey: ["payroll-list", month, year, search],
    endpoint,
    enabled: !!(month && year),
    select: (data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;
      return data;
    },
  });

  return {
    payrolls: crud.data ?? [],
    isLoading: crud.isLoading,
    isError: crud.isError,
    isRefetching: crud.isRefetching,
    refetch: crud.refetch,
  };
}

// ─── 2. Payroll KPI Totals ───────────────────────────────────────────────────
export function usePayrollTotals({ month, year } = {}) {
  const params = new URLSearchParams({ type: "totals" });
  if (month) params.set("month", month);
  if (year) params.set("year", year);
  const endpoint = `/payroll/summary?${params.toString()}`;

  const crud = useCrud({
    queryKey: ["payroll-totals", month, year],
    endpoint,
    enabled: !!(month && year),
    select: (data) => data?.data ?? data,
  });

  return {
    totals: crud.data,
    isLoading: crud.isLoading,
    isError: crud.isError,
    refetch: crud.refetch,
  };
}

// ─── 3. Payroll Summary (paid / unpaid) ─────────────────────────────────────
export function usePayrollSummary({ month, year, type, department } = {}) {
  const params = new URLSearchParams();
  if (month) params.set("month", month);
  if (year) params.set("year", year);
  if (type) params.set("type", type);
  if (department) params.set("department", department);
  const endpoint = `/payroll/summary?${params.toString()}`;

  const crud = useCrud({
    queryKey: ["payroll-summary", month, year, type, department],
    endpoint,
    enabled: !!(month && year),
    select: (data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      return data;
    },
  });

  return {
    employees: crud.data ?? [],
    isLoading: crud.isLoading,
    isError: crud.isError,
    refetch: crud.refetch,
  };
}

// ─── 4. Employee Payroll Details ─────────────────────────────────────────────
export function useEmployeePayrollDetails({ employeeId, month, year } = {}) {
  const params = new URLSearchParams();
  if (month) params.set("month", month);
  if (year) params.set("year", year);
  const endpoint = employeeId
    ? `/payroll/employees/${employeeId}/details?${params.toString()}`
    : null;

  const crud = useCrud({
    queryKey: ["payroll-employee-details", employeeId, month, year],
    endpoint,
    enabled: !!(employeeId && month && year),
    select: (data) => data?.data ?? data,
  });

  return {
    details: crud.data,
    isLoading: crud.isLoading,
    isError: crud.isError,
    refetch: crud.refetch,
  };
}

// ─── 5. Create Payroll Deductions ────────────────────────────────────────────
export function usePayrollDeductions() {
  const crud = useCrud({
    queryKey: ["payroll-list"],
    endpoint: "/payroll/deductions",
    enabled: false,
    useJsonPayload: true,
    onSuccess: () => {
      crud.queryClient.invalidateQueries({ queryKey: ["payroll-totals"] });
    },
  });

  const createDeductions = (data) => crud.createItem({ body: data });

  return { createDeductions, isCreating: crud.creating };
}

// ─── 6. Create Payroll Bonuses ───────────────────────────────────────────────
export function usePayrollBonuses() {
  const crud = useCrud({
    queryKey: ["payroll-list"],
    endpoint: "/payroll/bonuses",
    enabled: false,
    useJsonPayload: true,
    onSuccess: () => {
      crud.queryClient.invalidateQueries({ queryKey: ["payroll-totals"] });
    },
  });

  const createBonuses = (data) => crud.createItem({ body: data });

  return { createBonuses, isCreating: crud.creating };
}

// ─── 7. Approve Salaries ─────────────────────────────────────────────────────
export function useApproveSalaries() {
  const crud = useCrud({
    queryKey: ["payroll-list"],
    endpoint: "/payroll/approve",
    enabled: false,
    useJsonPayload: true,
    onSuccess: () => {
      crud.queryClient.invalidateQueries({ queryKey: ["payroll-totals"] });
      crud.queryClient.invalidateQueries({ queryKey: ["payroll-summary"] });
    },
  });

  const approveSalaries = (data) => crud.createItem({ body: data });

  return { approveSalaries, isApproving: crud.creating };
}

// ─── 8. Edit Salary Profile ──────────────────────────────────────────────────
export function useEditSalaryProfile() {
  const crud = useCrud({
    queryKey: ["payroll-list"],
    endpoint: "/payroll/salary-profile",
    enabled: false,
    useJsonPayload: true,
    onSuccess: () => {
      crud.queryClient.invalidateQueries({ queryKey: ["payroll-employee-details"] });
    },
  });

  const editSalaryProfile = ({ employeeId, body }) =>
    crud.updateItem({ id: employeeId, body, method: "put", useJsonPayload: true });

  return { editSalaryProfile, isUpdating: crud.updating };
}

// ─── 9. Export Payroll (blob download عبر useCrud.fetchItem) ────────────────
export function useExportPayroll() {
  const crud = useCrud({ endpoint: "/payroll/export", enabled: false });
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const exportPayroll = async ({ month, year, format }) => {
    try {
      format === "pdf" ? setIsExportingPdf(true) : setIsExportingExcel(true);

      const blobData = await crud.fetchItem({
        params: { month, year, format },
        responseType: "blob",
      });

      const ext = format === "excel" ? "xlsx" : "pdf";
      const filename = `payroll_${month}_${year}.${ext}`;
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`تم تصدير الملف: ${filename}`);
      return { filename };
    } finally {
      format === "pdf" ? setIsExportingPdf(false) : setIsExportingExcel(false);
    }
  };

  return { exportPayroll, isExportingPdf, isExportingExcel };
}

// ─── 10. Generate Payroll ─────────────────────────────────────────────────────
export function useGeneratePayroll() {
  const crud = useCrud({
    queryKey: ["payroll-list"],
    endpoint: "/payroll/generate",
    enabled: false,
    useJsonPayload: true,
    onSuccess: () => {
      crud.queryClient.invalidateQueries({ queryKey: ["payroll-totals"] });
      crud.queryClient.invalidateQueries({ queryKey: ["payroll-summary"] });
    },
  });

  const generatePayroll = (data) => crud.createItem({ body: data });

  return { generatePayroll, isGenerating: crud.creating };
}

// ─── Download Payroll Slip (blob عبر useCrud.fetchItem) ─────────────────────
export function useDownloadPayrollSlip() {
  const crud = useCrud({ enabled: false });
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPayrollSlip = async (payrollId) => {
    try {
      setIsDownloading(true);
      const blobData = await crud.fetchItem({
        endpoint: `/payroll/slip/${payrollId}/pdf`,
        responseType: "blob",
      });

      const filename = `payroll_slip_${payrollId}.pdf`;
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`تم تحميل كشف الراتب: ${filename}`);
      return { filename };
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadPayrollSlip, isDownloading };
}

// ─── Send Payroll Slip Email (POST عبر useCrud.createItem) ──────────────────
export function useSendPayrollSlip() {
  const crud = useCrud({ enabled: false, useJsonPayload: true });

  const sendPayrollSlip = async (payrollId) => {
    const res = await crud.createItem({
      endpoint: `/payroll/slip/${payrollId}/email`,
      body: {},
    });
    return res;
  };

  return { sendPayrollSlip, isSending: crud.creating };
}