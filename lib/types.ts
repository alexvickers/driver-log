export type Category = "fuel" | "maintenance" | "wash" | "tolls" | "other";

export const CATEGORIES: Record<Category, string> = {
  fuel: "Fuel",
  maintenance: "Maintenance",
  wash: "Car wash",
  tolls: "Tolls",
  other: "Other",
};

export type Shift = {
  id?: number;
  date: string; // YYYY-MM-DD
  start: string; // HH:MM
  end: string; // HH:MM
  odoStart: number;
  odoEnd: number;
  gross: number;
  tips: number;
};

export type Expense = {
  id?: number;
  date: string; // YYYY-MM-DD
  cat: Category;
  amount: number;
  liters: number;
};
