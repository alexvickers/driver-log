"use client";

import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { money } from "../lib/format";

type Point = { key: string; label: string; net: number };

export default function ProfitChart({ data }: { data: Point[] }) {
  if (!data.length) {
    return <div className="empty">No data in this period yet. Add a shift or an expense.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--mut)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(v: unknown) => money(Number(v))}
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 8,
            color: "var(--ink)",
          }}
          cursor={{ fill: "var(--line)", opacity: 0.4 }}
        />
        <ReferenceLine y={0} stroke="var(--line)" />
        <Bar dataKey="net" name="Net" radius={[3, 3, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.key} fill={d.net < 0 ? "var(--neg)" : "var(--bar)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
