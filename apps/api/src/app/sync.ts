import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { GROUP_COMPONENTS, GROUP_EXAMPLES, GROUP_ICONS } from '../domain/artifact-path.js';
import {
  hashComponentSpec,
  hashTokens,
  normalizeComponentName,
  type ComponentDiff,
  type ComponentSnapshot,
  type FigmaComponentSpec,
  type FigmaDocument,
  type FigmaToken,
  type Framework,
  type PublisherType,
  type SyncPlan,
  type SyncRequest,
  type TokenDiff,
} from '../domain/models.js';
import type { JobStore } from '../store/store.js';
import { loadLatestExtractionDoc } from './regenerate.js';

export interface SyncPlanContext {
  workspaceDir?: string;
  extractionsDir?: string;
}

export function loadWorkspaceDiskSnapshots(
  docName: string,
  workspaceDir?: string,
  prevExtractionDoc?: FigmaDocument
): Record<string, ComponentSnapshot> {
  const out: Record<string, ComponentSnapshot> = {};
  if (!workspaceDir) return out;

  const prevSpecs = new Map<string, FigmaComponentSpec>();
  for (const spec of prevExtractionDoc?.components || []) {
    prevSpecs.set(normalizeComponentName(spec.name), spec);
  }
  const sortedPrimaryNames = [...prevSpecs.keys()].sort((a, b) => b.length - a.length);

  for (const grp of [GROUP_COMPONENTS, GROUP_ICONS, GROUP_EXAMPLES] as const) {
    const dir = path.join(workspaceDir, 'src', grp);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.lite.tsx')) continue;
      const name = file.slice(0, -'.lite.tsx'.length);
      const sourceCode = fs.readFileSync(path.join(dir, file), 'utf8');
      const spec = prevSpecs.get(name);
      let derivedFrom: string | undefined;
      if (!spec) {
        if (grp === GROUP_EXAMPLES && name.endsWith('Example')) {
          derivedFrom = name.slice(0, -'Example'.length);
        } else {
          for (const primary of sortedPrimaryNames) {
            if (name !== primary && name.startsWith(primary)) {
              derivedFrom = primary;
              break;
            }
          }
          if (!derivedFrom && (name === 'TabItem' || name === 'MenuItem')) {
            derivedFrom = name === 'TabItem' ? 'Tabs' : 'MainMenu';
          }
        }
      }
      out[name] = {
        documentName: docName,
        componentName: name,
        sourceCode,
        updatedAt: '',
        contentHash: spec ? hashComponentSpec(spec) : '',
        ...(spec ? { spec } : {}),
        ...(derivedFrom ? { derivedFrom } : {}),
        group: grp,
      };
    }
  }
  return out;
}

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
  req: SyncRequest,
  ctx?: SyncPlanContext
): Promise<SyncPlan> {
  const docName = req.document.name || 'Design System';
  const prevSnap = await store.getLatestSnapshot(docName);
  const storeComps = await store.getComponentSnapshots(docName);
  const prevExtractionDoc = loadLatestExtractionDoc(ctx?.extractionsDir);
  const diskComps = loadWorkspaceDiskSnapshots(docName, ctx?.workspaceDir, prevExtractionDoc);
  const existingComps: Record<string, ComponentSnapshot> = { ...diskComps, ...storeComps };

  const prevTokens = prevSnap?.tokens || prevExtractionDoc?.tokens || [];
  const prevTokensHash =
    prevSnap?.tokensHash || (prevTokens.length > 0 ? hashTokens(prevTokens) : '');
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
    // Derived siblings (e.g. StepperItem) live as long as their Figma parent does.
    const owner = prevComp.derivedFrom || name;
    if (!incomingMap.has(owner)) {
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
