import TableShared from "@/shared/components/TableShared";
import { Checkbox } from "@/components/ui/checkbox";
import { DeductionPill } from "./DeductionPill";
import { RowActionsMenu } from "./RowActionsMenu";
import { Badge } from "@/components/ui/badge";

// Map API status → Arabic label + variant
const STATUS_MAP = {
  draft:     { label: "مسودة",        variant: "secondary" },
  approved:  { label: "معتمد",        variant: "default"   },
  paid:      { label: "تم الصرف",     variant: "success"   },
  pending:   { label: "قيد الانتظار", variant: "secondary" },
  processed: { label: "تمت المعالجة", variant: "default"   },
  error:     { label: "خطأ",          variant: "destructive"},
};

function fmt(val) {
  const n = parseFloat(val);
  return isNaN(n) ? "—" : n.toLocaleString("en-EG");
}

export function PayrollTable({ data, onAddDeduction, onAddAllowance, onViewDetails, selectedEmployeeIds, setSelectedEmployeeIds, isLoading }) {
  const handleCheckboxChange = (employeeId) => {
    if (selectedEmployeeIds.includes(employeeId)) {
      setSelectedEmployeeIds(selectedEmployeeIds.filter(id => id !== employeeId));
    } else {
      setSelectedEmployeeIds([...selectedEmployeeIds, employeeId]);
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg">
      <div className="min-w-[640px]">
        <TableShared
          isLoading={isLoading}
          columns={[
            /* ── Checkbox + Code ── */
            {
              header: "",
              cellClassName: "py-3 px-2",
              render: (row) => {
                // Try multiple possible ID field names
                const employeeId = row.employee?.id || row.id || row.employee_id || row.employeeId;
                return (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      className="rounded w-4 h-4 border-border"
                      aria-label={`تحديد ${row.employee?.name}`}
                      checked={selectedEmployeeIds.includes(employeeId)}
                      onCheckedChange={() => handleCheckboxChange(employeeId)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {row.employee?.employee_code ?? "—"}
                    </p>
                  </div>
                );
              },
            },

            /* ── Employee name + department ── */
            {
              header: "الموظف",
              render: (row) => {
                const emp = row.employee ?? {};
                const imgBase = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL?.replace("/api", "") ?? "";
                const imgSrc = emp.profile_image_url
                  ? `${imgBase}${emp.profile_image_url}`
                  : `https://i.pravatar.cc/150?u=${emp.id}`;
                return (
                  <div className="flex items-center gap-2">
                    <img
                      src={imgSrc}
                      alt={emp.name}
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex-shrink-0 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://i.pravatar.cc/150?u=${emp.id}`;
                      }}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-xs sm:text-sm pb-0.5 truncate">
                        {emp.name ?? "—"}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {emp.department ?? "—"}
                      </p>
                    </div>
                  </div>
                );
              },
            },

            /* ── Gross (total_earnings) ── */
            {
              header: "إجمالي المكتسبات",
              cellClassName: "text-right text-foreground text-xs sm:text-sm whitespace-nowrap",
              render: (row) => fmt(row.total_earnings),
            },

            /* ── Basic salary ── */
            {
              header: "الراتب الأساسي",
              cellClassName: "text-right text-foreground text-xs sm:text-sm whitespace-nowrap",
              render: (row) => fmt(row.basic_salary),
            },

            /* ── Deductions ── */
            {
              header: "الخصومات",
              cellClassName: "text-right text-xs sm:text-sm whitespace-nowrap",
              render: (row) => {
                const val = parseFloat(row.total_deductions);
                if (!isNaN(val) && val > 0) {
                  return <DeductionPill count={fmt(row.total_deductions)} />;
                }
                return <span className="text-muted-foreground">—</span>;
              },
            },
            /* ── Net salary ── */
            {
              header: "صافي الراتب",
              cellClassName: "text-right font-medium text-foreground text-xs sm:text-sm whitespace-nowrap",
              render: (row) => `${fmt(row.net_salary)} EGP`,
            },
            /* ── Status ── */
            {
              header: "الحالة",
              cellClassName: "text-center",
              render: (row) => {
                const s = STATUS_MAP[row.status] ?? { label: row.status, variant: "secondary" };
                return (
                  <Badge variant={s.variant} className="text-xs whitespace-nowrap">
                    {s.label == "finalized" ? "تم استلام الراتب" : "قيد الانتظار"}
                  </Badge>
                );
              },
            },
            /* ── Actions ── */
            {
              header: "",
              cellClassName: "py-3 px-2 text-left",
              render: (row) => (
                <RowActionsMenu
                  onAddDeduction={() => onAddDeduction(row)}
                  onAddAllowance={() => onAddAllowance(row)}
                  onViewDetails={() => onViewDetails(row)}
                  status={row.status}
                />
              ),
            },
          ]}
          data={data}
        />
      </div>
    </div>
  );
}