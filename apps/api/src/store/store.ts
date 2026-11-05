import type {
  CompiledArtifact,
  ComponentProgress,
  ComponentSnapshot,
  Job,
  JobStatus,
  PublishResults,
  Run,
  Snapshot,
  StageError,
  SyncPlan,
  Task,
} from '../domain/models.js';

export interface JobStore {
  save(job: Job): Promise<void>;
  update(job: Job): Promise<void>;
  get(jobId: string): Promise<Job>;
  listJobIdsByStatus(statuses: JobStatus[]): Promise<string[]>;
  getLatestJobByBranch(branchName: string): Promise<Job | null>;
  updateStatus(jobId: string, status: JobStatus, stageError?: StageError): Promise<void>;
  updateComponent(jobId: string, progress: ComponentProgress): Promise<void>;
  saveArtifacts(jobId: string, artifacts: CompiledArtifact[]): Promise<void>;
  savePublishResults(jobId: string, results: PublishResults): Promise<void>;
  saveZip(jobId: string, data: Uint8Array): Promise<void>;
  getZip(jobId: string): Promise<Uint8Array>;

  saveRun(run: Run): Promise<void>;
  updateRun(run: Run): Promise<void>;
  updateTask(jobId: string, task: Task): Promise<void>;

  saveSnapshot(snapshot: Snapshot): Promise<void>;
  getLatestSnapshot(documentName: string): Promise<Snapshot | null>;
  saveComponentSnapshot(snapshot: ComponentSnapshot): Promise<void>;
  getComponentSnapshot(documentName: string, componentName: string): Promise<ComponentSnapshot | null>;
  getComponentSnapshots(documentName: string): Promise<Record<string, ComponentSnapshot>>;

  saveSyncPlan(plan: SyncPlan): Promise<void>;
  getSyncPlan(syncId: string): Promise<SyncPlan>;
}
