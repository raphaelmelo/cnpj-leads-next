# Prompt consolidado — motor de conteúdo LinkedIn / product engineer

> Cole isto inteiro ao abrir uma sessão nova. Reúne tudo que foi pedido, o que já existe e as restrições reais do ambiente.

---

## Quem sou

- **Raphael Melo** — dev full-stack (React, TypeScript, Node) com **pós em produtos digitais**.
- **Sócio e product engineer na Trisco Engenharia** — https://www.triscoengenharia.com.br
- Site pessoal: **https://rapppl.com**
- Guarujá/SP. GitHub `raphaelmelo` desde 2016.

## O que eu quero

Criar conteúdo no LinkedIn que **demonstre expertise em desenvolvimento de produto** — não conteúdo genérico de "5 dicas". Quero ocupar a categoria **product engineer** na cabeça de quem ainda nem sabe que é isso que precisa contratar.

A estratégia se chama **awardness**: awareness conquistada por acabamento. A tese é que num feed de carrossel de Canva, **o acabamento é o único argumento que não dá para falsificar** — se eu afirmo que construo produto com acabamento, a única prova aceitável é o próprio post ter acabamento. A peça é a prova.

## Público (ICP)

**Founder early-stage, pré-PMF.** Tem hipótese, tem runway curto, não tem prova de que alguém quer o que ele está construindo.

### O job declarado

> *Quando tenho uma hipótese de negócio e um runway curto, quero transformá-la em algo que pessoas reais usem o quanto antes, para descobrir se há negócio aí antes que o dinheiro acabe.*

Ele não contrata código. Contrata **velocidade de aprendizado com acabamento que não envergonha.**

### As quatro forças (Moesta/Spiek) — a espinha de todo conteúdo

| Força | O que é | Exemplos |
|---|---|---|
| **PUSH** | Empurra para fora do status quo | Runway queimando sem nada no ar; agência entregou o escopo exato de um briefing errado; toda decisão volta pra mesa do founder |
| **PULL** | Atrai para a nova solução | Alguém que discute o problema antes de estimar; corta escopo sozinho; entrega em produção, não em Figma |
| **ANSIEDADE** | Freia na hora de contratar | "É só dev caro com nome bonito?"; "vai querer mandar no meu produto?"; "se ele sumir, quem mantém?"; "não sei avaliar tecnicamente" |
| **HÁBITO** | Prende ao arranjo atual | Agência já contratada; amigo CTO que "faz no fim de semana"; no-code que "já resolve"; custo afundado |

**Ansiedade tem peso alto**: é a força que mata a contratação no último metro.

## Entregáveis

### 1. Roteiros — ✅ FEITO

20 roteiros em `copy/20-roteiros.md`, cada um atacando **uma** força, com hook literal, beats, fecho, prova e risco. Inclui sequenciamento de 7 semanas com justificativa por posição.

### 2. Artes — ⚠️ EM ABERTO, É O PRÓXIMO PASSO

**5 templates de arte para LinkedIn.** Requisitos, nas minhas palavras:

- **muito fofas**
- **impossível de ser ignoradas**
- **alta retenção de atenção**
- **que contem história (storytelling) e chamem atenção pro post**
- **PNG estático, NÃO vídeo**
- feitas com **Python e Remotion** — os dois
- nível awards, qualidade super caprichada

Os 5 templates devem ser **arquétipos narrativos**, não só layouts:

1. **VIRADA** — uma crença riscada e substituída (reversão)
2. **DADO** — um número que dói, com fonte carimbada (revelação)
3. **ESPELHO** — checklist de sintomas, o leitor se reconhece (identificação)
4. **MECANISMO** — diagrama de como algo funciona (explicação)
5. **CONFISSÃO** — um erro próprio, contado (vulnerabilidade)

### 3. Repositório próprio — ⚠️ PENDENTE

Este projeto **deve ser repositório próprio**, separado do `cnpj-leads-next`. Ele já é autônomo e tem `EXTRAIR.sh` que faz a extração num comando. Falta só criar o repo vazio no GitHub.

---

## O que já está construído

| Arquivo | Estado |
|---|---|
| `copy/20-roteiros.md` | ✅ 20 roteiros completos + sequenciamento |
| `FATOS-A-CONFIRMAR.md` | ✅ Separa `[V]` verificado / `[I]` índice de busca / `[P]` opinião |
| `python/press.py` | ✅ Prensa risográfica testada: papel, retícula de meio-tom rotacionada, tinta com cobertura desigual, erro de registro, formas orgânicas. Determinística por seed |
| `python/build_assets.py` | ✅ Gera 13 PNGs em `public/press/` a 2160×2700 |
| `src/design/tokens.ts` | ✅ Tintas Riso reais, 5 paletas de 2 tintas + papel, escala tipográfica |
| `src/design/fonts.ts` | ✅ Fraunces + Bricolage Grotesque + Geist Mono via `@remotion/google-fonts` |
| Templates Remotion | ❌ Não iniciados |
| Composição das artes | ⚠️ Defeito diagnosticado, correção não aplicada |

