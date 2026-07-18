import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { FormField, FormControl, FormLabel } from "@/components/ui/form-field";
import { Calendar, RefreshCw, User } from "lucide-react";
import PillGroup from "@/shared/components/PillGroup";
import MultiPillGroup from "@/shared/components/MultiPillGroup";
import { DatePicker } from "@/shared/forms/DatePicker";
import { cn } from "@/lib/utils";
import { useCrud } from "@/hooks/useCrud";
import { useShifts } from "@/components/dashboard/Settings/hooks/useShifts";

const SCHEDULE_TYPE_OPTIONS = [
  { value: "fixed", label: "ساعات ثابتة" },
  { value: "shift", label: "نظام الورديات" },
];

const DAY_OPTIONS = [
  { value: "saturday", label: "السبت" },
  { value: "sunday", label: "الأحد" },
  { value: "monday", label: "الاثنين" },
  { value: "tuesday", label: "الثلاثاء" },
  { value: "wednesday", label: "الأربعاء" },
  { value: "thursday", label: "الخميس" },
  { value: "friday", label: "الجمعة" },
];


const RECURRENCE_OPTIONS = [
  { value: "fixed", label: "ثابت" },
  { value: "weekly", label: "اسبوعي" },
  { value: "monthly", label: "شهري" },
];

function EmployeeAvatar({ employee }) {
  const [imgError, setImgError] = useState(false);

  if (!employee.photo || imgError) {
    return (
      <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
        <User className="h-5 w-5 text-gray-500" />
      </div>
    );
  }

  return (
    <img
      src={employee.photo}
      alt={employee.name}
      className="h-10 w-10 rounded-full border-2 border-white object-cover"
      onError={() => setImgError(true)}
    />
  );
}

function ShiftOptionCard({ option, selected, onSelect }) {
  const Icon = option.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={cn(
        "w-full flex items-center gap-3 rounded-lg border px-4 py-3.5 text-right transition-colors",
        selected
          ? "border-primary bg-primary/10"
          : "border-gray-200 hover:border-gray-300"
      )}
    >
       <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-primary" : "border-gray-300"
        )}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </span>
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", option.bgClassName)}>
          <Icon className={cn("h-6 w-6 shrink-0", option.iconClassName)} />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900">{option.label}</p>
          <p className="text-sm text-muted-foreground pt-2">{option.time}</p>
        </div>
      </div>
     
    </button>
  );
}

