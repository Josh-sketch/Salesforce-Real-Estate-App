export const fmt = (n) => `₦${Number(n).toLocaleString("en-NG")}`;
export const TODAY = new Date("2025-02-08");
export const daysUntil = (d) => Math.ceil((new Date(d) - TODAY) / 86400000);
export const ordinal = (n) =>
  n + (n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th");

const AVG_COLORS = ["#7C4DCC","#1565C0","#00695C","#BF360C","#880E4F","#1B5E20","#4A148C","#01579B"];
export const getAC = (id) =>
  AVG_COLORS[parseInt((id || "0").replace(/\D/g, "")) % AVG_COLORS.length];
