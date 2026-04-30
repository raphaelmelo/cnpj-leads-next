import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { LeadsTable } from "@/components/leads-table";
import { KPIs } from "@/components/kpis";
import { SearchBar } from "@/components/search-bar";
import { Pagination } from "@/components/pagination";
import { ExportButtons } from "@/components/export-buttons";
import { VIEWS, listLeads, countLeads, statsForView } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 50;

export default async function ViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ view: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { view } = await params;
  const sp = await searchParams;
  const def = VIEWS[view];
  if (!def) notFound();

  const page = Math.max(1, Number(sp.page ?? "1"));
  const search = sp.q?.trim() || undefined;

  const [leads, total, stats] = await Promise.all([
    listLeads({ view, page, pageSize: PAGE_SIZE, search }),
    countLeads({ view, search }),
    statsForView({ view, search }),
  ]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-5">
          <div>
            <h1 className="text-2xl font-semibold">{def.title}</h1>
            <p className="mt-1 text-sm text-zinc-600">{def.description}</p>
          </div>

          <SearchBar />

          <KPIs
            total={Number(stats.total)}
            scoreMedio={stats.score_medio != null ? Number(stats.score_medio) : null}
            capitalTotal={stats.capital_total != null ? Number(stats.capital_total) : null}
            capitalMedio={stats.capital_medio != null ? Number(stats.capital_medio) : null}
            grupos={Number(stats.grupos)}
          />

          <ExportButtons view={view} search={search} total={Number(stats.total)} />

          <LeadsTable leads={leads} />

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={Number(stats.total)}
            search={search}
          />
        </div>
      </main>
    </div>
  );
}
