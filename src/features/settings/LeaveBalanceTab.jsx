import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";
import { StatBox } from "./StatBox";
import { ToggleRow } from "./ToggleRow";
import { useFormContext } from "react-hook-form";

export function LeaveBalanceTab() {
  const { watch, setValue } = useFormContext();

  const emergencyLeave = watch("leaveBalance.emergencyLeave");
  const sickLeave = watch("leaveBalance.sickLeave");
  const annualLeave = watch("leaveBalance.annualLeave");
  const rolloverPolicy = watch("leaveBalance.rolloverPolicy");

  return (
    <Card className="border-gray-100 max-w-3xl mx-auto">
      <CardContent className="md:p-5">
        <SectionHeader
          icon={CalendarDays}
          tone="green"
          title="رصيد الإجازات"
          description="هنا يتم تحديد أرصدة الإجازات المسموحة للموظفين وفقاً لسياسة الشركة"
        />
        <div className="grid md:grid-cols-3 gap-3 pb-4">
          <StatBox
            value={emergencyLeave}
            onChange={(v) => setValue("leaveBalance.emergencyLeave", v)}
            label="الإجازات الطارئة"
            unit="يوم / السنة"
          />
          <StatBox
            value={sickLeave}
            onChange={(v) => setValue("leaveBalance.sickLeave", v)}
            label="الإجازات المرضية"
            unit="يوم / السنة"
          />
          <StatBox
            value={annualLeave}
            onChange={(v) => setValue("leaveBalance.annualLeave", v)}
            label="الإجازات السنوية"
            unit="يوم / السنة"
          />
        </div>
        <div className="space-y-2">
          <ToggleRow
            label="ترحيل رصيد الاجازات السنوية غير المستخدم إلى السنة التالية"
            checked={rolloverPolicy === "carry_forward"}
            onCheckedChange={(v) => setValue("leaveBalance.rolloverPolicy", v ? "carry_forward" : "expire")}
          />
          <ToggleRow
            label="انتهاء الرصيد بنهاية السنة"
            checked={rolloverPolicy === "expire"}
            onCheckedChange={(v) => setValue("leaveBalance.rolloverPolicy", v ? "expire" : "carry_forward")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
