import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  hashComponentSpec,
  normalizeComponentName,
  taskToContract,
  type CompiledArtifact,
  type ComponentProgress,
  type ComponentSnapshot,
  type FigmaComponentSpec,
  type FigmaToken,
  type Job,
  type Run,
  type Task,
} from '../domain/models.js';
import { GROUP_COMPONENTS, GROUP_EXAMPLES, normalizeGroup } from '../domain/artifact-path.js';
import { buildComponentKnowledgeNotes } from '../domain/knowledge-base.js';
import type { ArtifactPublisher } from '../publisher/download-publisher.js';
import type { JobStore } from '../store/store.js';
import type { AuthorResult, MitosisAuthor } from './author-runner.js';
import { resolveComponentGroup } from './docs-writer.js';
import { failJob, finalizeJobArtifacts } from './job-finalize.js';
import type { EventBroker } from './events.js';
import { collectFamilySources, readWorkspaceComponentSource } from './regenerate.js';
import {
  extractTailwindUtilityClasses,
  generateThemeCSS,
  generateTokensCSS,
  generateTokensTS,
  resolveTokens,
} from './tokens.js';

export interface JobRunnerContext {
  store: JobStore;
  author: MitosisAuthor;
  publishers: Map<string, ArtifactPublisher>;
  broker: EventBroker;
  maxRetries: number;
  concurrency: number;
  docsDir?: string;
  generatedDir?: string;
  workspaceDir?: string;
}

async function saveTokenArtifacts(ctx: JobRunnerContext, jobId: string, resolved: FigmaToken[]): Promise<void> {
  const themeCSS = generateThemeCSS(resolved);
  const tokensCSS = generateTokensCSS(resolved);
  await ctx.store.saveArtifacts(jobId, [
    { target: 'tokens', fileName: 'tokens.json', code: JSON.stringify(resolved, null, 2) },
    { target: 'tokens', fileName: 'theme.css', code: themeCSS },
    { target: 'tokens', fileName: 'tokens.css', code: tokensCSS },
    { target: 'tokens', fileName: 'tokens.ts', code: generateTokensTS(resolved) },
  ]);

  if (ctx.docsDir) {
    const tokensThemeDir = path.join(ctx.docsDir, '.vitepress', 'theme', 'tokens');
    fs.mkdirSync(tokensThemeDir, { recursive: true });
    fs.writeFileSync(path.join(tokensThemeDir, 'theme.css'), themeCSS, 'utf8');
    fs.writeFileSync(path.join(tokensThemeDir, 'tokens.css'), tokensCSS, 'utf8');
  }
}

/** Results collected across all component tasks of one run. */
export interface JobAccumulator {
  authoredComponents: Record<string, string>;
  componentGroups: Record<string, string>;
  /** Sibling components authored alongside a Figma component, mapped to that component's name. */
  derivedFrom: Record<string, string>;
  artifacts: CompiledArtifact[];
}

interface RunInputs {
  resolvedTokens: FigmaToken[];
  tokenClasses: string[];
  /** Previously authored sources of this document, so derived siblings resolve across runs. */
  siblingSources: Record<string, string>;
}

interface ComponentTaskInput {
  spec: FigmaComponentSpec;
  task: Task;
  isUnchanged: boolean;
  forceAuthor: boolean;
  existingSource: string;
  initialSiblingDrafts?: Record<string, string>;
  feedbackNotes?: string;
}

async function publishTask(ctx: JobRunnerContext, job: Job, runId: string, task: Task, progress: Omit<ComponentProgress, 'name'>, error?: string) {
  task.updatedAt = new Date().toISOString();
  await ctx.store.updateTask(job.id, task);
  await ctx.store.updateComponent(job.id, { name: task.componentName, ...progress });
  ctx.broker.publish(job.id, {
    eventType: 'task_status', jobId: job.id, runId, status: task.status, ...(error ? { error } : {}), task: taskToContract(task),
  });
}

