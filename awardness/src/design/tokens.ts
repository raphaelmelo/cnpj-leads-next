import type { CSSProperties } from "react";

/**
 * Sistema visual: RISOGRAFIA.
 *
 * Por que riso e nao "design de post":
 *
 * 1. O feed do LinkedIn e azul corporativo chapado. Tinta riso destoa antes de
 *    o olho ler qualquer palavra — a parada de rolagem acontece na cor, nao no
 *    texto.
 * 2. Riso e quente por construcao. As tintas sao fluorescentes de verdade, o
 *    papel e creme, o registro e imperfeito. Isso le como feito a mao, nao como
 *    template — e e exatamente o "fofo" que nao vira infantil.
 * 3. A limitacao e a estetica. Riso imprime uma cor por passada, entao a paleta
 *    e curta por natureza. Restricao curta e o que separa cartaz de colagem.
 *
 * As cores abaixo sao aproximacoes RGB das tintas spot reais da Riso.
 */

export const ink = {
  fluorescentPink: "#FF48B0",
  brightRed: "#F15060",
  orange: "#FF6C2F",
  yellow: "#FFE800",
  green: "#00A95C",
  teal: "#00838A",
  blue: "#0078BF",
  aqua: "#5EC8E5",
  purple: "#765BA7",
  black: "#16110C",
} as const;

export type InkName = keyof typeof ink;

/** Papel. Nunca branco: riso imprime em papel creme e e dele que vem o calor. */
export const paper = {
  cream: "#F7F1E1",
  bone: "#FBF7EC",
  sand: "#EFE6D2",
} as const;

/**
 * Paletas. Cada peca escolhe UMA. Duas tintas mais o preto — a regra da
 * prensa de verdade, e a razao de o conjunto parecer uma serie em vez de
 * cinco posts avulsos.
 */
export const palettes = {
  /** Quente e frontal. Para a peca que acusa. */
  aviso: { a: ink.fluorescentPink, b: ink.yellow, paper: paper.cream },
  /** Fria e analitica. Para a peca que explica. */
  planta: { a: ink.blue, b: ink.aqua, paper: paper.bone },
  /** Terrosa e confessional. Para a peca que admite um erro. */
  barro: { a: ink.orange, b: ink.teal, paper: paper.sand },
  /** Contraste maximo. Para a peca que vira a mesa. */
  virada: { a: ink.brightRed, b: ink.green, paper: paper.cream },
  /** Sobria com um susto. Para a peca de dado. */
  dado: { a: ink.purple, b: ink.orange, paper: paper.bone },
} as const;

export type PaletteName = keyof typeof palettes;

/* ------------------------------------------------------------------ */
/* Grid                                                                */
/* ------------------------------------------------------------------ */

export const BASELINE = 8;
export const u = (n: number) => n * BASELINE;

/** 4:5 — o maior retangulo vertical que o feed do LinkedIn concede. */
export const CANVAS = { width: 1080, height: 1350 } as const;

/** Margem. Generosa de proposito: cartaz respira, post apertado le como banner. */
export const MARGIN = u(11); // 88px

/* ------------------------------------------------------------------ */
/* Tipografia                                                          */
/* ------------------------------------------------------------------ */

export type TypeSpec = {
  size: number;
  leading: number;
  tracking: number;
  weight: number;
};

/**
 * Fraunces carrega a voz. Tem eixos SOFT e WONK: da para pedir terminais
 * arredondados e italicos tortos, que e de onde vem o charme sem cair no
 * infantil. Bricolage carrega o texto. Geist Mono carrega o carimbo.
 */
export const type = {
  hero: { size: 124, leading: 0.92, tracking: -0.035, weight: 700 },
  xl: { size: 96, leading: 0.94, tracking: -0.03, weight: 700 },
  lg: { size: 72, leading: 1.0, tracking: -0.02, weight: 600 },
  md: { size: 54, leading: 1.08, tracking: -0.015, weight: 600 },
  body: { size: 38, leading: 1.34, tracking: -0.005, weight: 400 },
  bodySm: { size: 31, leading: 1.4, tracking: 0, weight: 400 },
  stamp: { size: 21, leading: 1.2, tracking: 0.15, weight: 500 },
  stampSm: { size: 17, leading: 1.2, tracking: 0.18, weight: 500 },
} as const satisfies Record<string, TypeSpec>;

export const typeCss = (spec: TypeSpec, family: string): CSSProperties => ({
  fontFamily: family,
  fontSize: spec.size,
  lineHeight: spec.leading,
  letterSpacing: `${spec.tracking}em`,
  fontWeight: spec.weight,
  margin: 0,
});
