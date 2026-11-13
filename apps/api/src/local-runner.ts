import * as fs from 'node:fs';
import * as path from 'node:path';
import { DevMockAuthor, InProcessAuthor, type MitosisAuthor } from './app/author-runner.js';
import { regenerateComponentLocal } from './app/regenerate.js';
import { Service } from './app/service.js';
import { buildAndSyncWorkspaceLocal, inspectComponentLocal } from './app/workspace-sync.js';
import { findRepoRoot, loadConfig, loadDotEnv } from './config.js';
import type { FigmaDocument, JobEvent } from './domain/models.js';
import { DownloadPublisher } from './publisher/download-publisher.js';
import { LocalWorkspacePublisher } from './publisher/local-publisher.js';
import { MemStore } from './store/mem-store.js';
import type { JobStore } from './store/store.js';

export interface ParsedSyncArgs {
  filePath?: string;
  replayFixture?: string;
  selectedComponents?: string[];
}

export function parseSyncArgs(argv: string[]): ParsedSyncArgs {
  const out: ParsedSyncArgs = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i] || '';
    if (arg === '--replay' || arg === '-r') {
      const next = argv[i + 1];
      if (next && !next.startsWith('-')) {
        out.replayFixture = next;
        i++;
      } else {
        out.replayFixture = 'latest';
      }
      continue;
    }
    if (arg.startsWith('--replay=')) {
      out.replayFixture = arg.slice('--replay='.length) || 'latest';
      continue;
    }
    if (arg === '--components' || arg === '-c') {
      const next = argv[i + 1] || '';
      out.selectedComponents = next.split(',').map((s) => s.trim()).filter(Boolean);
      i++;
      continue;
    }
    if (arg.startsWith('--components=')) {
      out.selectedComponents = arg.slice('--components='.length).split(',').map((s) => s.trim()).filter(Boolean);
      continue;
    }
    if (!arg.startsWith('-') && !out.filePath) {
      out.filePath = arg;
    }
  }
  return out;
}

export function createLocalEnvironment(cwd = process.cwd()): {
  root: string;
  store: JobStore;
  author: MitosisAuthor;
  svc: Service;
  extractionsDir: string;
  docsDir: string;
} {
  const root = findRepoRoot(cwd) || path.resolve(cwd);
  loadDotEnv(path.join(root, '.env'));
  const cfg = loadConfig(
    (k) =>
      k === 'KOMERCE_INSECURE_NO_AUTH' || k === 'SUPERNOVA_INSECURE_NO_AUTH'
        ? 'true'
        : process.env[k],
    root
  );
  const docsDir = cfg.docsDir || path.join(root, 'apps', 'docs');
  const store: JobStore = new MemStore();
  const author: MitosisAuthor = cfg.devMockLLM ? new DevMockAuthor() : new InProcessAuthor();
  const publishers = [
    new LocalWorkspacePublisher(root, { store, docsDir, compileLibrary: true }),
    new DownloadPublisher(store),
  ];
  const svc = new Service(store, author, publishers, {
    extractionsDir: cfg.extractionsDir,
    docsDir,
    generatedDir: cfg.generatedDir,
    workspaceDir: root,
  });
  return { root, store, author, svc, extractionsDir: cfg.extractionsDir, docsDir };
}

function logEvent(ev: JobEvent): void {
  if (ev.eventType === 'task_status' && ev.task) {
    console.error(`   • [${ev.task.status.toUpperCase()}] ${ev.task.componentName}`);
  } else if (ev.eventType === 'job_status' && ev.status) {
    console.error(`⏳ Status: ${ev.status}`);
  }
}

