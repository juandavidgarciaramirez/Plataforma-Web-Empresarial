#!/bin/bash

# Despliegue del backend (cPanel + Passenger). Lo ejecuta el workflow de GitHub
# en cada push a main. NO aplica migraciones: las SQL se ejecutan a mano y este
# script aborta, sin tocar la versión en servicio, si falta alguna.
# Ver docs/despliegue-etapa-15.md.

set -eo pipefail

APP="/home/capitalc/backend-git/backend"
VENV="/home/capitalc/nodevenv/backend-git/backend/22"
LOG="/home/capitalc/backend-git/deploy.log"

exec >> "$LOG" 2>&1

trap 'echo "=== DEPLOY FALLIDO (linea $LINENO) ==="; date' ERR

echo ""
echo "========================================"
echo "DEPLOY $(date)"
echo "========================================"

cd /home/capitalc/backend-git

PREVIOUS_COMMIT="$(git rev-parse HEAD)"

echo "=== GIT PULL ==="
git fetch origin
git reset --hard origin/main

cd "$APP"

echo "=== NODE ENV ==="
source "$VENV/bin/activate"

# Antes de regenerar Prisma o compilar: si falta una migración, una variable o
# permisos en uploads/, el proceso termina aquí y sigue en servicio la versión
# anterior (dist/ y prisma/generated/ intactos).
echo "=== VERIFICACION PREVIA ==="
"$VENV/bin/node" scripts/verify-deploy.js preflight

if ! git diff --quiet "$PREVIOUS_COMMIT" HEAD -- backend/package.json backend/package-lock.json; then
    echo "=== DEPENDENCIAS ==="
    npm install --no-audit --no-fund
fi

# prisma/generated está excluido de Git: hay que generarlo en el servidor.
echo "=== PRISMA GENERATE ==="
"$VENV/bin/node" "$VENV/lib/node_modules/prisma/build/index.js" generate

# `nest build` borra dist/ y vuelve a escribirlo aunque haya errores de tipos: se
# comprueban antes para que un error no deje en dist/ una versión rota.
echo "=== COMPROBACION DE TIPOS ==="
"$VENV/bin/node" --max-old-space-size=4096 \
    "$VENV/lib/node_modules/typescript/bin/tsc" --noEmit -p tsconfig.build.json

echo "=== BUILD ==="
"$VENV/bin/node" --max-old-space-size=4096 \
    "$VENV/lib/node_modules/@nestjs/cli/bin/nest.js" build

echo "=== COPY MIGRATIONS ==="

SRC="$APP/src/database/migrations"
DST="$APP/dist/database/migrations"

mkdir -p "$DST"

if [ -d "$SRC" ]; then
    find "$SRC" -maxdepth 1 -type f \
        -name '*.sql' \
        ! -name '*_verify.sql' \
        -exec cp {} "$DST/" \;
fi

echo "=== RESTART PASSENGER ==="
mkdir -p "$APP/tmp"
touch "$APP/tmp/restart.txt"

echo "=== VERIFICACION POSTERIOR ==="
"$VENV/bin/node" scripts/verify-deploy.js postflight

echo "=== DEPLOY OK ==="
date
