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

has_lite_components() {
  local dir="$1"
  set -- "${dir}"/*.lite.tsx
  [ -e "${1:-}" ]
}

# Sync remote komerce-design/* PR branches created via GitHub API (allow force-updated PR refs)
git fetch --quiet origin '+refs/heads/komerce-design/*:refs/remotes/origin/komerce-design/*' 2>/dev/null || true

# Auto-detect latest komerce-design/* PR branch if not specified
if [ -z "${BRANCH}" ]; then
  # Check if current working tree already has src/components/*.lite.tsx
  if has_lite_components "${REPO_ROOT}/src/components"; then
    echo -e "${GREEN}✓ Detected active PR components in working directory (${REPO_ROOT}/src/components).${NC}"
    export DS_REPO_DIR="${REPO_ROOT}"
  else
    # Find most recent komerce-design/* branch locally or in origin
    BRANCH=$(git for-each-ref --sort=-committerdate --format='%(refname:short)' refs/remotes/origin/komerce-design/ refs/heads/komerce-design/ | head -n 1 || true)
    if [ -z "${BRANCH}" ]; then
      echo -e "${YELLOW}⚠ No komerce-design/* PR branch found in git. Falling back to root src/.${NC}"
      export DS_REPO_DIR="${REPO_ROOT}"
    fi
  fi
fi

TMP_EXTRACT_DIR=""
DOCS_BACKUP_DIR=""
cleanup() {
  unset DS_REPO_DIR || true
  if [ -n "${TMP_EXTRACT_DIR}" ] && [ -d "${TMP_EXTRACT_DIR}" ]; then
    rm -rf "${TMP_EXTRACT_DIR}"
  fi
  if [ -n "${DOCS_BACKUP_DIR}" ] && [ -d "${DOCS_BACKUP_DIR}" ]; then
    rm -rf "${REPO_ROOT}/apps/docs/components"
    cp -R "${DOCS_BACKUP_DIR}/components" "${REPO_ROOT}/apps/docs/components"
    cp "${DOCS_BACKUP_DIR}/tokens.md" "${REPO_ROOT}/apps/docs/tokens.md"
    rm -rf "${DOCS_BACKUP_DIR}"
    node "${REPO_ROOT}/apps/docs/scripts/compile-docs-components.mjs" > /dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

if [ -n "${BRANCH}" ] && [ -z "${DS_REPO_DIR:-}" ]; then
  if ! git rev-parse --verify "${BRANCH}" > /dev/null 2>&1; then
    if git rev-parse --verify "origin/${BRANCH}" > /dev/null 2>&1; then
      BRANCH="origin/${BRANCH}"
    else
      echo -e "${RED}❌ Git branch or ref '${BRANCH}' not found.${NC}"
      exit 1
    fi
  fi

  DOCS_BACKUP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/komerce-docs-backup.XXXXXX")"
  cp -R "${REPO_ROOT}/apps/docs/components" "${DOCS_BACKUP_DIR}/components"
  cp "${REPO_ROOT}/apps/docs/tokens.md" "${DOCS_BACKUP_DIR}/tokens.md"

  TMP_EXTRACT_DIR="$(mktemp -d "${TMPDIR:-/tmp}/komerce-pr-preview.XXXXXX")"
  echo -e "${BOLD}${BLUE}📦 Extracting PR branch '${BRANCH}' into temporary workspace...${NC}"
  git archive "${BRANCH}" | tar -x -C "${TMP_EXTRACT_DIR}"

  if ! has_lite_components "${TMP_EXTRACT_DIR}/src/components"; then
    echo -e "${RED}❌ No src/components/*.lite.tsx components found in '${BRANCH}'.${NC}"
    exit 1
  else
    # Backfill any baseline subcomponents from root src/components
    if has_lite_components "${REPO_ROOT}/src/components"; then
      for base_file in "${REPO_ROOT}/src/components/"*.lite.tsx; do
        base_name="$(basename "${base_file}")"
        if [ ! -e "${TMP_EXTRACT_DIR}/src/components/${base_name}" ]; then
          cp "${base_file}" "${TMP_EXTRACT_DIR}/src/components/${base_name}"
        fi
      done
    fi
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