### O defeito das artes, e a correção que falta

A primeira leva de ativos foi gerada e **inspecionada visualmente**. Textura e retícula ficaram certas. A composição não:

1. Cobertura de tinta acima de 90% em 4 das 5 peças — não sobra papel pra tipografia
2. Sobreimpressão virando lama (roxo+laranja e laranja+teal a cobertura cheia)
3. Arcos saindo como cunhas cortadas

**Causa raiz:** as funções de forma normalizam `x` por largura e `y` por altura num quadro 4:5 — todo círculo vira elipse cortada. E, mais de fundo: o gerador produz *textura de tela cheia* quando cartaz pede *elemento posicionado em zona reservada*.

**Correção especificada:** função `stamp()` que recebe máscara local quadrada e a coloca numa caixa normalizada do canvas com aspecto correto; teto de cobertura por tinta (~45%) para a sobreimpressão não emlamear; **retícula aplicada no campo global, nunca por forma** — senão a ilusão de prensa quebra.

### Por que Python E Remotion

Não é redundância:

| Python | Remotion |
|---|---|
| Operação de pixel | Composição e tipografia |
| Retícula de meio-tom rotacionada | Hierarquia, grid, layout |
| Fibra de papel, grão, cobertura desigual | Fontes variáveis, quebra de linha |
| Erro de registro entre passadas | Render PNG determinístico |

Retícula em 2160×2700 leva segundos em numpy e seria refeita a cada frame se vivesse no navegador.

---

## Evidência já levantada (reaproveitar, não refazer)

### Verificado literal `[V]` — pode publicar entre aspas

Handbook da PostHog, lido no repositório open-source da própria empresa:

- *"When the person talking to users is the same one writing the code, less time gets spent on handoff."*
- *"Product engineers focus on building great products while software engineers focus on building reliable software."*
- *"A product engineering team usually includes just product engineers."*
- *"Getting to 80% doesn't count."*
- *"anyone can pay $20 for a machine that spits out code that works well enough... code is not enough on its own to create an advantage. But here's the good news: it never was."*
- *"AI can't build your business."*

### Achado de mercado

**"Engenheiro de produto" em português significa engenharia industrial.** É por isso que a busca PT retorna ~12.296 vagas contaminadas contra ~335 em inglês. O termo em inglês está vago no Brasil — **território livre**.

### Decisão de formato

Estudo Metricool 2026 (673.658 posts / 63.108 contas, a única amostra que cobre **perfis pessoais**): vídeo é o formato mais usado e o que menos performa em perfil pessoal; imagem e multi-imagem performam acima. O famoso "documento = 6,60%" vem de amostra só de páginas de empresa — sample errado. **Por isso PNG, não vídeo.** Marcado `[I]`: veio de índice de busca, confirmar.

---

## Restrições reais do ambiente (descobertas na sessão anterior)

1. **A política de rede bloqueia quase todo domínio externo** (`403` no túnel CONNECT), incluindo **rapppl.com e triscoengenharia.com.br**. Isso não é o site: é o environment. Para liberar, é preciso mudar a política de rede do environment em Claude Code on the web. Alcançáveis: `github.com`, `raw.githubusercontent.com`, `registry.npmjs.org`, `pypi.org`, `fonts.googleapis.com`.
   → **Consequência:** a paleta atual é provisória e nenhum fato sobre a Trisco foi afirmado. Se a nova sessão também não alcançar os sites, **peça que eu cole o conteúdo** em vez de inventar.

2. **O GitHub App não pode criar repositório** (`403 Resource not accessible by integration`). Criar o repo vazio em github.com/new fica comigo.

3. `Pillow` e `numpy` precisam ser instalados (`python3 -m pip install Pillow numpy`) — não vêm no ambiente.

---

## Como eu quero que você trabalhe

1. **Evidência ou silêncio.** Nunca inventar dado, número, API ou fato. Sem evidência: dizer "não sei" e ir buscar. Nunca preencher lacuna com suposição apresentada como fato.
2. **Causa raiz, não sintoma.** Medir antes de supor. Perguntar sempre: "estou tratando a causa ou o sintoma?"
3. **Executar, nunca hesitar.** Não encolher escopo, não perguntar "vale a pena?". Se eu pedi ou sinalizei, fazer.
4. **Contexto cheio ≠ qualidade menor.** Ao chegar perto do limite, me avisar explicitamente e propor sessão nova.
5. **Especialistas sempre.** Indicar qual agente é o certo antes de executar; delegar com spec, plano e critérios de aceite.
6. **Verificar visualmente.** Arte não se entrega no escuro — gerar, olhar, e só então dizer que está pronta.

---

## Primeira tarefa da próxima sessão

Corrigir a composição das artes pela causa raiz (posicionamento por zona com correção de aspecto) e entregar **os 5 templates PNG**, inspecionados visualmente, com os roteiros já escritos preenchendo cada arquétipo.
