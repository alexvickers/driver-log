"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import db from "../lib/db";
import { useData } from "../lib/useData";
import { brDate, money, nf, parseNum, today } from "../lib/format";
import { CATEGORIES, type Category } from "../lib/types";

const EMPTY = { date: "", amount: "", cat: "fuel", liters: "", odo: "", full: true };
type TextField = "date" | "amount" | "cat" | "liters" | "odo";

export default function ExpensesView() {
  const { expenses, refresh } = useData();
  const [f, setF] = useState(EMPTY);

  useEffect(() => {
    setF((p) => ({ ...p, date: today() }));
  }, []);

  const set = (k: TextField) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const isFuel = f.cat === "fuel";

  async function submit(e: FormEvent) {
    e.preventDefault();
    await db.expenses.add({
      date: f.date,
      cat: f.cat as Category,
      amount: parseNum(f.amount),
      liters: isFuel ? parseNum(f.liters) : 0,
      odometer: isFuel ? parseNum(f.odo) : 0,
      fullTank: isFuel ? f.full : false,
    });
    await refresh();
    setF({ ...EMPTY, date: f.date, cat: f.cat });
  }

  async function remove(id?: number) {
    if (id == null || !confirm("Delete this expense?")) return;
    await db.expenses.delete(id);
    await refresh();
  }

  const list = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <h1>Expenses</h1>
      <div className="card">
        <form onSubmit={submit}>
          <label>
            Date
            <input type="date" value={f.date} onChange={set("date")} required />
          </label>
          <label>
            Amount (R$)
            <input inputMode="decimal" placeholder="0,00" value={f.amount} onChange={set("amount")} required />
          </label>
          <label>
            Category
            <select value={f.cat} onChange={set("cat")}>
              {(Object.keys(CATEGORIES) as Category[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORIES[c]}
                </option>
              ))}
            </select>
          </label>
          {isFuel && (
            <>
              <label>
                Liters
                <input inputMode="decimal" placeholder="0" value={f.liters} onChange={set("liters")} />
              </label>
              <label>
                Odometer (km)
                <input inputMode="decimal" value={f.odo} onChange={set("odo")} />
              </label>
              <label
                className="full"
                style={{ flexDirection: "row", alignItems: "center", gap: 8, color: "var(--ink)" }}
              >
                <input
                  type="checkbox"
                  checked={f.full}
                  onChange={(e) => setF((p) => ({ ...p, full: e.target.checked }))}
                  style={{ width: "auto" }}
                />
                Filled to full
              </label>
            </>
          )}
          <button className="btn full" type="submit">
            Save expense
          </button>
        </form>
        {isFuel && (
          <div className="msg">
            Liters, odometer, and &ldquo;Filled to full&rdquo; are needed for fuel economy. Untick the box when you
            didn&rsquo;t fill the tank.
          </div>
        )}
      </div>
      <h2>History</h2>
      <div className="card">
        {list.length === 0 && <div className="empty">No expenses yet. Log fuel, tolls or maintenance above.</div>}
        {list.map((x) => (
          <div className="row" key={x.id}>
            <div>
              {brDate(x.date)}
              <small>
                {CATEGORIES[x.cat]}
                {x.liters ? ` · ${nf(x.liters)} L` : ""}
                {x.odometer ? ` · ${nf(x.odometer, 0)} km` : ""}
                {x.cat === "fuel" && x.fullTank ? " · full tank" : ""}
              </small>
              <button className="del" onClick={() => remove(x.id)}>
                Delete
              </button>
            </div>
            <div className="r">{money(x.amount)}</div>
          </div>
        ))}
      </div>
    </>
  );
}
