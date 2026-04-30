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
      <p className="text-zinc-500">
        Página <span className="font-medium tabular-nums">{page}</span> de{" "}
        <span className="font-medium tabular-nums">{totalPages.toLocaleString("pt-BR")}</span>
      </p>
      <div className="flex gap-2">
        <Link
          href={url(prev)}
          aria-disabled={page === 1}
          className={`rounded-md border px-3 py-1.5 ${
            page === 1
              ? "pointer-events-none opacity-50"
              : "bg-white hover:bg-zinc-50"
          }`}
        >
          ← Anterior
        </Link>
        <Link
          href={url(next)}
          aria-disabled={page === totalPages}
          className={`rounded-md border px-3 py-1.5 ${
            page === totalPages
              ? "pointer-events-none opacity-50"
              : "bg-white hover:bg-zinc-50"
          }`}
        >
          Próxima →
        </Link>
      </div>
    </div>
  );
}