function recordAuthored(acc: JobAccumulator, compName: string, compGroup: string, res: AuthorResult): void {
  const primary = res.components[compName] || Object.values(res.components)[0] || '';
  if (primary) acc.authoredComponents[compName] = primary;
  acc.componentGroups[compName] = compGroup;
  if (!res.components[compName]) return;
  for (const [name, source] of Object.entries(res.components)) {
    if (name === compName || !source) continue;
    const defaultGrp = name.endsWith('Example') ? GROUP_EXAMPLES : GROUP_COMPONENTS;
    acc.authoredComponents[name] = source;
    acc.componentGroups[name] = normalizeGroup(res.componentGroups[name]) || defaultGrp;
    acc.derivedFrom[name] = compName;
  }
}

/** Re-emits stored siblings of parents that succeeded without re-authoring them (e.g. compile-only runs), preferring live workspace files over SQLite snapshots. */
function carryDerivedSiblings(
  existing: Record<string, ComponentSnapshot>,
  acc: JobAccumulator,
  workspaceDir?: string
): void {
  for (const [name, snap] of Object.entries(existing)) {
    const parent = snap.derivedFrom;
    if (!parent || acc.authoredComponents[name] || !acc.authoredComponents[parent]) continue;
    const preferredGroup = normalizeGroup(snap.group) || (name.endsWith('Example') ? GROUP_EXAMPLES : GROUP_COMPONENTS);
    const resolved = workspaceDir
      ? readWorkspaceComponentSource(workspaceDir, name, preferredGroup, snap.sourceCode || '')
      : { source: snap.sourceCode || '', group: preferredGroup };
    if (!resolved.source) continue;
    acc.authoredComponents[name] = resolved.source;
    acc.componentGroups[name] = resolved.group;
    acc.derivedFrom[name] = parent;
    acc.artifacts.push({ target: 'mitosis', fileName: `${name}.lite.tsx`, group: resolved.group, code: resolved.source });
  }
}

async function runSingleComponentTask(
  ctx: JobRunnerContext, job: Job, runId: string, input: ComponentTaskInput, inputs: RunInputs, acc: JobAccumulator
): Promise<boolean> {
  const { spec, task } = input;
  const compName = task.componentName;
  const compGroup = resolveComponentGroup(undefined, compName, spec);
  task.status = 'authoring';
  await publishTask(ctx, job, runId, task, { status: 'authoring', group: compGroup });

  let lastErr: Error | undefined;
  let currentSource = input.existingSource;
  let repairErrors: string[] | undefined;
  let siblingDrafts: Record<string, string> | undefined =
    input.initialSiblingDrafts && Object.keys(input.initialSiblingDrafts).length > 0
      ? input.initialSiblingDrafts
      : undefined;
  for (let attempt = 1; attempt <= task.maxAttempts; attempt++) {
    task.attemptCount = attempt;
    try {
      const res = await ctx.author.authorDesignSystem({
        componentName: compName, components: [spec], tokens: job.document.tokens?.length ? job.document.tokens : inputs.resolvedTokens, tokenClasses: inputs.tokenClasses,
        existingSource: currentSource, repairErrors, siblingDrafts, targets: job.targets,
        ...(input.feedbackNotes ? { feedbackNotes: input.feedbackNotes } : {}),
        ...(ctx.workspaceDir ? { workspaceDir: ctx.workspaceDir } : {}),
        siblingSources: { ...inputs.siblingSources, ...acc.authoredComponents },
        compileOnly: input.isUnchanged && !input.forceAuthor && Boolean(currentSource) && attempt === 1,
      });
      if (Object.keys(res.components).length > 0 || res.artifacts.length > 0) {
        recordAuthored(acc, compName, compGroup, res);
        acc.artifacts.push(...res.artifacts);
        task.status = 'ready';
        task.artifacts = res.artifacts;
        if (res.artifacts.length > 0) await ctx.store.saveArtifacts(job.id, res.artifacts);
        await publishTask(ctx, job, runId, task, { status: 'done', group: compGroup });
        return true;
      }
      lastErr = new Error(`no code generated for ${compName}`);
    } catch (err: any) {
      lastErr = err instanceof Error ? err : new Error(String(err));
      repairErrors = [lastErr.message];
      const { [compName]: draft, ...siblings } = (err?.partialComponents ?? {}) as Record<string, string>;
      if (draft) currentSource = draft;
      if (Object.keys(siblings).length > 0) {
        siblingDrafts = { ...(siblingDrafts ?? {}), ...siblings };
      }
    }
  }

  task.status = 'failed';
  task.error = lastErr?.message || 'authoring failed';
  await publishTask(ctx, job, runId, task, { status: 'failed', group: compGroup, stageError: { stage: 'authoring', message: task.error } }, task.error);
  return false;
}

