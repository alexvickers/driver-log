import { useCallback, useEffect, useState } from "react";
import db from "./db";
import type { Expense, Shift } from "./types";

export function useData() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const [s, e] = await Promise.all([db.shifts.toArray(), db.expenses.toArray()]);
    setShifts(s);
    setExpenses(e);
    setReady(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { shifts, expenses, ready, refresh };
}
