import { NextRequest } from "next/server";
import ExcelJS from "exceljs";
import { listLeads, VIEWS } from "@/lib/queries";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLS = [
  "lead_score",
  "razao_social",
  "nome_fantasia",
  "cnpj",
  "capital_social",
  "bucket_capital",
  "idade_anos",
  "uf",
  "municipio",
  "telefone1",
  "ddd1",
  "email",
  "qtd_socios",
  "nome_grupo_economico",
  "lead_score_motivos",
] as const;

function csvEscape(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCSV(leads: Lead[], cols: readonly string[]): string {
  const header = cols.join(",");
  const lines = leads.map((l) =>
    cols.map((c) => csvEscape((l as unknown as Record<string, unknown>)[c])).join(","),
  );
  return [header, ...lines].join("\n");
}

async function toXLSX(leads: Lead[], cols: readonly string[]): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Leads");
  ws.columns = cols.map((c) => ({ header: c, key: c, width: 20 }));
  for (const l of leads) {
    ws.addRow(l as unknown as Record<string, unknown>);
  }
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: cols.length } };
  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
}

function limparTel(ddd: number | null, tel: string | null): string {
  if (!ddd || !tel) return "";
  const d = String(Math.trunc(ddd)).padStart(2, "0");
  const t = String(tel).replace(/\D/g, "");
  if (t.length < 8) return "";
  return `${d}${t}`;
}

function toContatos(leads: Lead[]): string {
  const header = "razao_social,cnpj,telefone,telefone_e164,whatsapp_url,email,uf,municipio,capital_social,lead_score";
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const l of leads.sort((a, b) => b.lead_score - a.lead_score)) {
    const tel = limparTel(l.ddd1, l.telefone1);
    if (tel && seen.has(tel)) continue;
    if (tel) seen.add(tel);
    lines.push(
      [
        csvEscape(l.razao_social),
        csvEscape(l.cnpj),
        csvEscape(tel),
        csvEscape(tel ? `+55${tel}` : ""),
        csvEscape(tel ? `https://wa.me/55${tel}` : ""),
        csvEscape(l.email ?? ""),
        csvEscape(l.uf ?? ""),
        csvEscape(l.municipio ?? ""),
        csvEscape(l.capital_social),
        csvEscape(l.lead_score),
      ].join(","),
    );
  }
  return [header, ...lines].join("\n");
}

function toTelefones(leads: Lead[]): string {
  const seen = new Set<string>();
  for (const l of leads) {
    const t = limparTel(l.ddd1, l.telefone1);
    if (t) seen.add(t);
  }
  return Array.from(seen).join("\n");
}

const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function toEmails(leads: Lead[]): string {
  const seen = new Set<string>();
  for (const l of leads) {
    const e = l.email?.trim();
    if (e && EMAIL_RE.test(e)) seen.add(e.toLowerCase());
  }
  return Array.from(seen).join("\n");
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const view = sp.get("view") ?? "";
  const formato = sp.get("formato") ?? "csv";
  const limite = Math.min(50000, Math.max(1, Number(sp.get("limite") ?? "100")));
  const search = sp.get("q")?.trim() || undefined;

  if (!VIEWS[view]) {
    return new Response("view inválida", { status: 400 });
  }

  // Carrega TODO o limite de uma vez (limit alto + offset 0)
  const leads = await listLeads({ view, page: 1, pageSize: limite, search });

  const stamp = new Date().toISOString().slice(0, 10);
  const baseName = `leads_${view}_${stamp}`;

  switch (formato) {
    case "csv": {
      const body = toCSV(leads, COLS);
      return new Response(body, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${baseName}.csv"`,
        },
      });
    }
    case "xlsx": {
      const buf = await toXLSX(leads, COLS);
      return new Response(buf as unknown as BodyInit, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${baseName}.xlsx"`,
        },
      });
    }
    case "contatos": {
      const body = toContatos(leads);
      return new Response(body, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${baseName}_contatos.csv"`,
        },
      });
    }
    case "telefones": {
      const body = toTelefones(leads);
      return new Response(body, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${baseName}_telefones.txt"`,
        },
      });
    }
    case "emails": {
      const body = toEmails(leads);
      return new Response(body, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${baseName}_emails.txt"`,
        },
      });
    }
    default:
      return new Response("formato inválido", { status: 400 });
  }
}
