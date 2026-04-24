import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

export function formatDateTime(input?: string) {
  if (!input) return "-";
  return dayjs(input).format("DD MMM YYYY, HH:mm");
}

export function formatDate(input?: string) {
  if (!input) return "-";
  return dayjs(input).format("DD MMM YYYY");
}

export function isPastDate(input?: string) {
  if (!input) return false;
  return dayjs(input).isBefore(dayjs());
}

export function groupByDate<T extends { startsAt?: string; createdAt?: string }>(items: T[]) {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const keySource = item.startsAt ?? item.createdAt;
    const key = keySource ? dayjs(keySource).format("YYYY-MM-DD") : "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}
