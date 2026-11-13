import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  DomainError,
  normalizeComponentName,
  type ApplySyncRequest,
  type ComponentProgress,
  type ExtractionOptions,
  type ExtractionRequest,
  type Framework,
  type Job,
  type JobEvent,
  type PublisherType,
  type SyncPlan,
  type SyncRequest,
} from '../domain/models.js';
import type { ArtifactPublisher, PullRequestManager } from '../publisher/download-publisher.js';
import type { JobStore } from '../store/store.js';
import type { MitosisAuthor } from './author-runner.js';
import { resolveComponentGroup } from './docs-writer.js';
import { EventBroker } from './events.js';
import { executeExtractionJob } from './job-runner.js';
import { calculateSyncPlan } from './sync.js';
import { processGitHubWebhook, type WebhookResult } from './webhook.js';

export interface ServicePaths {
  extractionsDir: string;
  docsDir?: string;
  generatedDir?: string;
  workspaceDir?: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Normalizes requested names and rejects any that are not components of the submitted document. */
function resolveSelectedComponents(requested: string[] | undefined, components: ComponentProgress[]): string[] {
  if (!requested || requested.length === 0) return [];
  const known = new Set(components.map((c) => c.name));
  const selected = [...new Set(requested.map((n) => normalizeComponentName(n)))];
  const unknown = selected.filter((n) => !known.has(n));
  if (unknown.length > 0) {
    throw new DomainError('INVALID_PAYLOAD', `selectedComponents not in document: ${unknown.join(', ')}`);
  }
  return selected;
}

export class Service {
  private publishers = new Map<string, ArtifactPublisher>();
  private prManager?: PullRequestManager;
  private maxRetries = 2;
  private concurrency = 4;
  private broker = new EventBroker();

  constructor(
    private readonly store: JobStore,
    private readonly author: MitosisAuthor,
    publishersList: ArtifactPublisher[],
    private readonly paths: ServicePaths,
    prManager?: PullRequestManager
  ) {
    for (const p of publishersList) {
      this.publishers.set(p.name(), p);
      if (!this.prManager && 'getPullRequestBranch' in p) {
        this.prManager = p as unknown as PullRequestManager;
      }
    }
    if (prManager) this.prManager = prManager;
  }

  setConcurrency(c: number): void {
    if (c > 0) this.concurrency = c;
  }

  setMaxRetries(r: number): void {
    this.maxRetries = Math.max(0, r);
  }

  /** Subscribes before reading the job so no event between the read and the subscription is lost. */
  async subscribeJobEvents(
    jobId: string,
    listener: (ev: JobEvent) => void
  ): Promise<{ job: Job; unsubscribe: () => void }> {
    const unsubscribe = this.broker.subscribe(jobId, listener);
    try {
      return { job: await this.store.get(jobId), unsubscribe };
    } catch (err) {
      unsubscribe();
      throw err;
    }
  }

  /** Jobs left mid-flight by a previous process can never finish; mark them failed on startup. */
  async recoverInterruptedJobs(): Promise<number> {
    const ids = await this.store.listJobIdsByStatus(['queued', 'authoring', 'compiling', 'publishing']);
    for (const id of ids) {
      await this.store.updateStatus(id, 'failed', {
        stage: 'recovery',
        message: 'job was interrupted by a server restart',
      });
    }
    return ids.length;
  }

  async submitExtraction(req: ExtractionRequest): Promise<string> {
    if (!req?.document?.components || req.document.components.length === 0) {
      throw new DomainError('INVALID_PAYLOAD', 'document must include at least one component');
    }

    const targets: Framework[] =
      req.targets && req.targets.length > 0 ? req.targets : ['mitosis'];
    const publishers: PublisherType[] =
      req.publishers && req.publishers.length > 0 ? req.publishers : ['download'];

    const components: ComponentProgress[] = req.document.components.map((comp) => {
      const name = normalizeComponentName(comp.name);
      return {
        name,
        status: 'pending',
        group: resolveComponentGroup(undefined, name, comp),
      };
    });

    const selectedComponents = resolveSelectedComponents(req.selectedComponents, components);

    const jobId = crypto.randomUUID();
    const now = new Date().toISOString();
    const job: Job = {
      id: jobId,
      documentName: req.document.name || 'Design System',
      document: req.document,
      options: req.options,
      ...(selectedComponents.length > 0 ? { selectedComponents } : {}),
      targets,
      publishers,
      status: 'queued',
      tasks: [],
      components,
      artifacts: [],
      publishResults: {},
      createdAt: now,
      updatedAt: now,
    };

    if (this.paths.extractionsDir) {
      fs.mkdirSync(this.paths.extractionsDir, { recursive: true });
      const data = JSON.stringify(req, null, 2);
      fs.writeFileSync(path.join(this.paths.extractionsDir, 'latest.json'), data, 'utf8');
    }

    await this.store.save(job);
    queueMicrotask(() => {
      void this.executeJob(jobId);
    });
    return jobId;
  }

