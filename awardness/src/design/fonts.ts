import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

/**
 * Carregadas no modulo, nunca dentro do componente: o Remotion so grava o
 * frame depois que as promises resolvem, e chamar loadFont em render
 * reregistraria a fonte a cada quadro.
 *
 * "latin-ext" nao e opcional em portugues — sem ele a acentuacao cai em
 * fallback e a peca sai com duas fontes na mesma palavra.
 */
const fraunces = loadFraunces("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin", "latin-ext"],
});

const bricolage = loadBricolage("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
});

const geistMono = loadGeistMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin", "latin-ext"],
});

export const FONT_DISPLAY = fraunces.fontFamily;
export const FONT_TEXT = bricolage.fontFamily;
export const FONT_STAMP = geistMono.fontFamily;

export const fontsReady = Promise.all([
  fraunces.waitUntilDone(),
  bricolage.waitUntilDone(),
  geistMono.waitUntilDone(),
]);
