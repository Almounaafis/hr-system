import { X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";
import EmployeeMultiSelect from "@/components/shared/EmployeeMultiSelect";
import FormInput from "@/components/shared/forms/FormInput";
import { weekDays, timeOptions, shiftNameOptions } from "./mockData";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useEmployeesList } from "./hooks/useEmployeesList";
import { useDepartments } from "./hooks/useDepartments";

export function AddShiftDialog({ open, onOpenChange, onCreate, editingShift }) {
  const { register, watch, setValue, reset, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      workDays: ["sat", "sun", "mon", "tue", "wed"],
      dayTimes: {
        sat: { arrival: "09:00", departure: "17:00" },
        sun: { arrival: "09:00", departure: "17:00" },
        mon: { arrival: "09:00", departure: "17:00" },
        tue: { arrival: "09:00", departure: "17:00" },
        wed: { arrival: "09:00", departure: "17:00" },
        thu: { arrival: "09:00", departure: "17:00" },
        fri: { arrival: "09:00", departure: "17:00" }
      },
      assignmentMode: "employee",
      assignedItems: [],
      searchValue: ""
    }
  });

  const nameValue = watch("name");
  const workDaysValue = watch("workDays") || [];
  const dayTimesValue = watch("dayTimes") || {};
  const assignmentModeValue = watch("assignmentMode") || "employee";
  const assignedItemsValue = watch("assignedItems") || [];
  const searchValue = watch("searchValue") || "";

  const { employees } = useEmployeesList({ search: "" });
  const { departments } = useDepartments({ search: "" });


  useEffect(() => {
    setValue("searchValue", "");
    setValue("assignedItems", []);
  }, [assignmentModeValue, setValue]);

  useEffect(() => {
    if (open) {
      if (editingShift) {
        const dayEnglishToId = {
          saturday: "sat",
          sunday: "sun",
          monday: "mon",
          tuesday: "tue",
          wednesday: "wed",
          thursday: "thu",
          friday: "fri"
        };
        let workDayIds = [];
        let timesMap = {
          sat: { arrival: "09:00", departure: "17:00" },
          sun: { arrival: "09:00", departure: "17:00" },
          mon: { arrival: "09:00", departure: "17:00" },
          tue: { arrival: "09:00", departure: "17:00" },
          wed: { arrival: "09:00", departure: "17:00" },
          thu: { arrival: "09:00", departure: "17:00" },
          fri: { arrival: "09:00", departure: "17:00" }
        };

        if (editingShift.day_times && editingShift.day_times.length > 0) {
          editingShift.day_times.forEach(dt => {
            const dayId = dayEnglishToId[dt.day];
            if (dayId) {
              workDayIds.push(dayId);
              timesMap[dayId] = {
                arrival: dt.start_time?.substring(0, 5) || "09:00",
                departure: dt.end_time?.substring(0, 5) || "17:00"
              };
            }
          });
        } else if (editingShift.fromDay && editingShift.toDay) {
          const fromIndex = weekDays.findIndex(w => w.label === editingShift.fromDay);
          const toIndex = weekDays.findIndex(w => w.label === editingShift.toDay);
          if (fromIndex !== -1 && toIndex !== -1) {
            const range = fromIndex <= toIndex
              ? weekDays.slice(fromIndex, toIndex + 1)
              : [...weekDays.slice(fromIndex), ...weekDays.slice(0, toIndex + 1)];

            range.forEach(d => {
              workDayIds.push(d.id);
              timesMap[d.id] = {
                arrival: editingShift.fromTime || "09:00",
                departure: editingShift.toTime || "17:00"
              };
            });
          }
        }

        reset({
          name: editingShift.name || "",
          workDays: workDayIds,
          dayTimes: timesMap,
          assignmentMode: editingShift.department_ids?.length > 0 ? "department" : "employee",
          assignedItems: editingShift.department_ids?.length > 0
            ? editingShift.department_ids
            : (editingShift.employee_ids || []),
          searchValue: ""
        });
      } else {
        reset({
          name: "",
          workDays: ["sat", "sun", "mon", "tue", "wed"],
          dayTimes: {
            sat: { arrival: "09:00", departure: "17:00" },
            sun: { arrival: "09:00", departure: "17:00" },
            mon: { arrival: "09:00", departure: "17:00" },
            tue: { arrival: "09:00", departure: "17:00" },
            wed: { arrival: "09:00", departure: "17:00" },
            thu: { arrival: "09:00", departure: "17:00" },
            fri: { arrival: "09:00", departure: "17:00" }
          },
          assignmentMode: "employee",
          assignedItems: [],
          searchValue: ""
        });
      }
    }
  }, [open, editingShift, reset]);

  const toggleDay = (dayId) => {
    const exists = workDaysValue.includes(dayId);
    const newDays = exists
      ? workDaysValue.filter((d) => d !== dayId)
      : [...workDaysValue, dayId];
    setValue("workDays", newDays);
  };

  const removeItemChip = (itemId) => {
    setValue("assignedItems", assignedItemsValue.filter((id) => id !== itemId));
  };

  const sortedWorkDays = [...workDaysValue].sort((a, b) => {
    const indexA = weekDays.findIndex((d) => d.id === a);
    const indexB = weekDays.findIndex((d) => d.id === b);
    return indexA - indexB;
  });

  const handleFormSubmit = handleSubmit((data) => {
    const dayIdToEnglishName = {
      sat: "saturday",
      sun: "sunday",
      mon: "monday",
      tue: "tuesday",
      wed: "wednesday",
      thu: "thursday",
      fri: "friday"
    };
    const selectedWorkDaysSorted = [...data.workDays].sort((a, b) => {
      const indexA = weekDays.findIndex((d) => d.id === a);
      const indexB = weekDays.findIndex((d) => d.id === b);
      return indexA - indexB;
    });

    const dayTimesPayload = selectedWorkDaysSorted.map((dayId) => {
      const times = data.dayTimes?.[dayId] || { arrival: "09:00", departure: "17:00" };
      return {
        day: dayIdToEnglishName[dayId],
        start_time: times.arrival,
        end_time: times.departure
      };
    });

    const shiftPayload = {
      name: data.name || "شيفت متغير",
      day_times: dayTimesPayload,
      ...(data.assignmentMode === "employee"
        ? { employee_ids: assignedItemsValue || [] }
        : {
          department_names: assignedItemsValue.map(id => {
            const dept = departments?.find(d => d.id === id);
            return dept?.name || "";
          }).filter(Boolean)
        }
      ),
      effective_from: editingShift?.effective_from || new Date().toISOString().split('T')[0]
    };

    onCreate(shiftPayload);
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="left">
      <SheetContent className="!max-w-[620px] rounded-r-3xl p-0 overflow-y-auto" dir="rtl">
        <SheetTitle className="sr-only">
          {editingShift ? "تعديل الشيفت" : "اضافة شيفت جديد"}
        </SheetTitle>
        <h2 className="text-xl font-bold text-foreground px-6 pt-6 pb-2">
          {editingShift ? "تعديل الشيفت" : "اضافة شيفت جديد"}
        </h2>

        <div className="px-6 pb-6 space-y-6">
          <FormInput
            name="name"
            label="اسم الوردية"
            type="select"
            register={register}
            value={nameValue}
            options={shiftNameOptions.map(opt => ({ value: opt, label: opt }))}
            placeholder="شيفت متغير"
            className="w-full rounded-xl border border-border px-3 py-2.5 text-base text-foreground focus:border-primary focus:outline-none bg-background shadow-sm"
          />

          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground">مواعيد العمل</h3>

            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => {
                const isSelected = workDaysValue.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-semibold border transition-all shadow-sm",
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-border text-foreground hover:bg-muted"
                    )}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              {sortedWorkDays.map((dayId) => {
                const dayObj = weekDays.find((d) => d.id === dayId);
                const dayTimes = dayTimesValue[dayId] || { arrival: "09:00", departure: "17:00" };
                return (
                  <div key={dayId} className="flex items-center justify-between gap-4">
                    <span className="w-16 text-base font-semibold text-foreground text-right">{dayObj.label}</span>
                    <div className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-2 flex-1 justify-between border border-transparent">
                      <FormInput
                        name={`dayTimes.${dayId}.arrival`}
                        type="select"
                        register={register}
                        value={dayTimes.arrival}
                        options={timeOptions}
                        className="bg-transparent min-w-[100px] border-0 shadow-none focus:ring-0 focus:ring-offset-0 w-fit h-auto p-0 flex-row-reverse gap-1 font-semibold text-foreground [&>svg]:h-4 [&>svg]:w-4 [&>svg]:opacity-60 [&>svg]:text-muted-foreground hover:text-foreground"
                      />
                      <span className="text-sm font-semibold text-muted-foreground">الى</span>
                      <FormInput
                        name={`dayTimes.${dayId}.departure`}
                        type="select"
                        register={register}
                        value={dayTimes.departure}
                        options={timeOptions}
                        className="bg-transparent min-w-[100px] border-0 shadow-none focus:ring-0 focus:ring-offset-0 w-fit h-auto p-0 flex-row-reverse gap-1 font-semibold text-foreground [&>svg]:h-4 [&>svg]:w-4 [&>svg]:opacity-60 [&>svg]:text-muted-foreground hover:text-foreground"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground">تعيين الموظفين والأقسام</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField name="assignmentMode" className="w-full md:col-span-1">
                <FormInput
                  name="assignmentMode"
                  type="select"
                  register={register}
                  value={assignmentModeValue}
                  options={[
                    { value: "department", label: "حسب القسم" },
                    { value: "employee", label: "حسب الموظف" }
                  ]}
                  className="w-full rounded-xl border border-border px-3 py-2.5 text-base text-foreground focus:border-primary focus:outline-none bg-background shadow-sm"
                />
              </FormField>

              <FormField name="assignedItems" className="w-full md:col-span-2">
                <EmployeeMultiSelect
                  employees={assignmentModeValue === "employee" ? (employees || []) : (departments || [])}
                  value={assignedItemsValue}
                  onChange={(val) => setValue("assignedItems", val)}
                  onSearchChange={(val) => setValue("searchValue", val)}
                  searchValue={searchValue}
                  placeholder={assignmentModeValue === "employee" ? "اختر الموظفين" : "اختر الأقسام"}
                  label={assignmentModeValue === "employee" ? "الموظفين" : "الأقسام"}
                />
              </FormField>
            </div>

            {assignedItemsValue.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {assignedItemsValue.map((itemId) => {
                  const item = assignmentModeValue === "employee"
                    ? (employees || []).find((e) => e.id === itemId)
                    : (departments || []).find((d) => d.id === itemId);
                  if (!item) return null;
                  return (
                    <span
                      key={itemId}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#E6F4F5] border border-[#BDE3E6] px-3.5 py-2 text-sm font-semibold text-[#138893] shadow-sm"
                    >
                      {item.name}
                      <button
                        type="button"
                        onClick={() => removeItemChip(itemId)}
                        aria-label={`إزالة ${item.name}`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 px-6 py-5 border-t border-border bg-background">
          <Button
            className="flex-1 h-12 text-base font-semibold bg-[#4E9DA8] text-white hover:bg-[#4E9DA8]/90 rounded-xl shadow-sm transition-all"
            onClick={handleFormSubmit}
          >
            {editingShift ? "حفظ" : "انشاء"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-12 text-base font-semibold border border-border text-foreground hover:bg-muted rounded-xl shadow-sm transition-all"
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
