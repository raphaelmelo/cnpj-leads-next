import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(v: number | null | undefined, opts?: { compact?: boolean }) {
  if (v == null || isNaN(v)) return "—";
  if (opts?.compact) {
    if (v >= 1e9) return `R$ ${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `R$ ${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `R$ ${(v / 1e3).toFixed(0)}k`;
  }
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function formatCNPJ(c: string | null | undefined) {
  if (!c) return "—";
  const s = c.replace(/\D/g, "");
  if (s.length !== 14) return c;
  return `${s.slice(0, 2)}.${s.slice(2, 5)}.${s.slice(5, 8)}/${s.slice(8, 12)}-${s.slice(12)}`;
}

export function formatTel(ddd: number | null | undefined, tel: string | null | undefined) {
  if (!ddd || !tel) return null;
  const d = String(Math.trunc(ddd)).padStart(2, "0");
  const t = String(tel).replace(/\D/g, "");
  if (t.length < 8) return null;
  if (t.length === 9) return `(${d}) ${t.slice(0, 5)}-${t.slice(5)}`;
  if (t.length === 8) return `(${d}) ${t.slice(0, 4)}-${t.slice(4)}`;
  return `(${d}) ${t}`;
}

export function whatsappUrl(ddd: number | null | undefined, tel: string | null | undefined) {
  if (!ddd || !tel) return null;
  const d = String(Math.trunc(ddd)).padStart(2, "0");
  const t = String(tel).replace(/\D/g, "");
  if (t.length < 8) return null;
  return `https://wa.me/55${d}${t}`;
}

export function scoreColor(score: number) {
  if (score >= 80) return "bg-emerald-100 text-emerald-900 border-emerald-300";
  if (score >= 60) return "bg-lime-100 text-lime-900 border-lime-300";
  if (score >= 40) return "bg-amber-100 text-amber-900 border-amber-300";
  if (score >= 20) return "bg-orange-100 text-orange-900 border-orange-300";
  return "bg-rose-100 text-rose-900 border-rose-300";
}
