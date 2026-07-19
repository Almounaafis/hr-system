import { useState, useEffect, useMemo } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import {
  initialPayrollCycle,
  initialLocationSettings,
  initialWorkHours,
  initialShifts,
  initialDeductionTiers,
  initialDeductionPolicy,
  initialLeaveBalance,
  // weekDays
} from "@/features/settings/mockData";
import { PayrollCycleTab } from "@/features/settings/PayrollCycleTab";
import { LocationSettingsTab } from "@/features/settings/LocationSettingsTab";
import { WorkHoursTab } from "@/features/settings/WorkHoursTab";
import { DeductionPolicyTab } from "@/features/settings/DeductionPolicyTab";
import { LeaveBalanceTab } from "@/features/settings/LeaveBalanceTab";
import { TabBar } from "@/features/settings/TabBar";
import { AddShiftDialog } from "@/features/settings/AddShiftDialog";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { useShifts } from "@/features/settings/hooks/useShifts";

export default function PayrollAttendancePolicy() {
  const [activeTab, setActiveTab] = useState("payroll-cycle");

  const { data: settingsData, isLoading, isError, updateSettings, updating } = useSettings();
  const { data: shiftsData, createShift, updateShift, deleteShift } = useShifts();
  
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);

const shifts = useMemo(() => {
  if (!shiftsData) return initialShifts;
  return shiftsData.map((shift) => ({
    id: shift.id,
    name: shift.name,
    fromTime: shift.day_times?.[0]?.start_time || "09:00",
    toTime: shift.day_times?.[0]?.end_time || "17:00",
    fromDay: shift.day_times?.[0]?.day || "—",
    toDay: shift.day_times?.[shift.day_times.length - 1]?.day || "—",
    employeeCount: shift.employee_count || 0,
    employee_ids: shift.employee_ids || [],      
    department_ids: shift.department_ids || [],   
    effective_from: shift.effective_from,
    day_times: shift.day_times,
  }));
}, [shiftsData]);

  const methods = useForm({
    defaultValues: {
      payrollCycle: initialPayrollCycle,
      locationSettings: initialLocationSettings,
      workHours: initialWorkHours,
      deductionPolicy: initialDeductionPolicy,
      deductionTiers: initialDeductionTiers,
      leaveBalance: initialLeaveBalance,
    }
  });

  const { reset, handleSubmit } = methods;

  // Sync state with API data when it loads
  useEffect(() => {
    if (settingsData) {
      const newPayrollCycle = {
        cycleType: settingsData.payroll_cycle_type || "fixed_30_days",
        mode: settingsData.payroll_cycle_type === "fixed_30_days" ? "fixed" : "flexible",
        startDay: settingsData.payroll_cycle_start_day || 1,
        endDay: settingsData.payroll_cycle_end_day || 30,
        startDate: "",
        endDate: "",
      };

      const newLocationSettings = {
        locationName: settingsData.location_name || "",
        latitude: settingsData.location_lat || "",
        longitude: settingsData.location_lng || "",
        radius: settingsData.location_radius_meters || 100,
        verificationEnabled: settingsData.location_verification_enabled || false,
        blockOutsideRadius: settingsData.block_outside_radius || false,
      };

      const newWorkHours = {
        scheduleType: settingsData.default_schedule_type || "fixed",
        startTime: settingsData.default_start_time?.substring(0, 5) || "09:30",
        endTime: settingsData.default_end_time?.substring(0, 5) || "16:30",
        workDayStart: settingsData.default_work_day_start || "monday",
        workDayEnd: settingsData.default_work_day_end || "thursday",
        workDays: settingsData.default_work_days || ["monday", "tuesday", "wednesday", "thursday"],
      };

      const newDeductionPolicy = {
        deductionType: settingsData.deduction_type || "fixed",
        discountFactor: settingsData.deduction_multiplier ? String(parseFloat(settingsData.deduction_multiplier)) : "2",
        countAbsenceAsFullDay: settingsData.count_absence_as_full_day || false,
        autoApplyDeductions: settingsData.auto_apply_deductions || false,
      };

      const newDeductionTiers = settingsData.late_deduction_rules
        ? settingsData.late_deduction_rules.map((rule, index) => ({
            id: `tier-${index}`,
            from: rule.from_minutes || 0,
            to: rule.to_minutes || 999,
            deduction: rule.deduction || "quarter_day",
          }))
        : initialDeductionTiers;

      const newLeaveBalance = {
        annualLeave: settingsData.annual_leave_days || 21,
        sickLeave: settingsData.sick_leave_days || 14,
        emergencyLeave: settingsData.emergency_leave_days || 6,
        rolloverPolicy: settingsData.leave_rollover_policy || "carry_forward",
      };

      reset({
        payrollCycle: newPayrollCycle,
        locationSettings: newLocationSettings,
        workHours: newWorkHours,
        deductionPolicy: newDeductionPolicy,
        deductionTiers: newDeductionTiers,
        leaveBalance: newLeaveBalance,
      });
    }
  }, [settingsData, reset]);


  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">جاري التحميل...</div>;
  }

  if (isError) {
    return <div className="p-4 text-center text-destructive">حدث خطأ في تحميل البيانات</div>;
  }

  const handleOpenAddShift = () => {
    setEditingShift(null);
    setIsAddShiftOpen(true);
  };

  const handleEditShift = (shift) => {
    setEditingShift(shift);
    setIsAddShiftOpen(true);
  };

  const handleCreateShift = async (shiftPayload) => {
    try {
      if (editingShift) {
        await updateShift(editingShift.id, shiftPayload);
      } else {
        await createShift(shiftPayload);
      }
      setIsAddShiftOpen(false);
      setEditingShift(null);
    } catch (error) {
      console.error("Error creating/updating shift:", error);
    }
  };

  const handleDeleteShift = async (shiftId) => {
    try {
      await deleteShift(shiftId);
    } catch (error) {
      console.error("Error deleting shift:", error);
    }
  };

  const handleSaveSettings = handleSubmit(async (data) => {
    try {
      const formatTime = (timeStr) => {
        if (!timeStr) return "09:30";
        if (timeStr.split(':').length === 3) return timeStr.substring(0, 5);
        if (timeStr.split(':').length === 2) return timeStr;
        return "09:30";
      };
      
      const payload = {
        payroll_cycle_type: data.payrollCycle.cycleType,
        payroll_cycle_start_day: data.payrollCycle.startDay,
        payroll_cycle_end_day: data.payrollCycle.endDay,
        location_name: data.locationSettings.locationName || null,
        location_lat: data.locationSettings.latitude || null,
        location_lng: data.locationSettings.longitude || null,
        location_radius_meters: data.locationSettings.radius,
        location_verification_enabled: data.locationSettings.verificationEnabled,
        block_outside_radius: data.locationSettings.blockOutsideRadius,
        default_schedule_type: data.workHours.scheduleType,
        default_start_time: formatTime(data.workHours.startTime),
        default_end_time: formatTime(data.workHours.endTime),
        default_work_day_start: data.workHours.workDayStart,
        default_work_day_end: data.workHours.workDayEnd,
        deduction_type: data.deductionPolicy.deductionType,
        ...(data.deductionPolicy.deductionType === "multiplier" && {
          deduction_multiplier: data.deductionPolicy.discountFactor || "2"
        }),
        late_deduction_rules: data.deductionTiers.map((tier) => ({
          deduction: tier.deduction,
          to_minutes: tier.to === 999 ? null : tier.to,
          from_minutes: tier.from,
        })),
        count_absence_as_full_day: data.deductionPolicy.countAbsenceAsFullDay,
        auto_apply_deductions: data.deductionPolicy.autoApplyDeductions,
        annual_leave_days: data.leaveBalance.annualLeave,
        sick_leave_days: data.leaveBalance.sickLeave,
        emergency_leave_days: data.leaveBalance.emergencyLeave,
        leave_rollover_policy: data.leaveBalance.rolloverPolicy,
      };

      await updateSettings(payload);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  });

  const renderActiveTab = () => {
    switch (activeTab) {
      case "payroll-cycle":
        return <PayrollCycleTab />;
      case "location":
        return <LocationSettingsTab />;
      case "work-hours":
        return (
          <WorkHoursTab
            shifts={shifts}
            onAddShift={handleOpenAddShift}
            onDeleteShift={handleDeleteShift}
            onEditShift={handleEditShift}
          />
        );
      case "deductions":
        return <DeductionPolicyTab />;
      case "leave-balance":
        return <LeaveBalanceTab />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
          إعدادات النظام
        </h1>

        {/* Save Button */}
        <Button
          onClick={handleSaveSettings}
          disabled={updating}
          className="flex items-center gap-1.5 h-9 sm:h-10 px-4 text-sm sm:text-md w-full sm:w-auto"
        >
          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
          {updating ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>

      {/* Tabs */}
      <TabBar
        activeTab={activeTab}
        onChange={setActiveTab}
        className="text-sm sm:text-base"
      />

      {/* Content */}
      <div className="text-sm sm:text-base">
        <FormProvider {...methods}>
          {renderActiveTab()}
        </FormProvider>
      </div>

      {/* Dialog */}
      <AddShiftDialog
        open={isAddShiftOpen}
        onOpenChange={setIsAddShiftOpen}
        onCreate={handleCreateShift}
        editingShift={editingShift}
      />
    </div>
  );
}
