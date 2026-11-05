import {
  DomainError,
  type CompiledArtifact,
  type ComponentProgress,
  type ComponentSnapshot,
  type Job,
  type JobStatus,
  type PublishResults,
  type Run,
  type Snapshot,
  type StageError,
  type SyncPlan,
  type Task,
} from '../domain/models.js';
import type { JobStore } from './store.js';

export class MemStore implements JobStore {
  private jobs = new Map<string, Job>();
  private zips = new Map<string, Uint8Array>();
  private runs = new Map<string, Run>();
  private snapshots = new Map<string, Snapshot>();
  private compSnapshots = new Map<string, Map<string, ComponentSnapshot>>();
  private syncPlans = new Map<string, SyncPlan>();

  async save(job: Job): Promise<void> {
    this.jobs.set(job.id, structuredClone(job));
  }

  async update(job: Job): Promise<void> {
    if (!this.jobs.has(job.id)) {
      throw new DomainError('JOB_NOT_FOUND', `job ${job.id} not found`);
    }
    job.updatedAt = new Date().toISOString();
    this.jobs.set(job.id, structuredClone(job));
  }

  async get(jobId: string): Promise<Job> {
    const job = this.jobs.get(jobId);
    if (!job) throw new DomainError('JOB_NOT_FOUND', `job ${jobId} not found`);
    return structuredClone(job);
  }

  async listJobIdsByStatus(statuses: JobStatus[]): Promise<string[]> {
    return [...this.jobs.values()].filter((j) => statuses.includes(j.status)).map((j) => j.id);
  }

  async getLatestJobByBranch(branchName: string): Promise<Job | null> {
    let latest: Job | undefined;
    for (const job of this.jobs.values()) {
      if (job.publishResults?.branchName !== branchName) continue;
      if (!latest || job.updatedAt > latest.updatedAt) latest = job;
    }
    return latest ? structuredClone(latest) : null;
  }

  async updateStatus(jobId: string, status: JobStatus, stageError?: StageError): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) throw new DomainError('JOB_NOT_FOUND', `job ${jobId} not found`);
    job.status = status;
    if (stageError) job.error = stageError;
    job.updatedAt = new Date().toISOString();
  }

  async updateComponent(jobId: string, progress: ComponentProgress): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) throw new DomainError('JOB_NOT_FOUND', `job ${jobId} not found`);
    const idx = job.components.findIndex((c) => c.name === progress.name);
    if (idx >= 0) job.components[idx] = structuredClone(progress);
    else job.components.push(structuredClone(progress));
    job.updatedAt = new Date().toISOString();
  }

  async saveArtifacts(jobId: string, artifacts: CompiledArtifact[]): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) throw new DomainError('JOB_NOT_FOUND', `job ${jobId} not found`);
    for (const art of artifacts) {
      const idx = job.artifacts.findIndex(
        (a) => a.target === art.target && a.fileName === art.fileName
      );
      if (idx >= 0) job.artifacts[idx] = structuredClone(art);
      else job.artifacts.push(structuredClone(art));
    }
    job.updatedAt = new Date().toISOString();
  }

  async savePublishResults(jobId: string, results: PublishResults): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) throw new DomainError('JOB_NOT_FOUND', `job ${jobId} not found`);
    job.publishResults = structuredClone(results);
    job.updatedAt = new Date().toISOString();
  }

  async saveZip(jobId: string, data: Uint8Array): Promise<void> {
    if (!this.jobs.has(jobId)) throw new DomainError('JOB_NOT_FOUND', `job ${jobId} not found`);
    this.zips.set(jobId, new Uint8Array(data));
  }

  async getZip(jobId: string): Promise<Uint8Array> {
    const data = this.zips.get(jobId);
    if (!data) throw new DomainError('JOB_NOT_FINISHED', `zip for job ${jobId} not ready`);
    return new Uint8Array(data);
  }

  async saveRun(run: Run): Promise<void> {
    this.runs.set(run.id, structuredClone(run));
  }

  async updateRun(run: Run): Promise<void> {
    this.runs.set(run.id, structuredClone(run));
  }

  async updateTask(jobId: string, task: Task): Promise<void> {
    const job = this.jobs.get(jobId);
    if (job) {
      const idx = job.tasks.findIndex((t) => t.id === task.id);
      if (idx >= 0) job.tasks[idx] = structuredClone(task);
      else job.tasks.push(structuredClone(task));
    }
    const run = this.runs.get(task.runId);
    if (run) {
      const idx = run.tasks.findIndex((t) => t.id === task.id);
      if (idx >= 0) run.tasks[idx] = structuredClone(task);
      else run.tasks.push(structuredClone(task));
    }
  }

  async saveSnapshot(snapshot: Snapshot): Promise<void> {
    this.snapshots.set(snapshot.documentName, structuredClone(snapshot));
  }

  async getLatestSnapshot(documentName: string): Promise<Snapshot | null> {
    const snap = this.snapshots.get(documentName);
    return snap ? structuredClone(snap) : null;
  }

  async saveComponentSnapshot(snapshot: ComponentSnapshot): Promise<void> {
    let docMap = this.compSnapshots.get(snapshot.documentName);
    if (!docMap) {
      docMap = new Map();
      this.compSnapshots.set(snapshot.documentName, docMap);
    }
    docMap.set(snapshot.componentName, structuredClone(snapshot));
  }

  async getComponentSnapshot(
    documentName: string,
    componentName: string
  ): Promise<ComponentSnapshot | null> {
    const s = this.compSnapshots.get(documentName)?.get(componentName);
    return s ? structuredClone(s) : null;
  }

  async getComponentSnapshots(documentName: string): Promise<Record<string, ComponentSnapshot>> {
    const docMap = this.compSnapshots.get(documentName);
    const out: Record<string, ComponentSnapshot> = {};
    if (!docMap) return out;
    for (const [k, v] of docMap.entries()) {
      out[k] = structuredClone(v);
    }
    return out;
  }

  async saveSyncPlan(plan: SyncPlan): Promise<void> {
    this.syncPlans.set(plan.syncId, structuredClone(plan));
  }

  async getSyncPlan(syncId: string): Promise<SyncPlan> {
    const plan = this.syncPlans.get(syncId);
    if (!plan) throw new DomainError('SYNC_PLAN_NOT_FOUND', `sync plan ${syncId} not found`);
    return structuredClone(plan);
  }
}
