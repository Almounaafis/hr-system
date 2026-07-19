// ─── Data Transformation Helpers ────────────────────────────────────────────

export function transformKPIs(stats) {
    const {
        total_employees = 0,
        present_count = 0,
        late_count = 0,
        absent_count = 0,
        vacation_count = 0,
    } = stats;

    return [
        {
            title: "إجمالي الموظفين",
            value: total_employees.toString(),
            change: "+0",
            changeType: "neutral",
            icon: "Users",
            color: "blue",
        },
        {
            title: "الحضور اليوم",
            value: present_count.toString(),
            change: "+0",
            changeType: "neutral",
            icon: "CalendarCheck",
            color: "green",
        },
        {
            title: "المتأخرين",
            value: late_count.toString(),
            change: "+0",
            changeType: "neutral",
            icon: "Clock",
            color: "orange",
        },
        {
            title: "الغياب",
            value: absent_count.toString(),
            change: "+0",
            changeType: "neutral",
            icon: "XCircle",
            color: "red",
        },
        {
            title: "طلبات الإجازات",
            value: vacation_count.toString(),
            change: "+0",
            changeType: "neutral",
            icon: "CalendarOff",
            color: "purple",
        },
    ];
}


export function transformTodayActivity(stats) {
  const { present_percent = 0, late_percent = 0, absent_percent = 0 } = stats;
  return [
    { key: "present", label: "الحضور اليوم", value: present_percent, color: "#22C55E" },
    { key: "late", label: "المتأخرين", value: late_percent, color: "#F59E0B" },
    { key: "absent", label: "الغياب", value: absent_percent, color: "#EF4444" },
  ];
}