"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Flame,
  Sprout,
  Building2,
  Phone,
  Network,
  Map,
  Database,
  Ban,
  type LucideIcon,
} from "lucide-react";

type Item = { href: string; label: string; icon: LucideIcon; group?: string };

const ITEMS: Item[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/v/top-100", label: "Top 100", icon: Flame, group: "Views" },
  { href: "/v/recem-criadas", label: "Recém-criadas", icon: Sprout, group: "Views" },
  { href: "/v/grandes", label: "Grandes consolidadas", icon: Building2, group: "Views" },
  { href: "/v/contataveis", label: "Contatáveis", icon: Phone, group: "Views" },
  { href: "/v/grupos", label: "Grupos econômicos", icon: Network, group: "Views" },
  { href: "/v/uf-sp", label: "🏘️ São Paulo", icon: Map, group: "Por estado" },
  { href: "/v/uf-rj", label: "🏘️ Rio de Janeiro", icon: Map, group: "Por estado" },
  { href: "/v/uf-mg", label: "🏘️ Minas Gerais", icon: Map, group: "Por estado" },
  { href: "/v/uf-pr", label: "🏘️ Paraná", icon: Map, group: "Por estado" },
  { href: "/v/uf-sc", label: "🏘️ Santa Catarina", icon: Map, group: "Por estado" },
  { href: "/v/base", label: "Base completa", icon: Database, group: "Outros" },
  { href: "/v/lista-negra", label: "Lista negra", icon: Ban, group: "Outros" },
];

export function Sidebar() {
  const path = usePathname();
  const groups: Record<string, Item[]> = {};
  const standalone: Item[] = [];

  for (const it of ITEMS) {
    if (it.group) (groups[it.group] ??= []).push(it);
    else standalone.push(it);
  }

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-6 hidden lg:block transition-colors duration-300">
      <Link href="/" className="block px-3 py-2 mb-8 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 transition-all duration-300 group">
        <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">🏗️ Leads</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Incorporadoras BR</p>
      </Link>

      <nav className="space-y-2">
        {standalone.map((it) => (
          <NavItem key={it.href} item={it} active={path === it.href} />
        ))}

        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="pt-6">
            <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 opacity-75">
              {group}
            </p>
            <div className="space-y-1">
              {items.map((it) => (
                <NavItem key={it.href} item={it} active={path === it.href} />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function NavItem({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative overflow-hidden group",
        active
          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/15"
          : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
      )}
    >
      <Icon className={cn("h-4.5 w-4.5 shrink-0 transition-transform duration-200", active && "group-hover:scale-110")} />
      <span className="truncate">{item.label}</span>
      {active && <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all" />}
    </Link>
  );
}
