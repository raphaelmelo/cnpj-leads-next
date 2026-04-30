import { formatBRL } from "@/lib/utils";

export function KPIs({
  total,
  scoreMedio,
  capitalTotal,
  capitalMedio,
  grupos,
}: {
  total: number;
  scoreMedio: number | null;
  capitalTotal: number | null;
  capitalMedio: number | null;
  grupos: number | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      <Card label="Leads" value={total.toLocaleString("pt-BR")} />
      <Card label="Score médio" value={scoreMedio?.toFixed(1) ?? "—"} />
      <Card label="Capital total" value={formatBRL(capitalTotal, { compact: true })} />
      <Card label="Capital médio" value={formatBRL(capitalMedio, { compact: true })} />
      <Card label="Grupos econômicos" value={grupos?.toLocaleString("pt-BR") ?? "0"} />
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 hover:-translate-y-1">
      <p className="text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{label}</p>
      <p className="mt-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent tabular-nums">{value}</p>
    </div>
  );
}
