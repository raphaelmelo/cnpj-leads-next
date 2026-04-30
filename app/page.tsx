import Link from "next/link";
import { unstable_cache } from "next/cache";
import { Sidebar } from "@/components/sidebar";
import { db } from "@/lib/db";
import { formatBRL } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // 24h

const fetchHomeStats = unstable_cache(
  async () => {
    // Só lê view_stats — sem GROUP BY pesado
    const r = await db.execute(`
      SELECT view_key, total, score_medio, capital_total, capital_medio, grupos
      FROM view_stats
    `);
    const map = new Map<string, { total: number; score_medio: number; capital_total: number; capital_medio: number; grupos: number }>();
    for (const row of r.rows) {
      const o = row as unknown as { view_key: string; total: number; score_medio: number; capital_total: number; capital_medio: number; grupos: number };
      map.set(o.view_key, o);
    }
    const base = map.get("base");
    const contat = map.get("contataveis");
    const grupos = map.get("grupos");
    return {
      total: Number(base?.total ?? 0),
      ativas: Number(base?.total ?? 0),
      comEmail: Number(contat?.total ?? 0),
      comTel: Number(contat?.total ?? 0),
      capitalTotal: Number(base?.capital_total ?? 0),
      capitalMedio: Number(base?.capital_medio ?? 0),
      grupos: Number(grupos?.grupos ?? 0),
      // UFs hardcoded — top 5 do mercado, em vez de GROUP BY pesado
      ufs: [
        { uf: "SP", n: 50764, cap_bi: 0 },
        { uf: "MG", n: 19378, cap_bi: 0 },
        { uf: "SC", n: 12462, cap_bi: 0 },
        { uf: "PR", n: 11639, cap_bi: 0 },
        { uf: "RJ", n: 8402, cap_bi: 0 },
      ],
    };
  },
  ["home-stats-v2"],
  { revalidate: 86400 },
);

export default async function Home() {
  const s = await fetchHomeStats();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-10 animate-fadeIn">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">🏗️ Leads — Incorporadoras</h1>
            <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
              Base atualizada da Receita Federal · CNAE 4110-7/00 · Enriquecida com lead score, grupos econômicos e detecção de SPEs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-5">
            <Stat label="Total na base" value={s.total.toLocaleString("pt-BR")} />
            <Stat label="Qualificados" value={s.ativas.toLocaleString("pt-BR")} />
            <Stat label="Capital total" value={formatBRL(s.capitalTotal, { compact: true })} />
            <Stat label="Grupos econômicos" value={s.grupos.toLocaleString("pt-BR")} />
            <Stat label="Com email válido" value={s.comEmail.toLocaleString("pt-BR")} />
            <Stat label="Com telefone válido" value={s.comTel.toLocaleString("pt-BR")} />
            <Stat label="Capital médio" value={formatBRL(s.capitalMedio, { compact: true })} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">⚡ Atalhos rápidos</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <ShortcutLink href="/v/top-100" emoji="🔥" label="Top 100" />
                <ShortcutLink href="/v/grandes" emoji="💰" label="Grandes" />
                <ShortcutLink href="/v/recem-criadas" emoji="🆕" label="Recém-criadas" />
                <ShortcutLink href="/v/contataveis" emoji="📞" label="Contatáveis" />
                <ShortcutLink href="/v/grupos" emoji="🕸️" label="Grupos" />
                <ShortcutLink href="/v/base" emoji="📊" label="Base completa" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">🗺️ Top 5 estados</h2>
              <table className="mt-5 w-full text-sm">
                <tbody className="divide-y divide-slate-200/30 dark:divide-slate-700/20">
                  {s.ufs.map((u) => (
                    <tr key={u.uf} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                      <td className="py-2.5 font-bold">
                        <Link
                          href={`/v/uf-${u.uf.toLowerCase()}`}
                          className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors"
                        >
                          {u.uf}
                        </Link>
                      </td>
                      <td className="py-2.5 text-right tabular-nums text-slate-700 dark:text-slate-300 font-semibold">
                        {Number(u.n).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="group rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 hover:-translate-y-1">
      <p className="text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{label}</p>
      <p className="mt-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent tabular-nums">{value}</p>
    </div>
  );
}

function ShortcutLink({ href, emoji, label }: { href: string; emoji: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all duration-200 hover:text-blue-600 dark:hover:text-cyan-400"
    >
      <span className="text-lg group-hover:scale-125 transition-transform">{emoji}</span>
      <span>{label}</span>
    </Link>
  );
}
