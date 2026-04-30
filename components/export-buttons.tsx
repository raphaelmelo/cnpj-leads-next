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
    <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-white p-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-500">Quantidade</label>
        <select
          value={limite}
          onChange={(e) => setLimite(Number(e.target.value))}
          className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm"
        >
          <option value={50}>Top 50</option>
          <option value={100}>Top 100</option>
          <option value={500}>Top 500</option>
          <option value={1000}>Top 1.000</option>
          <option value={total}>Tudo ({total.toLocaleString("pt-BR")})</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-500">Formato</label>
        <select
          value={formato}
          onChange={(e) => setFormato(e.target.value as typeof formato)}
          className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm"
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
        className="ml-auto rounded-md bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
      >
        📥 Exportar
      </button>
    </div>
  );
}
