export type Lead = {
  cnpj: string;
  cnpj_basico: string;
  razao_social: string;
  nome_fantasia: string | null;
  capital_social: number;
  matriz_filial: string | null;
  cnae_principal: number | null;
  cnae_secundario: string | null;
  data_inicio_atividade: string | null;
  idade_anos: number | null;
  bucket_idade: string | null;
  bucket_capital: string | null;
  regiao: string | null;
  uf: string | null;
  municipio: number | null;
  bairro: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  cep: string | null;
  ddd1: number | null;
  telefone1: string | null;
  email: string | null;
  email_dominio_proprio: number;
  eh_matriz: number;
  qtd_estabelecimentos: number;
  multi_estado: number;
  parece_spe: number;
  qtd_socios: number;
  tem_socio_pj: number;
  tem_email_valido: number;
  tem_telefone_valido: number;
  score_contato: number;
  lead_score: number;
  lead_score_motivos: string | null;
  nome_grupo_economico: string | null;
  qtd_empresas_grupo: number | null;
};

export type Socio = {
  cnpj_basico: string;
  nome_socio: string;
  qualificacao_socio: string | null;
  data_entrada: string | null;
  faixa_etaria: string | null;
  cpf_cnpj_socio: string | null;
  tipo_socio: string | null;
};

export type ViewKey =
  | "top-100"
  | "recem-criadas"
  | "grandes"
  | "contataveis"
  | "grupos"
  | "uf-sp"
  | "uf-rj"
  | "uf-mg"
  | "uf-pr"
  | "uf-sc"
  | "base"
  | "lista-negra";
