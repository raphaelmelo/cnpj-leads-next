import Link from "next/link";

export function Pagination({
  page,
  pageSize,
  total,
  search,
}: {
  page: number;
  pageSize: number;
  total: number;
  search?: string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  function url(p: number) {
    const sp = new URLSearchParams();
    sp.set("page", String(p));
    if (search) sp.set("q", search);
    return `?${sp.toString()}`;
  }

  if (totalPages === 1) return null;

  return (
    <div className="flex items-center justify-between text-sm">
      <p className="text-slate-600 dark:text-slate-400 font-medium">
        Página <span className="tabular-nums text-slate-800 dark:text-slate-200">{page}</span> de{" "}
        <span className="tabular-nums text-slate-800 dark:text-slate-200">{totalPages.toLocaleString("pt-BR")}</span>
      </p>
      <div className="flex gap-2">
        <Link
          href={url(prev)}
          aria-disabled={page === 1}
          className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
            page === 1
              ? "pointer-events-none opacity-40 cursor-not-allowed"
              : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95"
          }`}
        >
          ← Anterior
        </Link>
        <Link
          href={url(next)}
          aria-disabled={page === totalPages}
          className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
            page === totalPages
              ? "pointer-events-none opacity-40 cursor-not-allowed"
              : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95"
          }`}
        >
          Próxima →
        </Link>
      </div>
    </div>
  );
}
