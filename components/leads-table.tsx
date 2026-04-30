import Link from "next/link";
import type { Lead } from "@/lib/types";
import {
  cn,
  formatBRL,
  formatCNPJ,
  formatTel,
  scoreColor,
  whatsappUrl,
} from "@/lib/utils";

export function LeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-16 text-center text-sm text-slate-500 dark:text-slate-400 shadow-sm">
        <div className="text-4xl mb-3">📭</div>
        Nenhum lead nessa view.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400 font-semibold">
          <tr>
            <th className="px-4 py-3 text-left">Score</th>
            <th className="px-4 py-3 text-left">Razão social</th>
            <th className="px-4 py-3 text-left">CNPJ</th>
            <th className="px-4 py-3 text-right">Capital</th>
            <th className="px-4 py-3 text-left">UF</th>
            <th className="px-4 py-3 text-left">Telefone</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Idade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/30 dark:divide-slate-700/20">
          {leads.map((l) => {
            const tel = formatTel(l.ddd1, l.telefone1);
            const wa = whatsappUrl(l.ddd1, l.telefone1);
            return (
              <tr key={l.cnpj} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150 group">
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex h-7 min-w-10 items-center justify-center rounded-lg border px-2 text-xs font-bold tabular-nums shadow-sm transition-all duration-200 group-hover:shadow-md",
                      scoreColor(l.lead_score),
                    )}
                  >
                    {Math.round(l.lead_score)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/empresa/${l.cnpj}`}
                    className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-200"
                  >
                    {l.razao_social}
                  </Link>
                  {l.nome_fantasia && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{l.nome_fantasia}</div>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 inline-block">
                  {formatCNPJ(l.cnpj)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-800 dark:text-slate-200 font-medium">
                  {formatBRL(l.capital_social, { compact: true })}
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">{l.uf}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                  {tel ? (
                    <span className="flex items-center gap-2 group/phone">
                      <span className="text-slate-800 dark:text-slate-200">{tel}</span>
                      {wa && (
                        <a
                          href={wa}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all duration-200 opacity-0 group-hover/phone:opacity-100"
                          title="WhatsApp"
                        >
                          ↗
                        </a>
                      )}
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300 max-w-[20ch] truncate" title={l.email ?? undefined}>
                  {l.email ?? <span className="text-slate-400 dark:text-slate-500">—</span>}
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-600 dark:text-slate-400">
                  {l.idade_anos ? `${l.idade_anos.toFixed(1)}y` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
