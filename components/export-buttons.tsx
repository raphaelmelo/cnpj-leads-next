"use client";

import { useState } from "react";

export function ExportButtons({
  view,
  search,
  total,
}: {
  view: string;
  search?: string;
  total: number;
}) {
  const [limite, setLimite] = useState(100);
  const [formato, setFormato] = useState<"csv" | "xlsx" | "contatos" | "telefones" | "emails">("csv");

  function exportar() {
    const sp = new URLSearchParams();
    sp.set("view", view);
    sp.set("formato", formato);
    sp.set("limite", String(limite));
    if (search) sp.set("q", search);
    window.open(`/api/export?${sp.toString()}`, "_blank");
  }

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Quantidade</label>
        <select
          value={limite}
          onChange={(e) => setLimite(Number(e.target.value))}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-blue-400 dark:focus:border-cyan-400 focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10 dark:text-slate-100"
        >
          <option value={50}>Top 50</option>
          <option value={100}>Top 100</option>
          <option value={500}>Top 500</option>
          <option value={1000}>Top 1.000</option>
          <option value={total}>Tudo ({total.toLocaleString("pt-BR")})</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Formato</label>
        <select
          value={formato}
          onChange={(e) => setFormato(e.target.value as typeof formato)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-blue-400 dark:focus:border-cyan-400 focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10 dark:text-slate-100"
        >
          <option value="csv">CSV completo</option>
          <option value="xlsx">XLSX formatado</option>
          <option value="contatos">Lista contatos (CRM)</option>
          <option value="telefones">Telefones (.txt)</option>
          <option value="emails">Emails (.txt)</option>
        </select>
      </div>

      <button
        onClick={exportar}
        className="ml-auto rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-105 active:scale-95 uppercase tracking-wide dark:shadow-emerald-500/15"
      >
        📥 Exportar
      </button>
    </div>
  );
}
