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

type Interval = {
  closeDate: string;
  distance: number; // km driven between two full fill-ups (all driving)
  liters: number;
  cost: number;
  work: number; // km of that distance covered by logged shifts
};

/**
 * Full-tank method. Between two "filled to full" fuel entries that have an
 * odometer reading, all the liters added after the first one were burned
 * over the distance between them. Shift km inside the same odometer range
 * is work driving; the rest is personal.
 */
function fuelIntervals(shifts: Shift[], expenses: Expense[]): Interval[] {
  const fuel = expenses
    .filter((e) => e.cat === "fuel")
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        (a.odometer || 0) - (b.odometer || 0) ||
        (a.id || 0) - (b.id || 0),
    );

  const anchors: number[] = [];
  fuel.forEach((e, i) => {
    if (e.fullTank && (e.odometer || 0) > 0) anchors.push(i);
  });

  const out: Interval[] = [];
  for (let k = 0; k < anchors.length - 1; k++) {
    const open = fuel[anchors[k]];
    const close = fuel[anchors[k + 1]];
    const between = fuel.slice(anchors[k] + 1, anchors[k + 1] + 1);
    const distance = (close.odometer || 0) - (open.odometer || 0);
    if (distance <= 0 || between.some((e) => !(e.liters > 0))) continue;

    const lo = open.odometer || 0;
    const hi = close.odometer || 0;
    const work = shifts.reduce(
      (a, s) => a + Math.max(0, Math.min(s.odoEnd, hi) - Math.max(s.odoStart, lo)),
      0,
    );

    out.push({
      closeDate: close.date,
      distance,
      liters: between.reduce((a, e) => a + e.liters, 0),
      cost: between.reduce((a, e) => a + e.amount, 0),
      work: Math.min(work, distance),
    });
  }
  return out;
}

export function fuelStats(shifts: Shift[], expenses: Expense[], p: Period) {
  const all = fuelIntervals(shifts, expenses);
  if (!all.length) return null;

  const from = periodStart(p);
  const inPeriod = all.filter((i) => i.closeDate >= from);
  const used = inPeriod.length ? inPeriod : all;
  const distance = used.reduce((a, i) => a + i.distance, 0);
  const liters = used.reduce((a, i) => a + i.liters, 0);
  const cost = used.reduce((a, i) => a + i.cost, 0);
  const work = used.reduce((a, i) => a + i.work, 0);

  return {
    intervals: used.length,
    usingAllTime: inPeriod.length === 0 && p !== "all",
    kmPerL: distance / liters,
    costPerKm: cost / distance,
    workShare: work / distance,
    personalKm: Math.max(0, distance - work),
  };
}
