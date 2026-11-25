"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import db from "../lib/db";
import { useData } from "../lib/useData";
import { hours, km } from "../lib/stats";
import { brDate, hm, money, nf, parseNum, today } from "../lib/format";

const EMPTY = { date: "", gross: "", start: "", end: "", o1: "", o2: "", tips: "" };

export default function ShiftsView() {
  const { shifts, refresh } = useData();
  const [f, setF] = useState(EMPTY);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setF((p) => ({ ...p, date: today() }));
  }, []);

  const set = (k: keyof typeof EMPTY) => (e: ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    const o1 = parseNum(f.o1);
    const o2 = parseNum(f.o2);
    if (o2 < o1) {
      setMsg("End odometer must be equal to or higher than the start odometer.");
      return;
    }
    await db.shifts.add({
      date: f.date,
      start: f.start,
      end: f.end,
      odoStart: o1,
      odoEnd: o2,
      gross: parseNum(f.gross),
      tips: parseNum(f.tips),
    });
    await refresh();
    setMsg("Shift saved.");
    setF({ ...EMPTY, date: f.date });
  }

  async function remove(id?: number) {
    if (id == null || !confirm("Delete this shift?")) return;
    await db.shifts.delete(id);
    await refresh();
  }

  const list = [...shifts].sort((a, b) => (b.date + b.start).localeCompare(a.date + a.start));

  return (
    <>
      <h1>Shifts</h1>
      <div className="card">
        <form onSubmit={submit}>
          <label>
            Date
            <input type="date" value={f.date} onChange={set("date")} required />
          </label>
          <label>
            Gross earnings (R$)
            <input inputMode="decimal" placeholder="0,00" value={f.gross} onChange={set("gross")} required />
          </label>
          <label>
            Start time
            <input type="time" value={f.start} onChange={set("start")} required />
          </label>
          <label>
            End time
            <input type="time" value={f.end} onChange={set("end")} required />
          </label>
          <label>
            Odometer at start (km)
            <input inputMode="decimal" value={f.o1} onChange={set("o1")} required />
          </label>
          <label>
            Odometer at end (km)
            <input inputMode="decimal" value={f.o2} onChange={set("o2")} required />
          </label>
          <label className="full">
            Tips (R$)
            <input inputMode="decimal" placeholder="0,00" value={f.tips} onChange={set("tips")} />
          </label>
          <button className="btn full" type="submit">
            Save shift
          </button>
        </form>
        {msg && (
          <div className="msg" role="status">
            {msg}
          </div>
        )}
      </div>
      <h2>History</h2>
      <div className="card">
        {list.length === 0 && <div className="empty">No shifts yet. Log your first one above.</div>}
        {list.map((x) => (
          <div className="row" key={x.id}>
            <div>
              {brDate(x.date)}
              <small>
                {x.start}–{x.end} · {hm(hours(x.start, x.end))} · {nf(km(x))} km
              </small>
              <button className="del" onClick={() => remove(x.id)}>
                Delete
              </button>
            </div>
            <div className="r">
              {money(x.gross + x.tips)}
              <small>{x.tips ? `incl. ${money(x.tips)} tips` : ""}</small>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
