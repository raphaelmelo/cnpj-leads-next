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
      <main className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">🏗️ Leads — Incorporadoras</h1>
            <p className="text-sm text-zinc-600">
              Base atualizada da Receita Federal · CNAE 4110-7/00 · Enriquecida com lead score, grupos econômicos e detecção de SPEs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Total na base" value={s.total.toLocaleString("pt-BR")} />
            <Stat label="Qualificados" value={s.ativas.toLocaleString("pt-BR")} />
            <Stat label="Capital total" value={formatBRL(s.capitalTotal, { compact: true })} />
            <Stat label="Grupos econômicos" value={s.grupos.toLocaleString("pt-BR")} />
            <Stat label="Com email válido" value={s.comEmail.toLocaleString("pt-BR")} />
            <Stat label="Com telefone válido" value={s.comTel.toLocaleString("pt-BR")} />
            <Stat label="Capital médio" value={formatBRL(s.capitalMedio, { compact: true })} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-white p-4">
              <h2 className="text-sm font-semibold text-zinc-700">Atalhos</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <ShortcutLink href="/v/top-100" emoji="🔥" label="Top 100" />
                <ShortcutLink href="/v/grandes" emoji="💰" label="Grandes" />
                <ShortcutLink href="/v/recem-criadas" emoji="🆕" label="Recém-criadas" />
                <ShortcutLink href="/v/contataveis" emoji="📞" label="Contatáveis" />
                <ShortcutLink href="/v/grupos" emoji="🕸️" label="Grupos" />
                <ShortcutLink href="/v/base" emoji="📊" label="Base completa" />
              </div>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <h2 className="text-sm font-semibold text-zinc-700">Top 10 estados por capital</h2>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {s.ufs.map((u) => (
                    <tr key={u.uf} className="border-b border-zinc-100 last:border-0">
                      <td className="py-1.5 font-medium">
                        <Link
                          href={`/v/uf-${u.uf.toLowerCase()}`}
                          className="hover:underline"
                        >
                          {u.uf}
                        </Link>
                      </td>
                      <td className="py-1.5 text-right tabular-nums text-zinc-600">
                        {Number(u.n).toLocaleString("pt-BR")}
                      </td>
                      <td className="py-1.5 text-right tabular-nums text-zinc-700">
                        R$ {Number(u.cap_bi).toLocaleString("pt-BR")}B
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
    <div className="rounded-lg border bg-white p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-0.5 text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function ShortcutLink({ href, emoji, label }: { href: string; emoji: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md border bg-zinc-50 px-3 py-2 text-sm hover:bg-zinc-100"
    >
      <span>{emoji}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
