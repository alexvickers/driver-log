"use client";

import { useState } from "react";
import { useData } from "../lib/useData";
import { buckets, fuelStats, periodStart, summarize, type Period } from "../lib/stats";
import { hm, money, nf } from "../lib/format";
import type { Category } from "../lib/types";
import ProfitChart from "./ProfitChart";

const LABELS: Record<Period, string> = {
  week: "This week",
  month: "This month",
  all: "All time",
};

export default function Dashboard() {
  const { shifts, expenses } = useData();
  const [period, setPeriod] = useState<Period>("week");
  const s = summarize(shifts, expenses, period);
  const data = buckets(shifts, expenses, period);
  const fuel = fuelStats(shifts, expenses, period);

  const from = periodStart(period);
  const spentOn = (cat: Category) =>
    expenses.filter((e) => e.cat === cat && e.date >= from).reduce((a, e) => a + e.amount, 0);

  const stats: [string, string][] = [
    ["Gross", money(s.gross)],
    ["Expenses", money(s.spent)],
    ["Distance", `${nf(s.distance)} km`],
    ["Time driving", hm(s.time)],
    ["Gross per km", s.grossPerKm == null ? "–" : money(s.grossPerKm)],
    ["Net per hour", s.netPerHour == null ? "–" : money(s.netPerHour)],
    ["Cost per km", s.costPerKm == null ? "–" : money(s.costPerKm)],
    ["Shifts", String(s.shifts)],
    ["Coffee & energy drinks", money(spentOn("caffeine"))],
    ["Coffee per shift", s.shifts ? money(spentOn("caffeine") / s.shifts) : "–"],
    ["Meals", money(spentOn("food"))],
    ["Meals per shift", s.shifts ? money(spentOn("food") / s.shifts) : "–"],
  ];

  const fuelCards: [string, string][] = fuel
    ? [
        ["Fuel economy", `${nf(fuel.kmPerL)} km/l`],
        ["Est. fuel cost of work", money(s.distance * fuel.costPerKm)],
        ["Work share of km", `${nf(fuel.workShare * 100, 0)}%`],
        ["Personal km", `${nf(fuel.personalKm)} km`],
      ]
    : [];

  return (
    <>
      <h1>Driver Log</h1>
      <div className="seg">
        {(Object.keys(LABELS) as Period[]).map((p) => (
          <button key={p} aria-pressed={p === period} onClick={() => setPeriod(p)}>
            {LABELS[p]}
          </button>
        ))}
      </div>
      <div className="card hero">
        <div className="lbl">Net profit</div>
        <div className={`big ${s.net < 0 ? "neg" : "pos"}`}>{money(s.net)}</div>
      </div>
      <div className="grid">
        {stats.map(([label, value]) => (
          <div className="card stat" key={label}>
            <div className="v">{value}</div>
            <div className="l">{label}</div>
          </div>
        ))}
      </div>

      <h2>Fuel</h2>
      {fuel ? (
        <>
          <div className="grid" style={{ marginTop: 0 }}>
            {fuelCards.map(([label, value]) => (
              <div className="card stat" key={label}>
                <div className="v">{value}</div>
                <div className="l">{label}</div>
              </div>
            ))}
          </div>
          <div className="msg">
            Based on {fuel.intervals} full-tank {fuel.intervals === 1 ? "interval" : "intervals"}
            {fuel.usingAllTime ? " (all time, since none closed in this period)" : ""}. Personal km is driving
            outside your logged shifts.
          </div>
        </>
      ) : (
        <div className="card empty">
          Add fuel expenses with the odometer reading and tick &ldquo;Filled to full&rdquo; on at least two of
          them to see fuel economy and the work vs. personal split.
        </div>
      )}

      <h2>Net by {period === "all" ? "month" : "day"}</h2>
      <div className="card">
        <ProfitChart data={data} />
      </div>
    </>
  );
}
