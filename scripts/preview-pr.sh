#!/usr/bin/env bash
set -euo pipefail

BRANCH="${1:-}"
MODE="${2:-dev}" # "dev" (live server) or "build" (static build)

BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

export COREPACK_ENABLE_STRICT=0
export npm_config_manage_package_manager_versions=false

# Auto-detect latest supernova/* PR branch if not specified
if [ -z "${BRANCH}" ]; then
  # Check if current working tree already has src/components/*.lite.tsx
  if compgen -G "${REPO_ROOT}/src/components/*.lite.tsx" > /dev/null; then
    echo -e "${GREEN}✓ Detected active PR components in working directory (${REPO_ROOT}/src/components).${NC}"
    export DS_REPO_DIR="${REPO_ROOT}"
  else
    # Find most recent supernova/* branch locally or in origin
    BRANCH=$(git for-each-ref --sort=-committerdate --format='%(refname:short)' refs/heads/supernova/ refs/remotes/origin/supernova/ | head -n 1 || true)
    if [ -z "${BRANCH}" ]; then
      echo -e "${YELLOW}⚠ No supernova/* PR branch found in git. Falling back to templates/ds-repo.${NC}"
      export DS_REPO_DIR="${REPO_ROOT}/templates/ds-repo"
    fi
  fi
fi

TMP_EXTRACT_DIR=""
DOCS_BACKUP_DIR=""
cleanup() {
  if [ -n "${DOCS_BACKUP_DIR}" ] && [ -d "${DOCS_BACKUP_DIR}" ]; then
    cp -R "${DOCS_BACKUP_DIR}/components/." "${REPO_ROOT}/apps/docs/components/"
    cp "${DOCS_BACKUP_DIR}/tokens.md" "${REPO_ROOT}/apps/docs/tokens.md"
    rm -rf "${DOCS_BACKUP_DIR}"
    node "${REPO_ROOT}/apps/docs/scripts/compile-docs-components.mjs" > /dev/null 2>&1 || true
  fi
  if [ -n "${TMP_EXTRACT_DIR}" ] && [ -d "${TMP_EXTRACT_DIR}" ]; then
    rm -rf "${TMP_EXTRACT_DIR}"
  fi
}
trap cleanup EXIT

if [ -n "${BRANCH}" ] && [ -z "${DS_REPO_DIR:-}" ]; then
  if ! git rev-parse --verify "${BRANCH}" > /dev/null 2>&1; then
    echo -e "${RED}❌ Git branch or ref '${BRANCH}' not found.${NC}"
    exit 1
  fi

  DOCS_BACKUP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/supernova-docs-backup.XXXXXX")"
  cp -R "${REPO_ROOT}/apps/docs/components" "${DOCS_BACKUP_DIR}/components"
  cp "${REPO_ROOT}/apps/docs/tokens.md" "${DOCS_BACKUP_DIR}/tokens.md"

  TMP_EXTRACT_DIR="$(mktemp -d "${TMPDIR:-/tmp}/supernova-pr-preview.XXXXXX")"
  echo -e "${BOLD}${BLUE}📦 Extracting PR branch '${BRANCH}' into temporary workspace...${NC}"
  git archive "${BRANCH}" | tar -x -C "${TMP_EXTRACT_DIR}"

  if ! compgen -G "${TMP_EXTRACT_DIR}/src/components/*.lite.tsx" > /dev/null; then
    echo -e "${YELLOW}⚠ Branch '${BRANCH}' has no src/components/*.lite.tsx at root; checking templates/ds-repo...${NC}"
    if compgen -G "${TMP_EXTRACT_DIR}/templates/ds-repo/src/components/*.lite.tsx" > /dev/null; then
      export DS_REPO_DIR="${TMP_EXTRACT_DIR}/templates/ds-repo"
    else
      echo -e "${RED}❌ No .lite.tsx components found in '${BRANCH}'.${NC}"
      exit 1
    fi
  else
    export DS_REPO_DIR="${TMP_EXTRACT_DIR}"
  fi

  COMP_COUNT=$(ls -1 "${DS_REPO_DIR}/src/components/"*.lite.tsx 2>/dev/null | wc -l | tr -d ' ')
  echo -e "${GREEN}✓ Loaded ${COMP_COUNT} components from branch '${BRANCH}'.${NC}"
fi

echo -e "${CYAN}⚙️  Compiling Mitosis components to React, Vue 3, and Svelte for live preview...${NC}"
if [ "${MODE}" = "build" ]; then
  pnpm --dir "${REPO_ROOT}/apps/docs" build
  echo -e "\n${BOLD}${GREEN}✅ Static UI Preview built at:${NC} apps/docs/.vitepress/dist"
else
  echo -e "\n${BOLD}${GREEN}🚀 Starting Live Multi-Framework UI Preview Server...${NC}"
  echo -e "   Open ${BOLD}http://localhost:5173/showcase${NC} or ${BOLD}http://localhost:5173/components/${NC} in your browser.\n"
  pnpm --dir "${REPO_ROOT}/apps/docs" dev
fi
