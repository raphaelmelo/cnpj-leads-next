"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function SearchBar({ placeholder = "Buscar razão social ou CNPJ..." }: { placeholder?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const initial = params.get("q") ?? "";
  const [value, setValue] = useState(initial);

  useEffect(() => {
    setValue(params.get("q") ?? "");
  }, [params]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const url = new URL(window.location.href);
    if (value.trim()) url.searchParams.set("q", value.trim());
    else url.searchParams.delete("q");
    url.searchParams.delete("page");
    router.push(`${pathname}${url.search}`);
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-400 dark:focus:border-cyan-400 focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:scale-105 active:scale-95 dark:shadow-blue-500/15"
      >
        Buscar
      </button>
      {initial && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            router.push(pathname);
          }}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
        >
          Limpar
        </button>
      )}
    </form>
  );
}