export async function runLocalSyncCommand(argv: string[], cwd = process.cwd()): Promise<void> {
  const args = parseSyncArgs(argv);
  const { svc } = createLocalEnvironment(cwd);

  let syncId: string;
  if (args.filePath) {
    const abs = path.resolve(cwd, args.filePath);
    if (!fs.existsSync(abs)) {
      throw new Error(`Extraction file not found: ${abs}`);
    }
    const parsed = JSON.parse(fs.readFileSync(abs, 'utf8'));
    const document: FigmaDocument = parsed.document ?? parsed;
    const plan = await svc.submitSync({
      document,
      targets: ['mitosis'],
      publishers: ['local'],
    });
    syncId = plan.syncId;
    console.error(
      `📋 Sync Plan (${plan.documentName}): +${plan.summary.new} new, ~${plan.summary.changed} changed, =${plan.summary.unchanged} unchanged`
    );
  } else {
    const fixture = args.replayFixture || 'latest';
    const plan = await svc.replaySync(fixture);
    syncId = plan.syncId;
    console.error(
      `📋 Replay Sync Plan '${fixture}' (${plan.documentName}): +${plan.summary.new} new, ~${plan.summary.changed} changed, =${plan.summary.unchanged} unchanged`
    );
  }

  const jobId = await svc.applySync(syncId, {
    targets: ['mitosis'],
    publishers: ['local'],
    ...(args.selectedComponents?.length ? { selectedComponents: args.selectedComponents } : {}),
  });

  await new Promise<void>((resolve, reject) => {
    void svc
      .subscribeJobEvents(jobId, (ev) => {
        logEvent(ev);
        if (ev.eventType === 'job_completed') {
          unsubscribe?.();
          resolve();
        } else if (ev.eventType === 'job_failed') {
          unsubscribe?.();
          reject(new Error(ev.error || 'Local sync job failed'));
        }
      })
      .then(({ job, unsubscribe: unsub }) => {
        unsubscribe = unsub;
        if (job.status === 'succeeded' || job.status === 'partially_succeeded') {
          unsub();
          resolve();
        } else if (job.status === 'failed') {
          unsub();
          reject(new Error(job.error?.message || 'Local sync job failed'));
        }
      })
      .catch(reject);
    let unsubscribe: (() => void) | undefined;
  });

  const finalJob = await svc.getJob(jobId);
  console.error(
    `✅ Local sync finished (${finalJob.status}) — wrote ${finalJob.publishResults?.filesWritten ?? 0} files to ${finalJob.publishResults?.workspaceDir ?? 'workspace'}`
  );
}

export async function runLocalRegenCommand(argv: string[], cwd = process.cwd()): Promise<void> {
  const [componentName, ...noteParts] = argv.filter((a) => !a.startsWith('-'));
  if (!componentName) {
    throw new Error('Usage: komerce regen <ComponentName> [notes...]');
  }
  const notes = noteParts.join(' ').trim();
  const { root, store, author, extractionsDir, docsDir } = createLocalEnvironment(cwd);
  console.error(`🔧 Regenerating ${componentName}${notes ? ` (${notes})` : ''}...`);
  const res = await regenerateComponentLocal({
    store,
    author,
    workspaceDir: root,
    extractionsDir,
    docsDir,
    componentName,
    notes,
    compileLibrary: true,
  });
  console.error(
    `✅ Regenerated ${res.updatedComponents.join(', ')} (${res.filesWritten} files updated in src/, library/*, and apps/docs)`
  );
}

export async function runLocalInspectCommand(argv: string[], cwd = process.cwd()): Promise<void> {
  const [componentName] = argv.filter((a) => !a.startsWith('-'));
  if (!componentName) {
    throw new Error('Usage: komerce inspect <ComponentName>');
  }
  const { root, store, extractionsDir } = createLocalEnvironment(cwd);
  const res = await inspectComponentLocal({
    store,
    workspaceDir: root,
    extractionsDir,
    componentName,
  });
  console.log(JSON.stringify(res, null, 2));
}

export async function runLocalBuildCommand(argv: string[], cwd = process.cwd()): Promise<void> {
  const componentNames = argv.filter((a) => !a.startsWith('-'));
  const { root, store, extractionsDir, docsDir } = createLocalEnvironment(cwd);
  console.error(
    `🔨 Syncing workspace sources (${componentNames.length > 0 ? componentNames.join(', ') : 'all components'}) -> docs, library/*, and 5-framework preview...`
  );
  const res = await buildAndSyncWorkspaceLocal({
    store,
    workspaceDir: root,
    extractionsDir,
    docsDir,
    componentNames,
    compileLibrary: true,
  });
  console.error(
    `✅ Workspace synced (${res.syncedComponents.length} components, ${res.docsUpdated} markdown docs, library/* & apps/docs preview compiled)`
  );
}
