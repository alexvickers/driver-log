"use client";

import { useRef, useState, type ChangeEvent } from "react";
import db from "../lib/db";
import { CATEGORIES, type Category, type Expense, type Shift } from "../lib/types";

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const str = (v: unknown) => (typeof v === "string" ? v : "");
const q = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
const stamp = () => new Date().toISOString().slice(0, 10);

export default function BackupView() {
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function exportJson() {
    const [shifts, expenses] = await Promise.all([db.shifts.toArray(), db.expenses.toArray()]);
    download(`driver-log-${stamp()}.json`, JSON.stringify({ shifts, expenses }, null, 2), "application/json");
    setMsg("Backup downloaded.");
  }

  async function exportCsv() {
    const [shifts, expenses] = await Promise.all([db.shifts.toArray(), db.expenses.toArray()]);
    const rows = ["type,date,start,end,odo_start,odo_end,gross,tips,category,amount,liters"];
    shifts.forEach((s) =>
      rows.push(["shift", s.date, s.start, s.end, s.odoStart, s.odoEnd, s.gross, s.tips, "", "", ""].map(q).join(",")),
    );
    expenses.forEach((e) =>
      rows.push(["expense", e.date, "", "", "", "", "", "", e.cat, e.amount, e.liters].map(q).join(",")),
    );
    download(`driver-log-${stamp()}.csv`, rows.join("\n"), "text/csv");
    setMsg("CSV downloaded.");
  }

  async function importJson(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const d = JSON.parse(await file.text()) as { shifts?: unknown; expenses?: unknown };
      if (!Array.isArray(d.shifts) || !Array.isArray(d.expenses)) throw new Error("bad shape");
      if (!confirm("Replace all current data with this backup?")) return;
      const shifts: Shift[] = d.shifts.map((s: Record<string, unknown>) => ({
        date: str(s.date),
        start: str(s.start),
        end: str(s.end),
        odoStart: num(s.odoStart),
        odoEnd: num(s.odoEnd),
        gross: num(s.gross),
        tips: num(s.tips),
      }));
      const expenses: Expense[] = d.expenses.map((x: Record<string, unknown>) => ({
        date: str(x.date),
        cat: (str(x.cat) in CATEGORIES ? str(x.cat) : "other") as Category,
        amount: num(x.amount),
        liters: num(x.liters),
      }));
      await db.transaction("rw", db.shifts, db.expenses, async () => {
        await db.shifts.clear();
        await db.expenses.clear();
        await db.shifts.bulkAdd(shifts);
        await db.expenses.bulkAdd(expenses);
      });
      setMsg(`Restored ${shifts.length} shifts and ${expenses.length} expenses.`);
    } catch {
      setMsg("That file is not a valid backup. Choose a JSON file exported from Driver Log.");
    }
  }

  return (
    <>
      <h1>Backup</h1>
      <div className="card">
        <p style={{ marginTop: 0 }}>
          Your data lives only in this browser, on this domain. Clearing site data erases it, so download a backup now
          and then. You can also use it to move your log to another device.
        </p>
        <div className="grid">
          <button className="btn" onClick={exportJson}>
            Download backup (JSON)
          </button>
          <button className="btn alt" onClick={exportCsv}>
            Export CSV
          </button>
          <button className="btn alt full" onClick={() => fileRef.current?.click()}>
            Restore from backup file
          </button>
        </div>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importJson} />
        {msg && (
          <div className="msg" role="status">
            {msg}
          </div>
        )}
      </div>
    </>
  );
}
