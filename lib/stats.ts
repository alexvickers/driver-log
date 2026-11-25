import { iso } from "./format";
import type { Expense, Shift } from "./types";

export type Period = "week" | "month" | "all";

export const km = (s: Shift) => Math.max(0, s.odoEnd - s.odoStart);

/** Hours between two HH:MM times; handles shifts that cross midnight. */
export function hours(start: string, end: string) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return ((eh * 60 + em - (sh * 60 + sm) + 1440) % 1440) / 60;
}

export function periodStart(p: Period) {
  if (p === "all") return "0000-00-00";
  const d = new Date();
  if (p === "month") d.setDate(1);
  else d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday
  return iso(d);
}

export function summarize(shifts: Shift[], expenses: Expense[], p: Period) {
  const from = periodStart(p);
  const sh = shifts.filter((s) => s.date >= from);
  const ex = expenses.filter((e) => e.date >= from);
  const gross = sh.reduce((a, s) => a + s.gross + s.tips, 0);
  const spent = ex.reduce((a, e) => a + e.amount, 0);
  const distance = sh.reduce((a, s) => a + km(s), 0);
  const time = sh.reduce((a, s) => a + hours(s.start, s.end), 0);
  const net = gross - spent;
  return {
    gross,
    spent,
    net,
    distance,
    time,
    shifts: sh.length,
    grossPerKm: distance ? gross / distance : null,
    netPerHour: time ? net / time : null,
    costPerKm: distance ? spent / distance : null,
  };
}

export function buckets(shifts: Shift[], expenses: Expense[], p: Period) {
  const from = periodStart(p);
  const keyOf = (date: string) => (p === "all" ? date.slice(0, 7) : date);
  const map: Record<string, number> = {};
  shifts
    .filter((s) => s.date >= from)
    .forEach((s) => (map[keyOf(s.date)] = (map[keyOf(s.date)] || 0) + s.gross + s.tips));
  expenses
    .filter((e) => e.date >= from)
    .forEach((e) => (map[keyOf(e.date)] = (map[keyOf(e.date)] || 0) - e.amount));
  return Object.keys(map)
    .sort()
    .map((key) => ({
      key,
      label: p === "all" ? key.slice(2) : key.slice(8),
      net: Math.round(map[key] * 100) / 100,
    }));
}
