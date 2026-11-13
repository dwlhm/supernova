#!/usr/bin/env bash
set -euo pipefail

FIXTURE="${1:-latest}"
shift || true

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

if [ ! -f "apps/api/dist/cli.js" ]; then
  pnpm --filter @komerce-design/api build
fi

exec node apps/api/dist/cli.js sync --replay "${FIXTURE}" "$@"
