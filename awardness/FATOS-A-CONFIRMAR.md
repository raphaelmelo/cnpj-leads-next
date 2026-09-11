# Fatos a confirmar antes de publicar

Este arquivo existe por uma razão: **nenhuma afirmação marcada `[I]` foi lida por mim na página original.**

A política de rede deste ambiente bloqueou quase todo domínio externo (`403` no túnel CONNECT). O que consegui ler literalmente foi só a PostHog — porque o site deles é open source e o texto do handbook está publicado no repositório `PostHog/posthog.com`, acessível via `raw.githubusercontent.com`. Isso não é contorno de política: é a publicação oficial da própria empresa.

Tudo o mais veio de **snippet de índice de busca**. A URL é real e a data é real. A redação exata, não posso garantir.

---

## Bloqueado nesta sessão

`rapppl.com` · `triscoengenharia.com.br` · `linkedin.com` · `business.linkedin.com` · `posthog.com` · `hbr.org` · `lennysnewsletter.com` · `martinfowler.com` · `survey.stackoverflow.co` · `awwwards.com` · `thefwa.com` · `motionawards.com` · `arxiv.org` · `en.wikipedia.org`

Alcançáveis: `github.com`, `raw.githubusercontent.com`, `registry.npmjs.org`, `pypi.org`, `fonts.googleapis.com`.

---

## [V] — verificado literal, pode publicar entre aspas

Todas da PostHog, lidas no texto-fonte completo:

| Citação | Onde é usada |
|---|---|
| *"When the person talking to users is the same one writing the code, less time gets spent on handoff."* | roteiro **07** |
| *"Product engineers focus on building great products while software engineers focus on building reliable software."* | roteiro **12** |
| *"A software engineering team might include a frontend engineer, backend engineer, tester, designer, and product manager. A product engineering team usually includes just product engineers."* | roteiro **08** |
| *"Product engineers prefer prototypes, minimum viable features, and experiments to briefs, proposals, and presentations."* | roteiro **09** |
| *"Getting to 80% doesn't count."* | roteiro **11** |
| *"anyone can pay $20 for a machine that spits out code that works well enough... code is not enough on its own to create an advantage. But here's the good news: it never was."* | roteiro **10** |
| *"AI can't build your business."* | roteiro **10** |

Fontes: `posthog.com/product-engineer/what-is-a-product-engineer`, `posthog.com/blog/product-engineer-vs-software-engineer` (Ian Vanagas e Jina Yoon, 2025-12-08), `posthog.com/product-engineer/traits`.

---

## [I] — CONFIRMAR ANTES DE PUBLICAR

### 1. CB Insights — 42% morrem sem mercado · roteiro 01
- **Afirmado:** *"no market need"* é a razão #1 de falha, em 42% dos post-mortems analisados.
- **Onde conferir:** `cbinsights.com/research/startup-failure-post-mortem/`
- **O que confirmar:** o percentual, o tamanho da amostra (483?) e o ano. Há uma atualização de 2024 (431 empresas) em que o número que aparece é **43% de PMF ruim** — são recortes diferentes e é fácil trocar um pelo outro.
- **Risco se estiver errado:** médio. É um número muito repetido; errar nele é constrangedor justamente por isso.

### 2. Sebrae — metade não sobrevive, 56,56% não faturam · roteiro 03
- **Onde conferir:** `agenciasebrae.com.br` — matéria sobre sobrevivência de startups brasileiras.
- **O que confirmar:** os dois percentuais, o ano da pesquisa e qual instituto produziu o dado (a agência reporta; nem sempre é pesquisa do próprio Sebrae).
- **Risco se estiver errado:** alto. O roteiro 03 é inteiro construído sobre esses dois números.

### 3. Empreendedor.com.br — 86% / 32% · roteiro 06
- **Afirmado:** 86% dos líderes de tecnologia no Brasil relatam dificuldade em contratar; só 32% atribuem à falta de profissionais.
- **O que confirmar:** **qual é a pesquisa original.** Isto é portal de notícias reportando um levantamento de terceiro. Sem a pesquisa primária, não publique com o número.
- **Risco se estiver errado:** alto. É o melhor dado brasileiro da série e o mais frágil em procedência.

### 4. Stack Overflow Developer Survey 2025 — 66% · roteiro 10
- **Afirmado:** a maior frustração dos devs é lidar com soluções de IA *"almost right, but not quite"* — 66%.
- **Onde conferir:** `survey.stackoverflow.co/2025/ai`
- **O que confirmar:** o percentual e a redação literal em inglês.
- **Risco se estiver errado:** baixo. O argumento sobrevive sem o número.

### 5. Metricool 2026 — formato em perfil pessoal · nota de formato
- **Afirmado:** em perfis pessoais, vídeo é o formato mais usado e o que menos performa; imagem e multi-imagem performam acima. Amostra: 673.658 posts / 63.108 contas.
- **O que confirmar:** o estudo inteiro. **É a base da decisão de fazer PNG em vez de vídeo** — vale abrir.
- **Risco se estiver errado:** alto para a estratégia de formato, nulo para o conteúdo dos roteiros.

---

## Fatos SEUS que eu não tenho como verificar

Não escrevi nada afirmando isso. Se entrar nos posts, a responsabilidade é sua:

- Tempo de atuação como desenvolvedor e como product engineer.
- Seu papel exato na Trisco Engenharia (você informou: sócio e product engineer).
- O que a Trisco faz, para quem, e o que você construiu lá.
- Qualquer número de projeto, cliente ou resultado.
- Formação — a pós em produtos digitais.

O único dado seu que está verificado é o público do GitHub: conta `raphaelmelo` criada em 2016-04-25, localização Guarujá/SP, campo de empresa `@getupcloud`.

---

## Deliberadamente não usado

Números que circulam no meio e que **descartei por não terem fonte primária rastreável**:

- *"Founders desperdiçam os primeiros US$ 30 mil"* — sem fonte.
- *"Feature creep afeta 68% dos projetos"* — sem fonte.
- *"64% das features são raramente ou nunca usadas"* (Standish/Johnson, XP 2002) — **a limitação é grave**: Mike Cohn documenta que veio de apenas **quatro aplicações internas**. Se for usar, use com a ressalva. Eu preferi não usar.
- *"Comentário vale 15x mais que curtida"* no algoritmo do LinkedIn — folclore de fornecedor. O LinkedIn nunca publicou pesos relativos.
- *"Golden hour"* — jargão de criador, sem definição oficial do LinkedIn.
