// Attendance time rules
// Shift starts at 10:00 AM with a 10 minute grace period — anyone checking in
// after 10:10 AM is considered late, and their check-in time is shown in red.
export const SHIFT_START_MINUTES = 10 * 60; // 10:00 AM
export const GRACE_PERIOD_MINUTES = 10;

export function parseTimeToMinutes(timeStr) {
  const match = timeStr?.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  let [, hours, minutes, period] = match;
  hours = Number(hours);
  minutes = Number(minutes);
  if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function isLateCheckIn(timeStr) {
  const minutes = parseTimeToMinutes(timeStr);
  if (minutes === null) return false;
  return minutes > SHIFT_START_MINUTES + GRACE_PERIOD_MINUTES;
}

export function convertToTimeInput(timeStr) {
  const match = timeStr?.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return "";
  let [, hours, minutes, period] = match;
  hours = Number(hours);
  if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

export function getInitials(name = "") {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export const AVATAR_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-green-100", text: "text-green-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-purple-100", text: "text-purple-700" },
  { bg: "bg-pink-100", text: "text-pink-700" },
];

export function getAvatarColor(id = "") {
  const sum = String(id).split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export function formatTime(isoOrTime) {
  if (!isoOrTime) return "—";
  const d = new Date(isoOrTime);
  if (isNaN(d.getTime())) return isoOrTime;
  return d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

export function mapAttendanceRecord(record) {
  const employee = record.employee || {};
  const color = getAvatarColor(employee.id);

  return {
    id: record.id,
    employeeCode: employee.employee_code,
    name: employee.name,
    department: employee.department,
    checkIn: formatTime(record.clock_in),
    checkOut: formatTime(record.clock_out),
    hoursWorked: record.work_hours ?? "—",
    status: record.status,
    avatar: getInitials(employee.name),
    avatarBg: color.bg,
    avatarColor: color.text,
    _raw: record,
  };
}
