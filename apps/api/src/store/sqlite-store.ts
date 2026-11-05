import * as fs from 'node:fs';
import * as path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
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

export class SqliteStore implements JobStore {
  private db: DatabaseSync;

  constructor(dbPath: string) {
    if (dbPath !== ':memory:') {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    this.db = new DatabaseSync(dbPath);
    this.initSchema();
  }

  private initSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        payload TEXT NOT NULL,
        zip_data BLOB,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS runs (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        payload TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS snapshots (
        document_name TEXT PRIMARY KEY,
        payload TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS component_snapshots (
        document_name TEXT NOT NULL,
        component_name TEXT NOT NULL,
        payload TEXT NOT NULL,
        PRIMARY KEY (document_name, component_name)
      );
      CREATE TABLE IF NOT EXISTS sync_plans (
        sync_id TEXT PRIMARY KEY,
        payload TEXT NOT NULL
      );
    `);
  }

  async save(job: Job): Promise<void> {
    const stmt = this.db.prepare(
      `INSERT OR REPLACE INTO jobs (id, payload, updated_at) VALUES (?, ?, ?)`
    );
    stmt.run(job.id, JSON.stringify(job), job.updatedAt);
  }

  async update(job: Job): Promise<void> {
    await this.get(job.id);
    job.updatedAt = new Date().toISOString();
    const stmt = this.db.prepare(`UPDATE jobs SET payload = ?, updated_at = ? WHERE id = ?`);
    stmt.run(JSON.stringify(job), job.updatedAt, job.id);
  }

  async get(jobId: string): Promise<Job> {
    const stmt = this.db.prepare(`SELECT payload FROM jobs WHERE id = ?`);
    const row = stmt.get(jobId) as { payload: string } | undefined;
    if (!row) throw new DomainError('JOB_NOT_FOUND', `job ${jobId} not found`);
    return JSON.parse(row.payload) as Job;
  }

  async listJobIdsByStatus(statuses: JobStatus[]): Promise<string[]> {
    if (statuses.length === 0) return [];
    const placeholders = statuses.map(() => '?').join(', ');
    const stmt = this.db.prepare(
      `SELECT id FROM jobs WHERE json_extract(payload, '$.status') IN (${placeholders})`
    );
    return (stmt.all(...statuses) as Array<{ id: string }>).map((r) => r.id);
  }

  async getLatestJobByBranch(branchName: string): Promise<Job | null> {
    const stmt = this.db.prepare(
      `SELECT payload FROM jobs WHERE json_extract(payload, '$.publishResults.branchName') = ?
       ORDER BY updated_at DESC LIMIT 1`
    );
    const row = stmt.get(branchName) as { payload: string } | undefined;
    return row ? (JSON.parse(row.payload) as Job) : null;
  }

  async updateStatus(jobId: string, status: JobStatus, stageError?: StageError): Promise<void> {
    const job = await this.get(jobId);
    job.status = status;
    if (stageError) job.error = stageError;
    await this.update(job);
  }

  async updateComponent(jobId: string, progress: ComponentProgress): Promise<void> {
    const job = await this.get(jobId);
    const idx = job.components.findIndex((c) => c.name === progress.name);
    if (idx >= 0) job.components[idx] = progress;
    else job.components.push(progress);
    await this.update(job);
  }

  async saveArtifacts(jobId: string, artifacts: CompiledArtifact[]): Promise<void> {
    const job = await this.get(jobId);
    for (const art of artifacts) {
      const idx = job.artifacts.findIndex(
        (a) => a.target === art.target && a.fileName === art.fileName
      );
      if (idx >= 0) job.artifacts[idx] = art;
      else job.artifacts.push(art);
    }
    await this.update(job);
  }

  async savePublishResults(jobId: string, results: PublishResults): Promise<void> {
    const job = await this.get(jobId);
    job.publishResults = results;
    await this.update(job);
  }

  async saveZip(jobId: string, data: Uint8Array): Promise<void> {
    await this.get(jobId);
    const stmt = this.db.prepare(`UPDATE jobs SET zip_data = ? WHERE id = ?`);
    stmt.run(data, jobId);
  }

  async getZip(jobId: string): Promise<Uint8Array> {
    const stmt = this.db.prepare(`SELECT zip_data FROM jobs WHERE id = ?`);
    const row = stmt.get(jobId) as { zip_data: Uint8Array | null } | undefined;
    if (!row) throw new DomainError('JOB_NOT_FOUND', `job ${jobId} not found`);
    if (!row.zip_data || row.zip_data.byteLength === 0) {
      throw new DomainError('JOB_NOT_FINISHED', `zip for job ${jobId} not ready`);
    }
    return new Uint8Array(row.zip_data);
  }

  async saveRun(run: Run): Promise<void> {
    const stmt = this.db.prepare(
      `INSERT OR REPLACE INTO runs (id, job_id, payload) VALUES (?, ?, ?)`
    );
    stmt.run(run.id, run.jobId, JSON.stringify(run));
  }

  async updateRun(run: Run): Promise<void> {
    await this.saveRun(run);
  }

  async updateTask(jobId: string, task: Task): Promise<void> {
    const job = await this.get(jobId);
    const idx = job.tasks.findIndex((t) => t.id === task.id);
    if (idx >= 0) job.tasks[idx] = task;
    else job.tasks.push(task);
    await this.update(job);
  }

  async saveSnapshot(snapshot: Snapshot): Promise<void> {
    const stmt = this.db.prepare(
      `INSERT OR REPLACE INTO snapshots (document_name, payload) VALUES (?, ?)`
    );
    stmt.run(snapshot.documentName, JSON.stringify(snapshot));
  }

  async getLatestSnapshot(documentName: string): Promise<Snapshot | null> {
    const stmt = this.db.prepare(`SELECT payload FROM snapshots WHERE document_name = ?`);
    const row = stmt.get(documentName) as { payload: string } | undefined;
    return row ? (JSON.parse(row.payload) as Snapshot) : null;
  }

  async saveComponentSnapshot(snapshot: ComponentSnapshot): Promise<void> {
    const stmt = this.db.prepare(
      `INSERT OR REPLACE INTO component_snapshots (document_name, component_name, payload) VALUES (?, ?, ?)`
    );
    stmt.run(snapshot.documentName, snapshot.componentName, JSON.stringify(snapshot));
  }

  async getComponentSnapshot(
    documentName: string,
    componentName: string
  ): Promise<ComponentSnapshot | null> {
    const stmt = this.db.prepare(
      `SELECT payload FROM component_snapshots WHERE document_name = ? AND component_name = ?`
    );
    const row = stmt.get(documentName, componentName) as { payload: string } | undefined;
    return row ? (JSON.parse(row.payload) as ComponentSnapshot) : null;
  }

  async getComponentSnapshots(documentName: string): Promise<Record<string, ComponentSnapshot>> {
    const stmt = this.db.prepare(
      `SELECT component_name, payload FROM component_snapshots WHERE document_name = ?`
    );
    const rows = stmt.all(documentName) as Array<{ component_name: string; payload: string }>;
    const out: Record<string, ComponentSnapshot> = {};
    for (const r of rows) {
      out[r.component_name] = JSON.parse(r.payload) as ComponentSnapshot;
    }
    return out;
  }

  async saveSyncPlan(plan: SyncPlan): Promise<void> {
    const stmt = this.db.prepare(
      `INSERT OR REPLACE INTO sync_plans (sync_id, payload) VALUES (?, ?)`
    );
    stmt.run(plan.syncId, JSON.stringify(plan));
  }

  async getSyncPlan(syncId: string): Promise<SyncPlan> {
    const stmt = this.db.prepare(`SELECT payload FROM sync_plans WHERE sync_id = ?`);
    const row = stmt.get(syncId) as { payload: string } | undefined;
    if (!row) throw new DomainError('SYNC_PLAN_NOT_FOUND', `sync plan ${syncId} not found`);
    return JSON.parse(row.payload) as SyncPlan;
  }

  close(): void {
    this.db.close();
  }
}
