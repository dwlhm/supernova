import * as fs from 'node:fs';
import * as path from 'node:path';
import { GROUP_COMPONENTS, GROUP_EXAMPLES, GROUP_ICONS, validComponentName } from '../domain/artifact-path.js';
import {
  buildComponentKnowledgeNotes,
  recordComponentKnowledgeRule,
} from '../domain/knowledge-base.js';
import {
  camelToKebab,
  DomainError,
  hashComponentSpec,
  normalizeComponentName,
  type CompiledArtifact,
  type FigmaComponentSpec,
  type FigmaDocument,
  type FigmaToken,
} from '../domain/models.js';
import { runWorkspaceLibraryCompile, writeArtifactsToWorkspace } from '../publisher/local-publisher.js';
import type { JobStore } from '../store/store.js';
import type { MitosisAuthor } from './author-runner.js';
import { generateComponentDoc } from './docgen.js';
import { inferCompoundParent, resolveComponentGroup } from './docs-writer.js';
import { extractTailwindUtilityClasses, resolveTokens } from './tokens.js';

export interface LocalRegenerateOptions {
  store: JobStore;
  author: MitosisAuthor;
  workspaceDir: string;
  extractionsDir?: string;
  docsDir?: string;
  componentName: string;
  notes?: string;
  compileLibrary?: boolean;
}

export interface LocalRegenerateResult {
  componentName: string;
  filesWritten: number;
  updatedComponents: string[];
}

export function loadLatestExtractionDoc(extractionsDir?: string): FigmaDocument | undefined {
  if (!extractionsDir || !fs.existsSync(extractionsDir)) return undefined;
  const files = fs
    .readdirSync(extractionsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ name: f, mtime: fs.statSync(path.join(extractionsDir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  const latest = files[0];
  if (!latest) return undefined;
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(extractionsDir, latest.name), 'utf8'));
    return (raw.document ?? raw) as FigmaDocument;
  } catch {
    return undefined;
  }
}

const RELATIVE_LITE_IMPORT_RE = /from\s+['"](?:\.\.?\/(?:components|icons)\/|\.\.\/|\.\/)([A-Za-z0-9_]+)\.lite['"]/g;

function extractImportedLiteNames(source: string): string[] {
  const out: string[] = [];
  for (const match of source.matchAll(RELATIVE_LITE_IMPORT_RE)) {
    if (match[1]) out.push(match[1]);
  }
  return out;
}

export function readWorkspaceComponentSource(
  workspaceDir: string,
  compName: string,
  preferredGroup = GROUP_COMPONENTS,
  fallbackSource = ''
): { source: string; group: string } {
  const primaryPath = path.join(workspaceDir, 'src', preferredGroup, `${compName}.lite.tsx`);
  const altGroup = preferredGroup === GROUP_ICONS ? GROUP_COMPONENTS : GROUP_ICONS;
  const altPath = path.join(workspaceDir, 'src', altGroup, `${compName}.lite.tsx`);

  if (fs.existsSync(primaryPath)) {
    return { source: fs.readFileSync(primaryPath, 'utf8'), group: preferredGroup };
  }
  if (fs.existsSync(altPath)) {
    return { source: fs.readFileSync(altPath, 'utf8'), group: altGroup };
  }
  return { source: fallbackSource, group: preferredGroup };
}

export function collectFamilySources(
  workspaceDir: string,
  compName: string,
  primarySource: string,
  snapshots: Record<string, { derivedFrom?: string; sourceCode?: string }>
): { siblingDrafts: Record<string, string>; siblingSources: Record<string, string> } {
  const compDir = path.join(workspaceDir, 'src', GROUP_COMPONENTS);
  const iconsDir = path.join(workspaceDir, 'src', GROUP_ICONS);
  const examplesDir = path.join(workspaceDir, 'src', GROUP_EXAMPLES);
  const allDiskSources: Record<string, string> = {};

  for (const dir of [compDir, iconsDir, examplesDir]) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.lite.tsx')) continue;
      const name = file.slice(0, -'.lite.tsx'.length);
      allDiskSources[name] = fs.readFileSync(path.join(dir, file), 'utf8');
    }
  }

  const familyNames = new Set<string>();
  const exampleName = `${compName}Example`;
  const isCompoundFamily = Boolean(allDiskSources[exampleName]) || compName === 'MainMenu';

  if (allDiskSources[exampleName]) familyNames.add(exampleName);
  if (allDiskSources[`${compName}Item`]) familyNames.add(`${compName}Item`);

  for (const name of Object.keys(allDiskSources)) {
    if (name !== compName && inferCompoundParent(name) === compName) {
      familyNames.add(name);
    }
  }

  if (isCompoundFamily) {
    for (const name of Object.keys(allDiskSources)) {
      if (name !== compName && name.startsWith(compName)) {
        familyNames.add(name);
      }
    }
  }

  for (const [snapName, snap] of Object.entries(snapshots)) {
    if (snap.derivedFrom === compName && snapName !== compName) {
      familyNames.add(snapName);
    }
  }

  const queue = [primarySource, ...(allDiskSources[exampleName] ? [allDiskSources[exampleName]!] : [])];
  while (queue.length > 0) {
    const src = queue.pop()!;
    for (const imported of extractImportedLiteNames(src)) {
      if (imported === compName || familyNames.has(imported)) continue;
      // Only include dedicated sub-components (e.g. TabItem, MenuItem, Table*), not generic leaf primitives like Button/Badge/Checkbox
      if (
        imported.startsWith(compName) ||
        imported.endsWith('Item') ||
        imported.endsWith('Cell') ||
        imported.endsWith('Row') ||
        imported.endsWith('Legend') ||
        (compName === 'ToggleGroup' && imported === 'Toggle') ||
        snapshots[imported]?.derivedFrom === compName
      ) {
        familyNames.add(imported);
        if (allDiskSources[imported]) queue.push(allDiskSources[imported]!);
      }
    }
  }

  const siblingDrafts: Record<string, string> = {};
  for (const name of familyNames) {
    const src = allDiskSources[name] || snapshots[name]?.sourceCode;
    if (src) siblingDrafts[name] = src;
  }

  return { siblingDrafts, siblingSources: allDiskSources };
}

