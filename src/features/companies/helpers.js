export function getInitials(name) {
  if (!name) return "؟";
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function safeArray(v) {
  return Array.isArray(v) ? v : [];
}