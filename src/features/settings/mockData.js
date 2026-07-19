export const initialPayrollCycle = {
  cycleType: "fixed_30_days", // "fixed_30_days" | "custom"
  mode: "fixed", // "fixed" | "flexible" - derived from cycleType
  startDay: 1,
  endDay: 30,
  fixedDay: 30,
  startDate: "",
  endDate: ""
};

export const initialLocationSettings = {
  locationName: "",
  latitude: "",
  longitude: "",
  radius: 100,
  verificationEnabled: false,
  blockOutsideRadius: false
};

export const initialWorkHours = {
  scheduleType: "fixed", // "fixed" | "shift"
  startTime: "09:30",
  endTime: "16:30",
  workDayStart: "monday",
  workDayEnd: "thursday",
  workDays: ["monday", "tuesday", "wednesday", "thursday"]
};

export const shiftToneByName = {
  "الشيفت الصباحي": { icon: "sun", tone: "amber" },
  "الشيفت المسائي": { icon: "moon", tone: "purple" }
};

export const initialShifts = [
  {
    id: "shift-1",
    name: "الشيفت الصباحي",
    fromTime: "9:00 ص",
    toTime: "05:00 م",
    fromDay: "الأحد",
    toDay: "الخميس",
    employeeCount: 12
  },
  {
    id: "shift-2",
    name: "الشيفت المسائي",
    fromTime: "12:00 م",
    toTime: "08:00 م",
    fromDay: "الأحد",
    toDay: "الخميس",
    employeeCount: 12
  }
];

export const shiftNameOptions = ["شيفت صباحي", "شيفت مسائي", "شيفت متغير"];

export const weekDays = [
  { id: "sat", label: "السبت" },
  { id: "sun", label: "الأحد" },
  { id: "mon", label: "الإثنين" },
  { id: "tue", label: "الثلاثاء" },
  { id: "wed", label: "الأربعاء" },
  { id: "thu", label: "الخميس" },
  { id: "fri", label: "الجمعة" }
];



export const initialDeductionTiers = [
  { id: "t1", from: 15, to: 30, deduction: "quarter_day" },
  { id: "t2", from: 30, to: 60, deduction: "half_day" },
  { id: "t3", from: 60, to: 999, deduction: "full_day" }
];

export const initialDeductionPolicy = {
  deductionType: "fixed", // "fixed" | "multiplier"
  discountFactor: "2",
  countAbsenceAsFullDay: true,
  autoApplyDeductions: true
};

export const initialLeaveBalance = {
  emergencyLeave: 6,
  sickLeave: 14,
  annualLeave: 21,
  rolloverPolicy: "carry_forward" // "carry_forward" | "expire"
};

export const timeOptions = [
  { value: "04:00", label: "04:00 ص" },
  { value: "05:00", label: "05:00 ص" },
  { value: "06:00", label: "06:00 ص" },
  { value: "08:00", label: "08:00 ص" },
  { value: "09:00", label: "09:00 ص" },
  { value: "10:00", label: "10:00 ص" },
  { value: "11:00", label: "11:00 ص" },
  { value: "12:00", label: "12:00 م" },
  { value: "13:00", label: "01:00 م" },
  { value: "14:00", label: "02:00 م" },
  { value: "15:00", label: "03:00 م" },
  { value: "16:00", label: "04:00 م" },
  { value: "17:00", label: "05:00 م" },
  { value: "18:00", label: "06:00 م" },
  { value: "19:00", label: "07:00 م" },
  { value: "20:00", label: "08:00 م" },
];