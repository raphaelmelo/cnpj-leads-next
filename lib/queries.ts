import { unstable_cache } from "next/cache";
import { db } from "./db";
import type { Lead, Socio } from "./types";

const CACHE_TTL = 86400; // 24h — dados RFB são mensais

const COLS_BASE = `
  cnpj, cnpj_basico, razao_social, nome_fantasia, capital_social,
  matriz_filial, cnae_principal, cnae_secundario,
  data_inicio_atividade, idade_anos, bucket_idade, bucket_capital,
  regiao, uf, municipio, bairro, logradouro, numero, complemento, cep,
  ddd1, telefone1, email, email_dominio_proprio,
  eh_matriz, qtd_estabelecimentos, multi_estado, parece_spe,
  qtd_socios, tem_socio_pj, tem_email_valido, tem_telefone_valido,
  score_contato, lead_score, lead_score_motivos,
  nome_grupo_economico, qtd_empresas_grupo
`;

// A base já vem filtrada (score >= 70 + qualificado) via criar_base_top.py.
// Use `1=1` quando não precisar de filtro adicional.
const QUALIFICADO_WHERE = `1=1`;

export type ViewFilter = {
  where: string;
  orderBy: string;
  defaultLimit?: number;
};

export const VIEWS: Record<string, ViewFilter & { title: string; description: string }> = {
  "top-100": {
    title: "Top 100",
    description: "Os 100 leads com maior lead score.",
    where: QUALIFICADO_WHERE,
    orderBy: "lead_score DESC",
    defaultLimit: 100,
  },
  "recem-criadas": {
    title: "Recém-criadas",
    description: "Empresas com menos de 1 ano e capital > R$ 500k. Acabaram de abrir, momento de compra.",
    where: `idade_anos < 1 AND capital_social > 500000`,
    orderBy: "capital_social DESC",
  },
  "grandes": {
    title: "Grandes consolidadas",
    description: "Capital > R$ 10M, mais de 10 anos, matriz. Tickets altos.",
    where: `capital_social > 10000000 AND idade_anos > 10 AND eh_matriz = 1`,
    orderBy: "capital_social DESC",
  },
  "contataveis": {
    title: "Contatáveis",
    description: "Score ≥ 60 com email e telefone validados.",
    where: `lead_score >= 60 AND tem_email_valido = 1 AND tem_telefone_valido = 1`,
    orderBy: "lead_score DESC",
  },
  "grupos": {
    title: "Grupos econômicos",
    description: "Holdings e SPEs detectadas via cruzamento de sócios.",
    where: `nome_grupo_economico IS NOT NULL AND ${QUALIFICADO_WHERE}`,
    orderBy: "qtd_empresas_grupo DESC, nome_grupo_economico, lead_score DESC",
  },
  "uf-sp": { title: "São Paulo", description: "Incorporadoras qualificadas em SP.", where: `uf = 'SP' AND ${QUALIFICADO_WHERE}`, orderBy: "lead_score DESC" },
  "uf-rj": { title: "Rio de Janeiro", description: "Incorporadoras qualificadas em RJ.", where: `uf = 'RJ' AND ${QUALIFICADO_WHERE}`, orderBy: "lead_score DESC" },
  "uf-mg": { title: "Minas Gerais", description: "Incorporadoras qualificadas em MG.", where: `uf = 'MG' AND ${QUALIFICADO_WHERE}`, orderBy: "lead_score DESC" },
  "uf-pr": { title: "Paraná", description: "Incorporadoras qualificadas em PR.", where: `uf = 'PR' AND ${QUALIFICADO_WHERE}`, orderBy: "lead_score DESC" },
  "uf-sc": { title: "Santa Catarina", description: "Incorporadoras qualificadas em SC.", where: `uf = 'SC' AND ${QUALIFICADO_WHERE}`, orderBy: "lead_score DESC" },
  "base": {
    title: "Base completa",
    description: "Todos os leads qualificados (excluí lista negra).",
    where: QUALIFICADO_WHERE,
    orderBy: "lead_score DESC",
  },
  "lista-negra": {
    title: "Lista negra",
    description: "Leads excluídos automaticamente — confira se algum bom não foi excluído por engano.",
    where: `NOT (${QUALIFICADO_WHERE})`,
    orderBy: "capital_social DESC",
  },
};

export type ListParams = {
  view: string;
  page?: number;
  pageSize?: number;
  search?: string;
};

export async function listLeads({ view, page = 1, pageSize = 50, search }: ListParams) {
  const def = VIEWS[view];
  if (!def) throw new Error(`view inválida: ${view}`);

  // Sem busca → cacheable
  if (!search || !search.trim()) {
    return _listLeadsCached(view, page, pageSize);
  }

  // Com busca → não cacheia
  const params: (string | number)[] = [];
  const q = `%${search.toUpperCase()}%`;
  const where = `${def.where} AND (UPPER(razao_social) LIKE ? OR UPPER(IFNULL(nome_fantasia,'')) LIKE ? OR cnpj LIKE ?)`;
  params.push(q, q, `%${search}%`);

  const offset = (page - 1) * pageSize;
  const sql = `
    SELECT ${COLS_BASE} FROM incorporadoras
    WHERE ${where} ORDER BY ${def.orderBy} LIMIT ${pageSize} OFFSET ${offset}
  `;
  const result = await db.execute({ sql, args: params });
  return result.rows as unknown as Lead[];
}

