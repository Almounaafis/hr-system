import { KPICard } from "./KPICard";
import { DollarSign, CheckCircle, Clock, CreditCard } from "lucide-react";
import { usePayrollTotals } from "@/features/payroll/hooks/usePayroll";

export function PayrollKPIs({ month, year }) {
  const { totals, isLoading } = usePayrollTotals({ month, year });

  // New response structure: { paid: {...}, unpaid: {...} }
  const totalSalaries =
    totals?.paid?.total_net_salaries ?? "—";
  const totalDeductions =
    totals?.paid?.total_deductions ?? "—";
  const paidCount =
    totals?.paid?.employee_count ?? "—";
  const unpaidCount =
    totals?.unpaid?.employee_count ?? "—";

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="اجمالي الرواتب"
        value={isLoading ? "..." : String(totalSalaries)}
        unit="EGP"
        icon={DollarSign}
        color="blue"
      />
      <KPICard
        title="اجمالي الخصومات"
        value={isLoading ? "..." : String(totalDeductions)}
        unit="EGP"
        icon={CreditCard}
        color="red"
      />
      <KPICard
        title="تم الصرف"
        value={isLoading ? "..." : String(paidCount)}
        unit="موظف"
        icon={CheckCircle}
        color="green"
      />
      <KPICard
        title="قيد المراجعة"
        value={isLoading ? "..." : String(unpaidCount)}
        unit="موظف"
        icon={Clock}
        color="amber"
      />
    </div>
  );
}
