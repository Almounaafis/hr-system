import { Percent } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form-field";
import FormInput from "@/shared/forms/FormInput";
import PillGroup from "@/shared/components/PillGroup";
import { SectionHeader } from "./SectionHeader";
import { ToggleRow } from "./ToggleRow";
import { useFormContext } from "react-hook-form";

export function DeductionPolicyTab() {
  const { register, watch, setValue } = useFormContext();

  const deductionType = watch("deductionPolicy.deductionType");
  const discountFactor = watch("deductionPolicy.discountFactor");
  const countAbsenceAsFullDay = watch("deductionPolicy.countAbsenceAsFullDay");
  const autoApplyDeductions = watch("deductionPolicy.autoApplyDeductions");
  const tiers = watch("deductionTiers") || [];

  return (
    <Card className="border-gray-100 max-w-3xl mx-auto">
      <CardContent className="p-5">
        <SectionHeader
          icon={Percent}
          tone="rose"
          title="سياسة الخصومات"
          description="قم بتحديد آلية احتساب خصومات التأخير والغياب وفقا لسياسة الشركة."
        />
        <FormLabel>نوع الخصم</FormLabel>
        <PillGroup
          options={[
            { value: "fixed", label: "خصم ثابت" },
            { value: "multiplier", label: "خصم مضاعف" }
          ]}
          value={deductionType}
          onChange={(val) => setValue("deductionPolicy.deductionType", val)}
        />

        {deductionType === "multiplier" ? (
          <>
            <div className="mt-4 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2.5 text-base text-primary">
              يتم احتساب الخصم بناءً على عدد ساعات التأخير ومعامل الخصم المحدد.
            </div>

            <div className="mt-4">
              <FormLabel>معامل الخصم</FormLabel>
              <div className="mt-2 relative">
                <FormInput
                  label=""
                  name="deductionPolicy.discountFactor"
                  type="select"
                  register={register}
                  value={discountFactor || "2"}
                  options={[
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3", label: "3" },
                    { value: "4", label: "4" },
                    { value: "5", label: "5" }
                  ]}
                  className="bg-background border-border !pe-34"
                />
                <span className="absolute pointer-events-none right-3 top-1/2 -translate-y-1/2 text-base text-foreground">
                  كل ساعة تأخير = ×
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mt-4 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2.5 md:text-base text-primary">
              حدد فئة الخصم بناءً على مدة التأخير
            </div>

            <div className="mt-3 space-y-3">
              {tiers.map((tier, idx) => (
                <div key={tier.id} className="grid md:grid-cols-2 gap-3 items-end">
                  <FormInput
                    label="مدة التأخير"
                    name={`deductionTiers.${idx}.range`}
                    type="select"
                    value={`${tier.from}-${tier.to}`}
                    onChange={(e) => {
                      const [from, to] = e.target.value.split('-').map(Number);
                      const updatedTiers = tiers.map(t => t.id === tier.id ? { ...t, from, to } : t);
                      setValue("deductionTiers", updatedTiers);
                    }}
                    options={[
                      { value: "15-30", label: "من 15 إلى 30 دقيقة" },
                      { value: "30-60", label: "من 30 إلى 60 دقيقة" },
                      { value: "60-999", label: "أكثر من ساعة" }
                    ]}
                  />
                  <FormInput
                    label="قيمة الخصم"
                    name={`deductionTiers.${idx}.deduction`}
                    type="select"
                    register={register}
                    value={tier.deduction}
                    options={[
                      { value: "quarter_day", label: "ربع يوم" },
                      { value: "half_day", label: "نصف يوم" },
                      { value: "full_day", label: "يوم كامل" }
                    ]}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <div className="divide-y divide-gray-100 mt-4">
          <ToggleRow
            label="احتساب الغياب ليوم كامل"
            checked={countAbsenceAsFullDay}
            onCheckedChange={(v) => setValue("deductionPolicy.countAbsenceAsFullDay", v)}
          />
          <ToggleRow
            label="تطبيق الخصومات تلقائيا على الرواتب"
            checked={autoApplyDeductions}
            onCheckedChange={(v) => setValue("deductionPolicy.autoApplyDeductions", v)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
