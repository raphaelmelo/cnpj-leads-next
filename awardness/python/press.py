"""
A prensa.

Simula o que uma Risograph faz com tinta e papel e o navegador nao faz com
CSS: fibra de papel, cobertura desigual de tinta, retícula de meio-tom em
angulo e erro de registro entre passadas.

Divisao de trabalho do projeto:
  Python  -> textura, retícula, ruido, formas organicas  (operacao de pixel)
  Remotion-> tipografia, hierarquia, layout, render PNG  (composicao)

Nada aqui depende de aleatoriedade do relogio: toda funcao recebe `seed` e
produz o mesmo arquivo byte a byte. Peca reproduzivel e requisito, nao luxo —
sem isso nao da para versionar arte.
"""

from __future__ import annotations

import numpy as np
from PIL import Image


# --------------------------------------------------------------------------
# Base
# --------------------------------------------------------------------------

def _rng(seed: int) -> np.random.Generator:
    return np.random.default_rng(seed)


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def _smoothstep(edge0: np.ndarray | float, edge1: np.ndarray | float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - edge0) / np.maximum(edge1 - edge0, 1e-6), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def value_noise(w: int, h: int, octaves: int, seed: int, base: int = 4) -> np.ndarray:
    """
    Ruido de valor multi-oitava, 0..1.

    Gerado em baixa resolucao e reamostrado com bicubico a cada oitava — mais
    barato que Perlin e, para fibra de papel, indistinguivel. Cada oitava tem
    metade da amplitude e o dobro da frequencia da anterior.
    """
    rng = _rng(seed)
    out = np.zeros((h, w), dtype=np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        size = base * (2 ** o)
        grid = rng.random((size, size)).astype(np.float32)
        layer = np.asarray(
            Image.fromarray((grid * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC),
            dtype=np.float32,
        ) / 255.0
        out += layer * amp
        total += amp
        amp *= 0.5
    return out / total


# --------------------------------------------------------------------------
# Papel
# --------------------------------------------------------------------------

def paper(w: int, h: int, base_hex: str, seed: int = 7, strength: float = 0.055) -> Image.Image:
    """
    Papel. Tres camadas somadas:

      fibra   — ruido de media frequencia, a trama da folha
      mancha  — ruido de baixissima frequencia, a variacao de tom da resma
      poeira  — pontos escuros esparsos, as impurezas da celulose

    `strength` fica baixo de proposito. Textura de papel que se percebe
    conscientemente esta forte demais; ela tem que agir abaixo do limiar.
    """
    r, g, b = hex_to_rgb(base_hex)
    fiber = value_noise(w, h, octaves=5, seed=seed) - 0.5
    stain = value_noise(w, h, octaves=2, seed=seed + 101, base=2) - 0.5

    rng = _rng(seed + 202)
    speck = (rng.random((h, w)) > 0.9992).astype(np.float32)

    mod = 1.0 + fiber * strength + stain * (strength * 1.6)
    img = np.stack([np.full((h, w), c, dtype=np.float32) * mod for c in (r, g, b)], axis=-1)
    img -= speck[..., None] * 26.0
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGB")


# --------------------------------------------------------------------------
# Retícula de meio-tom
# --------------------------------------------------------------------------

def halftone_mask(
    w: int,
    h: int,
    coverage: np.ndarray,
    pitch: float = 14.0,
    angle_deg: float = 45.0,
    softness: float = 1.1,
) -> np.ndarray:
    """
    Retícula rotacionada, 0..1.

    O raio do ponto cresce com a RAIZ da cobertura, nao com a cobertura: o que
    o olho le e area, e area vai com o quadrado do raio. Usar cobertura direta
    produz um degrade que escurece cedo demais e denuncia retícula falsa.

    O angulo padrao e 45 graus porque e o que menos gera padrao de interferencia
    visivel quando duas passadas se sobrepoem.
    """
    a = np.deg2rad(angle_deg)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ru = xx * np.cos(a) + yy * np.sin(a)
    rv = -xx * np.sin(a) + yy * np.cos(a)

    cu = np.mod(ru, pitch) - pitch / 2.0
    cv = np.mod(rv, pitch) - pitch / 2.0
    dist = np.sqrt(cu * cu + cv * cv)

    radius = (pitch / 2.0) * np.sqrt(np.clip(coverage, 0.0, 1.0)) * 1.32
    return _smoothstep(radius + softness, radius - softness, dist)


def linear_coverage(w: int, h: int, direction: str = "down", lo: float = 0.0, hi: float = 1.0) -> np.ndarray:
    """Campo de cobertura em rampa — a entrada mais comum da retícula."""
    if direction in ("down", "up"):
        ramp = np.linspace(0.0, 1.0, h, dtype=np.float32)[:, None].repeat(w, axis=1)
    else:
        ramp = np.linspace(0.0, 1.0, w, dtype=np.float32)[None, :].repeat(h, axis=0)
    if direction in ("up", "left"):
        ramp = 1.0 - ramp
    return lo + ramp * (hi - lo)


def radial_coverage(w: int, h: int, cx: float = 0.5, cy: float = 0.5, radius: float = 0.75) -> np.ndarray:
    """Campo radial — usado nos halos atras de numero grande."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx / w) - cx) ** 2 + ((yy / h) - cy) ** 2)
    return np.clip(1.0 - d / max(radius, 1e-6), 0.0, 1.0)


# --------------------------------------------------------------------------
# Tinta
# --------------------------------------------------------------------------

def ink_layer(
    w: int,
    h: int,
    mask: np.ndarray,
    ink_hex: str,
    seed: int = 3,
    mottle: float = 0.2,
) -> Image.Image:
    """
    Uma passada de tinta, RGBA.

    `mottle` e o que mais importa aqui: a Riso deposita tinta de forma
    desigual, e uma chapa de cor perfeitamente uniforme e a assinatura de
    vetor. O ruido de media frequencia modula o alfa, nao a cor — modular a
    cor suja a tinta; modular o alfa deixa o papel aparecer atraves dela, que e
    o que acontece de verdade.
    """
    r, g, b = hex_to_rgb(ink_hex)
    noise = value_noise(w, h, octaves=4, seed=seed + 57)
    alpha = np.clip(mask * (1.0 - mottle * 0.5 + noise * mottle), 0.0, 1.0)

    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[..., 0] = r
    rgba[..., 1] = g
    rgba[..., 2] = b
    rgba[..., 3] = (alpha * 255).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def misregister(img: Image.Image, dx: int, dy: int) -> Image.Image:
    """
    Erro de registro. A Riso puxa o papel a cada passada e nenhuma cor cai
    exatamente onde deveria. Um a tres pixels e o bastante: passou disso, le
    como erro de arquivo em vez de charme de impressao.
    """
    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    out.paste(img, (dx, dy))
    return out


# --------------------------------------------------------------------------
# Formas organicas
# --------------------------------------------------------------------------

def blob_mask(w: int, h: int, seed: int = 1, lobes: int = 7, wobble: float = 0.3) -> np.ndarray:
    """
    Mancha organica, 0..1.

    O raio varia com o angulo, somando harmonicos de fase aleatoria. Isso da
    uma forma fechada, sempre convexa o bastante para nao se auto-intersectar,
    e diferente a cada seed — que e o ponto: as cinco pecas usam seeds
    diferentes e nenhuma mancha se repete.
    """
    rng = _rng(seed)
    phases = rng.random(lobes) * 2 * np.pi
    weights = rng.random(lobes) * wobble

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = (xx / w - 0.5) * 2.0
    ny = (yy / h - 0.5) * 2.0
    theta = np.arctan2(ny, nx)
    dist = np.sqrt(nx * nx + ny * ny)

    radius = np.full((h, w), 0.74, dtype=np.float32)
    for k in range(lobes):
        radius += weights[k] * np.cos((k + 2) * theta + phases[k]) / (k + 2)

    return _smoothstep(radius + 0.012, radius - 0.012, dist)


def arc_mask(w: int, h: int, thickness: float = 0.09, radius: float = 0.62, start: float = 0.0, sweep: float = 1.0) -> np.ndarray:
    """Arco — o gesto mais barato que da movimento a um cartaz parado."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = xx / w - 0.5
    ny = yy / h - 0.5
    d = np.sqrt(nx * nx + ny * ny)
    ring = _smoothstep(thickness / 2 + 0.004, thickness / 2 - 0.004, np.abs(d - radius / 2))

    theta = np.mod(np.arctan2(ny, nx) / (2 * np.pi) + 1.0, 1.0)
    lo, hi = start, start + sweep
    within = ((theta >= lo) & (theta <= hi)) if hi <= 1.0 else ((theta >= lo) | (theta <= hi - 1.0))
    return ring * within.astype(np.float32)
