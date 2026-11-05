import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  hashComponentSpec,
  normalizeComponentName,
  taskToContract,
  type CompiledArtifact,
  type FigmaComponentSpec,
  type FigmaToken,
  type Job,
  type Run,
  type Task,
} from '../domain/models.js';
import type { ArtifactPublisher } from '../publisher/download-publisher.js';
import type { JobStore } from '../store/store.js';
import type { MitosisAuthor } from './author-runner.js';
import { resolveComponentGroup } from './docs-writer.js';
import { failJob, finalizeJobArtifacts } from './job-finalize.js';
import type { EventBroker } from './events.js';
import {
  buildDarkTokensBlock,
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
    const darkBlock = buildDarkTokensBlock(tokensCSS);
    fs.writeFileSync(path.join(tokensThemeDir, 'tokens.css'), `${tokensCSS}\n${darkBlock}\n`, 'utf8');
  }
}

async function runSingleComponentTask(
  ctx: JobRunnerContext,
  job: Job,
  runId: string,
  spec: FigmaComponentSpec,
  task: Task,
  isUnchanged: boolean,
  existingSource: string,
  resolvedTokens: FigmaToken[],
  tokenClasses: string[],
  authoredComponents: Record<string, string>,
  componentGroups: Record<string, string>,
  allArtifacts: CompiledArtifact[]
): Promise<boolean> {
  const compName = task.componentName;
  const compGroup = resolveComponentGroup(undefined, compName, spec);
  task.status = 'authoring';
  task.updatedAt = new Date().toISOString();
  await ctx.store.updateTask(job.id, task);
  await ctx.store.updateComponent(job.id, { name: compName, status: 'authoring', group: compGroup });
  ctx.broker.publish(job.id, { eventType: 'task_status', jobId: job.id, runId, status: 'authoring', task: taskToContract(task) });

  let lastErr: Error | undefined;
  let currentSource = existingSource;
  let repairErrors: string[] | undefined;

  for (let attempt = 1; attempt <= task.maxAttempts; attempt++) {
    task.attemptCount = attempt;
    try {
      const res = await ctx.author.authorDesignSystem({
        componentName: compName,
        components: [spec],
        tokens: resolvedTokens,
        tokenClasses,
        existingSource: currentSource,
        repairErrors,
        compileOnly: isUnchanged && Boolean(currentSource) && attempt === 1,
        targets: job.targets,
      });
      const compSource = res.components[compName] || Object.values(res.components)[0] || '';
      if (compSource || res.artifacts.length > 0) {
        task.status = 'ready';
        task.artifacts = res.artifacts;
        task.updatedAt = new Date().toISOString();
        await ctx.store.updateTask(job.id, task);
        await ctx.store.updateComponent(job.id, { name: compName, status: 'done', group: compGroup });
        if (res.artifacts.length > 0) await ctx.store.saveArtifacts(job.id, res.artifacts);
        ctx.broker.publish(job.id, { eventType: 'task_status', jobId: job.id, runId, status: 'ready', task: taskToContract(task) });
        if (compSource) authoredComponents[compName] = compSource;
        componentGroups[compName] = compGroup;
        allArtifacts.push(...res.artifacts);
        return true;
      }
      lastErr = new Error(`no code generated for ${compName}`);
    } catch (err: any) {
      lastErr = err instanceof Error ? err : new Error(String(err));
      repairErrors = [lastErr.message];
      if (err?.partialComponents?.[compName]) currentSource = err.partialComponents[compName];
    }
  }

  task.status = 'failed';
  task.error = lastErr?.message || 'authoring failed';
  task.updatedAt = new Date().toISOString();
  await ctx.store.updateTask(job.id, task);
  await ctx.store.updateComponent(job.id, {
    name: compName, status: 'failed', group: compGroup,
    stageError: { stage: 'authoring', message: task.error },
  });
  ctx.broker.publish(job.id, {
    eventType: 'task_status', jobId: job.id, runId, status: 'failed', error: task.error, task: taskToContract(task),
  });
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
  const authoredComponents: Record<string, string> = {};
  const componentGroups: Record<string, string> = {};
  const allArtifacts: CompiledArtifact[] = [];
  let successCount = 0;

  const queue = job.document.components.map((spec, i) => ({ spec, task: tasks[i]! }));
  const workers = Array.from({ length: Math.min(ctx.concurrency, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      const prev = existingComps[item.task.componentName];
      const ok = await runSingleComponentTask(
        ctx, job, runId, item.spec, item.task,
        prev?.contentHash === hashComponentSpec(item.spec), prev?.sourceCode || '',
        resolvedTokens, tokenClasses, authoredComponents, componentGroups, allArtifacts
      );
      if (ok) successCount++;
    }
  });
  await Promise.all(workers);

  if (successCount === 0) {
    await failJob(ctx, jobId, run, 'authoring', 'all component authoring tasks failed');
    return;
  }

  await finalizeJobArtifacts(ctx, jobId, run, docName, authoredComponents, componentGroups, allArtifacts);
}
