# awardness

Motor de conteúdo para posicionar **Raphael Melo** como *product engineer* no LinkedIn.

Não é um repositório de posts soltos. É uma cadeia: **JTBD → roteiro → arte → publicação**, em que cada elo é versionado e cada afirmação carrega procedência.

---

## Estado atual

| Peça | Estado |
|---|---|
| `copy/20-roteiros.md` | ✅ **Pronto.** 20 roteiros mapeados às quatro forças do JTBD, com hook literal, beats, fecho, prova e risco por peça. Inclui sequenciamento de 7 semanas. |
| `FATOS-A-CONFIRMAR.md` | ✅ **Pronto.** Separa o que foi lido no original do que veio de índice de busca. |
| `python/press.py` | ✅ **Pronto e testado.** A prensa risográfica: papel, retícula de meio-tom, tinta, erro de registro, formas orgânicas. |
| `python/build_assets.py` | ✅ **Roda.** Gera 13 PNGs em `public/press/` a 2160×2700. |
| Composição das artes | ⚠️ **Com defeito diagnosticado, correção não aplicada.** Ver abaixo. |
| Templates Remotion | ❌ **Não iniciados.** Pausados a pedido. |

### O defeito diagnosticado nas artes

A primeira leva de ativos foi gerada e inspecionada visualmente. A textura e a retícula ficaram corretas; **a composição não**. Três defeitos, todos com a mesma causa raiz:

1. Cobertura de tinta acima de 90% em quatro das cinco peças — não sobra papel para tipografia.
2. Sobreimpressão virando lama nas peças 2 e 5 (roxo+laranja e laranja+verde-azulado a cobertura cheia).
3. Arcos saindo como cunhas cortadas.

**Causa raiz:** as funções de forma normalizam `x` por largura e `y` por altura num quadro 4:5. Todo círculo vira elipse e é cortado pela borda. E, mais de fundo: eu gerei *textura de tela cheia* quando o que o cartaz pede é *elemento posicionado em zona reservada*.

**Correção pendente:** sistema de posicionamento por zona com correção de aspecto (`stamp()` de máscara local quadrada para caixa normalizada no canvas), teto de cobertura por tinta, e a retícula aplicada no campo global — não por forma, senão a ilusão de prensa quebra.

---

## Por que Python **e** Remotion

Não é redundância. Cada um faz o que o outro não faz:

| Python (`python/`) | Remotion (`src/`) |
|---|---|
| Operação de pixel | Composição e tipografia |
| Retícula de meio-tom rotacionada | Hierarquia, grid, layout |
| Fibra de papel, grão, cobertura desigual | Fontes variáveis, quebra de linha |
| Erro de registro entre passadas | Render PNG determinístico |
| Formas orgânicas procedurais | Schema editável no Studio |

Retícula em 2160×2700 leva segundos em numpy e seria refeita a cada frame se vivesse no navegador. Por isso a prensa roda uma vez e o Remotion só compõe.

---

## Uso

```bash
npm install
python3 -m pip install Pillow numpy

python3 python/build_assets.py   # gera public/press/*.png
npm run studio                   # abre o Remotion Studio  (requer templates)
npm run typecheck                # passa limpo
```

---

## Este projeto deve virar repositório próprio

Ele nasceu fora do `cnpj-leads-next` de propósito e não tem nenhuma dependência dele. A criação do repositório no GitHub foi **negada nesta sessão** (`403 Resource not accessible by integration` — o GitHub App não tem permissão de criar repositório).

Para extrair:

```bash
cp -r awardness ~/awardness && cd ~/awardness
git init && git add -A && git commit -m "início"
git remote add origin git@github.com:raphaelmelo/awardness.git
git push -u origin main
```

---

## Regra da casa

Nenhuma afirmação vai ao ar sem procedência. `[V]` foi lido no original; `[I]` veio de índice de busca e precisa de conferência; `[P]` é opinião própria e não precisa de fonte — precisa de ser verdade.

Onze dos vinte roteiros são `[P]`. Eles funcionam como argumento, mas só viram ativo quando carregarem um caso real seu. Essa é a única camada que ninguém copia.
