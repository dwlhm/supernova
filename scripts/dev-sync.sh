#!/usr/bin/env bash
set -euo pipefail

FIXTURE="${1:-latest}"
SERVER_URL="${SUPERNOVA_API_URL:-http://localhost:8080}"
API_TOKEN="${API_TOKEN:-}"

# Terminal color codes
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BOLD}${BLUE}🚀 Supernova Dev-Sync: Replaying extraction '${FIXTURE}'...${NC}"

# Check server health
if ! curl -s -f "${SERVER_URL}/v1/health" > /dev/null 2>&1; then
  echo -e "${RED}❌ Supernova API is not responding at ${SERVER_URL}.${NC}"
  echo -e "   Please start the server first (e.g. 'make dev' or 'pnpm dev')."
  exit 1
fi

AUTH_HEADER=()
if [ -n "${API_TOKEN}" ]; then
  AUTH_HEADER=(-H "Authorization: Bearer ${API_TOKEN}")
fi

# 1. Trigger Replay Sync
echo -e "${CYAN}📡 Calculating diff plan against snapshot...${NC}"
SYNC_RESP=$(curl -s -f -X POST "${SERVER_URL}/v1/syncs/replay" \
  -H "Content-Type: application/json" \
  "${AUTH_HEADER[@]}" \
  -d "{\"fixture\":\"${FIXTURE}\"}")

SYNC_ID=$(echo "${SYNC_RESP}" | node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync(0));console.log(d.syncId || '');")
DOC_NAME=$(echo "${SYNC_RESP}" | node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync(0));console.log(d.documentName || 'Design System');")

if [ -z "${SYNC_ID}" ]; then
  echo -e "${RED}❌ Failed to calculate sync plan: ${SYNC_RESP}${NC}"
  exit 1
fi

echo -e "\n${BOLD}📋 Sync Plan for '${DOC_NAME}' (ID: ${SYNC_ID})${NC}"
echo "${SYNC_RESP}" | node -e "
const fs = require('fs');
const d = JSON.parse(fs.readFileSync(0));
const s = d.summary || {};
console.log('   Total: ' + (s.total || 0) + ' | New: ' + (s.new || 0) + ' | Changed: ' + (s.changed || 0) + ' | Unchanged: ' + (s.unchanged || 0) + ' | Removed: ' + (s.removed || 0));
console.log('\n   Component Status:');
(d.components || []).forEach(c => {
  let badge = c.status;
  if (c.status === 'new') badge = '\x1b[32m[NEW]\x1b[0m';
  else if (c.status === 'changed') badge = '\x1b[33m[CHANGED]\x1b[0m';
  else if (c.status === 'unchanged') badge = '\x1b[34m[UNCHANGED]\x1b[0m';
  else if (c.status === 'removed') badge = '\x1b[31m[REMOVED]\x1b[0m';
  console.log('   - ' + badge + ' ' + c.name);
});
"

# 2. Apply Sync Plan
echo -e "\n${CYAN}⚡ Applying Sync Plan (${SYNC_ID}) to GitHub PR...${NC}"
APPLY_RESP=$(curl -s -f -X POST "${SERVER_URL}/v1/syncs/${SYNC_ID}/apply" \
  -H "Content-Type: application/json" \
  "${AUTH_HEADER[@]}" \
  -d '{"publishers":["pull_request"]}')

JOB_ID=$(echo "${APPLY_RESP}" | node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync(0));console.log(d.jobId || '');")

if [ -z "${JOB_ID}" ]; then
  echo -e "${RED}❌ Failed to apply sync plan: ${APPLY_RESP}${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Job enqueued: ${JOB_ID}${NC}"
echo -e "${CYAN}📡 Streaming execution progress...${NC}\n"

# 3. Stream SSE Events
curl -s -N "${SERVER_URL}/v1/jobs/${JOB_ID}/events" "${AUTH_HEADER[@]}" | while IFS= read -r line; do
  if [[ "${line}" =~ ^data:\ (.*) ]]; then
    DATA="${BASH_REMATCH[1]}"
    node -e "
      try {
        const ev = JSON.parse(process.argv[1]);
        if (ev.eventType === 'task_status' && ev.task) {
          const status = ev.task.status;
          let color = '\x1b[36m';
          if (status === 'ready' || status === 'succeeded') color = '\x1b[32m';
          else if (status === 'failed') color = '\x1b[31m';
          console.log('   [' + ev.task.componentName + '] -> ' + color + status + '\x1b[0m');
        } else if (ev.eventType === 'job_completed') {
          console.log('\n\x1b[1m\x1b[32m🎉 Job Completed Successfully!\x1b[0m');
        } else if (ev.eventType === 'job_failed') {
          console.log('\n\x1b[1m\x1b[31m❌ Job Failed: ' + (ev.error || 'Unknown error') + '\x1b[0m');
        }
      } catch (e) {}
    " "${DATA}"
  fi
done

# 4. Fetch Final Status & PR URL
FINAL_RESP=$(curl -s "${SERVER_URL}/v1/jobs/${JOB_ID}" "${AUTH_HEADER[@]}")
PR_URL=$(echo "${FINAL_RESP}" | node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync(0));console.log((d.publishResults && d.publishResults.pullRequestUrl) || '');")

if [ -n "${PR_URL}" ]; then
  echo -e "\n${BOLD}${GREEN}🔗 Pull Request Available at:${NC} ${BOLD}${UNDERLINE:-}${PR_URL}${NC}\n"
else
  echo -e "\n${BOLD}Job finished. Results stored.${NC}\n"
fi
