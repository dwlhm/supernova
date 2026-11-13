import * as fs from 'node:fs';
import * as path from 'node:path';
import { buildComponentBlueprint, type ComponentBlueprint } from '@komerce-design/mitosis-author';
import { GROUP_COMPONENTS, GROUP_EXAMPLES, GROUP_ICONS } from '../domain/artifact-path.js';
import { loadProjectKnowledge } from '../domain/knowledge-base.js';
import {
  camelToKebab,
  hashComponentSpec,
  normalizeComponentName,
  type CompiledArtifact,
  type FigmaComponentSpec,
  type FigmaToken,
} from '../domain/models.js';
import { runWorkspaceLibraryCompile, writeArtifactsToWorkspace } from '../publisher/local-publisher.js';
import type { JobStore } from '../store/store.js';
import { generateComponentDoc, generateTokensDoc } from './docgen.js';
import { inferCompoundParent } from './docs-writer.js';
import {
  collectFamilySources,
  loadLatestExtractionDoc,
  readWorkspaceComponentSource,
} from './regenerate.js';
import { generateThemeCSS, generateTokensCSS, generateTokensTS, resolveTokens } from './tokens.js';

export interface WorkspaceInspectOptions {
  store: JobStore;
  workspaceDir: string;
  extractionsDir?: string;
  componentName: string;
}

export interface WorkspaceInspectResult {
  componentName: string;
  group: string;
  familyFiles: string[];
  knowledgeRules: string[];
  globalRules: string[];
  blueprint?: ComponentBlueprint;
}

export interface WorkspaceBuildSyncOptions {
  store: JobStore;
  workspaceDir: string;
  extractionsDir?: string;
  docsDir?: string;
  componentNames?: string[];
  compileLibrary?: boolean;
}

export interface WorkspaceBuildSyncResult {
  syncedComponents: string[];
  docsUpdated: number;
}

async function resolveExtractionContext(
  store: JobStore,
  extractionsDir?: string
): Promise<{
  docName: string;
  specsByName: Map<string, FigmaComponentSpec>;
  tokens: FigmaToken[];
  rawTokens: FigmaToken[];
}> {
  let docName = 'Design System';
  const specsByName = new Map<string, FigmaComponentSpec>();
  let tokens: FigmaToken[] = [];
  let rawTokens: FigmaToken[] = [];

  const finishedIds = await store.listJobIdsByStatus(['succeeded', 'partially_succeeded']);
  const latestJobId = finishedIds[finishedIds.length - 1];
  const latestJob = latestJobId ? await store.get(latestJobId).catch(() => null) : null;
  if (latestJob) {
    docName = latestJob.documentName || docName;
    for (const c of latestJob.document.components || []) {
      specsByName.set(normalizeComponentName(c.name), c);
    }
    if (latestJob.document.tokens?.length) {
      rawTokens = latestJob.document.tokens;
      tokens = resolveTokens(latestJob.document.tokens);
    }
  }

  const fallbackDoc = loadLatestExtractionDoc(extractionsDir);
  if (fallbackDoc) {
    docName = fallbackDoc.name || docName;
    for (const c of fallbackDoc.components || []) {
      const norm = normalizeComponentName(c.name);
      if (!specsByName.has(norm)) specsByName.set(norm, c);
    }
    if (tokens.length === 0 && fallbackDoc.tokens?.length) {
      rawTokens = fallbackDoc.tokens;
      tokens = resolveTokens(fallbackDoc.tokens);
    }
  }

  return { docName, specsByName, tokens, rawTokens: rawTokens.length > 0 ? rawTokens : tokens };
}

export async function inspectComponentLocal(
  opts: WorkspaceInspectOptions
): Promise<WorkspaceInspectResult> {
  const compName = opts.componentName.trim();
  const { docName, specsByName, rawTokens } = await resolveExtractionContext(
    opts.store,
    opts.extractionsDir
  );
  const spec =
    specsByName.get(compName) ||
    (await opts.store.getComponentSnapshot(docName, compName))?.spec;
  const resolved = readWorkspaceComponentSource(opts.workspaceDir, compName, GROUP_COMPONENTS, '');
  const snapshots = await opts.store.getComponentSnapshots(docName);
  const { siblingDrafts } = collectFamilySources(
    opts.workspaceDir,
    compName,
    resolved.source,
    snapshots
  );
  const kb = loadProjectKnowledge(opts.workspaceDir);
  const familyNames = [compName, ...Object.keys(siblingDrafts)];
  const knowledgeRules: string[] = [];
  for (const name of familyNames) {
    for (const r of kb.components[name]?.rules ?? []) {
      knowledgeRules.push(`[${name}] ${r}`);
    }
  }

  return {
    componentName: compName,
    group: resolved.group,
    familyFiles: familyNames.map((n) =>
      `src/${n.endsWith('Example') ? GROUP_EXAMPLES : resolved.group}/${n}.lite.tsx`
    ),
    knowledgeRules,
    globalRules: kb.globalRules,
    ...(spec ? { blueprint: buildComponentBlueprint(compName, spec, rawTokens) } : {}),
  };
}

