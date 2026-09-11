"""
Gera a biblioteca de ativos de tinta e papel consumida pelo Remotion.

Roda uma vez; o Remotion so compoe. Separar assim tem uma razao pratica: a
retícula de meio-tom em 2160x2700 leva segundos em numpy e seria refeita a
cada frame se vivesse no navegador.

Uso:
    python3 python/build_assets.py
Saida:
    public/press/*.png
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
import press  # noqa: E402

# 2x do formato de feed (1080x1350). O texto do Remotion sai em escala 2 e as
# duas camadas se encontram na mesma resolucao — misturar 1x com 2x produz
# retícula borrada sobre tipografia nitida, e o olho pega isso na hora.
SCALE = 2
W, H = 1080 * SCALE, 1350 * SCALE

OUT = Path(__file__).resolve().parent.parent / "public" / "press"

PAPERS = {
    "cream": "#F7F1E1",
    "bone": "#FBF7EC",
    "sand": "#EFE6D2",
}


def save(img, name: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{name}.png"
    img.save(path, optimize=True)
    kb = path.stat().st_size / 1024
    print(f"  {name}.png  {img.size[0]}x{img.size[1]}  {kb:.0f} KB")


def build_papers() -> None:
    print("papel")
    for name, hexv in PAPERS.items():
        save(press.paper(W, H, hexv, seed=hash(name) % 9973), f"paper-{name}")


def build_virada() -> None:
    """Peca 1 — a mancha grande no alto, o arco embaixo. Tensao diagonal."""
    print("virada")
    blob = press.blob_mask(W, H, seed=41, lobes=6, wobble=0.26)
    # Recorta a mancha para o quadrante superior direito e a dissolve na base:
    # mancha inteira centralizada compete com o titulo.
    fade = press.linear_coverage(W, H, "up", lo=0.0, hi=1.35)
    cov = np.clip(blob * fade, 0, 1)
    save(press.misregister(press.ink_layer(W, H, press.halftone_mask(W, H, cov, pitch=16 * SCALE / 2, angle_deg=15), "#F15060", seed=41), 2, -3), "virada-a")

    arc = press.arc_mask(W, H, thickness=0.055, radius=1.02, start=0.06, sweep=0.30)
    save(press.ink_layer(W, H, arc, "#00A95C", seed=42, mottle=0.3), "virada-b")


def build_dado() -> None:
    """Peca 2 — halo radial atras do numero. A cobertura cai do centro."""
    print("dado")
    halo = press.radial_coverage(W, H, cx=0.34, cy=0.36, radius=0.60) ** 1.4
    save(press.misregister(press.ink_layer(W, H, press.halftone_mask(W, H, halo, pitch=9 * SCALE, angle_deg=45), "#765BA7", seed=17), -3, 2), "dado-a")

    band = press.linear_coverage(W, H, "up", lo=-0.5, hi=1.0)
    band = np.clip(band, 0, 1) * (press.linear_coverage(W, H, "right", lo=0.2, hi=1.0))
    save(press.ink_layer(W, H, press.halftone_mask(W, H, band * 0.55, pitch=7 * SCALE, angle_deg=75), "#FF6C2F", seed=18), "dado-b")


def build_espelho() -> None:
    """Peca 3 — faixa vertical de retícula na margem, mancha no rodape."""
    print("espelho")
    strip = press.linear_coverage(W, H, "right", lo=1.25, hi=-0.15)
    strip = np.clip(strip, 0, 1) ** 1.8
    save(press.misregister(press.ink_layer(W, H, press.halftone_mask(W, H, strip, pitch=11 * SCALE, angle_deg=0), "#FF48B0", seed=71), 3, 2), "espelho-a")

    blob = press.blob_mask(W, H, seed=72, lobes=8, wobble=0.34)
    fade = press.linear_coverage(W, H, "down", lo=-0.35, hi=1.25)
    save(press.ink_layer(W, H, np.clip(blob * fade, 0, 1) * 0.85, "#FFE800", seed=73, mottle=0.26), "espelho-b")


def build_mecanismo() -> None:
    """Peca 4 — painel de retícula fina. A peca que explica tem que ser calma."""
    print("mecanismo")
    panel = press.linear_coverage(W, H, "down", lo=0.9, hi=0.06) ** 1.2
    save(press.misregister(press.ink_layer(W, H, press.halftone_mask(W, H, panel * 0.8, pitch=13 * SCALE, angle_deg=30), "#0078BF", seed=91), -2, -2), "mecanismo-a")

    arc = press.arc_mask(W, H, thickness=0.07, radius=1.18, start=0.55, sweep=0.26)
    save(press.ink_layer(W, H, arc, "#5EC8E5", seed=92, mottle=0.34), "mecanismo-b")


def build_confissao() -> None:
    """Peca 5 — mancha larga e macia. A peca que admite erro nao pode ser dura."""
    print("confissao")
    blob = press.blob_mask(W, H, seed=55, lobes=5, wobble=0.2)
    soft = press.radial_coverage(W, H, cx=0.62, cy=0.30, radius=0.9)
    save(press.misregister(press.ink_layer(W, H, press.halftone_mask(W, H, np.clip(blob * soft, 0, 1) * 0.9, pitch=18 * SCALE / 2, angle_deg=60), "#FF6C2F", seed=55), 3, -2), "confissao-a")

    base = press.linear_coverage(W, H, "down", lo=-0.45, hi=1.15)
    save(press.ink_layer(W, H, press.halftone_mask(W, H, np.clip(base, 0, 1) * 0.7, pitch=10 * SCALE, angle_deg=45), "#00838A", seed=56), "confissao-b")


if __name__ == "__main__":
    print(f"prensando em {W}x{H} (escala {SCALE})\n")
    build_papers()
    build_virada()
    build_dado()
    build_espelho()
    build_mecanismo()
    build_confissao()
    print(f"\npronto -> {OUT}")