  private resolveReplayPath(target?: string): string {
    const t = (target || '').trim();
    if (!t || t === 'latest') {
      return path.join(this.paths.extractionsDir, 'latest.json');
    }
    if (!UUID_REGEX.test(t)) {
      throw new DomainError('INVALID_PAYLOAD', 'replay target must be a job ID or "latest"');
    }
    return path.join(this.paths.extractionsDir, `${t}.json`);
  }

  async replayExtraction(target?: string): Promise<string> {
    const filePath = this.resolveReplayPath(target);
    if (!fs.existsSync(filePath)) {
      throw new DomainError('EXTRACTION_NOT_FOUND', 'No persisted extraction for the given job ID');
    }
    const req = JSON.parse(fs.readFileSync(filePath, 'utf8')) as ExtractionRequest;
    return this.submitExtraction(req);
  }

  async getJob(jobId: string): Promise<Job> {
    return this.store.get(jobId);
  }

  async getDownloadZip(jobId: string): Promise<Uint8Array> {
    const job = await this.store.get(jobId);
    if (job.status !== 'succeeded' && job.status !== 'partially_succeeded') {
      throw new DomainError('JOB_NOT_FINISHED', 'Job is not finished or artifacts not ready');
    }
    return this.store.getZip(jobId);
  }

  async submitSync(req: SyncRequest): Promise<SyncPlan> {
    if (
      (!req?.document?.components || req.document.components.length === 0) &&
      (!req?.document?.tokens || req.document.tokens.length === 0)
    ) {
      throw new DomainError('INVALID_PAYLOAD', 'sync document is empty');
    }
    const localPub = this.publishers.get('local') as { workspaceDir?: string } | undefined;
    const plan = await calculateSyncPlan(this.store, req, {
      workspaceDir: this.paths.workspaceDir ?? localPub?.workspaceDir,
      extractionsDir: this.paths.extractionsDir,
    });
    await this.store.saveSyncPlan(plan);
    return plan;
  }

  async getSyncPlan(syncId: string): Promise<SyncPlan> {
    if (!syncId) throw new DomainError('INVALID_PAYLOAD', 'missing sync ID');
    return this.store.getSyncPlan(syncId);
  }

  async applySync(syncId: string, overrides?: ApplySyncRequest): Promise<string> {
    const plan = await this.store.getSyncPlan(syncId);
    if (!plan.document) throw new DomainError('INVALID_PAYLOAD', 'sync plan missing document');
    const extractionReq: ExtractionRequest = {
      document: plan.document,
      syncId,
      targets: overrides?.targets?.length ? overrides.targets : plan.targets || ['mitosis'],
      publishers: overrides?.publishers?.length ? overrides.publishers : plan.publishers || ['download'],
      options: overrides?.options ?? plan.options,
      ...(overrides?.selectedComponents ? { selectedComponents: overrides.selectedComponents } : {}),
    };
    return this.submitExtraction(extractionReq);
  }

  async replaySync(target?: string, options?: ExtractionOptions): Promise<SyncPlan> {
    const filePath = this.resolveReplayPath(target);
    if (!fs.existsSync(filePath)) {
      throw new DomainError('EXTRACTION_NOT_FOUND', 'No persisted extraction found');
    }
    const ext = JSON.parse(fs.readFileSync(filePath, 'utf8')) as ExtractionRequest;
    return this.submitSync({
      document: ext.document,
      targets: ext.targets,
      publishers: ext.publishers,
      options: options ?? ext.options,
    });
  }

  /**
   * Validates and acknowledges the event synchronously; the slow LLM regeneration runs in the
   * background (GitHub drops deliveries after ~10s). Background failures are reported on the PR.
   */
  handleGitHubWebhook(eventType: string, payload: string | Uint8Array): WebhookResult {
    return processGitHubWebhook(eventType, payload, {
      store: this.store,
      author: this.author,
      prManager: this.prManager,
    });
  }

  async executeJob(jobId: string): Promise<void> {
    const localPub = this.publishers.get('local') as { workspaceDir?: string } | undefined;
    await executeExtractionJob(
      {
        store: this.store,
        author: this.author,
        publishers: this.publishers,
        broker: this.broker,
        maxRetries: this.maxRetries,
        concurrency: this.concurrency,
        docsDir: this.paths.docsDir,
        generatedDir: this.paths.generatedDir,
        workspaceDir: this.paths.workspaceDir ?? localPub?.workspaceDir,
      },
      jobId
    );
  }
}
