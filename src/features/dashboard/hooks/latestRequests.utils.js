/* ===================== */
/* Constants / Lookups   */
/* ===================== */
export const REQUEST_TYPE_LABELS = {
  bonus: "طلب مكافأة",
  deduction: "طلب خصم",
  leave: "طلب إجازة",
  overtime: "طلب أوفر تايم",
  permission: "طلب إذن",
  resignation: "طلب استقالة",
};

export const STATUS_LABELS = {
  pending: "قيد الانتظار",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
  cancelled: "ملغي",
};

// نفس منطق badgeType بيتبعت لـ RequestBadge عشان يحدد اللون بنفسه
export const STATUS_TO_BADGE_TYPE = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  cancelled: "cancelled",
};

// ألوان أفاتار ثابتة (Tailwind) بتتكرر بالدور حسب أول حرف في الاسم
export const AVATAR_PALETTE = [
  { bg: "bg-blue-100", color: "text-blue-700" },
  { bg: "bg-purple-100", color: "text-purple-700" },
  { bg: "bg-green-100", color: "text-green-700" },
  { bg: "bg-orange-100", color: "text-orange-700" },
  { bg: "bg-pink-100", color: "text-pink-700" },
  { bg: "bg-teal-100", color: "text-teal-700" },
];

/* ===================== */
/* Pure Mapper           */
/* ===================== */
/**
 * يحول عنصر الطلب الخام القادم من الـ API لشكل جاهز للعرض في RequestItem
 * @param {object} request - عنصر الطلب الخام (زي شكل الـ response)
 */
export function mapRequestToItem(request) {
  const employee = request.employee ?? {};
  const name = employee.name ?? "—";

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  // اختيار لون ثابت لنفس الاسم دايمًا (مش عشوائي كل رندر)
  const paletteIndex =
    Array.from(name).reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
    AVATAR_PALETTE.length;
  const { bg: avatarBg, color: avatarColor } = AVATAR_PALETTE[paletteIndex];

  const typeLabel = REQUEST_TYPE_LABELS[request.request_type] ?? request.request_type;
  const statusLabel = STATUS_LABELS[request.status] ?? request.status;
  const badgeType = STATUS_TO_BADGE_TYPE[request.status] ?? "default";

  const dateLabel = request.created_at
    ? new Date(request.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return {
    id: request.id,
    name: `${name} - ${typeLabel}`,
    date: dateLabel,
    initials: initials || "—",
    avatarBg,
    avatarColor,
    badge: statusLabel,
    badgeType,
  };
}