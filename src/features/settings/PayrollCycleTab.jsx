import { DollarSign, CalendarDays, FileSliders, BadgeInfo } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form-field";
import PillGroup from "@/components/shared/PillGroup";
import { SectionHeader } from "./SectionHeader";
import FormInput from "@/components/shared/forms/FormInput";
import { useFormContext } from "react-hook-form";

export function PayrollCycleTab() {
  const { watch, setValue, register } = useFormContext();

  const mode = watch("payrollCycle.mode");
  const startDay = watch("payrollCycle.startDay");
  const endDay = watch("payrollCycle.endDay");

  return (
    <Card className="border-gray-100 max-w-3xl mx-auto">
      <CardContent className="p-4 sm:p-5">
        {/* Header */}
        <SectionHeader
          icon={DollarSign}
          tone="blue"
          title="دورة الرواتب"
          description="حدد الفترة الزمنية التي يتم على أساسها حساب ومسير رواتب الموظفين"
        />

        {/* Label */}
        <FormLabel className="mt-4 text-sm sm:text-base">
          دورة الرواتب
        </FormLabel>

        {/* Mode Pills */}
        <PillGroup
          options={[
            { value: "fixed", label: "نظام 30 يوم", icon: CalendarDays },
            { value: "flexible", label: "نظام مرن", icon: FileSliders }
          ]}
          value={mode}
          onChange={(newMode) => {
            setValue("payrollCycle.mode", newMode);
            setValue("payrollCycle.cycleType", newMode === "flexible" ? "custom" : "fixed_30_days");
          }}
        />

        {/* Day Numbers */}
        {mode === "flexible" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <FormInput
              label="يوم البداية"
              name="payrollCycle.startDay"
              type="number"
              register={register}
              value={startDay}
              min={1}
              max={31}
              className="mb-4"
            />
            <FormInput
              label="يوم النهاية"
              name="payrollCycle.endDay"
              type="number"
              register={register}
              value={endDay}
              min={1}
              max={31}
              className="mb-4"
            />
          </div>
        )}

        {/* Info Box */}
        <div
          className="
            mt-4 sm:mt-5
            bg-[#EDF8FC]
            rounded-xl
            p-3 sm:p-4
            text-sm sm:text-base
            text-foreground
            leading-relaxed
            flex items-start gap-2
            max-w-full
          "
        >
          <BadgeInfo className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
          {mode === "flexible" ? (
            <p>
              يتم ضبط مدة الدورة تلقائيًا حسب عدد أيام كل شهر.
            </p>
          ) : (
            <p>
              في نظام 30 يوم تحسب الرواتب بشكل ثابت من أول إلى آخر يوم في الشهر
              لجميع الموظفين.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}