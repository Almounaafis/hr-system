function fmt(val) {
  const n = parseFloat(val);
  return isNaN(n) ? "—" : n.toLocaleString("en-EG");
}

export function SalaryBreakdownCard({ breakdown = {} ,  className="grid grid-cols-2 gap-4" }) {
  const {
    basic,
    total_earnings,
    total_deductions,
    net,
    deduction_items,
    bonus_items,
  } = breakdown;

  // Bonus = total_earnings - basic
  const bonusDiff = parseFloat(total_earnings) - parseFloat(basic);
  const hasBonus = !isNaN(bonusDiff) && bonusDiff > 0;

  // Deduction items: use array if available, otherwise show the total as one row
  const deductRows = Array.isArray(deduction_items) && deduction_items.length > 0
    ? deduction_items.map(item => ({
        reason: item.category ? `${item.reason} (${item.category})` : item.reason,
        amount: item.amount,
        quantity: item.quantity
      }))
    : parseFloat(total_deductions) > 0
      ? [{ reason: "إجمالي الخصومات", amount: total_deductions }]
      : [];

  // Earning items: use array if available, otherwise show basic + bonus
  const earningRows = Array.isArray(bonus_items) && bonus_items.length > 0
    ? [
        { reason: "الراتب الأساسي", amount: basic },
        ...bonus_items.map(item => ({
          reason: item.category ? `${item.reason} (${item.category})` : item.reason,
          amount: item.amount,
          quantity: item.quantity
        }))
      ]
    : [
        { reason: "الراتب الأساسي", amount: basic },
        ...(hasBonus ? [{ reason: "مكافآت", amount: bonusDiff }] : []),
      ];

  return (
    <div className="space-y-6">
      {/* Two Column Cards */}
      <div className={className}>
        {/* ── Deductions Card ── */}
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <h4 className="text-sm font-semibold text-red-700 mb-3">الخصومات</h4>
          <div className="space-y-3">
            {deductRows.length === 0 ? (
              <p className="text-xs text-muted-foreground">لا توجد خصومات</p>
            ) : (
              deductRows.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {item.reason}
                    {item.quantity && item.quantity > 1 && <span className="text-xs text-muted-foreground mr-1">x{item.quantity}</span>}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {fmt(item.amount)}
                  </span>
                </div>
              ))
            )}
            <div className="border-t border-red-200 pt-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-foreground">إجمالي الخصومات</span>
              <span className="text-base font-bold text-red-600">
                {fmt(total_deductions)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Earnings Card ── */}
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <h4 className="text-sm font-semibold text-green-700 mb-3">الإيرادات</h4>
          <div className="space-y-3">
            {earningRows.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {item.reason}
                  {item.quantity && item.quantity > 1 && <span className="text-xs text-muted-foreground mr-1">x{item.quantity}</span>}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {fmt(item.amount)}
                </span>
              </div>
            ))}
            <div className="border-t border-green-200 pt-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-foreground">إجمالي الإيرادات</span>
              <span className="text-base font-bold text-green-600">
                {fmt(total_earnings)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Net Salary ── */}
      <div className="bg-blue-50 rounded-lg p-4 flex gap-2 justify-between items-center flex-col">
        <span className="text-lg font-medium text-foreground">صافي المرتب</span>
        <span className="text-2xl font-bold text-green-600">
          {fmt(net)} EGP
        </span>
      </div>
    </div>
  );
}
