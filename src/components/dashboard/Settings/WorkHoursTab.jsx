import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form-field";
import FormInput from "@/shared/forms/FormInput";
import PillGroup from "@/shared/components/PillGroup";
import { SectionHeader } from "./SectionHeader";
import { ShiftsView } from "./ShiftsView";
import { useFormContext } from "react-hook-form";

export function WorkHoursTab({ shifts, onAddShift, onDeleteShift, onEditShift }) {
  const { register, watch, setValue } = useFormContext();

  const scheduleType = watch("workHours.scheduleType");
  const startTime = watch("workHours.startTime");
  const endTime = watch("workHours.endTime");
  const workDayStart = watch("workHours.workDayStart");
  const workDayEnd = watch("workHours.workDayEnd");

  return (
    <Card className="border-gray-100 max-w-3xl mx-auto">
      <CardContent className="p-4 sm:p-5">
        <SectionHeader
          icon={Clock}
          tone="amber"
          title="إعدادات ساعات العمل"
          description="حدد جداول العمل وتعيين الموظفين وفقاً لساعات العمل الثابتة أو نظام الورديات"
        />
        <FormLabel>نظام الدوام</FormLabel>
        <PillGroup
          options={[
            { value: "fixed", label: "ساعات عمل ثابتة" },
            { value: "shift", label: "نظام الورديات" }
          ]}
          value={scheduleType}
          onChange={(val) => setValue("workHours.scheduleType", val)}
        />

        {scheduleType === "shift" ? (
          <ShiftsView
            shifts={shifts}
            onAddShift={onAddShift}
            onDeleteShift={onDeleteShift}
            onEditShift={onEditShift}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <FormInput
                label="من الساعة"
                name="workHours.startTime"
                type="select"
                register={register}
                value={startTime}
                options={["09:30", "08:00", "10:00", "09:00"].map(opt => ({ value: opt, label: opt }))}
              />
              <FormInput
                label="إلى الساعة"
                name="workHours.endTime"
                type="select"
                register={register}
                value={endTime}
                options={["16:30", "17:00", "18:00", "15:00"].map(opt => ({ value: opt, label: opt }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <FormInput
                label="من يوم"
                name="workHours.workDayStart"
                type="select"
                register={register}
                value={workDayStart}
                options={[
                  { value: "saturday", label: "السبت" },
                  { value: "sunday", label: "الأحد" },
                  { value: "monday", label: "الإثنين" },
                  { value: "tuesday", label: "الثلاثاء" },
                  { value: "wednesday", label: "الأربعاء" },
                  { value: "thursday", label: "الخميس" },
                  { value: "friday", label: "الجمعة" },
                ]}
              />
              <FormInput
                label="إلى يوم"
                name="workHours.workDayEnd"
                type="select"
                register={register}
                value={workDayEnd}
                options={[
                  { value: "saturday", label: "السبت" },
                  { value: "sunday", label: "الأحد" },
                  { value: "monday", label: "الإثنين" },
                  { value: "tuesday", label: "الثلاثاء" },
                  { value: "wednesday", label: "الأربعاء" },
                  { value: "thursday", label: "الخميس" },
                  { value: "friday", label: "الجمعة" },
                ]}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}