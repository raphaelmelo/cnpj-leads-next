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
    <div className="rounded-lg border bg-white p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-0.5 text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
