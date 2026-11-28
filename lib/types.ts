export type Category =
  | "fuel"
  | "food"
  | "caffeine"
  | "maintenance"
  | "wash"
  | "tolls"
  | "other";

export const CATEGORIES: Record<Category, string> = {
  fuel: "Fuel",
  food: "Meals",
  caffeine: "Coffee & energy drinks",
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
  odometer?: number; // fuel entries: odometer at the pump
  fullTank?: boolean; // fuel entries: tank was filled to full
};
