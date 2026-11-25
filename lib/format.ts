const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const pad = (n: number) => String(n).padStart(2, "0");

export const money = (n: number) => brl.format(n || 0);
export const nf = (n: number, d = 1) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: d }).format(n || 0);
export const iso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const today = () => iso(new Date());
export const brDate = (s: string) => s.split("-").reverse().join("/");
export const hm = (h: number) => {
  const m = Math.round(h * 60);
  return `${Math.floor(m / 60)}h${pad(m % 60)}`;
};
export const parseNum = (v: string) => {
  const n = parseFloat(v.replace(",", "."));
  return Number.isNaN(n) ? 0 : n;
};