/** Never rejects: any unexpected error drives the job into a terminal `failed` state. */
export async function executeExtractionJob(ctx: JobRunnerContext, jobId: string): Promise<void> {
  const state: { run?: Run } = {};
  try {
    await runExtractionJob(ctx, jobId, state);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    try {
      await failJob(ctx, jobId, state.run, 'internal', message);
    } catch (finalErr) {
      console.error(`[API] job ${jobId} failed and could not be marked failed:`, message, finalErr);
    }
  }
}

async function runExtractionJob(ctx: JobRunnerContext, jobId: string, state: { run?: Run }): Promise<void> {
  const job = await ctx.store.get(jobId);
  const now = new Date().toISOString();
  const runId = crypto.randomUUID();
  const tasks: Task[] = job.document.components.map((compSpec) => ({
    id: crypto.randomUUID(), runId, componentName: normalizeComponentName(compSpec.name),
    status: 'queued', attemptCount: 0, maxAttempts: ctx.maxRetries + 1, createdAt: now, updatedAt: now,
  }));

  const run: Run = { id: runId, jobId, status: 'running', tasks, createdAt: now };
  state.run = run;
  await ctx.store.saveRun(run);
  job.runId = runId;
  job.tasks = tasks;
  await ctx.store.update(job);
  await ctx.store.updateStatus(jobId, 'authoring');
  ctx.broker.publish(jobId, { eventType: 'job_status', jobId, runId, status: 'authoring' });

  const resolvedTokens = resolveTokens(job.document.tokens || []);
  const tokenClasses = extractTailwindUtilityClasses(resolvedTokens);
  await saveTokenArtifacts(ctx, jobId, resolvedTokens);

  const docName = job.documentName || job.document.name || 'Design System';
  const existingComps = await ctx.store.getComponentSnapshots(docName);
  const snapshotSiblingSources = Object.fromEntries(
    Object.entries(existingComps).flatMap(([name, snap]) => (snap.sourceCode ? [[name, snap.sourceCode]] : []))
  );
  const diskSiblings = ctx.workspaceDir
    ? collectFamilySources(ctx.workspaceDir, '', '', existingComps).siblingSources
    : {};
  const siblingSources = { ...snapshotSiblingSources, ...diskSiblings };
  const inputs: RunInputs = { resolvedTokens, tokenClasses, siblingSources };
  const acc: JobAccumulator = { authoredComponents: {}, componentGroups: {}, derivedFrom: {}, artifacts: [] };
  const selected = new Set(job.selectedComponents || []);
  let successCount = 0;

  const queue = job.document.components.map((spec, i) => ({ spec, task: tasks[i]! }));
  const workers = Array.from({ length: Math.min(ctx.concurrency, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      const compName = item.task.componentName;
      const prev = existingComps[compName];
      const preferredGrp = resolveComponentGroup(undefined, compName, item.spec);
      const existingSource = ctx.workspaceDir
        ? readWorkspaceComponentSource(ctx.workspaceDir, compName, preferredGrp, prev?.sourceCode || '').source
        : prev?.sourceCode || '';
      const initialSiblingDrafts = ctx.workspaceDir
        ? collectFamilySources(ctx.workspaceDir, compName, existingSource, existingComps).siblingDrafts
        : undefined;
      const feedbackNotes = ctx.workspaceDir
        ? buildComponentKnowledgeNotes(ctx.workspaceDir, compName, Object.keys(initialSiblingDrafts ?? {}))
        : undefined;
      const ok = await runSingleComponentTask(ctx, job, runId, {
        ...item,
        isUnchanged: prev?.contentHash === hashComponentSpec(item.spec),
        forceAuthor: selected.has(compName),
        existingSource,
        initialSiblingDrafts,
        feedbackNotes,
      }, inputs, acc);
      if (ok) successCount++;
    }
  });
  await Promise.all(workers);
  carryDerivedSiblings(existingComps, acc, ctx.workspaceDir);

  if (successCount === 0) {
    await failJob(ctx, jobId, run, 'authoring', 'all component authoring tasks failed');
    return;
  }

  await finalizeJobArtifacts(ctx, jobId, run, docName, acc);
}
