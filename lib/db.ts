import Dexie, { type EntityTable } from "dexie";
import type { Expense, Shift } from "./types";

const db = new Dexie("driverlog") as Dexie & {
  shifts: EntityTable<Shift, "id">;
  expenses: EntityTable<Expense, "id">;
};

db.version(1).stores({
  shifts: "++id, date",
  expenses: "++id, date",
});

export default db;