export function CustomScheduleSheet({ open, onOpenChange, selectedIds, employees }) {
  const [scheduleType, setScheduleType] = useState("fixed");

  const selectedEmployees = employees?.filter((emp) => selectedIds.has(emp.id)) || [];
  const employeeIds = Array.from(selectedIds);

  // Fixed-hours tab state
  const [selectedDays, setSelectedDays] = useState(["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [startDate, setStartDate] = useState("");

  // Shift-system tab state
  const [selectedShift, setSelectedShift] = useState("");
  const [recurrence, setRecurrence] = useState("fixed");
  const [shiftStartDate, setShiftStartDate] = useState("");

  // Fetch shifts from API
  const { data: shifts, isLoading: loadingShifts } = useShifts();

  // Fetch current schedule for the first selected employee
  const { data: currentSchedule, isLoading: loadingSchedule } = useCrud({
    queryKey: ["schedule", employeeIds[0]],
    endpoint: employeeIds[0] ? `/schedules/${employeeIds[0]}` : "",
    enabled: open && employeeIds.length > 0,
  });

  // Assign schedule API
  const { createItem: assignSchedule, isCreating: assigning } = useCrud({
    endpoint: '/schedules/assign',
    enabled: false,
    useJsonPayload: true,
  });

  // Load current schedule data when sheet opens
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (currentSchedule && !loadingSchedule) {
      const schedule = currentSchedule?.data?.schedule || currentSchedule?.schedule || currentSchedule?.data || currentSchedule;
      if (schedule) {
        setScheduleType(schedule.schedule_type || "fixed");
        setSelectedDays(schedule.work_days || []);
        setStartTime(schedule.start_time?.substring(0, 5) || "09:00");
        setEndTime(schedule.end_time?.substring(0, 5) || "17:00");
        setStartDate(schedule.effective_from || "");
        if (schedule.schedule_type === "shift" && schedule.shift_id) {
          setSelectedShift(schedule.shift_id);
          setRecurrence(schedule.recurrence_type || "fixed");
          setShiftStartDate(schedule.effective_from || "");
        }
      }
    }
  }, [currentSchedule, loadingSchedule]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (employeeIds.length === 0) {
      alert("الرجاء اختيار موظف واحد على الأقل");
      return;
    }

    let payload;

    if (scheduleType === "fixed") {
      payload = {
        employee_ids: employeeIds,
        schedule_type: "fixed",
        work_days: selectedDays,
        start_time: startTime,
        end_time: endTime,
        effective_from: startDate || new Date().toISOString().split('T')[0],
      };
    } else if (scheduleType === "shift") {
      if (!selectedShift) {
        alert("الرجاء اختيار شيفت");
        return;
      }
      payload = {
        employee_ids: employeeIds,
        schedule_type: "shift",
        shift_id: selectedShift,
        recurrence_type: recurrence,
        effective_from: shiftStartDate || new Date().toISOString().split('T')[0],
      };
    }

    try {
      await assignSchedule({
        body: payload,
        method: "post",
        useJsonPayload: true,
      });
      alert("تم تطبيق الجدول بنجاح");
      onOpenChange(false);
    } catch {
      alert("حدث خطأ أثناء تطبيق الجدول");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="left">
      <SheetContent className="!max-w-[600px] overflow-y-auto">
        <SheetTitle className="sr-only">تعيين مواعيد عمل مخصصة</SheetTitle>

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">تعيين مواعيد عمل مخصصة</h2>
        </div>

        {selectedIds.size > 0 && (
          <div className="mb-6 p-4 bg-[#EDF8FC] rounded-lg">
            <div className="flex items-start justify-between gap-4">
             
              <div className="flex -space-x-3 space-x-reverse">
                {selectedEmployees.slice(0, 3).map((employee) => (
                  <EmployeeAvatar key={employee.id} employee={employee} />
                ))}
                {selectedEmployees.length > 3 && (
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-white text-xs font-medium">
                    +{selectedEmployees.length - 3}
                  </div>
                )}
              </div>
               <div>
                <p className="text-sm text-primary mb-1">{selectedIds.size} موظفين محددين</p>
                <p className="text-lg font-semibold text-primary">سيتم تطبيق هذا الجدول علي جميع الموظفيين المحددين فور الحفظ</p>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Type Toggle */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">نوع الجدول</p>
          <PillGroup
            options={SCHEDULE_TYPE_OPTIONS}
            value={scheduleType}
            onChange={setScheduleType}
          />
        </div>

        {scheduleType === "fixed" ? (
          <>
            {/* Work Days */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">مواعيد العمل</p>
              <MultiPillGroup
                options={DAY_OPTIONS}
                values={selectedDays}
                onToggle={toggleDay}
              />
            </div>

            {/* Start / End Time */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <FormField name="startTime">
                <FormLabel>وقت الحضور</FormLabel>
                <FormControl
                  type="time"
                  value={startTime}
                  onChange={setStartTime}
                  className="h-10 text-sm"
                />
              </FormField>
              <FormField name="endTime">
                <FormLabel>وقت الانصراف</FormLabel>
                <FormControl
                  type="time"
                  value={endTime}
                  onChange={setEndTime}
                  className="h-10 text-sm"
                />
              </FormField>
            </div>

            {/* Start Date */}
            <div className="mb-6">
              <FormField name="startDate">
                <FormLabel>يبدأ تطبيق الجدول من</FormLabel>
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="اختر البداية"
                />
              </FormField>
            </div>
          </>
        ) : (
          <>
            {/* Shift Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">اختيار الشيفت</p>
              {loadingShifts ? (
                <p className="text-sm text-muted-foreground">جاري تحميل الورديات...</p>
              ) : shifts && shifts.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {shifts.map((shift) => {
                    const shiftOption = {
                      value: shift.id,
                      label: shift.name || "شيفت",
                      time: shift.day_times?.length > 0 
                        ? `${shift.day_times[0].start_time} - ${shift.day_times[0].end_time}`
                        : "مواعيد متغيرة",
                      icon: RefreshCw,
                      bgClassName: "bg-[#DB4B862B]",
                      iconClassName: "text-[#DB4B86]",
                    };
                    return (
                      <ShiftOptionCard
                        key={shift.id}
                        option={shiftOption}
                        selected={selectedShift === shift.id}
                        onSelect={setSelectedShift}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">لا توجد ورديات متاحة. يرجى إنشاء ورديات من الإعدادات أولاً.</p>
              )}
            </div>

            {/* Recurrence */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">نوع التدوير</p>
              <PillGroup
                options={RECURRENCE_OPTIONS}
                value={recurrence}
                onChange={setRecurrence}
              />
            </div>

            {/* Start Date */}
            <div className="mb-6">
              <FormField name="shiftStartDate">
                <FormLabel>يبدأ تطبيق الجدول من</FormLabel>
                <DatePicker
                  value={shiftStartDate}
                  onChange={setShiftStartDate}
                  placeholder="اختر البداية"
                />
              </FormField>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            className="flex-1 h-12 text-base gap-2 bg-[#4E9DA8] text-white hover:bg-[#4E9DA8]/80"
            onClick={handleSave}
            disabled={assigning}
          >
            {assigning ? "جاري التطبيق..." : "تطبيق الجدول"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-12 text-base gap-2 border-gray-300 hover:bg-gray-50"
            onClick={() => onOpenChange(false)}
            disabled={assigning}
          >
            إلغاء
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}