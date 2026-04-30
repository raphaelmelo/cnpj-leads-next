import Link from "next/link";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { getEmpresa, getSocios, getOutrasEmpresasGrupo } from "@/lib/queries";
import {
  cn,
  formatBRL,
  formatCNPJ,
  formatTel,
  scoreColor,
  whatsappUrl,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EmpresaPage({
  params,
}: {
  params: Promise<{ cnpj: string }>;
}) {
  const { cnpj } = await params;
  const empresa = await getEmpresa(cnpj);
  if (!empresa) notFound();

  const [socios, grupo] = await Promise.all([
    getSocios(empresa.cnpj_basico),
    empresa.nome_grupo_economico
      ? getOutrasEmpresasGrupo(empresa.nome_grupo_economico, empresa.cnpj)
      : Promise.resolve([]),
  ]);

  const tel = formatTel(empresa.ddd1, empresa.telefone1);
  const wa = whatsappUrl(empresa.ddd1, empresa.telefone1);
  const razaoQ = encodeURIComponent(empresa.razao_social);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-5">
          <div className="flex items-start gap-4">
            <span
              className={cn(
                "inline-flex h-12 min-w-14 items-center justify-center rounded-md border px-3 text-lg font-semibold tabular-nums",
                scoreColor(empresa.lead_score),
              )}
            >
              {Math.round(empresa.lead_score)}
            </span>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold leading-tight">
                {empresa.razao_social}
              </h1>
              {empresa.nome_fantasia && (
                <p className="text-sm text-zinc-500">{empresa.nome_fantasia}</p>
              )}
              <p className="mt-1 font-mono text-xs text-zinc-500">
                {formatCNPJ(empresa.cnpj)} · {empresa.matriz_filial}
              </p>
              {empresa.lead_score_motivos && (
                <p className="mt-2 text-sm text-zinc-700">
                  <span className="font-medium">Motivos: </span>
                  {empresa.lead_score_motivos}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card title="📊 Dados">
              <Row label="Capital social" value={formatBRL(empresa.capital_social)} />
              <Row label="Idade" value={empresa.idade_anos ? `${empresa.idade_anos.toFixed(1)} anos` : "—"} />
              <Row label="Bucket capital" value={empresa.bucket_capital ?? "—"} />
              <Row label="Bucket idade" value={empresa.bucket_idade ?? "—"} />
              <Row label="Estabelecimentos" value={String(empresa.qtd_estabelecimentos)} />
              <Row label="Multi-estado" value={empresa.multi_estado ? "Sim" : "Não"} />
              {empresa.nome_grupo_economico && (
                <>
                  <Row label="Grupo econômico" value={empresa.nome_grupo_economico} />
                  <Row label="Empresas no grupo" value={String(empresa.qtd_empresas_grupo)} />
                </>
              )}
            </Card>

            <Card title="📞 Contato">
              <Row label="Telefone" value={tel ?? "—"} extra={
                wa ? (
                  <a href={wa} target="_blank" rel="noreferrer noopener" className="text-emerald-600 hover:underline">
                    WhatsApp ↗
                  </a>
                ) : null
              } />
              <Row label="Email" value={empresa.email ?? "—"} />
              <Row label="Email corporativo" value={empresa.email_dominio_proprio ? "Sim" : "Não"} />
              <div className="border-t border-zinc-100 pt-2 mt-2">
                <p className="text-xs font-medium text-zinc-500 mb-2">Buscar online</p>
                <div className="flex gap-2 flex-wrap">
                  <Pill href={`https://www.google.com/search?q=${razaoQ}`}>🔍 Google</Pill>
                  <Pill href={`https://www.google.com/search?q=site:linkedin.com/company+${razaoQ}`}>💼 LinkedIn</Pill>
                  <Pill href={`https://www.google.com/search?q=${razaoQ}&tbm=nws`}>📰 Notícias</Pill>
                </div>
              </div>
            </Card>

            <Card title="📍 Endereço">
              <Row label="Logradouro" value={`${empresa.logradouro ?? ""} ${empresa.numero ?? ""}`.trim() || "—"} />
              {empresa.complemento && <Row label="Complemento" value={empresa.complemento} />}
              <Row label="Bairro" value={empresa.bairro ?? "—"} />
              <Row label="Cidade/UF" value={`${empresa.municipio ?? "—"}/${empresa.uf ?? "—"}`} />
              <Row label="CEP" value={empresa.cep ?? "—"} />
              <Row label="Região" value={empresa.regiao ?? "—"} />
            </Card>

            <Card title="🏗️ Atividades (CNAE)">
              <Row label="Principal" value={String(empresa.cnae_principal ?? "—")} />
              {empresa.cnae_secundario && (
                <Row label="Secundárias" value={empresa.cnae_secundario} />
              )}
              <Row label="Início atividade" value={empresa.data_inicio_atividade ?? "—"} />
              <Row label="Parece SPE" value={empresa.parece_spe ? "Sim" : "Não"} />
            </Card>
          </div>

          {/* Sócios */}
          <div className="rounded-lg border bg-white p-5">
            <h2 className="text-base font-semibold">👥 Quadro societário</h2>
            <p className="text-xs text-zinc-500 mb-3">
              {socios.length} sócio{socios.length === 1 ? "" : "s"}
            </p>
            {socios.length === 0 ? (
              <p className="text-sm text-zinc-500">Nenhum sócio encontrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b text-xs uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-2 py-2 text-left">Nome</th>
                      <th className="px-2 py-2 text-left">Tipo</th>
                      <th className="px-2 py-2 text-left">Qualificação</th>
                      <th className="px-2 py-2 text-left">Entrada</th>
                      <th className="px-2 py-2 text-left">CPF/CNPJ</th>
                      <th className="px-2 py-2 text-left">LinkedIn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {socios.map((s, i) => {
                      const nomeQ = encodeURIComponent(s.nome_socio);
                      return (
                        <tr key={i}>
                          <td className="px-2 py-2 font-medium">{s.nome_socio}</td>
                          <td className="px-2 py-2 text-zinc-600">
                            {s.tipo_socio === "1" ? "PJ" : s.tipo_socio === "2" ? "PF" : s.tipo_socio === "3" ? "Estrangeiro" : s.tipo_socio}
                          </td>
                          <td className="px-2 py-2 text-zinc-600">{s.qualificacao_socio ?? "—"}</td>
                          <td className="px-2 py-2 text-zinc-600">{s.data_entrada ?? "—"}</td>
                          <td className="px-2 py-2 font-mono text-xs text-zinc-500">{s.cpf_cnpj_socio ?? "—"}</td>
                          <td className="px-2 py-2">
                            <a
                              href={`https://www.google.com/search?q=site:linkedin.com/in+${nomeQ}`}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="text-blue-600 hover:underline text-xs"
                            >
                              Buscar ↗
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Outras empresas do grupo */}
          {grupo.length > 0 && (
            <div className="rounded-lg border bg-white p-5">
              <h2 className="text-base font-semibold">🕸️ Outras empresas do grupo</h2>
              <p className="text-xs text-zinc-500 mb-3">
                {grupo.length} empresa(s) compartilham sócios com esta
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b text-xs uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-2 py-2 text-left">Razão social</th>
                      <th className="px-2 py-2 text-left">CNPJ</th>
                      <th className="px-2 py-2 text-left">UF</th>
                      <th className="px-2 py-2 text-right">Capital</th>
                      <th className="px-2 py-2 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {grupo.map((e) => (
                      <tr key={e.cnpj}>
                        <td className="px-2 py-2">
                          <Link href={`/empresa/${e.cnpj}`} className="font-medium hover:underline">
                            {e.razao_social}
                          </Link>
                        </td>
                        <td className="px-2 py-2 font-mono text-xs">{formatCNPJ(e.cnpj)}</td>
                        <td className="px-2 py-2">{e.uf}</td>
                        <td className="px-2 py-2 text-right tabular-nums">
                          {formatBRL(e.capital_social, { compact: true })}
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums">
                          {Math.round(e.lead_score)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold text-zinc-700">{title}</h2>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value, extra }: { label: string; value: string; extra?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className="text-right font-medium text-zinc-900">
        {value}
        {extra && <span className="ml-2 text-xs">{extra}</span>}
      </span>
    </div>
  );
}

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
    >
      {children}
    </a>
  );
}
