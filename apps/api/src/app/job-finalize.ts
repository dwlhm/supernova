import * as crypto from 'node:crypto';
import { getUtilsSource } from '@supernova/mitosis-compiler';
import { normalizeGroup } from '../domain/artifact-path.js';
import {
  hashComponentSpec,
  hashTokens,
  normalizeComponentName,
  type CompiledArtifact,
  type Run,
} from '../domain/models.js';
import { buildDocArtifacts, syncDocsDirectory, syncGeneratedDirectory } from './docs-writer.js';
import type { JobRunnerContext } from './job-runner.js';

export async function failJob(ctx: JobRunnerContext, jobId: string, run: Run | undefined, stage: string, message: string): Promise<void> {
  await ctx.store.updateStatus(jobId, 'failed', { stage, message });
  if (run) {
    run.status = 'failed';
    run.finishedAt = new Date().toISOString();
    await ctx.store.updateRun(run);
  }
  ctx.broker.publish(jobId, { eventType: 'job_failed', jobId, runId: run?.id, status: 'failed', error: message });
}

export async function finalizeJobArtifacts(
  ctx: JobRunnerContext,
  jobId: string,
  run: Run,
  docName: string,
  authoredComponents: Record<string, string>,
  componentGroups: Record<string, string>,
  allArtifacts: CompiledArtifact[]
): Promise<void> {
  if (allArtifacts.length === 0) {
    for (const [compName, code] of Object.entries(authoredComponents)) {
      allArtifacts.push({ target: 'mitosis', fileName: `${compName}.lite.tsx`, code, group: componentGroups[compName] || 'components' });
    }
  }
  for (const art of allArtifacts) {
    if (!art.group) art.group = normalizeGroup(componentGroups[art.fileName.split('.')[0] || '']) || 'components';
  }
  if (!allArtifacts.some((a) => a.fileName === 'utils.ts')) {
    allArtifacts.push({ target: 'mitosis', fileName: 'utils.ts', group: 'components', code: getUtilsSource() });
  }
  await ctx.store.saveArtifacts(jobId, allArtifacts);

  let job = await ctx.store.get(jobId);
  const docArtifacts = buildDocArtifacts(job, authoredComponents);
  await ctx.store.saveArtifacts(jobId, docArtifacts);

  job = await ctx.store.get(jobId);
  if (ctx.generatedDir) syncGeneratedDirectory(ctx.generatedDir, job.artifacts);
  if (ctx.docsDir) syncDocsDirectory(ctx.docsDir, job, docArtifacts, componentGroups, authoredComponents);

  const nowSnap = new Date().toISOString();
  for (const [compName, src] of Object.entries(authoredComponents)) {
    const spec = job.document.components.find((c) => normalizeComponentName(c.name) === compName);
    if (spec) {
      await ctx.store.saveComponentSnapshot({
        documentName: docName, componentName: compName, contentHash: hashComponentSpec(spec),
        spec, sourceCode: src, updatedAt: nowSnap,
      });
    }
  }
  await ctx.store.saveSnapshot({
    id: crypto.randomUUID(), documentName: docName,
    tokensHash: hashTokens(job.document.tokens || []), tokens: job.document.tokens || [], createdAt: nowSnap,
  });

  await ctx.store.updateStatus(jobId, 'publishing');
  try {
    for (const pubType of job.publishers) {
      const pub = ctx.publishers.get(pubType);
      if (pub) await pub.publish(job);
    }
  } catch (err: unknown) {
    await failJob(ctx, jobId, run, 'publishing', err instanceof Error ? err.message : String(err));
    return;
  }

  const failed = job.components.filter((c) => c.status === 'failed').map((c) => c.name);
  const status = failed.length > 0 ? 'partially_succeeded' : 'succeeded';
  const partialError = failed.length > 0
    ? { stage: 'authoring', message: `failed components: ${failed.join(', ')}` }
    : undefined;
  await ctx.store.updateStatus(jobId, status, partialError);
  run.status = 'succeeded';
  run.finishedAt = new Date().toISOString();
  await ctx.store.updateRun(run);
  ctx.broker.publish(jobId, {
    eventType: 'job_completed', jobId, runId: run.id, status, ...(partialError ? { error: partialError.message } : {}),
  });
}
