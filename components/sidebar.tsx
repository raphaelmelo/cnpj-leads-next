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
    <aside className="w-64 shrink-0 border-r border-zinc-200 bg-white p-4 hidden lg:block">
      <Link href="/" className="block px-2 pb-4">
        <h1 className="text-base font-semibold tracking-tight">🏗️ Leads</h1>
        <p className="text-xs text-zinc-500">Incorporadoras BR</p>
      </Link>

      <nav className="space-y-1">
        {standalone.map((it) => (
          <NavItem key={it.href} item={it} active={path === it.href} />
        ))}

        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="pt-4">
            <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              {group}
            </p>
            {items.map((it) => (
              <NavItem key={it.href} item={it} active={path === it.href} />
            ))}
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
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
        active
          ? "bg-zinc-100 text-zinc-900 font-medium"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}