export async function buildAndSyncWorkspaceLocal(
  opts: WorkspaceBuildSyncOptions
): Promise<WorkspaceBuildSyncResult> {
  const { docName, specsByName, tokens } = await resolveExtractionContext(
    opts.store,
    opts.extractionsDir
  );
  const snapshots = await opts.store.getComponentSnapshots(docName);
  const filterSet =
    opts.componentNames && opts.componentNames.length > 0
      ? new Set(opts.componentNames.map((n) => n.trim()).filter(Boolean))
      : null;

  const groups = [GROUP_COMPONENTS, GROUP_ICONS, GROUP_EXAMPLES] as const;
  const diskByGroup: Record<string, Record<string, string>> = {
    [GROUP_COMPONENTS]: {},
    [GROUP_ICONS]: {},
    [GROUP_EXAMPLES]: {},
  };

  for (const grp of groups) {
    const dir = path.join(opts.workspaceDir, 'src', grp);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.lite.tsx')) continue;
      const name = file.slice(0, -'.lite.tsx'.length);
      diskByGroup[grp]![name] = fs.readFileSync(path.join(dir, file), 'utf8');
    }
  }

  const docArtifacts: CompiledArtifact[] = [];
  const syncedComponents: string[] = [];
  const now = new Date().toISOString();

  for (const [compName, source] of Object.entries(diskByGroup[GROUP_COMPONENTS]!)) {
    if (filterSet && !filterSet.has(compName)) continue;
    const prevSnap = snapshots[compName];
    const spec = specsByName.get(compName) || prevSnap?.spec;
    let derivedFrom = inferCompoundParent(compName) || prevSnap?.derivedFrom;
    if (!spec && !derivedFrom) {
      const sortedPrimaries = [...specsByName.keys()].sort((a, b) => b.length - a.length);
      for (const primaryName of sortedPrimaries) {
        if (compName !== primaryName && compName.startsWith(primaryName)) {
          derivedFrom = primaryName;
          break;
        }
      }
    }

    // Only generate top-level markdown docs for primary Figma components (not compound sub-items)
    if (!derivedFrom) {
      const { siblingDrafts } = collectFamilySources(
        opts.workspaceDir,
        compName,
        source,
        snapshots
      );
      const docSiblings: Record<string, string> = {};
      for (const [sibName, sibCode] of Object.entries(siblingDrafts)) {
        if (!sibName.endsWith('Example')) docSiblings[sibName] = sibCode;
      }
      const docSpec: FigmaComponentSpec = spec ?? {
        id: compName,
        name: compName,
        node: { id: compName, name: compName, type: 'COMPONENT' },
      };
      docArtifacts.push({
        target: 'docs',
        fileName: `${camelToKebab(compName)}.md`,
        group: 'docs',
        code: generateComponentDoc(docSpec, source, docSiblings),
      });
    }

    await opts.store.saveComponentSnapshot({
      documentName: docName,
      componentName: compName,
      sourceCode: source,
      updatedAt: now,
      contentHash: spec ? hashComponentSpec(spec) : prevSnap?.contentHash || '',
      ...(spec ? { spec } : {}),
      ...(derivedFrom ? { derivedFrom } : {}),
      group: GROUP_COMPONENTS,
    });
    syncedComponents.push(compName);
  }

  for (const grp of [GROUP_ICONS, GROUP_EXAMPLES] as const) {
    for (const [name, source] of Object.entries(diskByGroup[grp]!)) {
      if (filterSet && !filterSet.has(name)) continue;
      const prevSnap = snapshots[name];
      const spec = specsByName.get(name) || prevSnap?.spec;
      const inferredParent =
        prevSnap?.derivedFrom ||
        (grp === GROUP_EXAMPLES && name.endsWith('Example') ? name.slice(0, -'Example'.length) : undefined);
      await opts.store.saveComponentSnapshot({
        documentName: docName,
        componentName: name,
        sourceCode: source,
        updatedAt: now,
        contentHash: spec ? hashComponentSpec(spec) : prevSnap?.contentHash || '',
        ...(spec ? { spec } : {}),
        ...(inferredParent ? { derivedFrom: inferredParent } : {}),
        group: grp,
      });
      syncedComponents.push(name);
    }
  }

  if (tokens.length > 0) {
    docArtifacts.push(
      { target: 'tokens', fileName: 'tokens.json', code: JSON.stringify(tokens, null, 2) },
      { target: 'tokens', fileName: 'theme.css', code: generateThemeCSS(tokens) },
      { target: 'tokens', fileName: 'tokens.css', code: generateTokensCSS(tokens) },
      { target: 'tokens', fileName: 'tokens.ts', code: generateTokensTS(tokens) }
    );
    if (!filterSet) {
      docArtifacts.push({
        target: 'docs',
        fileName: 'tokens.md',
        group: 'docs',
        code: generateTokensDoc(tokens),
      });
    }
  }

  const docsUpdated = writeArtifactsToWorkspace(opts.workspaceDir, docArtifacts, opts.docsDir);
  if (opts.compileLibrary !== false) {
    await runWorkspaceLibraryCompile(opts.workspaceDir);
  }

  return { syncedComponents, docsUpdated };
}
