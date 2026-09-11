#!/usr/bin/env bash
# Extrai este projeto para um repositorio proprio.
#
# A criacao do repositorio no GitHub foi NEGADA na sessao que gerou isto
# ("403 Resource not accessible by integration" — o GitHub App desta sessao
# nao tem permissao de criar repositorio), entao criar o repo vazio em
# github.com/new fica com voce. Este script faz todo o resto.
set -euo pipefail

DEST="${1:-$HOME/awardness}"
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -e "$DEST" ]; then
  echo "ja existe: $DEST" >&2
  echo "passe outro caminho: ./EXTRAIR.sh ~/outro-nome" >&2
  exit 1
fi

cp -r "$SRC" "$DEST"
rm -f "$DEST/EXTRAIR.sh"

cd "$DEST"
git init -q
git add -A
git commit -q -m "awardness: motor de conteudo para posicionamento de product engineer"

echo "pronto em $DEST"
echo
echo "agora crie o repo vazio em https://github.com/new e rode:"
echo "  cd $DEST"
echo "  git remote add origin git@github.com:raphaelmelo/awardness.git"
echo "  git push -u origin main"
