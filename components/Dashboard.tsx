"use client";

import { useState } from "react";
import { useData } from "../lib/useData";
import { buckets, summarize, type Period } from "../lib/stats";
import { hm, money, nf } from "../lib/format";
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

  const stats: [string, string][] = [
    ["Gross", money(s.gross)],
    ["Expenses", money(s.spent)],
    ["Distance", `${nf(s.distance)} km`],
    ["Time driving", hm(s.time)],
    ["Gross per km", s.grossPerKm == null ? "–" : money(s.grossPerKm)],
    ["Net per hour", s.netPerHour == null ? "–" : money(s.netPerHour)],
    ["Cost per km", s.costPerKm == null ? "–" : money(s.costPerKm)],
    ["Shifts", String(s.shifts)],
  ];

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
      <h2>Net by {period === "all" ? "month" : "day"}</h2>
      <div className="card">
        <ProfitChart data={data} />
      </div>
    </>
  );
}