const _listLeadsCached = unstable_cache(
  async (view: string, page: number, pageSize: number) => {
    const def = VIEWS[view];
    const limit = def.defaultLimit ?? pageSize;
    const offset = (page - 1) * limit;
    const sql = `
      SELECT ${COLS_BASE} FROM incorporadoras
      WHERE ${def.where} ORDER BY ${def.orderBy} LIMIT ${limit} OFFSET ${offset}
    `;
    const result = await db.execute(sql);
    return result.rows as unknown as Lead[];
  },
  ["list-leads"],
  { revalidate: CACHE_TTL },
);

export async function countLeads({ view, search }: ListParams) {
  const def = VIEWS[view];
  if (!def) throw new Error(`view inválida: ${view}`);

  // Sem busca: usa cache de view_stats
  if (!search || !search.trim()) {
    const cached = await db.execute({
      sql: `SELECT total FROM view_stats WHERE view_key = ?`,
      args: [view],
    });
    if (cached.rows.length > 0) {
      return Number((cached.rows[0] as unknown as { total: number }).total);
    }
  }

  const params: (string | number)[] = [];
  let where = def.where;

  if (search && search.trim()) {
    where += ` AND (UPPER(razao_social) LIKE ? OR UPPER(IFNULL(nome_fantasia,'')) LIKE ? OR cnpj LIKE ?)`;
    const q = `%${search.toUpperCase()}%`;
    params.push(q, q, `%${search}%`);
  }

  const sql = `SELECT COUNT(*) AS total FROM incorporadoras WHERE ${where}`;
  const result = await db.execute({ sql, args: params });
  const row = result.rows[0] as unknown as { total: number };
  return Number(row.total);
}

export async function statsForView({ view, search }: ListParams) {
  const def = VIEWS[view];
  if (!def) throw new Error(`view inválida: ${view}`);

  // Sem busca: usa stats pré-calculadas (instantâneo)
  if (!search || !search.trim()) {
    const cached = await db.execute({
      sql: `SELECT total, score_medio, capital_total, capital_medio, grupos
            FROM view_stats WHERE view_key = ?`,
      args: [view],
    });
    if (cached.rows.length > 0) {
      return cached.rows[0] as unknown as {
        total: number;
        score_medio: number;
        capital_total: number;
        capital_medio: number;
        grupos: number;
      };
    }
  }

  // Com busca ou view sem cache: agrega na hora
  const params: (string | number)[] = [];
  let where = def.where;
  if (search && search.trim()) {
    where += ` AND (UPPER(razao_social) LIKE ? OR UPPER(IFNULL(nome_fantasia,'')) LIKE ? OR cnpj LIKE ?)`;
    const q = `%${search.toUpperCase()}%`;
    params.push(q, q, `%${search}%`);
  }

  const sql = `
    SELECT
      COUNT(*) AS total,
      ROUND(AVG(lead_score), 1) AS score_medio,
      SUM(capital_social) AS capital_total,
      ROUND(AVG(capital_social), 0) AS capital_medio,
      COUNT(DISTINCT nome_grupo_economico) AS grupos
    FROM incorporadoras
    WHERE ${where}
  `;
  const result = await db.execute({ sql, args: params });
  return result.rows[0] as unknown as {
    total: number;
    score_medio: number;
    capital_total: number;
    capital_medio: number;
    grupos: number;
  };
}

export const getEmpresa = unstable_cache(
  async (cnpj: string): Promise<Lead | null> => {
    const result = await db.execute({
      sql: `SELECT ${COLS_BASE} FROM incorporadoras WHERE cnpj = ? LIMIT 1`,
      args: [cnpj],
    });
    return (result.rows[0] as unknown as Lead) ?? null;
  },
  ["get-empresa"],
  { revalidate: CACHE_TTL },
);

export const getSocios = unstable_cache(
  async (cnpjBasico: string): Promise<Socio[]> => {
    const result = await db.execute({
      sql: `SELECT * FROM socios WHERE cnpj_basico = ? ORDER BY qualificacao_socio`,
      args: [cnpjBasico],
    });
    return result.rows as unknown as Socio[];
  },
  ["get-socios"],
  { revalidate: CACHE_TTL },
);

export const getOutrasEmpresasGrupo = unstable_cache(
  async (grupo: string, excluirCnpj: string): Promise<Lead[]> => {
    const result = await db.execute({
      sql: `SELECT ${COLS_BASE} FROM incorporadoras WHERE nome_grupo_economico = ? AND cnpj <> ? ORDER BY capital_social DESC LIMIT 50`,
      args: [grupo, excluirCnpj],
    });
    return result.rows as unknown as Lead[];
  },
  ["get-outras-grupo"],
  { revalidate: CACHE_TTL },
);
