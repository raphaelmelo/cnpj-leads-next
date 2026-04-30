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
      <div className="rounded-lg border bg-white p-12 text-center text-sm text-zinc-500">
        Nenhum lead nessa view.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-3 py-2 text-left">Score</th>
            <th className="px-3 py-2 text-left">Razão social</th>
            <th className="px-3 py-2 text-left">CNPJ</th>
            <th className="px-3 py-2 text-right">Capital</th>
            <th className="px-3 py-2 text-left">UF</th>
            <th className="px-3 py-2 text-left">Telefone</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Idade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {leads.map((l) => {
            const tel = formatTel(l.ddd1, l.telefone1);
            const wa = whatsappUrl(l.ddd1, l.telefone1);
            return (
              <tr key={l.cnpj} className="hover:bg-zinc-50">
                <td className="px-3 py-2">
                  <span
                    className={cn(
                      "inline-flex h-7 min-w-9 items-center justify-center rounded border px-2 text-xs font-semibold tabular-nums",
                      scoreColor(l.lead_score),
                    )}
                  >
                    {Math.round(l.lead_score)}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <Link
                    href={`/empresa/${l.cnpj}`}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    {l.razao_social}
                  </Link>
                  {l.nome_fantasia && (
                    <div className="text-xs text-zinc-500">{l.nome_fantasia}</div>
                  )}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-600">
                  {formatCNPJ(l.cnpj)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-zinc-700">
                  {formatBRL(l.capital_social, { compact: true })}
                </td>
                <td className="px-3 py-2 text-zinc-700">{l.uf}</td>
                <td className="px-3 py-2 text-zinc-700">
                  {tel ? (
                    <span className="flex items-center gap-2">
                      <span>{tel}</span>
                      {wa && (
                        <a
                          href={wa}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-emerald-600 hover:underline"
                          title="WhatsApp"
                        >
                          ↗
                        </a>
                      )}
                    </span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
                <td className="px-3 py-2 text-zinc-700 max-w-[20ch] truncate" title={l.email ?? undefined}>
                  {l.email ?? <span className="text-zinc-400">—</span>}
                </td>
                <td className="px-3 py-2 tabular-nums text-zinc-600">
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