export async function regenerateComponentLocal(opts: LocalRegenerateOptions): Promise<LocalRegenerateResult> {
  const compName = opts.componentName.trim();
  if (!validComponentName(compName)) {
    throw new DomainError(
      'INVALID_PAYLOAD',
      `Invalid component name "${opts.componentName}". Component names must be PascalCase alphanumeric identifiers.`
    );
  }

  let docName = 'Design System';
  let spec: FigmaComponentSpec | undefined;
  let tokens: FigmaToken[] = [];
  let rawTokens: FigmaToken[] = [];
  let savedGroup: string | undefined;
  let snapSource = '';

  const finishedIds = await opts.store.listJobIdsByStatus(['succeeded', 'partially_succeeded']);
  const latestJobId = finishedIds[finishedIds.length - 1];
  const latestJob = latestJobId ? await opts.store.get(latestJobId).catch(() => null) : null;
  if (latestJob) {
    docName = latestJob.documentName || docName;
    const compProg = latestJob.components.find((c) => c.name === compName);
    if (compProg?.group) savedGroup = compProg.group;
    const compSnap = await opts.store.getComponentSnapshot(docName, compName);
    if (compSnap?.spec) spec = compSnap.spec;
    if (compSnap?.sourceCode) snapSource = compSnap.sourceCode;
    const snap = await opts.store.getLatestSnapshot(docName);
    if (snap?.tokens) tokens = snap.tokens;
    if (!spec) {
      spec = latestJob.document.components?.find((c) => normalizeComponentName(c.name) === compName);
    }
    if (latestJob.document.tokens?.length) {
      rawTokens = latestJob.document.tokens;
      if (tokens.length === 0) tokens = resolveTokens(latestJob.document.tokens);
    }
  }

  if (!spec || tokens.length === 0 || rawTokens.length === 0) {
    const fallbackDoc = loadLatestExtractionDoc(opts.extractionsDir);
    if (fallbackDoc) {
      docName = fallbackDoc.name || docName;
      if (!spec) {
        spec = fallbackDoc.components?.find((c) => normalizeComponentName(c.name) === compName);
      }
      if (fallbackDoc.tokens?.length) {
        if (rawTokens.length === 0) rawTokens = fallbackDoc.tokens;
        if (tokens.length === 0) tokens = resolveTokens(fallbackDoc.tokens);
      }
    }
  }

  const resolved = readWorkspaceComponentSource(
    opts.workspaceDir,
    compName,
    resolveComponentGroup(savedGroup, compName, spec),
    snapSource
  );
  const group = resolved.group;
  const existingSource = resolved.source;

  const snapshots = await opts.store.getComponentSnapshots(docName);
  const { siblingDrafts, siblingSources: allWorkspaceSiblings } = collectFamilySources(
    opts.workspaceDir,
    compName,
    existingSource,
    snapshots
  );

  const feedbackNotes = buildComponentKnowledgeNotes(
    opts.workspaceDir,
    compName,
    Object.keys(siblingDrafts),
    opts.notes
  );

  const tokenClasses = tokens.length > 0 ? extractTailwindUtilityClasses(tokens) : [];
  const authorTokens = rawTokens.length > 0 ? rawTokens : tokens;
  const authorResult = await opts.author.authorDesignSystem({
    componentName: compName,
    existingSource,
    ...(Object.keys(siblingDrafts).length > 0 ? { siblingDrafts } : {}),
    ...(Object.keys(allWorkspaceSiblings).length > 0 ? { siblingSources: allWorkspaceSiblings } : {}),
    feedbackNotes,
    workspaceDir: opts.workspaceDir,
    targets: ['mitosis', 'react', 'vue3', 'svelte', 'vue2', 'angular'],
    ...(spec ? { components: [spec] } : {}),
    ...(authorTokens.length > 0 ? { tokens: authorTokens, tokenClasses } : {}),
  });

  const artifacts: CompiledArtifact[] = [];
  const updatedComponents: string[] = [];
  const docSiblingSources: Record<string, string> = {};
  for (const [sibName, sibCode] of Object.entries(siblingDrafts)) {
    if (!sibName.endsWith('Example')) docSiblingSources[sibName] = sibCode;
  }

  for (const [authoredName, code] of Object.entries(authorResult.components)) {
    if (!code) continue;
    const defaultGrp = authoredName.endsWith('Example') ? GROUP_EXAMPLES : undefined;
    const targetGroup = resolveComponentGroup(
      authorResult.componentGroups[authoredName] || (authoredName === compName ? group : defaultGrp),
      authoredName,
      authoredName === compName ? spec : undefined
    );
    artifacts.push({
      target: 'mitosis',
      fileName: `${authoredName}.lite.tsx`,
      group: targetGroup,
      code,
    });
    updatedComponents.push(authoredName);
    if (authoredName !== compName && targetGroup !== GROUP_EXAMPLES) {
      docSiblingSources[authoredName] = code;
    }
  }

  if (artifacts.length === 0) {
    throw new Error(`Author produced no artifacts for ${compName}`);
  }

  const mainSource = authorResult.components[compName] || existingSource;
  if (mainSource) {
    const docSpec: FigmaComponentSpec = spec ?? {
      id: compName,
      name: compName,
      node: { id: compName, name: compName, type: 'COMPONENT' },
    };
    artifacts.push({
      target: 'docs',
      fileName: `${camelToKebab(compName)}.md`,
      group: 'docs',
      code: generateComponentDoc(docSpec, mainSource, docSiblingSources),
    });
  }

  const filesWritten = writeArtifactsToWorkspace(opts.workspaceDir, artifacts, opts.docsDir);
  if ((opts.notes ?? '').trim()) {
    recordComponentKnowledgeRule(opts.workspaceDir, compName, opts.notes!);
  }
  if (opts.compileLibrary) {
    await runWorkspaceLibraryCompile(opts.workspaceDir);
  }

  const now = new Date().toISOString();
  for (const name of updatedComponents) {
    const code = authorResult.components[name];
    if (!code) continue;
    await opts.store.saveComponentSnapshot({
      documentName: docName,
      componentName: name,
      sourceCode: code,
      updatedAt: now,
      ...(name === compName && spec
        ? { contentHash: hashComponentSpec(spec), spec }
        : { contentHash: '', derivedFrom: name === compName ? undefined : compName, group: authorResult.componentGroups[name] }),
    });
  }

  return { componentName: compName, filesWritten, updatedComponents };
}
