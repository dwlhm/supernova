import * as crypto from 'node:crypto';
import {
  hashComponentSpec,
  hashTokens,
  normalizeComponentName,
  type ComponentDiff,
  type FigmaComponentSpec,
  type FigmaToken,
  type Framework,
  type PublisherType,
  type SyncPlan,
  type SyncRequest,
  type TokenDiff,
} from '../domain/models.js';
import type { JobStore } from '../store/store.js';

function computeTokenDiff(prevTokens: FigmaToken[], currTokens: FigmaToken[], prevHash: string): TokenDiff {
  const currHash = hashTokens(currTokens);
  const changed = currHash !== prevHash;

  const prevMap = new Map<string, FigmaToken>();
  for (const t of prevTokens) prevMap.set(t.name, t);

  const currMap = new Map<string, FigmaToken>();
  for (const t of currTokens) currMap.set(t.name, t);

  const added: string[] = [];
  const modified: string[] = [];
  const removed: string[] = [];

  for (const [name, currT] of currMap.entries()) {
    const prevT = prevMap.get(name);
    if (!prevT) {
      added.push(name);
    } else if (JSON.stringify(currT) !== JSON.stringify(prevT)) {
      modified.push(name);
    }
  }
  for (const name of prevMap.keys()) {
    if (!currMap.has(name)) {
      removed.push(name);
    }
  }

  added.sort();
  modified.sort();
  removed.sort();

  return {
    changed,
    added,
    modified,
    removed,
    previousHash: prevHash,
    currentHash: currHash,
  };
}

export async function calculateSyncPlan(
  store: JobStore,
  req: SyncRequest
): Promise<SyncPlan> {
  const docName = req.document.name || 'Design System';
  const prevSnap = await store.getLatestSnapshot(docName);
  const existingComps = await store.getComponentSnapshots(docName);

  const prevTokens = prevSnap?.tokens || [];
  const prevTokensHash = prevSnap?.tokensHash || '';
  const tokenDiff = computeTokenDiff(prevTokens, req.document.tokens || [], prevTokensHash);

  const incomingMap = new Map<string, FigmaComponentSpec>();
  for (const spec of req.document.components || []) {
    incomingMap.set(normalizeComponentName(spec.name), spec);
  }

  const compDiffs: ComponentDiff[] = [];
  let newCount = 0;
  let changedCount = 0;
  let unchangedCount = 0;
  let removedCount = 0;

  for (const [name, spec] of incomingMap.entries()) {
    const currHash = hashComponentSpec(spec);
    const prevComp = existingComps[name];
    if (!prevComp) {
      newCount++;
      compDiffs.push({ name, status: 'new', currentHash: currHash });
    } else if (prevComp.contentHash === currHash) {
      unchangedCount++;
      compDiffs.push({
        name,
        status: 'unchanged',
        previousHash: prevComp.contentHash,
        currentHash: currHash,
      });
    } else {
      changedCount++;
      compDiffs.push({
        name,
        status: 'changed',
        previousHash: prevComp.contentHash,
        currentHash: currHash,
        changeSummary: 'Component visual spec or properties changed',
      });
    }
  }

  for (const [name, prevComp] of Object.entries(existingComps)) {
    if (!incomingMap.has(name)) {
      removedCount++;
      compDiffs.push({
        name,
        status: 'removed',
        previousHash: prevComp.contentHash,
      });
    }
  }

  compDiffs.sort((a, b) => a.name.localeCompare(b.name));

  const targets: Framework[] =
    req.targets && req.targets.length > 0 ? req.targets : ['mitosis'];
  const publishers: PublisherType[] =
    req.publishers && req.publishers.length > 0 ? req.publishers : ['download'];

  return {
    syncId: crypto.randomUUID(),
    documentName: docName,
    summary: {
      total: incomingMap.size,
      new: newCount,
      changed: changedCount,
      unchanged: unchangedCount,
      removed: removedCount,
      tokensChanged: tokenDiff.changed,
    },
    components: compDiffs,
    tokens: tokenDiff,
    createdAt: new Date().toISOString(),
    document: req.document,
    targets,
    publishers,
    options: req.options,
  };
}
